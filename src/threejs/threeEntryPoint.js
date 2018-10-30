import SceneManager from "./SceneManager";

export default containerElement => {
	const canvas = createCanvas(document, containerElement);
	const sceneManager = new SceneManager(canvas);

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

	function updateScene(i_track) {
		sceneManager.updateScene(i_track);
	}

	function zoom(i_in) {
		sceneManager.zoom(i_in);
	}

	function moveCamera(i_xDelta, i_yDelta) {
		sceneManager.moveCamera(i_xDelta, i_yDelta);
	}

	return {
		updateScene,
		zoom,
		moveCamera
	}
}