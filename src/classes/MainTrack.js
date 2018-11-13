import SegmentSide from "./SegmentSide";
import SegmentBorder from "./SegmentBorder";
import SegmentBarrier from "./SegmentBarrier";
import Pits from "./Pits";
import Straight from "./Straight";
import Curve from "./Curve";
import TORCSUtils from "./TORCSUtils";

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
		this.width = TORCSUtils.getNumericAttribute(i_xmlNode, 'width');
		this.profilStopsLength = TORCSUtils.getNumericAttribute(i_xmlNode, 'profil steps length');
		this.defaultSurface = TORCSUtils.getStringAttribute(i_xmlNode, 'surface');

		let trackSegmentsNode = i_xmlNode.querySelector('section[name="Track Segments"]');
		let trackSegmentNodes = [...trackSegmentsNode.children];
		let theTrack = this;
		this.trackSegments = trackSegmentNodes
			.filter((child) => child.nodeName === 'section')
			.map((tsNode) => {
				let type = TORCSUtils.getStringAttribute(tsNode, 'type');
				let segment = undefined;
				switch (type)
				{
				case 'str':
					segment = new Straight(this);
					segment.length = TORCSUtils.getNumericAttribute(tsNode, 'lg');
					break;
				case 'rgt':
				case 'lft':
					segment = new Curve(this);
					segment.isRight = type === 'rgt';
					segment.arc = TORCSUtils.getNumericAttribute(tsNode, 'arc');
					segment.startRadius = TORCSUtils.getNumericAttribute(tsNode, 'radius');
					segment.endRadius = TORCSUtils.getNumericAttribute(tsNode, 'end radius') || segment.startRadius;
					break;
				default:
					break;
				}
				if (segment)
				{
					segment.name = tsNode.getAttribute('name');
					segment.startZ = TORCSUtils.getNumericAttribute(tsNode, 'z start');
					segment.endZ = TORCSUtils.getNumericAttribute(tsNode, 'z end');
					segment.surface = TORCSUtils.getStringAttribute(tsNode, 'surface');
					segment.startWidth = theTrack.width;
					segment.endWidth = theTrack.width;
				}
				return segment;
			});
		console.log(this.trackSegments);
	}

	insertSegmentAt(i_segment, i_insertionIndex) {
		this.trackSegments.splice(i_insertionIndex, 0, i_segment);
	}
}