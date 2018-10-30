import React, { Component } from "react";
import { ExpansionPanel, ExpansionPanelSummary, Typography, ExpansionPanelDetails } from "@material-ui/core";
import Straight from "../classes/Straight";
import Curve from "../classes/Curve";

import iconStraight from '../assets/icons/straight.svg';
import iconCurveRight from '../assets/icons/curve-right.svg';
import iconCurveLeft from '../assets/icons/curve-left.svg';
import StraightEditor from "./StraightEditor";
import CurveEditor from "./CurveEditor";

export default class SegmentEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		const segment = this.props.segment;
		let segmentType = 'Unknown type';
		let segmentIcon = '';
		let segmentProperties = undefined;
		if (segment instanceof Straight) {
			segmentType = 'Straight';
			segmentIcon = iconStraight;
			segmentProperties = <StraightEditor segment={this.props.segment} />;
		}
		else if (segment instanceof Curve) {
			segmentType = segment.isRight ? 'Right curve' : 'Left curve';
			segmentIcon = segment.isRight ? iconCurveRight : iconCurveLeft;
			segmentProperties = <CurveEditor segment={this.props.segment} />;
		}
		return (
			<ExpansionPanel style={{ width: '100%' }}>
				<ExpansionPanelSummary>
					<img src={segmentIcon} alt={segmentType} height="18px" />
					<Typography variant="subtitle1">{segment.name}</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails style={{ flexDirection: 'column' }}>
					<Typography variant="subtitle2">{segmentType}</Typography>
					{segmentProperties}
				</ExpansionPanelDetails>
			</ExpansionPanel>
		);
	}
}
