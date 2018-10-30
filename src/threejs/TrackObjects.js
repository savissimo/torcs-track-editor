import * as THREE from 'three'
import Straight from '../classes/Straight';
import Curve from '../classes/Curve';

export default (i_track, i_scene) => {
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
	
    /*const subjectWireframe = new THREE.LineSegments(
		new THREE.EdgesGeometry(subjectGeometry),
        new THREE.LineBasicMaterial()
		);*/
		
	const trackGroup = buildObjects(i_track);
		
    //group.add(subjectWireframe);
	i_scene.add(trackGroup);
	
	function buildObjects(i_track) {
		let retval = new THREE.Group();
		retval.add(buildMainTrackObjects(i_track.mainTrack));
		return retval;
	}
	
	function buildMainTrackObjects(i_mainTrack) {
		let retval = new THREE.Group();
		i_mainTrack.trackSegments.forEach(segment => {
			if (segment instanceof Straight) {
				retval.add(createStraightObject(segment));
			}
			else if (segment instanceof Curve) {
				retval.add(createCurveObject(segment));
			}
		});
		return retval;
	}
	
	function createStraightObject(i_straightSegment) {
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

		retval.add(new THREE.Mesh(geometry, trackSegmentMaterial));
		retval.add(new THREE.LineSegments(
			new THREE.EdgesGeometry(geometry),
			new THREE.LineBasicMaterial({ color: 0xff0000 })
		));

		//retval.add(createText(i_straightSegment.name, findCenterPoint(geometry)));

		return retval;
	}
	
	function createCurveObject(i_curveSegment) {
		let retval = new THREE.Group();
		
		//let stepsCount = 5;
		let totalArc = i_curveSegment.arc * (i_curveSegment.isRight ? -1 : 1) * Math.PI/180;

		for (let p = 0; p < 2; ++p) {
			let radius = p === 0 ? i_curveSegment.startRadius : i_curveSegment.endRadius;
			let innerRadius = radius - i_curveSegment.startWidth / 2;
			let outerRadius = radius + i_curveSegment.startWidth / 2;
			let partGeometry = new THREE.RingGeometry(
				innerRadius,
				outerRadius,
				8, 1, 0, totalArc / 2
				);
				
			partGeometry.rotateZ(segmentAngleAroundZ + Math.PI/2);
			
			let centerPosition = new THREE.Vector3(0, -radius, 0);
			centerPosition.copy(centerPosition.applyAxisAngle(axisZ, segmentAngleAroundZ));
			centerPosition.copy(centerPosition.add(segmentPosition));
			partGeometry.translate(centerPosition.x, centerPosition.y, centerPosition.z);
			
			let initialPosition = new THREE.Vector3(0, radius, 0);
			let positionDelta = new THREE.Vector3();
			positionDelta.copy(initialPosition);
			positionDelta.copy(positionDelta.applyAxisAngle(axisZ, totalArc / 2 + segmentAngleAroundZ));
			positionDelta.copy(positionDelta.sub(initialPosition));
			segmentPosition.copy(segmentPosition.add(positionDelta));
			segmentAngleAroundZ += totalArc / 2;
			
			retval.add(new THREE.Mesh(partGeometry, trackSegmentMaterial));
		}

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

    function update(time) {
        //subjectWireframe.material.color.setHSL( Math.sin(angle*2), 0.5, 0.5 );
        
        //const scale = (Math.sin(angle*8)+6.4)/5;
        //subjectWireframe.scale.set(scale, scale, scale)
    }

    return {
        update
    }

}
