import TORCSUtils from "./TORCSUtils";

export default class TrackHeader {
	name = 'Track';
	category = 'road';
	version = '1';
	author = '';
	description = '';

	loadTORCSXml(i_xmlNode) {
		this.name = TORCSUtils.getStringAttribute(i_xmlNode, 'name');
		this.category = TORCSUtils.getStringAttribute(i_xmlNode, 'category');
		this.version = TORCSUtils.getNumericAttribute(i_xmlNode, 'version');
		this.author = TORCSUtils.getStringAttribute(i_xmlNode, 'author');
		this.description = TORCSUtils.getStringAttribute(i_xmlNode, 'description');
	}
}