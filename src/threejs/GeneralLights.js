import * as THREE from 'three'

export default scene => {    

    const ambientLight = new THREE.AmbientLight('#333');
    const hemisphereLight = new THREE.HemisphereLight(0x0000ff, 0x44ff22, 0.6);

    const sunLight = new THREE.DirectionalLight("#fff", 1);
    sunLight.position.set(-1, .75, 1).normalize();
    sunLight.position.multiplyScalar(50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = sunLight.shadow.mapSize.height = 1024*4;
    const d = 1000;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 1000;
    sunLight.shadow.bias = 0.0001;
    sunLight.shadow.radius = 2;
    //sunLight.shadowDarkness = .35;
    //const lightIn = new THREE.PointLight("#4CAF50", 10);
    //const lightOut = new THREE.PointLight("#2196F3", 10);
    //lightOut.position.set(40,20,40);

    scene.add(ambientLight);
    //scene.add(hemisphereLight);
    scene.add(sunLight);
    //scene.add(lightIn);
    //scene.add(lightOut);

    const testLight = new THREE.SpotLight(0xff0000, 1, 500, Math.PI/2, .1, 2);
    testLight.position.set(350, 0, 10);
    testLight.rotation.set(60, 30, 0);
    //scene.add(testLight);

    //const rad = 80;

    function update(time) {
        //const x = rad * Math.sin(time*0.2)
        //lightOut.position.x = x;
    }

    return {
        update
    }
}
