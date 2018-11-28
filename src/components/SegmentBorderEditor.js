import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles, Typography } from '@material-ui/core';
import ValueSlidingEditor from './ValueSlidingEditor';

const styles = theme => ({
});

class SegmentBorderEditor extends Component {
	handleChange = (field) => (value) => {
		const border = this.props.border;
		border[field] = value;
		this.props.onBorderUpdated(border);
	}

	render() {
		const { classes, className } = this.props;
		const { border } = this.props;
		return (
			<div className={classNames({ [classes.root]: true, [className]: className})}>				
				<div>
					<Typography>Width</Typography>
					<ValueSlidingEditor value={border.width} min={0} max={50} step={0.1} onChange={v => this.handleChange('width')(v)} />
				</div>
				<div>
					<Typography>Height</Typography>
					<ValueSlidingEditor value={border.height} min={0} max={50} step={0.1} onChange={v => this.handleChange('height')(v)} />
				</div>
			</div>
		);
	}
};

export default withStyles(styles)(SegmentBorderEditor);
