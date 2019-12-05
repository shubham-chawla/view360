import React from 'react';
import * as THREE from 'three';

const imgUrl = 'https://threejs.org/examples/textures/2294472375_24a3b8ef46_o.jpg';
// 'https://raw.githubusercontent.com/spite/THREE.CubemapToEquirectangular/master/about/pano-The%20Polygon%20Shredder-1471041904038.jpg'

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
        const texture = new THREE.TextureLoader().load(imgUrl);
        const material = new THREE.MeshBasicMaterial({ map: texture });

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        const renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        // document.body.appendChild( renderer.domElement );
        // use ref as a mount point of the Three.js scene instead of the document.body
        this.mount.appendChild(renderer.domElement);

        const onWindowResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        const onPointerStart = event => {
            isUserInteracting = true;

            const clientX = event.clientX || event.touches[0].clientX;
            const clientY = event.clientY || event.touches[0].clientY;

            onMouseDownMouseX = clientX;
            onMouseDownMouseY = clientY;

            onMouseDownLon = lon;
            onMouseDownLat = lat;
        };

        const onPointerMove = event => {
            if (isUserInteracting === true) {
                const clientX = event.clientX || event.touches[0].clientX;
                const clientY = event.clientY || event.touches[0].clientY;

                lon = (onMouseDownMouseX - clientX) * 0.1 + onMouseDownLon;
                lat = (clientY - onMouseDownMouseY) * 0.1 + onMouseDownLat;
            }
        };

        const onPointerUp = () => {
            isUserInteracting = false;
        };

        const onDocumentMouseWheel = event => {
            const fov = camera.fov + event.deltaY * 0.05;
            camera.fov = THREE.Math.clamp(fov, 10, 75);
            camera.updateProjectionMatrix();
        };

        // add event listeners here
        document.addEventListener('mousedown', onPointerStart);
        document.addEventListener('mousemove', onPointerMove);
        document.addEventListener('mouseup', onPointerUp);

        document.addEventListener('wheel', onDocumentMouseWheel);

        document.addEventListener('touchstart', onPointerStart);
        document.addEventListener('touchmove', onPointerMove);
        document.addEventListener('touchend', onPointerUp);

        document.addEventListener('dragover', event => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'copy';
        });

        document.addEventListener('dragenter', () => {
            document.body.style.opacity = 0.5;
        });

        document.addEventListener('dragleave', () => {
            document.body.style.opacity = 1;
        });

        document.addEventListener('drop', event => {
            event.preventDefault();

            const reader = new FileReader();
            reader.addEventListener('load', event => {
                material.map.image.src = event.target.result;
                material.map.needsUpdate = true;
            });
            reader.readAsDataURL(event.dataTransfer.files[0]);

            document.body.style.opacity = 1;
        });

        window.addEventListener('resize', onWindowResize);

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
