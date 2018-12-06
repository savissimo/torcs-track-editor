import React, { Component } from "react";
import { Typography } from "@material-ui/core";
import ValueSlidingEditor from "./ValueSlidingEditor";

export default class CurveEditor extends Component {
	handleChange = (field) => (value) => {
		const segment = this.props.segment;
		segment.setValue(field, value);
		this.props.onSegmentUpdated(segment);
	}

	render() {
		const segment = this.props.segment;
		return (
			<div>
				<div>
					<Typography id="lblArc">Arc</Typography>
					<ValueSlidingEditor value={segment.arc} min={0} max={360} step={0.1} 
						onChange={v => this.handleChange('arc')(v)} />
				</div>
				<div>
					<Typography id="lblStartRadius">Start radius</Typography>
					<ValueSlidingEditor value={segment.startRadius} min={segment.startWidth/2} max={1000} step={0.1} 
						onChange={v => this.handleChange('startRadius')(v)} />
				</div>
				<div>
					<Typography id="lblEndRadius">End radius</Typography>
					<ValueSlidingEditor value={segment.endRadius} min={segment.startWidth/2} max={1000} step={0.1} 
						onChange={v => this.handleChange('endRadius')(v)} />
				</div>
			</div>
		);
	}
}
