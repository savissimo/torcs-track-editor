import * as THREE from 'three';
import TrackHeader from "./TrackHeader";
import TrackGraphic from "./TrackGraphic";
import MainTrack from "./MainTrack";
import Segment from "./Segment";

export default class Track {
	header = new TrackHeader();
	graphic = new TrackGraphic();
	mainTrack = new MainTrack();
	isDirty = false;

	loadTORCSXml(i_xmlDocument) {
		this.header.loadTORCSXml(i_xmlDocument.querySelector('section[name="Header"]'));
		this.mainTrack.loadTORCSXml(i_xmlDocument.querySelector('section[name="Main Track"]'));
	}

	setDirty() {
		this.isDirty = true;
	}

	getSegmentIndex(i_segment) {
		for (let i = 0; i < this.mainTrack.trackSegments.length; ++i) {
			let segment = this.mainTrack.trackSegments[i];
			if (segment === i_segment) {
				return i;
			}
		}
		return undefined;
	}

	computeEndOfSegment(i_segment) {
		if (!(i_segment instanceof Segment || Number.isInteger(i_segment))) { return undefined; }

		if (i_segment instanceof Segment) {
			let segmentIndex = this.getSegmentIndex(i_segment);
			if (segmentIndex !== undefined) {
				return this.computeEndOfSegment(segmentIndex);
			}
			return undefined;
		}

		let segmentPosition = new THREE.Vector3(0, 0, 0);
		let segmentAngleAroundZ = 0;

		for (let i = 0; i < this.mainTrack.trackSegments.length && i <= i_segment; ++i) {
			let segment = this.mainTrack.trackSegments[i];

			let { position, rotation } = segment.computeDisplacement(segmentPosition, segmentAngleAroundZ);
			segmentPosition.addVectors(segmentPosition, position);
			segmentAngleAroundZ += rotation;
		}

		return { position: segmentPosition, rotation: segmentAngleAroundZ };
	}

	computeStartOfSegment(i_segment) {
		if (!(i_segment instanceof Segment || Number.isInteger(i_segment))) { return undefined; }

		if (i_segment instanceof Segment) {
			let segmentIndex = this.getSegmentIndex(i_segment);
			if (segmentIndex !== undefined) {
				return this.computeEndOfSegment(segmentIndex - 1);
			}
			return undefined;
		}

		return this.computeEndOfSegment(i_segment - 1);
	}
}
