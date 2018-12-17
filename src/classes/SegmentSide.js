import TORCSUtils from "./TORCSUtils";

export default class SegmentSide {
	startWidth = 4;
	endWidth = 4;
	surface = 'grass';
	bankingType = 'level';

	segment = undefined;

	constructor(i_segment) {
		this.segment = i_segment;
	}

	loadTORCSXml(i_xmlNode) {
		this.startWidth = TORCSUtils.getNumericAttribute(i_xmlNode, 'start width');
		this.endWidth = TORCSUtils.getNumericAttribute(i_xmlNode, 'end width', 0);
		this.surface = TORCSUtils.getStringAttribute(i_xmlNode, 'surface', 'grass');
		this.bankingType = TORCSUtils.getStringAttribute(i_xmlNode, 'banking type', 'level');
	}
}