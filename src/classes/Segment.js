import lodash from 'lodash';

export default class Segment {
	mainTrack = undefined;
	name = '';
	startWidth = 10;
	endWidth = 10;

	bakedValues = undefined;

	m_zStart = 0;
	m_zStartLeft = 0;
	m_zStartRight = 0;
	m_zEnd = 0;
	m_zEndLeft = 0;
	m_zEndRight = 0;
	m_grade = 0;

	m_bankingStart = 0;
	m_bankingEnd = 0;
	
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

	leftBorder   = () => this.m_leftBorder  || (() => { let retval = lodash.clone(this.mainTrack.defaultLeftBorder); retval.segment = this; return retval; })();
	leftSide     = () => this.m_leftSide    || (() => { let retval = lodash.clone(this.mainTrack.defaultLeftSide); retval.segment = this; return retval; })();
	leftBarrier  = () => this.m_leftBarrier || (() => { let retval = lodash.clone(this.mainTrack.defaultLeftBarrier); retval.segment = this; return retval; })();
	rightBorder  = () => this.m_rightBorder  || (() => { let retval = lodash.clone(this.mainTrack.defaultRightBorder); retval.segment = this; return retval; })();
	rightSide    = () => this.m_rightSide    || (() => { let retval = lodash.clone(this.mainTrack.defaultRightSide); retval.segment = this; return retval; })();
	rightBarrier = () => this.m_rightBarrier || (() => { let retval = lodash.clone(this.mainTrack.defaultRightBarrier); retval.segment = this; return retval; })();

	setLeftBorder(i_border) { 
		this.m_leftBorder = i_border;
	}
	setLeftSide(i_side) { 
		this.m_leftSide = i_side;
	}
	setLeftBarrier(i_barrier) { 
		this.m_leftBarrier = i_barrier;
	}
	setRightBorder(i_border) { 
		this.m_rightBorder = i_border;
	}
	setRightSide(i_side) { 
		this.m_rightSide = i_side;
	}
	setRightBarrier(i_barrier) { 
		this.m_rightBarrier = i_barrier;
	}

	getZStart() {
		if (!this.bakedValues) { this.bake(); }
		return this.bakedValues.zStart;
	}
	getZStartLeft() {
		if (!this.bakedValues) { this.bake(); }
		return this.bakedValues.zStartLeft;
	}
	getZStartRight() {
		if (!this.bakedValues) { this.bake(); }
		return this.bakedValues.zStartRight;
	}
	getZEnd() {
		if (!this.bakedValues) { this.bake(); }
		return this.bakedValues.zEnd;
	}
	getZEndLeft() {
		if (!this.bakedValues) { this.bake(); }
		return this.bakedValues.zEndLeft;
	}
	getZEndRight() {
		if (!this.bakedValues) { this.bake(); }
		return this.bakedValues.zEndRight;
	}
	getBankingStart() {
		if (!this.bakedValues) { this.bake(); }
		return this.bakedValues.bankingStart;
	}
	getBankingEnd() {
		if (!this.bakedValues) { this.bake(); }
		return this.bakedValues.bankingEnd;
	}
	getGrade() {
		if (!this.bakedValues) { this.bake(); }
		return this.bakedValues.grade;
	}

	setValue(field, value) {
		if (['zStart','zStartLeft','zStartRight','zEnd','zEndLeft','zEndRight','bankingStart','bankingEnd','grade'].indexOf(field) < 0) return;
		this['m_' + field] = value;
		this.bakedValues = undefined;
	}

	bake() {
		let zStart = this.m_zStart, zStartLeft = this.m_zStartLeft, zStartRight = this.m_zStartRight;
		let zEnd = this.m_zEnd, zEndLeft = this.m_zEndLeft, zEndRight = this.m_zEndRight;
		let bankingStart = this.m_bankingStart, bankingEnd = this.m_bankingEnd;
		let grade = this.m_grade;

		if (zStart !== undefined) {
			zStartLeft = zStartRight = zStart;
		}
		else {
			zStart = (zStartLeft + zStartRight) / 2.0;
		}
		if (zEnd !== undefined) {
			zEndLeft = zEndRight = zEnd;
		}
		else if (grade !== undefined) {
			zEnd = zStart + this.getLength() * grade;
		}
		else {
			zEnd = (zEndLeft + zEndRight) / 2.0;
		}

		if (grade === undefined) {
			grade = (zEnd - zStart) / this.getLength();
		}
		
		if (bankingStart === undefined) {
			bankingStart = Math.atan2(zStartLeft - zStartRight, this.startWidth);
		}
		if (bankingEnd === undefined) {
			bankingEnd = Math.atan2(zEndLeft - zEndRight, this.endWidth);
		}

		const dzStart = Math.tan(bankingStart) * this.startWidth / 2.0;
		const dzEnd = Math.tan(bankingEnd) * this.endWidth / 2.0;
		zStartLeft = zStart + dzStart;
		zStartRight = zStart - dzStart;
		zEndLeft = zEnd + dzEnd;
		zEndRight = zEnd - dzEnd;

		this.bakedValues = {
			zStart: zStart, zStartLeft: zStartLeft, zStartRight: zStartRight,
			zEnd: zEnd, zEndLeft: zEndLeft, zEndRight: zEndRight,
			bankingStart: bankingStart, bankingEnd: bankingEnd,
			grade: grade
		};
	}
}
