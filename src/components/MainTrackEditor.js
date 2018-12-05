import React, { Component } from "react";
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, } from "@material-ui/core";
import SegmentEditor from "./SegmentEditor";

export default class MainTrackEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {			
		};
	}

	handleSegmentUpdated(segment) {
		this.props.onSegmentUpdated(segment);
	}

	render() {
		const mainTrack = this.props.mainTrack;
		const totalDelta = mainTrack.track.getTotalDelta();
		console.log(totalDelta);
		return (
			<ExpansionPanel defaultExpanded={true}>
				<ExpansionPanelSummary>
					<Typography variant="h6">Main Track</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails style={{ flexDirection: 'column' }}>
					<Typography variant="body2">{mainTrack.trackSegments.length} segments in the MainTrack</Typography>
					<Typography variant="body2">Total length: {mainTrack.track.getTotalLength().toFixed(2)}</Typography>
					<Typography variant="body2">Total delta: 
						<ul>
							<li>X: {totalDelta.position.x.toFixed(3)} m</li>
							<li>Y: {totalDelta.position.y.toFixed(3)} m</li>
							<li>Z: {totalDelta.position.z.toFixed(3)} m</li>
							<li>Angle: {totalDelta.rotation * 180/Math.PI}°</li>
						</ul>
					</Typography>
					<SegmentEditor segment={this.props.selectedSegment} 
						onSegmentUpdated={s => this.handleSegmentUpdated(s)}
					/>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}
