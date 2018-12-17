import TORCSUtils from "./TORCSUtils";

export default class SegmentBarrier {
	width = 0.1;
	height = 1;
	surface = 'barrier';
	style = 'fence';

	segment = undefined;

	constructor(i_segment) {
		this.segment = i_segment;
	}

	loadTORCSXml(i_xmlNode) {
		this.height = TORCSUtils.getNumericAttribute(i_xmlNode, 'height', 0.6);
		this.surface = TORCSUtils.getStringAttribute(i_xmlNode, 'surface', 'barrier');
		this.style = TORCSUtils.getStringAttribute(i_xmlNode, 'style', 'fence');
		this.width = this.style === 'fence'
			? 0
			: TORCSUtils.getNumericAttribute(i_xmlNode, 'width');
	}
}