import * as THREE from 'three'
import Straight from '../classes/Straight';
import Curve from '../classes/Curve';
import Track from '../classes/Track';
import Segment from '../classes/Segment';

export default (i_track) => {
	const trackSegmentMaterial = new THREE.MeshStandardMaterial({ color: "#000", transparent: false, side: THREE.DoubleSide });
	
	var segmentPosition = new THREE.Vector3(0, 0, 0);
	var segmentAngleAroundZ = 0;
	const axisZ = new THREE.Vector3(0, 0, 1);

	/*const loader = new THREE.FontLoader();
	var font = undefined;
	loader.load( 'assets/fonts/helvetiker_regular.typeface.json', function ( i_font ) {
		font = i_font;
	}, undefined, e => {
		console.error(e);
	});*/
	
	if (i_track instanceof Track) {
		return buildObjects(i_track);
	}
	else if (i_track instanceof Segment) {
		return createSegmentObject(i_track, true);
	}
	
	function buildObjects(i_track) {
		let retval = new THREE.Group();
		retval.add(buildMainTrackObjects(i_track.mainTrack));
		return retval;
	}
	
	function buildMainTrackObjects(i_mainTrack) {
		let retval = new THREE.Group();
		i_mainTrack.trackSegments.forEach(segment => retval.add(createSegmentObject(segment)));
		return retval;
	}

	function createSegmentObject(segment, i_highlight) {
		if (segment instanceof Straight) {
			return createStraightObject(segment, i_highlight);
		}
		else if (segment instanceof Curve) {
			return createCurveObject(segment, i_highlight);
		}
	}
	
	function createStraightObject(i_straightSegment, i_highlight) {
		let retval = new THREE.Group();

		let mainAxis = new THREE.Vector3(i_straightSegment.length, 0, 0);
		let rotatedMainAxis = new THREE.Vector3();
		rotatedMainAxis.copy(mainAxis);
		rotatedMainAxis.applyAxisAngle(axisZ, segmentAngleAroundZ);

		let geometry = new THREE.BoxGeometry(mainAxis.x, i_straightSegment.startWidth, 1);
		geometry.rotateZ(segmentAngleAroundZ);
		geometry.translate(segmentPosition.x + rotatedMainAxis.x/2, 
			segmentPosition.y + rotatedMainAxis.y/2, 
			segmentPosition.z + rotatedMainAxis.z/2);

		segmentPosition.copy(segmentPosition.add(rotatedMainAxis));
		segmentAngleAroundZ += 0;

		
		if (i_highlight) {
			retval.add(new THREE.LineSegments(
				new THREE.EdgesGeometry(geometry),
				new THREE.LineBasicMaterial({ color: 0xdd6600, linewidth: 5 })
				));
		}
		else {
			retval.add(new THREE.Mesh(geometry, trackSegmentMaterial));
			retval.add(new THREE.LineSegments(
				new THREE.EdgesGeometry(geometry),
				new THREE.LineBasicMaterial({ color: 0xff00ff })
			));
		}

		//retval.add(createText(i_straightSegment.name, findCenterPoint(geometry)));

		retval.userData = i_straightSegment;
		return retval;
	}
	
	function createCurveObject(i_curveSegment, i_highlight) {
		let retval = new THREE.Group();
		
		let totalArc = i_curveSegment.arc * (i_curveSegment.isRight ? -1 : 1) * Math.PI/180;
		let geometries = [];
		let edgeGeometries = [];
		
		for (let p = 0; p < 2; ++p) {
			let partArc = totalArc / 2;
			let radius = p === 0 ? i_curveSegment.startRadius : i_curveSegment.endRadius;
			let innerRadius = radius - i_curveSegment.startWidth / 2;
			let outerRadius = radius + i_curveSegment.startWidth / 2;
			let partGeometry = new THREE.RingGeometry(
				innerRadius,
				outerRadius,
				8, 1, 0, partArc
				);
				
			partGeometry.rotateZ(segmentAngleAroundZ + (i_curveSegment.isRight ? Math.PI/2 : - Math.PI/2));
			
			let centerPosition = new THREE.Vector3(0, radius * (i_curveSegment.isRight ? -1 : 1), 0);
			centerPosition.copy(centerPosition.applyAxisAngle(axisZ, segmentAngleAroundZ));
			centerPosition.copy(centerPosition.add(segmentPosition));
			partGeometry.translate(centerPosition.x, centerPosition.y, centerPosition.z);
			
			let initialPosition = new THREE.Vector3(0, -radius * (i_curveSegment.isRight ? -1 : 1), 0);
			let positionDelta = new THREE.Vector3();
			initialPosition.applyAxisAngle(axisZ, segmentAngleAroundZ);
			positionDelta.copy(initialPosition);
			positionDelta.copy(positionDelta.applyAxisAngle(axisZ, partArc));
			positionDelta.copy(positionDelta.sub(initialPosition));
			segmentPosition.copy(segmentPosition.add(positionDelta));
			segmentAngleAroundZ += partArc;
			
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
		
		if (i_highlight) {
			retval.add(new THREE.LineSegments(mergedEdgeGeometry, new THREE.LineBasicMaterial({ color: 0xdd6600, linewidth: 5 })));
		}
		else {
			retval.add(new THREE.Mesh(mergedGeometry, trackSegmentMaterial));
			retval.add(new THREE.LineSegments(mergedEdgeGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff })));
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
