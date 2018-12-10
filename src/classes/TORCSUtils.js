export default class TORCSUtils {
	static getStringAttribute(i_xmlNode, i_key, i_defaultValue) {
		if (!i_xmlNode) { return i_defaultValue; }
		let attribute = i_xmlNode.querySelector('attstr[name="' + i_key + '"]');
		if (attribute && attribute.parentElement === i_xmlNode) {
			return attribute.getAttribute('val') + '';
		}
		return undefined;
	}

	static getNumericAttribute(i_xmlNode, i_key, i_defaultValue) {
		if (!i_xmlNode) { return i_defaultValue; }
		let attribute = i_xmlNode.querySelector('attnum[name="' + i_key + '"]');
		if (attribute && attribute.parentElement === i_xmlNode) {
			let value = Number(attribute.getAttribute('val'));
			let unit = attribute.getAttribute('unit');
			switch (unit){
				case 'deg': value = value * Math.PI/180.0; break;
				case 'ft': value = value / 3.28084; break;
				default: break;
			}
			return value;
		}
		return undefined;
	}
}