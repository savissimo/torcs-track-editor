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
		return (
			<React.Fragment>
				<ExpansionPanel defaultExpanded={false}>
					<ExpansionPanelSummary>
						<Typography variant="h6">Main Track</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails style={{ flexDirection: 'column' }}>
						<Typography variant="body2">{mainTrack.trackSegments.length} segments in the MainTrack</Typography>
						<Typography variant="body2">Total length: {mainTrack.track.getTotalLength().toFixed(2)} m</Typography>
						<Typography variant="body2">Total delta:</Typography>
							<ul>
								<li><Typography variant="body2">X: {totalDelta.position.x.toFixed(3)} m</Typography></li>
								<li><Typography variant="body2">Y: {totalDelta.position.y.toFixed(3)} m</Typography></li>
								<li><Typography variant="body2">Z: {totalDelta.position.z.toFixed(3)} m</Typography></li>
								<li><Typography variant="body2">Angle: {totalDelta.rotation * 180/Math.PI}°</Typography></li>
							</ul>
						
					</ExpansionPanelDetails>
				</ExpansionPanel>
				<ExpansionPanel expanded={this.props.selectedSegment !== undefined}>
					<ExpansionPanelSummary>
						<Typography variant="h6">Selected Segment</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails style={{ flexDirection: 'column' }}>
						<SegmentEditor segment={this.props.selectedSegment} 
								onSegmentUpdated={s => this.handleSegmentUpdated(s)}
							/>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</React.Fragment>
		);
	}
}
