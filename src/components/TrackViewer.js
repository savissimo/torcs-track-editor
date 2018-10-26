import React, { Component } from "react";
import threeEntryPoint from '../threejs/threeEntryPoint';

export default class TrackViewer extends Component {
	componentDidMount() {
		threeEntryPoint(this.threeRootElement);
	}

	render() {
		return (
			<div ref={element => this.threeRootElement = element} />
		);
	}
}