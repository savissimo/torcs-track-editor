import Segment from "./Segment";
import * as THREE from 'three';

export default class Curve extends Segment {
	isRight = true;
	arc = 90;
	startRadius = 20;
	endRadius = 20;

	getNumberOfSteps() {
		return 6;
	}

	getPartRadius(i_partIndex) {
		return i_partIndex < 3 ? this.startRadius : this.endRadius;
	}

	computeDisplacement(i_initialPosition, i_initialAngleAroundZ) {
		let totalPosition = new THREE.Vector3();
		let totalRotation = 0;
		for (let i = 0; i < this.getNumberOfSteps(); ++i) {
			let { position, rotation } = this.computePartDisplacement(i, i_initialPosition, i_initialAngleAroundZ);
			totalPosition.addVectors(totalPosition, position);
			totalRotation += rotation;
		}

		return {
			position: totalPosition,
			rotation: totalRotation
		};
	}

	computePartDisplacement(i_part, i_initialPosition, i_initialAngleAroundZ) {
		let totalArc = this.arc * (this.isRight ? -1 : 1) * Math.PI/180;
		let partPosition = new THREE.Vector3();
		let partRotation = 0;
		let totalRotation = i_initialAngleAroundZ;
		const axisZ = new THREE.Vector3(0, 0, 1);

		let numSteps = this.getNumberOfSteps();

		for (let p = 0; p <= i_part && p < numSteps; ++p) {
			let partArc = totalArc / numSteps;
			partRotation = partArc;

			let positionDelta = new THREE.Vector3();
			if (p === i_part) {
				let radius = this.getPartRadius(p);
				let initialPosition = new THREE.Vector3(0, -radius * (this.isRight ? -1 : 1), 0);
				initialPosition.applyAxisAngle(axisZ, totalRotation);
				positionDelta.copy(initialPosition);
				positionDelta.applyAxisAngle(axisZ, partRotation);
				positionDelta.subVectors(positionDelta, initialPosition);
			}

			partPosition.copy(positionDelta);
			totalRotation += partRotation;
		}

		return {
			position: partPosition,
			rotation: partRotation
		};
	}
}
