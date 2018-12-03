import TORCSUtils from "./TORCSUtils";

export default class SegmentBarrier {
	width = 0.1;
	height = 1;
	surface = 'barrier';
	style = 'curb';

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