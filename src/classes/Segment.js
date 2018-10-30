export default class Segment {
	mainTrack = undefined;
	name = '';
	startZ = 0;
	endZ = 0;
	startWidth = 10;
	endWidth = 10;
	
	constructor(i_mainTrack) {
		this.mainTrack = i_mainTrack;
		var m_surface = undefined;
		
		this.surface = () => m_surface || this.mainTrack.defaultSurface;
	}
}
