import * as THREE from 'three';
import Straight from '../classes/Straight';
import Curve from '../classes/Curve';
import Track from '../classes/Track';
import { reverseFacesWindingOrder, StraightBorderGeometry, StraightSideGeometry, StraightBarrierGeometry, CurvePartBorderGeometry, CurvePartSideGeometry, CurvePartBarrierGeometry } from './TrackObjectGeometries';
import Segment from '../classes/Segment';

export default (i_track, i_segmentToHighlight) => {
	const trackSegmentMaterial = new THREE.MeshStandardMaterial({ color: "#111", transparent: false, side: THREE.DoubleSide, shadowSide: THREE.CullFaceBack });
	const trackSegmentHighlightMaterial = new THREE.MeshBasicMaterial({ color: "#bb0", transparent: true, opacity: .5, side: THREE.DoubleSide });
	
	const trackBorderMaterial = new THREE.MeshStandardMaterial({ color: "#c66", transparent: false, side: THREE.DoubleSide, shadowSide: THREE.CullFaceBack });
	const trackSideMaterial = new THREE.MeshStandardMaterial({ color: "#6c6", transparent: false, side: THREE.DoubleSide, shadowSide: THREE.CullFaceBack });
	const trackBarrierMaterial = new THREE.MeshStandardMaterial({ color: "#999", transparent: false, side: THREE.DoubleSide, shadowSide: THREE.CullFaceBack });
	
	const axisZ = new THREE.Vector3(0, 0, 1);

	/*const loader = new THREE.FontLoader();
	var font = undefined;
	loader.load( 'assets/fonts/helvetiker_regular.typeface.json', function ( i_font ) {
		font = i_font;
	}, undefined, e => {
		console.error(e);
	});*/
	
	if (i_track instanceof Track) {
		return buildObjects(i_track, i_segmentToHighlight);
	}
	else if (i_track instanceof Segment) {
		return createSegmentObject(i_track, true);
	}
	
	function buildObjects(i_track, i_segmentToHighlight) {
		let retval = new THREE.Group();
		retval.add(buildMainTrackObjects(i_track.mainTrack, i_segmentToHighlight));
		return retval;
	}
	
	function buildMainTrackObjects(i_mainTrack, i_segmentToHighlight) {
		let retval = new THREE.Group();
		i_mainTrack.trackSegments.forEach(segment => retval.add(createSegmentObject(segment, segment === i_segmentToHighlight)));
		return retval;
	}

	function createSegmentObject(segment, i_highlight) {
		console.log('creating 3D Object for segment ' + segment.name);
		let segment3DObject = undefined;
		if (segment instanceof Straight) {
			segment3DObject = createStraightObject(segment, i_highlight);
		}
		else if (segment instanceof Curve) {
			segment3DObject = createCurveObject(segment, i_highlight);
		}

		return segment3DObject;
	}
	
	function createStraightObject(i_straightSegment, i_highlight) {

		let getOuterGeometries = (i_border, i_side, i_barrier, i_isRight) => {
			let rightOffsetStart = i_straightSegment.startWidth/2;
			let rightOffsetEnd = rightOffsetStart;

			let borderGeometry = StraightBorderGeometry(rightOffsetStart, rightOffsetEnd, i_border, i_isRight);

			rightOffsetStart += i_border.width;
			rightOffsetEnd += i_border.width;

			let sideGeometry = StraightSideGeometry(rightOffsetStart, rightOffsetEnd, i_side, i_isRight);

			rightOffsetStart += i_side.startWidth;
			rightOffsetEnd += i_side.endWidth;

			let barrierGeometry = StraightBarrierGeometry(rightOffsetStart, rightOffsetEnd, i_barrier, i_isRight);

			return [ borderGeometry, sideGeometry, barrierGeometry ];
		};

		let retval = new THREE.Group();
		let segmentStart = i_straightSegment.mainTrack.track.computeStartOfSegment(i_straightSegment);
		let displacement = i_straightSegment.computeDisplacement(segmentStart.position, segmentStart.rotation);

		let geometry = new THREE.PlaneGeometry(i_straightSegment.startWidth, i_straightSegment.length, 1, 1);

		let [ leftBorderGeometry, leftSideGeometry, leftBarrierGeometry ] = 
			getOuterGeometries(i_straightSegment.leftBorder(), i_straightSegment.leftSide(), i_straightSegment.leftBarrier(), false);
		let [ rightBorderGeometry, rightSideGeometry, rightBarrierGeometry ] = 
			getOuterGeometries(i_straightSegment.rightBorder(), i_straightSegment.rightSide(), i_straightSegment.rightBarrier(), true);
		
		let geometries = [
			geometry, 
			leftBorderGeometry, rightBorderGeometry,
			leftSideGeometry, rightSideGeometry,
			leftBarrierGeometry, rightBarrierGeometry
		];
		
		geometries.forEach(g => {
			g.rotateZ(segmentStart.rotation - Math.PI/2);
			g.translate(segmentStart.position.x + displacement.position.x/2, 
				segmentStart.position.y + displacement.position.y/2, 
				segmentStart.position.z + displacement.position.z/2);
			});

		let trackMesh = new THREE.Mesh(geometry, trackSegmentMaterial);
		retval.add(new THREE.LineSegments(
			new THREE.EdgesGeometry(geometry),
			new THREE.LineBasicMaterial({ color: 0xff00ff })
			));
		
		let leftBorderMesh = new THREE.Mesh(leftBorderGeometry, trackBorderMaterial);
		let leftSideMesh = new THREE.Mesh(leftSideGeometry, trackSideMaterial);
		let leftBarrierMesh = new THREE.Mesh(leftBarrierGeometry, trackBarrierMaterial);
		let rightBorderMesh = new THREE.Mesh(rightBorderGeometry, trackBorderMaterial);
		let rightSideMesh = new THREE.Mesh(rightSideGeometry, trackSideMaterial);
		let rightBarrierMesh = new THREE.Mesh(rightBarrierGeometry, trackBarrierMaterial);

		let meshes = [ 
			trackMesh, 
			leftBarrierMesh, leftBorderMesh, leftSideMesh,
			rightBarrierMesh, rightBorderMesh, rightSideMesh,
			];
		meshes.forEach(m => {
			m.castShadow = true;
			m.receiveShadow = true;
			retval.add(m);
		});

		if (i_highlight) {
			retval.add(new THREE.Mesh(geometry, trackSegmentHighlightMaterial));
			retval.add(new THREE.LineSegments(
				new THREE.EdgesGeometry(geometry),
				new THREE.LineBasicMaterial({ color: 0xdd6600, linewidth: 5 })
				));
		}

		//retval.add(createText(i_straightSegment.name, findCenterPoint(geometry)));

		retval.userData = i_straightSegment;
		return retval;
	}
	
	function createCurveObject(i_curveSegment, i_highlight) {
		let retval = new THREE.Group();
		let segmentStart = i_curveSegment.mainTrack.track.computeStartOfSegment(i_curveSegment);
		//let displacement = i_curveSegment.computeDisplacement(segmentStart.position, segmentStart.rotation);
		
		let geometries = [];
		let borderGeometries = [];
		let sideGeometries = [];
		let barrierGeometries = [];
		
		let numberOfSteps = i_curveSegment.getNumberOfSteps();
		let currentStartPosition = new THREE.Vector3();
		currentStartPosition.copy(segmentStart.position);
		let currentRotation = segmentStart.rotation;
		for (let p = 0; p < numberOfSteps; ++p) {

			// eslint-disable-next-line no-loop-func
			let getOuterPartGeometries = (i_border, i_side, i_barrier, i_isInner) => {

				let rightOffsetStart = i_curveSegment.startWidth/2;
				let rightOffsetEnd = rightOffsetStart;

				let borderGeometry = CurvePartBorderGeometry(p, rightOffsetStart, rightOffsetEnd, i_border, i_isInner);

				rightOffsetStart += i_border.width;
				rightOffsetEnd += i_border.width;

				let sideGeometry = CurvePartSideGeometry(p, rightOffsetStart, rightOffsetEnd, i_side, i_isInner);

				const deltaWidth = i_side.endWidth - i_side.startWidth;
				rightOffsetStart += i_side.startWidth + deltaWidth / numberOfSteps * p;
				rightOffsetEnd += i_side.startWidth + deltaWidth / numberOfSteps * (p + 1);
				//console.log(i_curveSegment.name + ' part ' + p + ': ' + deltaWidth + ', ' + rightOffsetStart + ', ' + rightOffsetEnd);

				let barrierGeometry = CurvePartBarrierGeometry(p, rightOffsetStart, rightOffsetEnd, i_barrier, i_isInner);
	
				return [ borderGeometry, sideGeometry, barrierGeometry ];
			};

			let partDisplacement = i_curveSegment.computePartDisplacement(p, segmentStart.position, segmentStart.rotation);
			let partArc = partDisplacement.rotation;
			
			let partDisplacementDelta = new THREE.Vector3();
			partDisplacementDelta.subVectors(partDisplacement.position, segmentStart.position);
			
			let radius = i_curveSegment.getPartRadius(p);
			let innerRadius = radius - i_curveSegment.startWidth / 2;
			let outerRadius = radius + i_curveSegment.startWidth / 2;
			let centerPosition = new THREE.Vector3(0, radius * (i_curveSegment.isRight ? -1 : 1), 0);
			centerPosition.copy(centerPosition.applyAxisAngle(axisZ, currentRotation));
			centerPosition.addVectors(centerPosition, currentStartPosition);
			
			let partGeometry = new THREE.RingGeometry(
				innerRadius,
				outerRadius,
				1, 1, 0, partArc
				);
			if (i_curveSegment.isRight) {
				reverseFacesWindingOrder(partGeometry);
			}

			let [ leftBorderGeometry, leftSideGeometry, leftBarrierGeometry ] =
				getOuterPartGeometries(i_curveSegment.leftBorder(), i_curveSegment.leftSide(), i_curveSegment.leftBarrier(), 
				!i_curveSegment.isRight);
			let [ rightBorderGeometry, rightSideGeometry, rightBarrierGeometry ] =
				getOuterPartGeometries(i_curveSegment.rightBorder(), i_curveSegment.rightSide(), i_curveSegment.rightBarrier(), 
				i_curveSegment.isRight);

			let partGeometries = [
				partGeometry,
				leftBorderGeometry, leftSideGeometry, leftBarrierGeometry,
				rightBorderGeometry, rightSideGeometry, rightBarrierGeometry,
			]
			// eslint-disable-next-line no-loop-func
			partGeometries.forEach(g => {
				g.rotateZ(currentRotation + (i_curveSegment.isRight ? Math.PI/2 : - Math.PI/2));
				g.translate(centerPosition.x, centerPosition.y, centerPosition.z);
			});
			geometries.push(partGeometry);
			borderGeometries.push(leftBorderGeometry);
			borderGeometries.push(rightBorderGeometry);
			sideGeometries.push(leftSideGeometry);
			sideGeometries.push(rightSideGeometry);
			barrierGeometries.push(leftBarrierGeometry);
			barrierGeometries.push(rightBarrierGeometry);

			currentStartPosition.addVectors(currentStartPosition, partDisplacement.position);
			currentRotation += partDisplacement.rotation;
		}

		let mergedGeometry = new THREE.Geometry();
		geometries.forEach(g => {
			let mesh = new THREE.Mesh(g);
			mesh.updateMatrix();
			mergedGeometry.merge(mesh.geometry, mesh.matrix);
		});
		
		let mergedEdgeGeometry = new THREE.EdgesGeometry(mergedGeometry);
		
		let trackMesh = new THREE.Mesh(mergedGeometry, trackSegmentMaterial);
		retval.add(trackMesh);
		retval.add(new THREE.LineSegments(mergedEdgeGeometry, new THREE.LineBasicMaterial({ color: 0x4400ff })));

		let meshes = [ trackMesh ];
		borderGeometries.forEach(cg => { let mesh = new THREE.Mesh(cg, trackBorderMaterial); meshes.push(mesh); retval.add(mesh); });
		sideGeometries.forEach(sg => { let mesh = new THREE.Mesh(sg, trackSideMaterial); meshes.push(mesh); retval.add(mesh); });
		barrierGeometries.forEach(bg => { let mesh = new THREE.Mesh(bg, trackBarrierMaterial); meshes.push(mesh); retval.add(mesh); });

		meshes.forEach(m => {
			m.castShadow = true;
			m.receiveShadow = true;
		})

        //let vnh = new THREE.VertexNormalsHelper( mesh, 10, 0x00ff00, 10 );
		//retval.add( vnh );
		//let fnh = new THREE.FaceNormalsHelper( trackMmesh, 10, 0x00ff00, 10 );
		//retval.add(fnh);
		
		if (i_highlight) {
			retval.add(new THREE.Mesh(mergedGeometry, trackSegmentHighlightMaterial));
			retval.add(new THREE.LineSegments(mergedEdgeGeometry, new THREE.LineBasicMaterial({ color: 0xdd6600, linewidth: 5 })));
		}

		retval.userData = i_curveSegment;
		return retval;
	}

	/*function createText(i_text, i_position) {
		let geometry = new THREE.TextGeometry(i_text, {
			font: font
		});
		geometry.position.copy(i_position);
		let retval = new THREE.Mesh(
			geometry,
			new THREE.MeshStandardMaterial({ color: 0xff0000 })
		);
		return retval;
	}*/
	
	/*function findCenterPoint(i_geometry) {
		if (!i_geometry instanceof THREE.Geometry) {
			return undefined;
		}

		let retval = new THREE.Vector3();
		i_geometry.vertices.forEach(vertex => {
			retval.copy(retval.add(vertex));
		});
		retval.divideScalar(i_geometry.vertices.length);

		return retval;
	}*/
}
