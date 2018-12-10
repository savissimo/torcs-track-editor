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

export let StraightBorderGeometry = 
	(i_startOffset, i_endOffset, i_border, i_isRight) => {
	let borderGeometry = new THREE.Geometry();
	borderGeometry.vertices = [
		new THREE.Vector3(i_startOffset + 0,              0,                       0),
		new THREE.Vector3(i_endOffset   + 0,              i_border.segment.length, 0),
		new THREE.Vector3(i_endOffset   + i_border.width, i_border.segment.length, i_border.height),
		new THREE.Vector3(i_startOffset + i_border.width, 0,                       i_border.height),
		new THREE.Vector3(i_endOffset   + i_border.width, i_border.segment.length, 0),
		new THREE.Vector3(i_startOffset + i_border.width, 0,                       0)
	];
	borderGeometry.faces = [ 
		new THREE.Face3(0, 1, 2), new THREE.Face3(0, 2, 3), 
		new THREE.Face3(0, 1, 4), new THREE.Face3(0, 4, 5), 
		new THREE.Face3(3, 2, 4), new THREE.Face3(3, 4, 5), 
		new THREE.Face3(0, 3, 5), 
		new THREE.Face3(1, 2, 4), 
	];
	borderGeometry.computeFaceNormals();
	borderGeometry.translate(0, -i_border.segment.length/2, 0);
	if (!i_isRight) {
		borderGeometry.scale(-1, 1, 1);
		reverseFacesWindingOrder(borderGeometry);
	}

	return borderGeometry;
};

export let StraightSideGeometry = 
	(i_startOffset, i_endOffset, i_side, i_isRight) => {
	let sideGeometry = new THREE.Geometry();
	sideGeometry.vertices = [
		new THREE.Vector3(i_startOffset + 0,                 0,                     0),
		new THREE.Vector3(i_endOffset   + 0,                 i_side.segment.length, 0),
		new THREE.Vector3(i_endOffset   + i_side.endWidth,   i_side.segment.length, 0),
		new THREE.Vector3(i_startOffset + i_side.startWidth, 0,                     0)
	];
	sideGeometry.faces = [ new THREE.Face3(0, 1, 2), new THREE.Face3(0, 2, 3) ];
	sideGeometry.computeFaceNormals();
	sideGeometry.translate(0, -i_side.segment.length/2, 0);
	if (!i_isRight) {
		sideGeometry.scale(-1, 1, 1);
		reverseFacesWindingOrder(sideGeometry);
	}

	return sideGeometry
};

export let StraightBarrierGeometry = 
	(i_startOffset, i_endOffset, i_barrier, i_isRight) => {
	let barrierGeometry = new THREE.Geometry();
	barrierGeometry.vertices = [
		new THREE.Vector3(i_startOffset + 0,               0,                        0),
		new THREE.Vector3(i_endOffset   + 0,               i_barrier.segment.length, 0),
		new THREE.Vector3(i_endOffset   + i_barrier.width, i_barrier.segment.length, 0),
		new THREE.Vector3(i_startOffset + i_barrier.width, 0,                        0),
		new THREE.Vector3(i_startOffset + 0,               0,                        i_barrier.height),
		new THREE.Vector3(i_endOffset   + 0,               i_barrier.segment.length, i_barrier.height),
		new THREE.Vector3(i_endOffset   + i_barrier.width, i_barrier.segment.length, i_barrier.height),
		new THREE.Vector3(i_startOffset + i_barrier.width, 0,                        i_barrier.height),
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
	barrierGeometry.translate(0, -i_barrier.segment.length/2, 0);
	if (!i_isRight) {
		barrierGeometry.scale(-1, 1, 1);
		reverseFacesWindingOrder(barrierGeometry);
	}

	return barrierGeometry;
}

export let CurvePartBorderGeometry = 
	(i_part, i_startOffset, i_endOffset, i_border, i_isInner, i_subdivisions) => {
	let subdivisions = i_subdivisions || 4;

	let radius = i_border.segment.getPartRadius(i_part);
	let innerRadius = (i_subdivision) => radius - i_startOffset - (i_endOffset - i_startOffset) * i_subdivision / subdivisions;
	let outerRadius = (i_subdivision) => radius + i_startOffset + (i_endOffset - i_startOffset) * i_subdivision / subdivisions;

	let borderGeometry = new THREE.Geometry();
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
	let partArc = i_border.segment.computePartDisplacement(i_part, new THREE.Vector3(), 0).rotation;

	for (let s = 0; s < subdivisions; ++s) {
		let deltaAngle = partArc / subdivisions;

		let is = getXYFromPolar(borderInnerRadius(s), angle);
		let ie = getXYFromPolar(borderInnerRadius(s), angle + deltaAngle);
		let os = getXYFromPolar(borderOuterRadius(s), angle);
		let oe = getXYFromPolar(borderOuterRadius(s), angle + deltaAngle);

		let vc = borderGeometry.vertices.length;
		let higherInner = (i_isInner ^ i_border.segment.i_isRight);
		borderGeometry.vertices.push(...[
			new THREE.Vector3(is.x, is.y, 0),
			new THREE.Vector3(ie.x, ie.y, 0),
			new THREE.Vector3(higherInner ? ie.x : oe.x, higherInner ? ie.y : oe.y, i_border.height),
			new THREE.Vector3(higherInner ? is.x : os.x, higherInner ? is.y : os.y, i_border.height),
			new THREE.Vector3(oe.x, oe.y, 0),
			new THREE.Vector3(os.x, os.y, 0),
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

	barrierGeometry.computeFaceNormals();

	return barrierGeometry;
};

///////////////////////////////////////////////////////////////////////////////////////////////////


