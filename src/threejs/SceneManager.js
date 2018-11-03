import * as THREE from 'three';
import GeneralLights from './GeneralLights';
import TrackObjects from './TrackObjects';
import Segment from '../classes/Segment';

export default canvas => {

    const clock = new THREE.Clock();
    //const origin = new THREE.Vector3(0,0,0);
    
    var raycaster = new THREE.Raycaster();
    var mouseClickPosition = new THREE.Vector2();
    
    var track = undefined;
    var track3DObject = undefined;
    var selectedSegment = undefined;
    //var selectedSegment3DObject = undefined;
    
    const screenDimensions = {
        width: canvas.width,
        height: canvas.height
    }
    
    const mousePosition = {
        x: 0,
        y: 0
    }
    
    const scene = buildScene();
    const lights = new GeneralLights(scene);
    const renderer = buildRender(screenDimensions);
    const sceneSubjects = createSceneSubjects(scene);
    
    const [ orthogonalCamera, perspectiveCamera ] = buildCameras(screenDimensions);
    var camera = orthogonalCamera;
    
    function buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#ddd");

        return scene;
    }
    
    function buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
        const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true; 

        return renderer;
    }

    function buildCameras({ width, height }) {
        const aspectRatio = width / height;
        let viewRange = 200;
        const orthogonalCamera = new THREE.OrthographicCamera(-viewRange, viewRange, viewRange/aspectRatio, -viewRange/aspectRatio, 10, -10);

        const fieldOfView = 60;
        const nearPlane = 4;
        const farPlane = 1000; 
        const perspectiveCamera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        perspectiveCamera.position.set(0, 0, 50);

        return [ orthogonalCamera, perspectiveCamera ];
    }

    function createSceneSubjects(scene) {
        const sceneSubjects = [
            lights
        ];

        return sceneSubjects;
    }

    function updateTrack(i_track) {
        if (i_track) {
            track = i_track;
        }
        if (track3DObject) {
            scene.remove(track3DObject);
        }
        track3DObject = TrackObjects(track, selectedSegment);
        scene.add(track3DObject);

        /*this.sceneSubjects = [
            lights,
            track3DObject
        ];*/
    }

    function updateSelectedSegment(i_segment) {
        selectedSegment = i_segment;
        updateTrack();
        /*if (selectedSegment3DObject) {
            scene.remove(selectedSegment3DObject);
        }
        selectedSegment3DObject = TrackObjects(selectedSegment);
        if (selectedSegment3DObject) {
            scene.add(selectedSegment3DObject);
        }*/
    }

    function update() {
        const elapsedTime = clock.getElapsedTime();

        for(let i=0; i<sceneSubjects.length; i++) {
            if (sceneSubjects[i].update) {
                sceneSubjects[i].update(elapsedTime);
            }
        }

        renderer.render(scene, camera);
    }

    function onWindowResize() {
        const { width, height } = canvas;
        
        screenDimensions.width = width;
        screenDimensions.height = height;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        
        renderer.setSize(width, height);
    }

    function onMouseMove(x, y) {
        mousePosition.x = x;
        mousePosition.y = y;
    }

    function zoom(i_in) {
        if (camera === orthogonalCamera) {
            const delta = 1.2;
            camera.zoom *= i_in ? 1/delta : delta;
            camera.updateProjectionMatrix();
        }
    }

    function moveCamera(i_xDelta, i_yDelta) {
        if (camera === orthogonalCamera) {
            let factor = 20 / 7;
            camera.top += i_yDelta / factor / camera.zoom;
            camera.bottom += i_yDelta / factor / camera.zoom;
            camera.left -= i_xDelta / factor / camera.zoom;
            camera.right -= i_xDelta / factor / camera.zoom;
            camera.updateProjectionMatrix();
        }
    }

    function pick(i_x, i_y) {
        if (!track3DObject) {
            return undefined;
        }

        mouseClickPosition.x = (i_x / renderer.domElement.width) * 2 - 1;
        mouseClickPosition.y = -(i_y / renderer.domElement.height) * 2 + 1;
        raycaster.setFromCamera(mouseClickPosition, camera);
        let intersects = raycaster.intersectObject(track3DObject, true);
        for (let i = 0; i < intersects.length; ++i) {
            let obj3D = intersects[i].object;
            let obj = obj3D.userData;
            while (!(obj instanceof Segment) && obj3D.parent) {
                obj3D = obj3D.parent;
                obj = obj3D.userData;
            }
            if (obj instanceof Segment) {
                updateSelectedSegment(obj);
                return obj;
            }
        }
        updateSelectedSegment(undefined);
        return undefined;
    }

	function setPerspectiveCamera() {
        camera = perspectiveCamera;		
	}

	function setOrthogonalCamera() {
		camera = orthogonalCamera;
	}

    return {
        update,
        onWindowResize,
        onMouseMove,
        updateTrack,
        zoom,
        moveCamera,
        pick,
        setPerspectiveCamera,
        setOrthogonalCamera
    }
}
