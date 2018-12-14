import Segment from "./Segment";
import * as THREE from 'three';

export default class Curve extends Segment {
	isRight = true;
	arc = 90 * Math.PI/180;
	startRadius = 20;
	endRadius = 20;

	profilStepsLength = 4;

	bakedCurveValues = undefined;
	
	getLength() {
		if (!this.bakedCurveValues) { this.bakeCurve(); }
		return this.bakedCurveValues.totalLength;
	}

	getNumberOfSteps() {
		if (!this.bakedCurveValues) { this.bakeCurve(); }
		return this.bakedCurveValues.numberOfSteps;
	}

	getPartRadius(i_partIndex) {
		let ratio = this.getNumberOfSteps() === 1 
			? 1
			: 1.0 / (this.getNumberOfSteps() - 1)
			;
		return this.startRadius + (this.endRadius - this.startRadius) * i_partIndex * ratio;
	}

	getPartArc(i_partIndex) {
		if (!this.bakedCurveValues) { this.bakeCurve(); }
		return this.bakedCurveValues.stepLength / this.getPartRadius(i_partIndex) * (this.isRight ? -1 : 1);
	}

	getPartLength(i_partIndex) {
		if (!this.bakedCurveValues) { this.bakeCurve(); }
		return this.bakedCurveValues.stepLength;
	}

	setValue(field, value) {
		super.setValue(field, value);

		if (['arc','startRadius','endRadius','profilStepsLength'].indexOf(field) < 0) return;
		this[field] = value;
		this.bakedCurveValues = undefined;
	}

	bakeCurve() {
		const arcRad = this.arc;
		const length = (this.startRadius + this.endRadius) / 2 * arcRad;
		const stepsLength = this.profilStepsLength;
		const steps = Math.floor(length / stepsLength) + 1;
		
		let curLength = length / steps;

		if (this.endRadius !== this.startRadius) {
			const dradius = (this.endRadius - this.startRadius) / ((steps - 1) || 1);
			
			let tmpAngle = 0;
			let tmpRadius = this.startRadius;

			for (let curStep = 0; curStep < steps; ++curStep) {
				tmpAngle += curLength / tmpRadius;
				tmpRadius += dradius;
			}

			curLength *= arcRad / tmpAngle;
		}

		this.bakedCurveValues = {
			totalLength: curLength * steps,
			numberOfSteps: steps,
			stepLength: curLength
		};
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
		//let totalArc = this.arc * (this.isRight ? -1 : 1);
		let partPosition = new THREE.Vector3();
		let partRotation = 0;
		let totalRotation = i_initialAngleAroundZ;
		const axisZ = new THREE.Vector3(0, 0, 1);

		let numSteps = this.getNumberOfSteps();

		for (let p = 0; p <= i_part && p < numSteps; ++p) {
			const partArc = this.getPartArc(p);
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
