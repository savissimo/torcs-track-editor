import * as THREE from 'three';
import EditorHook from '../classes/EditorHook';

export function InterSegmentHooks () {

	const hookMaterial = new THREE.MeshBasicMaterial({ color: "#ffff00", transparent: true, opacity: .4, side: THREE.DoubleSide });
	const hookHighlightMaterial = new THREE.MeshBasicMaterial({ color: "#ff0000", transparent: true, opacity: .8, side: THREE.DoubleSide });
	const hookHoverMaterial = new THREE.MeshBasicMaterial({ color: "#660000", transparent: true, opacity: .8, side: THREE.DoubleSide });

	function buildObjects(i_track, i_positionsToHighlight, i_positionToHighlightHover) {
		let retval = new THREE.Group();
		retval.add(buildMainTrackInterSegmentHooks(i_track));
		retval.add(buildHighlightedObjects(i_track, i_positionsToHighlight));
		if (i_positionToHighlightHover !== undefined) {
			retval.add(buildHighlightedObjects(i_track, [ i_positionToHighlightHover ], hookHoverMaterial));
		}
		return retval;
	}

	function buildHighlightedObjects(i_track, i_positions, i_material) {
		let retval = new THREE.Group();
		(i_positions || []).forEach(position => { retval.add(createInterSegmentHook(i_track, position, i_material || hookHighlightMaterial)); });
		return retval;
	}

	function buildMainTrackInterSegmentHooks(i_track, i_material) {
		let retval = new THREE.Group();
		for (let i = 0; i <= i_track.mainTrack.trackSegments.length; ++i) {
			retval.add(createInterSegmentHook(i_track, i, i_material));
		}
		return retval;
	}

	function createInterSegmentHook(i_track, i, i_material) {
		let attitude = undefined;
		if (i === i_track.mainTrack.trackSegments.length) {
			attitude = i_track.computeEndOfSegment(i - 1);
		}
		else {
			attitude = i_track.computeStartOfSegment(i);
		}

		let retval = new THREE.Group();

		let size = 5;
		let geometry = new THREE.TorusBufferGeometry(size * 1.5, size * .25, 6, 36, Math.PI*2);
		geometry.rotateX(Math.PI/2);
		geometry.rotateZ(attitude.rotation + Math.PI/2);
		geometry.translate(attitude.position.x, attitude.position.y, attitude.position.z);
		retval.add(new THREE.Mesh(geometry, i_material || hookMaterial));		

		retval.userData = new EditorHook({ interSegmentIndex: i });

		return retval;
	}

	return {
		buildObjects,
		buildHighlightedObjects
	};
}