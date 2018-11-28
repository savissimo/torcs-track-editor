import * as THREE from 'three'

export default scene => {    

    const ambientLight = new THREE.AmbientLight('#fff');

    const sunLight = new THREE.DirectionalLight("#fff", 1);
    sunLight.position.set(1, 1, 100).normalize();
    //const lightIn = new THREE.PointLight("#4CAF50", 10);
    //const lightOut = new THREE.PointLight("#2196F3", 10);
    //lightOut.position.set(40,20,40);

    scene.add(ambientLight);
    //scene.add(sunLight);
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
