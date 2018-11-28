import React, { Component } from "react";
import { Card, CardContent, CardHeader, Avatar } from "@material-ui/core";
import Straight from "../classes/Straight";
import Curve from "../classes/Curve";

import iconStraight from '../assets/icons/straight.svg';
import iconCurveRight from '../assets/icons/curve-right.svg';
import iconCurveLeft from '../assets/icons/curve-left.svg';
import StraightEditor from "./StraightEditor";
import CurveEditor from "./CurveEditor";
import SegmentOuterPartsEditor from "./SegmentOuterPartsEditor";

export default class SegmentEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	handleSegmentUpdated(segment) {
		this.props.onSegmentUpdated(segment);
	}

	render() {
		const segment = this.props.segment;
		if (!segment) {
			return (<div></div>);
		}
		const segmentName = (segment && segment.name) || '';
		let segmentType = 'Unknown type';
		let segmentIcon = '';
		let segmentProperties = undefined;
		if (segment instanceof Straight) {
			segmentType = 'Straight';
			segmentIcon = iconStraight;
			segmentProperties = <StraightEditor segment={this.props.segment}
				onSegmentUpdated={(s) => this.handleSegmentUpdated(s)}
				/>;
		}
		else if (segment instanceof Curve) {
			segmentType = segment.isRight ? 'Right curve' : 'Left curve';
			segmentIcon = segment.isRight ? iconCurveRight : iconCurveLeft;
			segmentProperties = <CurveEditor segment={this.props.segment}
				onSegmentUpdated={(s) => this.handleSegmentUpdated(s)}
				/>;
		}
		const segmentLength = this.props.segment.getLength();
		return (
			<Card>
				<CardContent>
					<CardHeader
						title={segmentName}
						subheader={segmentType + ' - ' + segmentLength.toFixed(2) + ' m'}
						avatar={
							<Avatar aria-label={segmentType}>
								<img src={segmentIcon} alt={segmentType} height="18px" />
							</Avatar>
						}
						/>
					{segmentProperties}
					<SegmentOuterPartsEditor segment={this.props.segment} 
						onSegmentUpdated={(s) => this.handleSegmentUpdated(s)}
						/>
				</CardContent>
			</Card>
		);
	}
}
