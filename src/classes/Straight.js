import Segment from "./Segment";
import * as THREE from 'three';

export default class Straight extends Segment {
	length = 1;

	computeDisplacement(i_initialPosition, i_initialAngleAroundZ) {
		let mainAxis = new THREE.Vector3(this.length, 0, 0);
		let rotatedMainAxis = new THREE.Vector3();
		rotatedMainAxis.copy(mainAxis);
		rotatedMainAxis.applyAxisAngle(new THREE.Vector3(0, 0, 1), i_initialAngleAroundZ);

		/*let finalPosition = new THREE.Vector3();
		finalPosition.addVectors(i_initialPosition, rotatedMainAxis);
		
		let finalAngleAroundZ = i_initialAngleAroundZ;*/

		return {
			position: rotatedMainAxis,
			rotation: 0
		};
	}

	getLength() {
		return this.length;
	}
}
