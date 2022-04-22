import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);
const renderer = new THREE.WebGLRenderer();
const controls = new OrbitControls(camera, renderer.domElement);

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshStandardMaterial({
	color: 0x00ff00,
});
const cube = new THREE.Mesh(geometry, material);

scene.add(cube);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
hemiLight.position.set(0, 20, 0);
scene.add(hemiLight);

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);

const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight);

const gridHelper = new THREE.GridHelper(10, 10, 0xffffff, 0xffffff);
scene.add(gridHelper);

const mesh = new THREE.Mesh(
	new THREE.PlaneGeometry(100, 100),
	new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
);
mesh.rotation.x = -Math.PI / 2;
mesh.receiveShadow = true;
scene.add(mesh);

camera.position.z = 5;
// camera.position.x = 5;

document.onkeydown = function (e) {
	e.preventDefault();
	if (e.keyCode == 37) {
		cube.position.x -= 0.5;
	} else if (e.keyCode == 39) {
		cube.position.x += 0.5;
	} else if (e.keyCode == 38) {
		cube.position.z -= 0.5;
	} else if (e.keyCode == 40) {
		cube.position.z += 0.5;
	}
};

function animate() {
	requestAnimationFrame(animate);

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
	// cube.translateY(0.01);
	renderer.render(scene, camera);
}

animate();
