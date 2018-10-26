import React, { Component } from "react";
import threeEntryPoint from '../threejs/threeEntryPoint';

export default class TrackViewer extends Component {
	constructor(props) {
		super(props);
		this.state = { track: props.track };
	}

	componentDidMount() {
		threeEntryPoint(this.threeRootElement);
	}

	render() {
		return (
			<div ref={element => this.threeRootElement = element} className={this.props.classes.content}/>
		);
	}
}