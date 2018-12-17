export default class TORCSUtils {
	static getStringAttribute(i_xmlNode, i_key, i_defaultValue) {
		if (i_xmlNode) {
			const attribute = i_xmlNode.querySelector('attstr[name="' + i_key + '"]');
			if (attribute && attribute.parentElement === i_xmlNode) {
				return attribute.getAttribute('val') + '';
			}
		}
		return i_defaultValue;
	}

	static getNumericAttribute(i_xmlNode, i_key, i_defaultValue) {
		if (i_xmlNode) {
			const attribute = i_xmlNode.querySelector('attnum[name="' + i_key + '"]');
			if (attribute && attribute.parentElement === i_xmlNode) {
				let value = Number(attribute.getAttribute('val'));
				const unit = attribute.getAttribute('unit');
				switch (unit) {
					case 'deg': value = value * Math.PI/180.0; break;
					case 'ft': value = value / 3.28084; break;
					case '%': value = value / 100.0; break;
					default: break;
				}
				return value;
			}
		}
		return i_defaultValue;
	}
}