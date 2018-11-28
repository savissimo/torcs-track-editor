import TORCSUtils from "./TORCSUtils";

export default class SegmentSide {
	startWidth = 4;
	endWidth = 4;
	surface = 'grass';

	loadTORCSXml(i_xmlNode) {
		this.startWidth = TORCSUtils.getNumericAttribute(i_xmlNode, 'start width');
		this.endWidth = TORCSUtils.getNumericAttribute(i_xmlNode, 'end width');
		this.surface = TORCSUtils.getStringAttribute(i_xmlNode, 'surface');
	}
}