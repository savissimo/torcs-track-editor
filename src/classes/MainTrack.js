import SegmentSide from "./SegmentSide";
import SegmentBorder from "./SegmentBorder";
import SegmentBarrier from "./SegmentBarrier";
import Pits from "./Pits";
import Straight from "./Straight";

export default class MainTrack {
	width = 10;
	profilStopsLength = 4;
	defaultSurface = 'asphalt2-lines';
	
	defaultLeftSide = new SegmentSide();
	defaultLeftBorder = new SegmentBorder();
	defaultLeftBarrier = new SegmentBarrier();

	defaultRightSide = new SegmentSide();
	defaultRightBorder = new SegmentBorder();
	defaultRightBarrier = new SegmentBarrier();

	pits = new Pits();

	trackSegments = [];

	loadTORCSXml(i_xmlNode) {
		this.width = i_xmlNode.querySelector('attnum[name="width"]').getAttribute('val');
		this.profilStopsLength = i_xmlNode.querySelector('attnum[name="profil steps length"]').getAttribute('val');
		this.defaultSurface = i_xmlNode.querySelector('attstr[name="surface"]').getAttribute('val');

		let trackSegmentsNode = i_xmlNode.querySelector('section[name="Track Segments"]');
		let trackSegmentNodes = [...trackSegmentsNode.children];
		this.trackSegments = trackSegmentNodes
			.filter((child) => child.nodeName === 'section')
			.map((tsNode) => {
				let type = tsNode.querySelector('attstr[name="type"]').getAttribute('val');
				let segment = undefined;
				switch (type)
				{
				case 'str':
					segment = new Straight(this);
					segment.length = tsNode.querySelector('attnum[name="lg"]').getAttribute('val');
					break;
					default:
					break;
				}
				if (segment)
				{
					segment.name = tsNode.getAttribute('name');
					segment.startZ = tsNode.querySelector('attnum[name="z start"]').getAttribute('val');
					segment.endZ = tsNode.querySelector('attnum[name="z end"]').getAttribute('val');
					segment.surface = tsNode.querySelector('attstr[name="surface"]').getAttribute('val');
				}
				return segment;
			});
		console.log(this.trackSegments);
	}
}