import * as THREE from 'three'

export default scene => {    

    const sunLight = new THREE.PointLight("#f44", .1);
    sunLight.position.set(300, 0, 50);
    //const lightIn = new THREE.PointLight("#4CAF50", 10);
    //const lightOut = new THREE.PointLight("#2196F3", 10);
    //lightOut.position.set(40,20,40);

    scene.add(sunLight);
    //scene.add(lightIn);
    //scene.add(lightOut);

    //const rad = 80;

    function update(time) {
        //const x = rad * Math.sin(time*0.2)
        //lightOut.position.x = x;
    }

    return {
        update
    }
}
