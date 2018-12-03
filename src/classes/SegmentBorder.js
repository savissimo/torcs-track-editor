import TORCSUtils from "./TORCSUtils";

export default class SegmentBorder {
	width = 0.5;
	height = 0.05;
	surface = 'curb-5cm-r';
	style = 'plan';

	segment = undefined;

	constructor(i_segment) {
		this.segment = i_segment;
	}

	loadTORCSXml(i_xmlNode) {
		this.width = TORCSUtils.getNumericAttribute(i_xmlNode, 'width');
		this.height = TORCSUtils.getNumericAttribute(i_xmlNode, 'height');
		this.surface = TORCSUtils.getStringAttribute(i_xmlNode, 'surface');
		this.style = TORCSUtils.getStringAttribute(i_xmlNode, 'style');
	}
}