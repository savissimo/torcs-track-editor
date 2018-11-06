import { withStyles, TextField } from "@material-ui/core";
import { Slider } from "@material-ui/lab";
import React, { Component } from "react";
import PropTypes from "prop-types";

const styles = {
	root: {
		display: 'flex'
	},
	textbox: {
		flexGrow: 0,
		flexBasis: '5em',
		marginRight: '1em'
	},
	slider: {
		padding: '22px 0px',
		flexGrow: 1
    },
};

class ValueSlidingEditor extends Component {
	onChange(event, value) {
		this.props.onChange(Number.parseFloat(value || event.target.value));
	}

	render() {
		const { classes, value, min, max, step } = this.props;

		return (
			<div className={classes.root}>
				<TextField classes={{ root: classes.textbox }}
					value={value} onChange={(e, v) => this.onChange(e, v)} />
				<Slider aria-labelledby="lblLength" classes={{ container: classes.slider }}
					value={value} min={min} max={max} step={step}
					onChange={(e, v) => this.onChange(e, v)} 
					/>
			</div>
		);
	}
}

ValueSlidingEditor.propTypes = {
	value: PropTypes.number,
	min: PropTypes.number,
	max: PropTypes.number,
	step: PropTypes.number,
	onChange: PropTypes.func.isRequired
};

ValueSlidingEditor.defaultProps = {
	value: 50,
	min: 0,
	max: 100,
	step: 1
};

export default withStyles(styles)(ValueSlidingEditor);
