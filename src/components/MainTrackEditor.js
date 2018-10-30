import React, { Component } from "react";
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails, List, ListItem } from "@material-ui/core";
import SegmentEditor from "./SegmentEditor";

export default class MainTrackEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {			
		};
	}

	render() {
		return (
			<ExpansionPanel defaultExpanded={true}>
				<ExpansionPanelSummary>
					<Typography variant="h6">Main Track</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails style={{ flexDirection: 'column' }}>
					<Typography variant="body2">{this.props.mainTrack.trackSegments.length} segments in the MainTrack</Typography>
					<List dense={true} disablePadding={true}>
						{this.props.mainTrack.trackSegments.map(
							(segment, index) => <ListItem key={index} disableGutters={true}><SegmentEditor segment={segment}/></ListItem>
							)}
					</List>
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}
