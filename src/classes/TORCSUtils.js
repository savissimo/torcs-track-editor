export default class TORCSUtils {
	static getStringAttribute(i_xmlNode, i_key) {
		return i_xmlNode.querySelector('attstr[name="' + i_key + '"]').getAttribute('val');
	}

	static getNumericAttribute(i_xmlNode, i_key) {
		let attribute = i_xmlNode.querySelector('attnum[name="' + i_key + '"]');
		if (attribute && attribute.parentElement === i_xmlNode) {
			return Number(attribute.getAttribute('val'));
		}
		return undefined;
	}
}