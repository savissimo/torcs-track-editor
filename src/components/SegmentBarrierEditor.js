import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles, Typography } from '@material-ui/core';
import ValueSlidingEditor from './ValueSlidingEditor';

const styles = theme => ({
});

class SegmentBarrierEditor extends Component {
	handleChange = (field) => (value) => {
		const barrier = this.props.barrier;
		barrier[field] = value;
		this.props.onBarrierUpdated(barrier);
	}

	render() {
		const { classes, className } = this.props;
		const { barrier } = this.props;
		return (
			<div className={classNames({ [classes.root]: true, [className]: className})}>				
				<div>
					<Typography>Width</Typography>
					<ValueSlidingEditor value={barrier.width} min={0} max={50} step={0.1} onChange={v => this.handleChange('width')(v)} />
				</div>
				<div>
					<Typography>Height</Typography>
					<ValueSlidingEditor value={barrier.height} min={0} max={50} step={0.1} onChange={v => this.handleChange('height')(v)} />
				</div>
			</div>
		);
	}
};

export default withStyles(styles)(SegmentBarrierEditor);
