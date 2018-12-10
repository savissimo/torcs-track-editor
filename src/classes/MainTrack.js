import SegmentSide from "./SegmentSide";
import SegmentBorder from "./SegmentBorder";
import SegmentBarrier from "./SegmentBarrier";
import Pits from "./Pits";
import Straight from "./Straight";
import Curve from "./Curve";
import TORCSUtils from "./TORCSUtils";
import lodash from 'lodash';

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

		let zsr, zsl, zer, zel = 0;

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
					segment.m_surface = TORCSUtils.getStringAttribute(tsNode, 'surface');
					segment.startWidth = theTrack.width;
					segment.endWidth = theTrack.width;

					segment.zStartLeft = TORCSUtils.getNumericAttribute(tsNode, 'z start left', zsl);
					segment.zStartRight = TORCSUtils.getNumericAttribute(tsNode, 'z start right', zsr);
					segment.zEndLeft = TORCSUtils.getNumericAttribute(tsNode, 'z end left', zel);
					segment.zEndRight = TORCSUtils.getNumericAttribute(tsNode, 'z end right', zer);
					segment.zStart = TORCSUtils.getNumericAttribute(tsNode, 'z start');
					segment.zEnd = TORCSUtils.getNumericAttribute(tsNode, 'z end');
					segment.grade = TORCSUtils.getNumericAttribute(tsNode, 'grade');
					
					if (segment.zStart !== undefined) {
						segment.zStartLeft = segment.zStartRight = segment.zStart;
					}
					else {
						segment.zStart = (segment.zStartLeft + segment.zStartRight) / 2.0;
					}
					if (segment.zEnd !== undefined) {
						segment.zEndLeft = segment.zEndRight = segment.zEnd;
					}
					else if (segment.grade !== undefined) {
						segment.zEnd = segment.zStart + segment.getLength() * segment.grade;
					}
					else {
						segment.zEnd = (segment.zEndLeft + segment.zEndRight) / 2.0;
					}
					
					segment.bankingStart = TORCSUtils.getNumericAttribute(tsNode, 'banking start', 
						Math.atan2(segment.zStartLeft - segment.zStartRight, segment.startWidth));
					segment.bankingEnd = TORCSUtils.getNumericAttribute(tsNode, 'banking end', 
						Math.atan2(segment.zEndLeft - segment.zEndRight, segment.endWidth));
					
					const dzStart = Math.tan(segment.bankingStart) * segment.startWidth / 2.0;
					const dzEnd = Math.tan(segment.bankingEnd) * segment.endWidth / 2.0;
					segment.zStartLeft = segment.zStart + dzStart;
					segment.zStartRight = segment.zStart - dzStart;
					zsl = segment.zEndLeft = segment.zEnd + dzEnd;
					zsr = segment.zEndRight = segment.zEnd - dzEnd;
					console.log(`Segment ${segment.name}: ${segment.zStartLeft} ${segment.zStartRight} ${segment.zEndLeft} ${segment.zEndRight}`);


					let lcNode = tsNode.querySelector('section[name="Left Border"]');
					if (lcNode) {
						segment.m_leftBorder = new SegmentBorder(segment); 
						segment.m_leftBorder.loadTORCSXml(lcNode);
					}
					else {
						segment.m_leftBorder = lodash.clone(this.defaultLeftBorder);
						segment.m_leftBorder.segment = segment;
					}
					let lsNode = tsNode.querySelector('section[name="Left Side"]');
					if (lsNode) {
						segment.m_leftSide = new SegmentSide(segment); 
						segment.m_leftSide.loadTORCSXml(lsNode);
					}
					else {
						segment.m_leftSide = lodash.clone(this.defaultLeftSide);
						segment.m_leftSide.segment = segment;
					}
					let lbNode = tsNode.querySelector('section[name="Left Barrier"]');
					if (lbNode) {
						segment.m_leftBarrier = new SegmentBarrier(segment); 
						segment.m_leftBarrier.loadTORCSXml(lbNode);
					}
					else {
						segment.m_leftBarrier = lodash.clone(this.defaultLeftBarrier);
						segment.m_leftBarrier.segment = segment;
					}

					let rcNode = tsNode.querySelector('section[name="Right Border"]');
					if (rcNode) {
						segment.m_rightBorder = new SegmentBorder(segment); 
						segment.m_rightBorder.loadTORCSXml(rcNode);
					}
					else {
						segment.m_rightBorder = lodash.clone(this.defaultRightBorder);
						segment.m_rightBorder.segment = segment;
					}
					let rsNode = tsNode.querySelector('section[name="Right Side"]');
					if (rsNode) {
						segment.m_rightSide = new SegmentSide(segment); 
						segment.m_rightSide.loadTORCSXml(rsNode);
					}
					else {
						segment.m_rightSide = lodash.clone(this.defaultRightSide);
						segment.m_rightSide.segment = segment;
					}
					let rbNode = tsNode.querySelector('section[name="Right Barrier"]');
					if (rbNode) {
						segment.m_rightBarrier = new SegmentBarrier(segment); 
						segment.m_rightBarrier.loadTORCSXml(rbNode);
					}
					else {
						segment.m_rightBarrier = lodash.clone(this.defaultRightBarrier);
						segment.m_rightBarrier.segment = segment;
					}
				}
				return segment;
			});
	}

	insertSegmentAt(i_segment, i_insertionIndex) {
		this.trackSegments.splice(i_insertionIndex, 0, i_segment);
	}
}