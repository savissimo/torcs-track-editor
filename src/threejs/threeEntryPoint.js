import SceneManager from "./SceneManager";

export default containerElement => {
	const canvas = createCanvas(document, containerElement);
	const sceneManager = SceneManager(canvas);

	bindEventListeners();
	render();

	function createCanvas(document, containerElement) {
		const canvas = document.createElement('canvas');
		containerElement.appendChild(canvas);
		return canvas;
	}

	function bindEventListeners() {
		window.onresize = resizeCanvas;
		resizeCanvas();
	}

	function resizeCanvas() {
		canvas.style.width = '100%';
		canvas.style.height= '100%';
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		sceneManager.onWindowResize();
	}
	
	function render(time) {
		requestAnimationFrame(render);
		sceneManager.update();
	}

	function updateTrack(i_track) {
		sceneManager.updateTrack(i_track);
	}

	function zoom(i_in) {
		sceneManager.zoom(i_in);
	}

	function moveCamera(i_xDelta, i_yDelta, i_buttons, i_shiftKey) {
		sceneManager.moveCamera(i_xDelta, i_yDelta, i_buttons, i_shiftKey);
	}

	function setPerspectiveCamera() {
		sceneManager.setPerspectiveCamera();
	}

	function setOrthogonalCamera() {
		sceneManager.setOrthogonalCamera();
	}

	function enterHookMode() {
		sceneManager.enterHookMode();
	}

	function exitHookMode() {
		sceneManager.exitHookMode();
	}

	function updateHookMode() {
		sceneManager.updateHookMode();
	}

	return {
		updateTrack,
		zoom,
		moveCamera,
		setPerspectiveCamera,
		setOrthogonalCamera,
        enterHookMode,
        exitHookMode,
		updateHookMode,
		
		sceneManager
	}
}