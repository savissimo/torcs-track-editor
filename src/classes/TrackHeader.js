export default class TrackHeader {
	name = 'Track';
	category = 'road';
	version = '1';
	author = '';
	description = '';

	loadTORCSXml(i_xmlNode) {
		this.name = i_xmlNode.querySelector('attstr[name="name"]').getAttribute('val');
		this.category = i_xmlNode.querySelector('attstr[name="category"]').getAttribute('val');
		this.version = i_xmlNode.querySelector('attnum[name="version"]').getAttribute('val');
		this.author = i_xmlNode.querySelector('attstr[name="author"]').getAttribute('val');
		this.description = i_xmlNode.querySelector('attstr[name="description"]').getAttribute('val');
	}
}