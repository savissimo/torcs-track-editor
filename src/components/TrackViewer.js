import React, { Component } from "react";
import threeEntryPoint from '../threejs/threeEntryPoint';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@material-ui/lab";
import { withStyles } from "@material-ui/core";

import iconStraight from '../assets/icons/straight.svg';
import iconCurveRight from '../assets/icons/curve-right.svg';
import iconCurveLeft from '../assets/icons/curve-left.svg';
import Segment from "../classes/Segment";
import EditorHook from "../classes/EditorHook";
import Straight from "../classes/Straight";
import Curve from "../classes/Curve";


const styles = theme => ({
	root: {
	},
	viewer: {
		width: '100%',
		height: '100%'
	},
	speedDial: {
	  position: 'absolute',
	  bottom: theme.spacing.unit * 2,
	  right: theme.spacing.unit * 3,
	},
	speedDialIcon: {
		maxWidth: 16,
		maxHeight: 16
	}
  });

const addSegmentActions = [
	{ action: 'addStraight', name: 'Add straight', icon: iconStraight },
	{ action: 'addCurveRight', name: 'Add curve right', icon: iconCurveRight },
	{ action: 'addCurveLeft', name: 'Add curve left', icon: iconCurveLeft }
];

class TrackViewer extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			//track: props.track,
			perspective: true,
			mouseLeftDown: false,
			mouseLeftDragging: false,
			mouseLeftJustDragged: false,
			mouseLeftDownLastPositionX: undefined,
			mouseLeftDownLastPositionY: undefined,
			addSegmentSpeedDialOpen: false
		}; 
		this.m_currentPickingPromise = undefined;
	}	

	componentDidMount() {
		this.three = threeEntryPoint(this.threeRootElement);
		this.state.perspective 
			? this.three.setPerspectiveCamera()
			: this.three.setOrthogonalCamera();
	}		

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.track !== this.props.track
			|| nextProps.selectedSegment !== this.props.selectedSegment) {
			return true;
		}	

		if (nextState.perspective !== this.state.perspective) {
			return true;
		}	

		if (!nextProps.mouseLeftDragging && nextProps.mouseLeftDragging === this.state.mouseLeftDragging) {
			return false;
		}	

		return true;
	}	

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.track !== this.props.track) {
			this.three.updateTrack(this.props.track);
		}	

		if (prevProps.selectedSegment !== this.props.selectedSegment) {
			this.three.sceneManager.updateSelectedSegment(this.props.selectedSegment);
		}	

		if (prevState.perspective !== this.state.perspective) {
			this.state.perspective ? this.three.setPerspectiveCamera() : this.three.setOrthogonalCamera();
		}	
	}	

	mouseWheel(e) {
		this.three.zoom(e.deltaY < 0);
	}	

	mouseDown(e) {
		if (e.button === 0)
		{
			this.setState({ mouseLeftDown: true, mouseLeftDragging: false, mouseLeftJustDragged: false,
				mouseLeftDownLastPositionX: e.screenX, mouseLeftDownLastPositionY: e.screenY });
		}		
	}	

	mouseUp(e) {
		if (e.button === 0)
		{
			this.setState({ mouseLeftDown: false, mouseLeftJustDragged: this.state.mouseLeftDragging, mouseLeftDragging: false, 
				mouseLeftDownLastPositionX: undefined, mouseLeftDownLastPositionY: undefined });
		}		
	}	

	mouseMove(e) {
		if (this.state.mouseLeftDown)
		{
			let xDistance = e.screenX - this.state.mouseLeftDownLastPositionX;
			let yDistance = e.screenY - this.state.mouseLeftDownLastPositionY;
			if (this.state.mouseLeftDragging || (Math.abs(xDistance) + Math.abs(yDistance) > 2)) {
				this.setState({
					mouseLeftDragging: true, 
					mouseLeftDownLastPositionX: e.screenX, mouseLeftDownLastPositionY: e.screenY
				})	
			}	

			if (this.state.mouseLeftDragging) {
				this.three.moveCamera(xDistance, yDistance, e.buttons, e.shiftKey);
			}	
		}

		let pickX = e.clientX - this.threeRootElement.offsetLeft;
		let pickY = e.clientY - this.threeRootElement.offsetTop;
		this.three.sceneManager.onMouseMove(pickX, pickY);
	}	

	click(e) {
		if (e.button === 0) {
			if (this.state.mouseLeftJustDragged) {
				this.setState({ mouseLeftJustDragged: false });
				return;
			}	

			let pickX = e.clientX - this.threeRootElement.offsetLeft;
			let pickY = e.clientY - this.threeRootElement.offsetTop;

			let pickedObject = this.three.sceneManager.pickTrackSegment(pickX, pickY);
			let pickedHook = this.three.sceneManager.pickEditorHook(pickX, pickY);
			
			if (pickedHook instanceof EditorHook) {
				this.m_currentPickingPromiseFunction(pickedHook);
			}
			else if (pickedObject instanceof Segment) {
				this.props.onSegmentSelected(pickedObject);
			}
			else if (!pickedObject) {
				if (this.props.selectedSegment) {
					this.props.onSegmentSelected(undefined);
				}
			}

		}	
	}	

	keyDown(e) {
		switch (e.key) {
		case 'o':	
			this.setOrthographicView();
			break;
		case 'p':	
			this.setPerspectiveView();
			break;
		default:	
			break;
		}	
	}	
	
	setOrthographicView() {
		this.setState({perspective: false});
	}	

	setPerspectiveView() {
		this.setState({perspective: true});
	}	

	addSegmentSpeedDialHandleClick(e) {
		this.setState(state => ({ addSegmentSpeedDialOpen: !state.addSegmentSpeedDialOpen }));
	}

	actionHandler(i_action) {
		switch (i_action) {
		case 'addStraight': 
		case 'addCurveRight': 
		case 'addCurveLeft': 
			return (e) => {
				if (this.props.track.mainTrack.trackSegments.length === 0) {
					this.handlePickHookAction(i_action, { data: { interSegmentIndex: 0 }});
				}
				else {
					this.pickHook(i_action);
				}
				this.addSegmentSpeedDialHandleClick();
			};
		default: 
			break;
		}
	}

	handlePickHookAction(i_action, i_pickResult) {
		switch (i_action) {
		case 'addStraight': 
		case 'addCurveRight': 
		case 'addCurveLeft': 
			let segmentToAdd = undefined;
			switch (i_action) {
				case 'addStraight': segmentToAdd = new Straight(this.props.track.mainTrack); break;
				case 'addCurveRight': segmentToAdd = new Curve(this.props.track.mainTrack); segmentToAdd.isRight = true; break;
				case 'addCurveLeft': segmentToAdd = new Curve(this.props.track.mainTrack); segmentToAdd.isRight = false; break;
				default: break;
			}
			let hookIndex = i_pickResult.data.interSegmentIndex;
			this.props.onSegmentAdded(segmentToAdd, hookIndex);
			break;
		default:
			break;
		}
	}

	pickHook(i_action) {
		this.three.enterHookMode();
		this.m_currentPickingPromise = new Promise(resolve => this.m_currentPickingPromiseFunction = resolve);
		this.m_currentPickingPromise.then(value => {
			this.handlePickHookAction(i_action, value);
			this.three.exitHookMode();
		});
	}

	render() {
		const { classes } = this.props;

		return (
			<div className={this.props.className}>
				<div ref={element => this.threeRootElement = element} className={classes.viewer}
					onWheel={(e) => this.mouseWheel(e)} 
					onMouseDown={(e) => this.mouseDown(e)} onMouseUp={(e) => this.mouseUp(e)} onMouseMove={(e) => this.mouseMove(e)}
					tabIndex={0} onKeyDown={(e) => this.keyDown(e)}
					onClick={(e) => this.click(e)}
				></div>
				<SpeedDial
					ariaLabel="Add segment"
					className={classes.speedDial}
					icon={<SpeedDialIcon />}
					open={this.state.addSegmentSpeedDialOpen}
					onClick={e => this.addSegmentSpeedDialHandleClick(e)}
					>
					{addSegmentActions.map(action => (
						<SpeedDialAction 
							key={action.name}
							icon={ <img src={action.icon} alt={action.name} className={classes.speedDialIcon} /> }
							tooltipTitle={action.name}
							onClick={e => this.actionHandler(action.action)(e) }
						/>
					))}
				</SpeedDial>
			</div>
		);
	}
}

export default withStyles(styles)(TrackViewer);
