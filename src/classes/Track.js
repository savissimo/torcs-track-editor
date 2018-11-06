import TrackHeader from "./TrackHeader";
import TrackGraphic from "./TrackGraphic";
import MainTrack from "./MainTrack";

export default class Track {
	header = new TrackHeader();
	graphic = new TrackGraphic();
	mainTrack = new MainTrack();
	isDirty = false;

	loadTORCSXml(i_xmlDocument) {
		this.header.loadTORCSXml(i_xmlDocument.querySelector('section[name="Header"]'));
		this.mainTrack.loadTORCSXml(i_xmlDocument.querySelector('section[name="Main Track"]'));
	}

	setDirty() {
		this.isDirty = true;
	}
}
