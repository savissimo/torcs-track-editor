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
	
	defaultProfilStepsLength = 4;

	defaultLeftSide = new SegmentSide();
	defaultLeftBorder = new SegmentBorder();
	defaultLeftBarrier = new SegmentBarrier();

	defaultRightSide = new SegmentSide();
	defaultRightBorder = new SegmentBorder();
	defaultRightBarrier = new SegmentBarrier();

	pits = new Pits();

	track = undefined;
	trackSegments = [];
	
	constructor(i_track) {
		this.track = i_track;
	}

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
					segment.profilStepsLength = TORCSUtils.getNumericAttribute(tsNode, 'profil steps length') || this.defaultProfilStepsLength;
					break;
				default:
					break;
				}
				if (segment)
				{
					segment.name = tsNode.getAttribute('name');
					segment.startZ = TORCSUtils.getNumericAttribute(tsNode, 'z start');
					segment.endZ = TORCSUtils.getNumericAttribute(tsNode, 'z end');
					segment.m_surface = TORCSUtils.getStringAttribute(tsNode, 'surface');
					segment.startWidth = theTrack.width;
					segment.endWidth = theTrack.width;

					segment.m_leftBorder = new SegmentBorder(segment); 
					segment.m_leftBorder.loadTORCSXml(tsNode.querySelector('section[name="Left Border"]'));
					segment.m_leftSide = new SegmentSide(segment); 
					segment.m_leftSide.loadTORCSXml(tsNode.querySelector('section[name="Left Side"]'));
					segment.m_leftBarrier = new SegmentBarrier(segment); 
					segment.m_leftBarrier.loadTORCSXml(tsNode.querySelector('section[name="Left Barrier"]'));

					segment.m_rightBorder = new SegmentBorder(segment); 
					segment.m_rightBorder.loadTORCSXml(tsNode.querySelector('section[name="Right Border"]'));
					segment.m_rightSide = new SegmentSide(segment); 
					segment.m_rightSide.loadTORCSXml(tsNode.querySelector('section[name="Right Side"]'));
					segment.m_rightBarrier = new SegmentBarrier(segment); 
					segment.m_rightBarrier.loadTORCSXml(tsNode.querySelector('section[name="Right Barrier"]'));
				}
				return segment;
			});
	}

	insertSegmentAt(i_segment, i_insertionIndex) {
		this.trackSegments.splice(i_insertionIndex, 0, i_segment);
	}
}