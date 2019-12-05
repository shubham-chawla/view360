import React from 'react';
import * as THREE from 'three';

class View360 extends React.Component {
    componentDidMount() {
        let isUserInteracting = false,
            onMouseDownMouseX = 0,
            onMouseDownMouseY = 0,
            lon = 0,
            onMouseDownLon = 0,
            lat = 0,
            onMouseDownLat = 0,
            phi = 0,
            theta = 0;

        let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
        camera.target = new THREE.Vector3(0, 0, 0);

        const scene = new THREE.Scene();

        const geometry = new THREE.SphereBufferGeometry(500, 60, 40);
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale(-1, 1, 1);
        const texture = new THREE.TextureLoader().load('https://live.staticflickr.com/3289/2294472375_d8b56e1023_h.jpg');
        const material = new THREE.MeshBasicMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        this.mount.appendChild(renderer.domElement);

        const update = () => {
            if (isUserInteracting === false) {
                lon += 0.1;
            }

            lat = Math.max(-85, Math.min(85, lat));
            phi = THREE.Math.degToRad(90 - lat);
            theta = THREE.Math.degToRad(lon);

            camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
            camera.target.y = 500 * Math.cos(phi);
            camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);

            camera.lookAt(camera.target);

            /*
            // distortion
            camera.position.copy( camera.target ).negate();
            */

            renderer.render(scene, camera);
        };
        const animate = () => {
            requestAnimationFrame(animate);
            update();
        };

        animate();
    }

    render() {
        return <div ref={ref => (this.mount = ref)} />;
    }
}

export default View360;
