import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles, Tabs, Tab, Typography } from '@material-ui/core';

//// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconLeftBarrier from 'svg-react-loader!../assets/icons/left-barrier.svg';
//// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconLeftSide from 'svg-react-loader!../assets/icons/left-barrier.svg';
//// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconLeftBorder from 'svg-react-loader!../assets/icons/left-barrier.svg';
//// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconSegment from 'svg-react-loader!../assets/icons/segment.svg';
//// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconRightBorder from 'svg-react-loader!../assets/icons/right-barrier.svg';
//// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconRightSide from 'svg-react-loader!../assets/icons/right-barrier.svg';
//// eslint-disable-next-line import/no-webpack-loader-syntax
//import IconRightBarrier from 'svg-react-loader!../assets/icons/right-barrier.svg';

import iconLeftBarrier from '../assets/icons/left-barrier.svg';
import iconLeftSide from '../assets/icons/left-side.svg';
import iconLeftBorder from '../assets/icons/left-border.svg';
import iconSegment from '../assets/icons/segment.svg';
import iconRightBorder from '../assets/icons/right-border.svg';
import iconRightSide from '../assets/icons/right-side.svg';
import iconRightBarrier from '../assets/icons/right-barrier.svg';
import SegmentBorderEditor from './SegmentBorderEditor';
import SegmentSideEditor from './SegmentSideEditor';
import SegmentBarrierEditor from './SegmentBarrierEditor';

const styles = theme => ({
	tab: {
		flex: [[0, 0, 100/6 + '%']],
		minWidth: 0,
		'& img': {
			maxWidth: '100%',
			maxHeight: '100%'
		},
	},
	labelContainer: {
		paddingLeft: '.5em',
		paddingRight: '.5em',
	}
});

class SegmentOuterPartsEditor extends Component {
	state = {
		value: ''
	};

	handleChange(e, value) {
		this.setState({ value: value });
	}

	handleBorderUpdate(i_border, i_isRight) {
		if (i_isRight) {
			this.props.segment.setRightBorder(i_border);
		}
		else {
			this.props.segment.setLeftBorder(i_border);
		}
		this.props.onSegmentUpdated(this.props.segment);
	}

	handleSideUpdate(i_side, i_isRight) {
		if (i_isRight) {
			this.props.segment.setRightSide(i_side);
		}
		else {
			this.props.segment.setLeftSide(i_side);
		}
		this.props.onSegmentUpdated(this.props.segment);
	}

	handleBarrierUpdate(i_barrier, i_isRight) {
		if (i_isRight) {
			this.props.segment.setRightBarrier(i_barrier);
		}
		else {
			this.props.segment.setLeftBarrier(i_barrier);
		}
		this.props.onSegmentUpdated(this.props.segment);
	}

	render() {
		const { classes, className } = this.props;
		const { segment } = this.props;
		let createImgTag = (i_src) => <img src={i_src} alt="Icon" />
		return (
			<div className={classNames({ [classes.root]: true, [className]: className})}>
				<Tabs value={this.state.value} onChange={(e, value) => this.handleChange(e, value)} fullWidth={true}>
					<Tab className={classes.tab} classes={{ labelContainer: classes.labelContainer }} value="LB" icon={createImgTag(iconLeftBarrier)} />
					<Tab className={classes.tab} classes={{ labelContainer: classes.labelContainer }} value="LS" icon={createImgTag(iconLeftSide)} />
					<Tab className={classes.tab} classes={{ labelContainer: classes.labelContainer }} value="LC" icon={createImgTag(iconLeftBorder)} />
					<Tab className={classes.tab} classes={{ labelContainer: classes.labelContainer }} value="RC" icon={createImgTag(iconRightBorder)} />
					<Tab className={classes.tab} classes={{ labelContainer: classes.labelContainer }} value="RS" icon={createImgTag(iconRightSide)} />
					<Tab className={classes.tab} classes={{ labelContainer: classes.labelContainer }} value="RB" icon={createImgTag(iconRightBarrier)} />
				</Tabs>
				{this.state.value === 'LC' && <div>
					<Typography variant="h6">Left Border</Typography>
					<SegmentBorderEditor border={segment.leftBorder()} onBorderUpdated={e => this.handleBorderUpdate(e, false)} />
				</div>}
				{this.state.value === 'RC' && <div>
					<Typography variant="h6">Right Border</Typography>
					<SegmentBorderEditor border={segment.rightBorder()} onBorderUpdated={e => this.handleBorderUpdate(e, true)} />
				</div>}
				{this.state.value === 'LS' && <div>
					<Typography variant="h6">Left Side</Typography>
					<SegmentSideEditor side={segment.leftSide()} onSideUpdated={e => this.handleSideUpdate(e, false)} />
				</div>}
				{this.state.value === 'RS' && <div>
					<Typography variant="h6">Right Side</Typography>
					<SegmentSideEditor side={segment.rightSide()} onSideUpdated={e => this.handleSideUpdate(e, true)} />
				</div>}
				{this.state.value === 'LB' && <div>
					<Typography variant="h6">Left Barrier</Typography>
					<SegmentBarrierEditor barrier={segment.leftBarrier()} onBarrierUpdated={e => this.handleBarrierUpdate(e, false)} />
				</div>}
				{this.state.value === 'RB' && <div>
					<Typography variant="h6">Right Barrier</Typography>
					<SegmentBarrierEditor barrier={segment.rightBarrier()} onBarrierUpdated={e => this.handleBarrierUpdate(e, true)} />
				</div>}
			</div>
		);
	}
};

export default withStyles(styles)(SegmentOuterPartsEditor
);
