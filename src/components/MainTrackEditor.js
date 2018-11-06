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
		return (
			<ExpansionPanel defaultExpanded={true}>
				<ExpansionPanelSummary>
					<Typography variant="h6">Main Track</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails style={{ flexDirection: 'column' }}>
					<Typography variant="body2">{this.props.mainTrack.trackSegments.length} segments in the MainTrack</Typography>
					<SegmentEditor segment={this.props.selectedSegment} 
						onSegmentUpdated={s => this.handleSegmentUpdated(s)}
					/>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}
