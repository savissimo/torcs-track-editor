export default class Segment {
	mainTrack = undefined;
	name = '';
	startZ = 0;
	endZ = 0;
	startWidth = 10;
	endWidth = 10;
	
	m_surface = undefined;

	m_leftBorder = undefined;
	m_leftSide = undefined;
	m_leftBarrier = undefined;
	m_leftBorder = undefined;
	m_leftSide = undefined;
	m_leftBarrier = undefined;
	
	constructor(i_mainTrack) {
		this.mainTrack = i_mainTrack;
	}
	
	surface = () => this.m_surface || this.mainTrack.defaultSurface;

	leftBorder   = () => this.m_leftBorder  || this.mainTrack.defaultLeftBorder;
	leftSide     = () => this.m_leftSide    || this.mainTrack.defaultLeftSide;
	leftBarrier  = () => this.m_leftBarrier || this.mainTrack.defaultLeftBarrier;
	rightBorder  = () => this.m_rightBorder  || this.mainTrack.defaultRightBorder;
	rightSide    = () => this.m_rightSide    || this.mainTrack.defaultRightSide;
	rightBarrier = () => this.m_rightBarrier || this.mainTrack.defaultRightBarrier;
}
