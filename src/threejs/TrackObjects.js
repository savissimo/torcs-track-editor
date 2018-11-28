import * as THREE from 'three';
import Straight from '../classes/Straight';
import Curve from '../classes/Curve';
import Track from '../classes/Track';

export default (i_track, i_segmentToHighlight) => {
	const trackSegmentMaterial = new THREE.MeshStandardMaterial({ color: "#111", transparent: false, side: THREE.DoubleSide });
	const trackSegmentHighlightMaterial = new THREE.MeshBasicMaterial({ color: "#bb0", transparent: true, opacity: .5, side: THREE.DoubleSide });
	
	const trackBorderMaterial = new THREE.MeshStandardMaterial({ color: "#c66", transparent: false, side: THREE.DoubleSide });
	const trackSideMaterial = new THREE.MeshStandardMaterial({ color: "#6c6", transparent: false, side: THREE.DoubleSide });
	const trackBarrierMaterial = new THREE.MeshStandardMaterial({ color: "#999", transparent: false, side: THREE.DoubleSide });
	
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
	/*else if (i_track instanceof Segment) {
		return createSegmentObject(i_track, true);
	}*/
	
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

			let borderGeometry = new THREE.Geometry();
			borderGeometry.vertices = [
				new THREE.Vector3(rightOffsetStart + 0, 0, 0),
				new THREE.Vector3(rightOffsetStart + 0, i_straightSegment.length, 0),
				new THREE.Vector3(rightOffsetEnd   + i_border.width, i_straightSegment.length, i_border.height),
				new THREE.Vector3(rightOffsetEnd   + i_border.width, 0, i_border.height)
			];
			borderGeometry.faces = [ new THREE.Face3(0, 1, 2), new THREE.Face3(0, 2, 3) ];
			borderGeometry.computeFaceNormals();
			borderGeometry.translate(0, -i_straightSegment.length/2, 0);
			if (!i_isRight) {
				borderGeometry.scale(-1, 1, 1);
			}

			rightOffsetStart += i_border.width;
			rightOffsetEnd += i_border.width;

			let sideGeometry = new THREE.Geometry();
			sideGeometry.vertices = [
				new THREE.Vector3(rightOffsetStart + 0, 0, 0),
				new THREE.Vector3(rightOffsetStart + 0, i_straightSegment.length, 0),
				new THREE.Vector3(rightOffsetEnd   + i_side.endWidth, i_straightSegment.length, 0),
				new THREE.Vector3(rightOffsetEnd   + i_side.startWidth, 0, 0)
			];
			sideGeometry.faces = [ new THREE.Face3(0, 1, 2), new THREE.Face3(0, 2, 3) ];
			sideGeometry.computeFaceNormals();
			sideGeometry.translate(0, -i_straightSegment.length/2, 0);
			if (!i_isRight) {
				sideGeometry.scale(-1, 1, 1);
			}

			rightOffsetStart += i_side.startWidth;
			rightOffsetEnd += i_side.endWidth;

			return [ borderGeometry, sideGeometry ];
		};

		let retval = new THREE.Group();
		let segmentStart = i_track.computeStartOfSegment(i_straightSegment);
		let displacement = i_straightSegment.computeDisplacement(segmentStart.position, segmentStart.rotation);

		let geometry = new THREE.PlaneGeometry(i_straightSegment.startWidth, i_straightSegment.length, 1, 1);

		let [ leftBorderGeometry, leftSideGeometry ] = 
			getOuterGeometries(i_straightSegment.leftBorder(), i_straightSegment.leftSide(), i_straightSegment.leftBarrier(), false);
		let [ rightBorderGeometry, rightSideGeometry ] = 
			getOuterGeometries(i_straightSegment.rightBorder(), i_straightSegment.rightSide(), i_straightSegment.rightBarrier(), true);
		
		[
			geometry, 
			leftBorderGeometry, rightBorderGeometry,
			leftSideGeometry, rightSideGeometry,
		].forEach(g => {
			g.rotateZ(segmentStart.rotation - Math.PI/2);
			g.translate(segmentStart.position.x + displacement.position.x/2, 
				segmentStart.position.y + displacement.position.y/2, 
				segmentStart.position.z + displacement.position.z/2);
			});

		retval.add(new THREE.Mesh(geometry, trackSegmentMaterial));
		retval.add(new THREE.LineSegments(
			new THREE.EdgesGeometry(geometry),
			new THREE.LineBasicMaterial({ color: 0xff00ff })
			));
		
		retval.add(new THREE.Mesh(leftBorderGeometry,  trackBorderMaterial));
		retval.add(new THREE.Mesh(leftSideGeometry,  trackSideMaterial));
		retval.add(new THREE.Mesh(rightBorderGeometry, trackBorderMaterial));
		retval.add(new THREE.Mesh(rightSideGeometry, trackSideMaterial));

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
		let segmentStart = i_track.computeStartOfSegment(i_curveSegment);
		//let displacement = i_curveSegment.computeDisplacement(segmentStart.position, segmentStart.rotation);
		
		let geometries = [];
		let edgeGeometries = [];
		
		let numberOfSteps = i_curveSegment.getNumberOfSteps();
		let currentStartPosition = new THREE.Vector3();
		currentStartPosition.copy(segmentStart.position);
		let currentRotation = segmentStart.rotation;
		for (let p = 0; p < numberOfSteps; ++p) {
			let partDisplacement = i_curveSegment.computePartDisplacement(p, segmentStart.position, segmentStart.rotation);
			let partArc = partDisplacement.rotation;
			
			let partDisplacementDelta = new THREE.Vector3();
			partDisplacementDelta.subVectors(partDisplacement.position, segmentStart.position);
			
			let radius = i_curveSegment.getPartRadius(p);
			let innerRadius = radius - i_curveSegment.startWidth / 2;
			let outerRadius = radius + i_curveSegment.startWidth / 2;
			let partGeometry = new THREE.RingGeometry(
				innerRadius,
				outerRadius,
				8, 1, 0, partArc
				);
				
			partGeometry.rotateZ(currentRotation + (i_curveSegment.isRight ? Math.PI/2 : - Math.PI/2));
			
			let centerPosition = new THREE.Vector3(0, radius * (i_curveSegment.isRight ? -1 : 1), 0);
			centerPosition.copy(centerPosition.applyAxisAngle(axisZ, currentRotation));
			centerPosition.addVectors(centerPosition, currentStartPosition);
			partGeometry.translate(centerPosition.x, centerPosition.y, centerPosition.z);

			currentStartPosition.addVectors(currentStartPosition, partDisplacement.position);
			currentRotation += partDisplacement.rotation;
			
			geometries.push(partGeometry);
			edgeGeometries.push(new THREE.EdgesGeometry(partGeometry));
		}

		let mergedGeometry = new THREE.Geometry();
		geometries.forEach(g => {
			let mesh = new THREE.Mesh(g);
			mesh.updateMatrix();
			mergedGeometry.merge(mesh.geometry, mesh.matrix);
		});
		
		let mergedEdgeGeometry = new THREE.EdgesGeometry(mergedGeometry);
		
		let mesh = new THREE.Mesh(mergedGeometry, trackSegmentMaterial);
		retval.add(mesh);
		retval.add(new THREE.LineSegments(mergedEdgeGeometry, new THREE.LineBasicMaterial({ color: 0x4400ff })));

        //var vnh = new THREE.VertexNormalsHelper( mesh, 10, 0x00ff00, 10 );
        //retval.add( vnh );
		
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
