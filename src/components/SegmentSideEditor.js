import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles, Typography, FormControlLabel, Switch } from '@material-ui/core';
import ValueSlidingEditor from './ValueSlidingEditor';

const styles = theme => ({
});

class SegmentSideEditor extends Component {
	state = {
		isWidthFixed: false,
	}

	handleChange = (field) => (value) => {
		const side = this.props.side;
		side[field] = value;
		if (this.state.isWidthFixed && (field === 'endWidth' || field === 'startWidth')) {
			side.endWidth = side.startWidth;
		}
		this.props.onSideUpdated(side);
	}

	handleFixedWidthChange(e) {
		this.setState({ isWidthFixed: e.target.checked });
		this.props.side.endWidth = this.props.side.startWidth;
		this.props.onSideUpdated(this.props.side);
	}

	render() {
		const { classes, className } = this.props;
		const { side } = this.props;
		return (
			<div className={classNames({ [classes.root]: true, [className]: className})}>				
				<div>
					<Typography>Start width</Typography>
					<ValueSlidingEditor value={side.startWidth} min={0} max={50} step={0.1} onChange={v => this.handleChange('startWidth')(v)} />
				</div>
				<div>
					<Typography>End width</Typography>
					<FormControlLabel 
						control={<Switch checked={this.state.isWidthFixed} onChange={e => this.handleFixedWidthChange(e)}/>}
						label="Same width from start to end"
						/>
					<ValueSlidingEditor value={side.endWidth} min={0} max={50} step={0.1} onChange={v => this.handleChange('endWidth')(v)} />
				</div>
			</div>
		);
	}
};

export default withStyles(styles)(SegmentSideEditor);
