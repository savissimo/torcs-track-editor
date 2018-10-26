import { Component } from "react";

export default class SegmentEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			segment: props.Segment
		};
	}
}
