import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import ValueSlidingEditor from './ValueSlidingEditor';

export default class SegmentCommonEditor extends Component {
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
					<Typography id="lblArc">Banking start</Typography>
					<ValueSlidingEditor value={segment.getBankingStart() * 180/Math.PI} min={-90} max={90} step={0.5} 
						onChange={v => this.handleChange('bankingStart')(v * Math.PI/180)} />
				</div>
				<div>
					<Typography id="lblArc">Banking end</Typography>
					<ValueSlidingEditor value={segment.getBankingEnd() * 180/Math.PI} min={-90} max={90} step={0.5} 
						onChange={v => this.handleChange('bankingEnd')(v * Math.PI/180)} />
				</div>
			</div>
		);
	}
};
