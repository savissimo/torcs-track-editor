import * as THREE from 'three';

export let getXYFromPolar = (i_radius, i_theta) => 
	new THREE.Vector2(i_radius * Math.cos(i_theta), i_radius * Math.sin(i_theta));

export let reverseFacesWindingOrder = (i_geometry) => {
	for (var i = 0, l = i_geometry.faces.length; i < l; i++) {

		var face = i_geometry.faces[i];
		var temp = face.a;
		face.a = face.c;
		face.c = temp;

	}

	var faceVertexUvs = i_geometry.faceVertexUvs[0];
	for (i = 0, l = faceVertexUvs.length; i < l; i++) {

		var vector2 = faceVertexUvs[i][0];
		faceVertexUvs[i][0] = faceVertexUvs[i][2];
		faceVertexUvs[i][2] = vector2;
	}

	i_geometry.computeFaceNormals();
	i_geometry.computeVertexNormals();
}

export let StraightTrackGeometry = (i_straightSegment) => {
	let trackGeometry = new THREE.Geometry();
	let sw2 = i_straightSegment.startWidth / 2.0;
	let ew2 = i_straightSegment.endWidth / 2.0;
	trackGeometry.vertices = [
		new THREE.Vector3(-sw2, 0, 							i_straightSegment.getZStartLeft()),
		new THREE.Vector3(-ew2, i_straightSegment.length, 	i_straightSegment.getZEndLeft()),
		new THREE.Vector3(ew2, 	i_straightSegment.length, 	i_straightSegment.getZEndRight()),
		new THREE.Vector3(sw2, 	0, 							i_straightSegment.getZStartRight()),
	];
	trackGeometry.faces = [
		new THREE.Face3(0, 1, 2), new THREE.Face3(0, 2, 3)
	];
	trackGeometry.computeFaceNormals();
	return trackGeometry;
};

export let StraightBorderGeometry = 
	(i_startOffset, i_endOffset, i_border, i_isRight) => {
	let borderGeometry = new THREE.Geometry();
	if (i_border.width === 0) { return borderGeometry; }

	const segment = i_border.segment;
	
	const zStartInner = i_isRight ? segment.getZStartRight() : segment.getZStartLeft();
	const zEndInner = i_isRight ? segment.getZEndRight() : segment.getZEndLeft();
	const positiveBanking = i_isRight ? -1 : 1;
	const zStartOuter = zStartInner + Math.tan(segment.getBankingStart()) * positiveBanking * i_border.width;
	const zEndOuter = zEndInner + Math.tan(segment.getBankingEnd()) * positiveBanking * i_border.width;

	borderGeometry.vertices = [
		new THREE.Vector3(i_startOffset + 0,              0,              zStartInner),
		new THREE.Vector3(i_endOffset   + 0,              segment.length, zEndInner),
		new THREE.Vector3(i_endOffset   + i_border.width, segment.length, zEndOuter + i_border.height),
		new THREE.Vector3(i_startOffset + i_border.width, 0,              zStartOuter + i_border.height),
		new THREE.Vector3(i_endOffset   + i_border.width, segment.length, zEndOuter),
		new THREE.Vector3(i_startOffset + i_border.width, 0,              zStartOuter)
	];
	borderGeometry.faces = [ 
		new THREE.Face3(0, 1, 2), new THREE.Face3(0, 2, 3), 
		new THREE.Face3(0, 1, 4), new THREE.Face3(0, 4, 5), 
		new THREE.Face3(3, 2, 4), new THREE.Face3(3, 4, 5), 
		new THREE.Face3(0, 3, 5), 
		new THREE.Face3(1, 2, 4), 
	];
	borderGeometry.computeFaceNormals();
	if (!i_isRight) {
		borderGeometry.scale(-1, 1, 1);
		reverseFacesWindingOrder(borderGeometry);
	}

	return borderGeometry;
};

export let StraightSideGeometry = 
	(i_startOffset, i_endOffset, i_side, i_isRight) => {
	let sideGeometry = new THREE.Geometry();
	if (i_side.width === 0) { return sideGeometry; }

	const segment = i_side.segment;
	
	const positiveBanking = i_isRight ? -1 : 1;
	const zStartInner = segment.getZStart() + Math.tan(segment.getBankingStart() * positiveBanking) * i_startOffset; 
	const zStartOuter = segment.getZStart() + Math.tan(segment.getBankingStart() * positiveBanking) * (i_startOffset + i_side.startWidth); 
	const zEndInner =   segment.getZEnd()   + Math.tan(segment.getBankingEnd() * positiveBanking)   * i_endOffset; 
	const zEndOuter =   segment.getZEnd()   + Math.tan(segment.getBankingEnd() * positiveBanking)   * (i_endOffset + i_side.endWidth); 

	sideGeometry.vertices = [
		new THREE.Vector3(i_startOffset + 0,                 0,              zStartInner),
		new THREE.Vector3(i_endOffset   + 0,                 segment.length, zEndInner),
		new THREE.Vector3(i_endOffset   + i_side.endWidth,   segment.length, zEndOuter),
		new THREE.Vector3(i_startOffset + i_side.startWidth, 0,              zStartOuter)
	];
	sideGeometry.faces = [ new THREE.Face3(0, 1, 2), new THREE.Face3(0, 2, 3) ];
	sideGeometry.computeFaceNormals();
	if (!i_isRight) {
		sideGeometry.scale(-1, 1, 1);
		reverseFacesWindingOrder(sideGeometry);
	}

	return sideGeometry
};

export let StraightBarrierGeometry = 
	(i_startOffset, i_endOffset, i_barrier, i_isRight) => {
	let barrierGeometry = new THREE.Geometry();
	if (i_barrier.width === 0) { return barrierGeometry; }

	const segment = i_barrier.segment;
	
	const positiveBanking = i_isRight ? -1 : 1;
	const zStartInner = segment.getZStart() + Math.tan(segment.getBankingStart() * positiveBanking) * i_startOffset; 
	const zStartOuter = segment.getZStart() + Math.tan(segment.getBankingStart() * positiveBanking) * (i_startOffset + i_barrier.width); 
	const zEndInner =   segment.getZEnd()   + Math.tan(segment.getBankingEnd() * positiveBanking)   * i_endOffset; 
	const zEndOuter =   segment.getZEnd()   + Math.tan(segment.getBankingEnd() * positiveBanking)   * (i_endOffset + i_barrier.width); 

	barrierGeometry.vertices = [
		new THREE.Vector3(i_startOffset + 0,               0,              zStartInner + 0),
		new THREE.Vector3(i_endOffset   + 0,               segment.length, zEndInner + 0),
		new THREE.Vector3(i_endOffset   + i_barrier.width, segment.length, zEndOuter + 0),
		new THREE.Vector3(i_startOffset + i_barrier.width, 0,              zStartOuter + 0),
		new THREE.Vector3(i_startOffset + 0,               0,              zStartInner + i_barrier.height),
		new THREE.Vector3(i_endOffset   + 0,               segment.length, zEndInner + i_barrier.height),
		new THREE.Vector3(i_endOffset   + i_barrier.width, segment.length, zEndOuter + i_barrier.height),
		new THREE.Vector3(i_startOffset + i_barrier.width, 0,              zStartOuter + i_barrier.height),
	];
	barrierGeometry.faces = [
		new THREE.Face3(2, 1, 0), new THREE.Face3(3, 2, 0),
		new THREE.Face3(4, 5, 6), new THREE.Face3(4, 6, 7),
		new THREE.Face3(0, 1, 5), new THREE.Face3(0, 5, 4),
		new THREE.Face3(6, 2, 3), new THREE.Face3(3, 7, 6),
		new THREE.Face3(0, 4, 7), new THREE.Face3(0, 7, 3),
		new THREE.Face3(1, 6, 5), new THREE.Face3(1, 2, 6),
	]
	barrierGeometry.computeFaceNormals();
	if (!i_isRight) {
		barrierGeometry.scale(-1, 1, 1);
		//reverseFacesWindingOrder(barrierGeometry);
	}

	return barrierGeometry;
}

export let CurvePartTrackGeometry = (i_curveSegment, i_partIndex, i_subdivisions) => {
	let subdivisions = i_subdivisions || 4;
	let partArc = i_curveSegment.getPartArc(i_partIndex);

	let radius = i_curveSegment.getPartRadius(i_partIndex);
	let innerRadius = radius - i_curveSegment.startWidth / 2;
	let outerRadius = radius + i_curveSegment.startWidth / 2;

	let trackGeometry = new THREE.Geometry();
	let angle = 0;
	const deltaAngle = partArc / subdivisions;
	const deltaLeftZ = (i_curveSegment.getZEndLeft() - i_curveSegment.getZStartLeft()) / i_curveSegment.getNumberOfSteps();
	const deltaRightZ = (i_curveSegment.getZEndRight() - i_curveSegment.getZStartRight()) / i_curveSegment.getNumberOfSteps();
	const partZStartLeft = i_curveSegment.getZStartLeft() + deltaLeftZ * i_partIndex;
	const partZStartRight = i_curveSegment.getZStartRight() + deltaRightZ * i_partIndex;
	const deltaSubLeftZ = deltaLeftZ / subdivisions;
	const deltaSubRightZ = deltaRightZ / subdivisions;
	for (let s = 0; s < subdivisions; ++s) {
		const vc = trackGeometry.vertices.length;
		const os = getXYFromPolar(outerRadius, angle);
		const oe = getXYFromPolar(outerRadius, angle + deltaAngle);
		const ie = getXYFromPolar(innerRadius, angle + deltaAngle);
		const is = getXYFromPolar(innerRadius, angle);
		const zsl = partZStartLeft + deltaSubLeftZ * s;
		const zsr = partZStartRight + deltaSubRightZ * s;
		const zel = partZStartLeft + deltaSubLeftZ * (s + 1);
		const zer = partZStartRight + deltaSubRightZ * (s + 1);
		trackGeometry.vertices.push(...[
			new THREE.Vector3(os.x, os.y, i_curveSegment.isRight ? zsl : zsr),
			new THREE.Vector3(oe.x, oe.y, i_curveSegment.isRight ? zel : zer),
			new THREE.Vector3(ie.x, ie.y, i_curveSegment.isRight ? zer : zel),
			new THREE.Vector3(is.x, is.y, i_curveSegment.isRight ? zsr : zsl),
		]);
		trackGeometry.faces.push(...[
			new THREE.Face3(vc + 0, vc + 1, vc + 2), new THREE.Face3(vc + 0, vc + 2, vc + 3),
		]);
		angle += deltaAngle;
	}
	
	trackGeometry.computeFaceNormals();
	trackGeometry.rotateZ(i_curveSegment.isRight ? Math.PI/2 : - Math.PI/2);
	if (i_curveSegment.isRight) {
		reverseFacesWindingOrder(trackGeometry);
	}

	return trackGeometry;
}

export let CurvePartBorderGeometry = 
	(i_part, i_startOffset, i_endOffset, i_border, i_isInner, i_subdivisions) => {
	let subdivisions = i_subdivisions || 4;
	const segment = i_border.segment;

	let radius = segment.getPartRadius(i_part);
	let innerRadius = (i_subdivision) => radius - i_startOffset - (i_endOffset - i_startOffset) * i_subdivision / subdivisions;
	let outerRadius = (i_subdivision) => radius + i_startOffset + (i_endOffset - i_startOffset) * i_subdivision / subdivisions;

	let borderGeometry = new THREE.Geometry();
	if (i_border.width === 0) { return borderGeometry; }

	let borderWidth = (i_subdivision) => i_border.width;
	let borderInnerRadius = (i_subdivision) => 
		i_isInner 
			? innerRadius(i_subdivision) - borderWidth(i_subdivision)
			: outerRadius(i_subdivision);
	let borderOuterRadius = (i_subdivision) => 
		i_isInner
			? innerRadius(i_subdivision)
			: outerRadius(i_subdivision) + borderWidth(i_subdivision);
	
	let angle = 0;
	const partArc = i_border.segment.computePartDisplacement(i_part, new THREE.Vector3(), 0).rotation;

	const deltaLeftZ = (segment.getZEndLeft() - segment.getZStartLeft()) / segment.getNumberOfSteps();
	const deltaRightZ = (segment.getZEndRight() - segment.getZStartRight()) / segment.getNumberOfSteps();
	const partZStartLeft = segment.getZStartLeft() + deltaLeftZ * i_part;
	const partZStartRight = segment.getZStartRight() + deltaRightZ * i_part;
	const deltaSubLeftZ = deltaLeftZ / subdivisions;
	const deltaSubRightZ = deltaRightZ / subdivisions;
	
	const zStartTrack = (s) => segment.isRight ^ !i_isInner ? partZStartRight + deltaSubRightZ * s : partZStartLeft + deltaSubLeftZ * s;
	const zEndTrack = (s) => zStartTrack(s + 1);
	const positiveBanking = segment.isRight && i_isInner ? -1 : 1;
	const zStartSide = (s) => zStartTrack(s) + Math.tan(subStartBanking(s)) * positiveBanking * i_border.width;
	const zEndSide = (s) => zEndTrack(s) + Math.tan(subEndBanking(s)) * positiveBanking * i_border.width;
	
	const zStartInner = i_isInner ? zStartSide : zStartTrack;
	const zEndInner = i_isInner ? zEndSide : zEndTrack;
	const zStartOuter = i_isInner ? zStartTrack : zStartSide;
	const zEndOuter = i_isInner ? zEndTrack : zEndSide;
	
	const deltaBanking = (segment.getBankingEnd() - segment.getBankingStart()) / segment.getNumberOfSteps();
	const partStartBanking = segment.getBankingStart() + deltaBanking * i_part;
	const partEndBanking = segment.getBankingStart() + deltaBanking * (i_part + 1);
	const deltaSubBanking = (partEndBanking - partStartBanking) / subdivisions;
	const subStartBanking = (s) => partStartBanking + deltaSubBanking * s;
	const subEndBanking = (s) => subStartBanking(s + 1);
	
	for (let s = 0; s < subdivisions; ++s) {
		let deltaAngle = partArc / subdivisions;

		let is = getXYFromPolar(borderInnerRadius(s), angle);
		let ie = getXYFromPolar(borderInnerRadius(s), angle + deltaAngle);
		let os = getXYFromPolar(borderOuterRadius(s), angle);
		let oe = getXYFromPolar(borderOuterRadius(s), angle + deltaAngle);

		let vc = borderGeometry.vertices.length;
		let higherInner = (i_isInner ^ i_border.segment.i_isRight);
		borderGeometry.vertices.push(...[
			new THREE.Vector3(is.x, is.y, zStartInner(s)),
			new THREE.Vector3(ie.x, ie.y, zEndInner(s)),
			higherInner
				? new THREE.Vector3(ie.x, ie.y, zEndInner(s) + i_border.height)
				: new THREE.Vector3(oe.x, oe.y, zEndOuter(s) + i_border.height)
				,
			higherInner
				? new THREE.Vector3(is.x, is.y, zStartInner(s) + i_border.height)
				: new THREE.Vector3(os.x, os.y, zStartOuter(s) + i_border.height)
				,
			new THREE.Vector3(oe.x, oe.y, zEndOuter(s)),
			new THREE.Vector3(os.x, os.y, zStartOuter(s)),
		]);
		borderGeometry.faces.push(...[
			new THREE.Face3(0 + vc, 1 + vc, 2 + vc), new THREE.Face3(0 + vc, 2 + vc, 3 + vc),
			new THREE.Face3(0 + vc, 4 + vc, 1 + vc), new THREE.Face3(0 + vc, 5 + vc, 4 + vc),
			new THREE.Face3(5 + vc, 3 + vc, 2 + vc), new THREE.Face3(5 + vc, 4 + vc, 2 + vc),
			new THREE.Face3(0 + vc, 3 + vc, 5 + vc),
			new THREE.Face3(1 + vc, 4 + vc, 2 + vc),
		]);

		angle += deltaAngle;
	}

	borderGeometry.rotateZ(i_border.segment.isRight ? Math.PI/2 : - Math.PI/2);
	borderGeometry.computeFaceNormals();

	return borderGeometry;
};

export let CurvePartSideGeometry = 
	(i_part, i_startOffset, i_endOffset, i_side, i_isInner, i_subdivisions) => {
	const subdivisions = i_subdivisions || 4;

	const radius = i_side.segment.getPartRadius(i_part);
	const innerRadius = radius - i_startOffset;
	const outerRadius = radius + i_startOffset;

	let sideGeometry = new THREE.Geometry();
	const numberOfParts = i_side.segment.getNumberOfSteps();
	const partStartWidth = i_side.startWidth + (i_side.endWidth - i_side.startWidth) * i_part / numberOfParts;
	const partEndWidth = i_side.startWidth + (i_side.endWidth - i_side.startWidth) * (i_part + 1) / numberOfParts;
	let sideWidth = (i_subdivision) => partStartWidth + (partEndWidth - partStartWidth) * i_subdivision / subdivisions;
	let sideInnerRadius = (i_subdivision) => 
		i_isInner 
			? innerRadius - sideWidth(i_subdivision)
			: outerRadius;
	let sideOuterRadius = (i_subdivision) => 
		i_isInner
			? innerRadius
			: outerRadius + sideWidth(i_subdivision);
	let sideInnerEndRadius = (i_subdivision) => sideInnerRadius(i_subdivision + 1);
	let sideOuterEndRadius = (i_subdivision) => sideOuterRadius(i_subdivision + 1);
	
	let angle = 0;
	let partArc = i_side.segment.computePartDisplacement(i_part, new THREE.Vector3(), 0).rotation;

	for (let s = 0; s < subdivisions; ++s) {
		let deltaAngle = partArc / subdivisions;

		let is = getXYFromPolar(sideInnerRadius(s), angle);
		let ie = getXYFromPolar(sideInnerEndRadius(s), angle + deltaAngle);
		let os = getXYFromPolar(sideOuterRadius(s), angle);
		let oe = getXYFromPolar(sideOuterEndRadius(s), angle + deltaAngle);

		let vc = sideGeometry.vertices.length;
		sideGeometry.vertices.push(...[
			new THREE.Vector3(is.x, is.y, 0),
			new THREE.Vector3(ie.x, ie.y, 0),
			new THREE.Vector3(oe.x, oe.y, 0),
			new THREE.Vector3(os.x, os.y, 0),
		]);
		sideGeometry.faces.push(...[
			new THREE.Face3(0 + vc, 1 + vc, 2 + vc), new THREE.Face3(0 + vc, 2 + vc, 3 + vc),
		]);

		angle += deltaAngle;
	}

	sideGeometry.rotateZ(i_side.segment.isRight ? Math.PI/2 : - Math.PI/2);
	sideGeometry.computeFaceNormals();
	if (!i_side.segment.isRight) {
		reverseFacesWindingOrder(sideGeometry);
	}

	return sideGeometry;
};

export let CurvePartBarrierGeometry = 
	(i_part, i_startOffset, i_endOffset, i_barrier, i_isInner, i_subdivisions) => {
	let subdivisions = i_subdivisions || 4;

	const radius = i_barrier.segment.getPartRadius(i_part);
	const deltaPartOffset = i_endOffset - i_startOffset;
	let subStartOffset = (i_subdivision) => i_startOffset + deltaPartOffset * i_subdivision / subdivisions;
	let subEndOffset = (i_subdivision) => i_startOffset + deltaPartOffset * (i_subdivision + 1) / subdivisions;
	let innerStartRadius = (i_subdivision) => radius - subStartOffset(i_subdivision);
	let innerEndRadius = (i_subdivision) => radius - subEndOffset(i_subdivision);
	let outerStartRadius = (i_subdivision) => radius + subStartOffset(i_subdivision);
	let outerEndRadius = (i_subdivision) => radius + subEndOffset(i_subdivision);

	let barrierGeometry = new THREE.Geometry();
	let barrierWidth = (i_subdivision) => i_barrier.width;
	let barrierInnerStartRadius = (i_subdivision) => 
		i_isInner 
			? innerStartRadius(i_subdivision) - barrierWidth(i_subdivision)
			: outerStartRadius(i_subdivision);
	let barrierInnerEndRadius = (i_subdivision) => 
		i_isInner 
			? innerEndRadius(i_subdivision) - barrierWidth(i_subdivision)
			: outerEndRadius(i_subdivision);
	let barrierOuterStartRadius = (i_subdivision) => 
		i_isInner
			? innerStartRadius(i_subdivision)
			: outerStartRadius(i_subdivision) + barrierWidth(i_subdivision);
	let barrierOuterEndRadius = (i_subdivision) => 
		i_isInner
			? innerEndRadius(i_subdivision)
			: outerEndRadius(i_subdivision) + barrierWidth(i_subdivision);
	
	let angle = 0;
	const partArc = i_barrier.segment.computePartDisplacement(i_part, new THREE.Vector3(), 0).rotation;	
	
	for (let s = 0; s < subdivisions; ++s) {
		const deltaAngle = partArc / subdivisions;
		const innerStartRadius = barrierInnerStartRadius(s);
		const outerStartRadius = barrierOuterStartRadius(s);
		const innerEndRadius = barrierInnerEndRadius(s);
		const outerEndRadius = barrierOuterEndRadius(s);
		
		let is = getXYFromPolar(innerStartRadius, angle);
		let ie = getXYFromPolar(innerEndRadius, angle + deltaAngle);
		let os = getXYFromPolar(outerStartRadius, angle);
		let oe = getXYFromPolar(outerEndRadius, angle + deltaAngle);

		let vc = barrierGeometry.vertices.length;
		barrierGeometry.vertices.push(...[
			new THREE.Vector3(is.x, is.y, 0),
			new THREE.Vector3(ie.x, ie.y, 0),
			new THREE.Vector3(oe.x, oe.y, 0),
			new THREE.Vector3(os.x, os.y, 0),
			new THREE.Vector3(is.x, is.y, i_barrier.height),
			new THREE.Vector3(ie.x, ie.y, i_barrier.height),
			new THREE.Vector3(oe.x, oe.y, i_barrier.height),
			new THREE.Vector3(os.x, os.y, i_barrier.height),
		]);
		barrierGeometry.faces.push(...[
			new THREE.Face3(0 + vc, 2 + vc, 1 + vc), new THREE.Face3(0 + vc, 3 + vc, 2 + vc),
			new THREE.Face3(4 + vc, 5 + vc, 6 + vc), new THREE.Face3(4 + vc, 6 + vc, 7 + vc),
			new THREE.Face3(0 + vc, 1 + vc, 5 + vc), new THREE.Face3(0 + vc, 5 + vc, 4 + vc),
			new THREE.Face3(3 + vc, 7 + vc, 6 + vc), new THREE.Face3(3 + vc, 6 + vc, 2 + vc),
			new THREE.Face3(0 + vc, 4 + vc, 7 + vc), new THREE.Face3(0 + vc, 7 + vc, 3 + vc),
			new THREE.Face3(2 + vc, 6 + vc, 5 + vc), new THREE.Face3(2 + vc, 5 + vc, 1 + vc),
		]);

		angle += deltaAngle;
	}

	barrierGeometry.rotateZ(i_barrier.segment.isRight ? Math.PI/2 : - Math.PI/2);
	barrierGeometry.computeFaceNormals();

	return barrierGeometry;
};

///////////////////////////////////////////////////////////////////////////////////////////////////


