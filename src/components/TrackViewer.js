import React, { Component } from "react";
import threeEntryPoint from '../threejs/threeEntryPoint';

export default class TrackViewer extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			//track: props.track,
			perspective: true,
			mouseLeftDown: false,
			mouseLeftDragging: false,
			mouseLeftJustDragged: false,
			mouseLeftDownLastPositionX: undefined,
			mouseLeftDownLastPositionY: undefined
		};
	}

	componentDidMount() {
		this.three = threeEntryPoint(this.threeRootElement);
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.track !== this.props.track) {
			return true;
		}

		if (nextState.perspective !== this.state.perspective) {
			return true;
		}

		if (!nextProps.mouseLeftDragging && nextProps.mouseLeftDragging === this.state.mouseLeftDragging) {
			return false;
		}

		return false;
	}

	componentDidUpdate(prevProps, prevState) {
		if (prevProps.track !== this.props.track) {
			this.three.updateTrack(this.props.track);
		}

		if (prevState.perspective !== this.state.perspective) {
			this.state.perspective ? this.three.setPerspectiveCamera() : this.three.setOrthogonalCamera();
		}
	}

	mouseWheel(e) {
		this.three.zoom(e.deltaY > 0);
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
				this.three.moveCamera(xDistance, yDistance);
			}
		}
	}

	click(e) {
		if (e.button === 0) {
			if (this.state.mouseLeftJustDragged) {
				this.setState({ mouseLeftJustDragged: false });
				return;
			}

			let pickedSegment = this.three.pick(e.clientX - this.threeRootElement.offsetLeft, e.clientY - this.threeRootElement.offsetTop);
			this.props.onSegmentSelected(pickedSegment);
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

	render() {
		return (
			<div ref={element => this.threeRootElement = element} className={this.props.classes.content}
				onWheel={(e) => this.mouseWheel(e)} 
				onMouseDown={(e) => this.mouseDown(e)} onMouseUp={(e) => this.mouseUp(e)} onMouseMove={(e) => this.mouseMove(e)}
				tabIndex={0} onKeyDown={(e) => this.keyDown(e)}
				onClick={(e) => this.click(e)}
			>
			</div>
		);
	}
}