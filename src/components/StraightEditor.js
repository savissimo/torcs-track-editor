import React, { Component } from "react";
import { Typography, withStyles } from "@material-ui/core";
import ValueSlidingEditor from "./ValueSlidingEditor";

const styles = {
};
  
class StraightEditor extends Component {
	handleChange = (field) => (value) => {
		const segment = this.props.segment;
		segment[field] = value;
		this.props.onSegmentUpdated(segment);
	}

	render() {
		const segment = this.props.segment;
		return (
			<div>
				<div>
					<Typography id="lblLength">Length</Typography>
					<ValueSlidingEditor value={segment.length} min={0} max={500} step={0.1} onChange={v => this.handleChange('length')(v)} />
				</div>
			</div>
		);
	}
}

export default withStyles(styles)(StraightEditor);
