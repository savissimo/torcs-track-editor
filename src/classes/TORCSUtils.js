export default class TORCSUtils {
	static getStringAttribute(i_xmlNode, i_key) {
		if (!i_xmlNode) { return ''; }
		let attribute = i_xmlNode.querySelector('attstr[name="' + i_key + '"]');
		if (attribute && attribute.parentElement === i_xmlNode) {
			return attribute.getAttribute('val') + '';
		}
		return undefined;
	}

	static getNumericAttribute(i_xmlNode, i_key) {
		if (!i_xmlNode) { return 0; }
		let attribute = i_xmlNode.querySelector('attnum[name="' + i_key + '"]');
		if (attribute && attribute.parentElement === i_xmlNode) {
			return Number(attribute.getAttribute('val'));
		}
		return undefined;
	}
}