import React, { Component } from "react";
import threeEntryPoint from '../threejs/threeEntryPoint';

export default class TrackViewer extends Component {
	constructor(props) {
		super(props);
		this.state = { 
			//track: props.track,
			mouseLeftDown: false,
			mouseLeftDragging: false,
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

		if (!nextProps.mouseLeftDragging && nextProps.mouseLeftDragging === this.state.mouseLeftDragging) {
			return false;
		}

		return false;
	}

	componentDidUpdate() {
		this.three.updateScene(this.props.track);
	}

	mouseWheel(e) {
		this.three.zoom(e.deltaY > 0);
	}

	mouseDown(e) {
		if (e.button === 0)
		{
			this.setState({ mouseLeftDown: true, mouseLeftDragging: false, 
				mouseLeftDownLastPositionX: e.screenX, mouseLeftDownLastPositionY: e.screenY });
		}
	}

	mouseUp(e) {
		if (e.button === 0)
		{
			this.setState({ mouseLeftDown: false, mouseLeftDragging: false, 
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

	render() {
		return (
			<div ref={element => this.threeRootElement = element} className={this.props.classes.content}
				onWheel={(e) => this.mouseWheel(e)} 
				onMouseDown={(e) => this.mouseDown(e)} onMouseUp={(e) => this.mouseUp(e)} onMouseMove={(e) => this.mouseMove(e)}
			>
			</div>
		);
	}
}