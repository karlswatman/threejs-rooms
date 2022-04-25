import * as THREE from "three";
import cube from "./cube";
import gsap from "gsap";

//cursor
window.addEventListener("mousemove", (e) => {});

const scene = new THREE.Scene();

// red cube
const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// axes helper
const axes = new THREE.AxesHelper(2);
scene.add(axes);

// sizes
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

// CAMERA
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight
);
// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
// 	-1 * aspectRatio,
// 	1 * aspectRatio,
// 	1,
// 	-1,
// 	0.1,
// 	100
// );
// camera.position.x = 2;
// camera.position.y = 2;
camera.position.z = 2;
camera.lookAt(mesh.position);
scene.add(camera);

// renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.setSize(sizes.width, sizes.height);

//clock
const clock = new THREE.Clock();

gsap.to(mesh.rotation, {
	duration: 2,
	y: Math.PI * 2,
	delay: 1,
	repeat: -1,
});

//animations
const tick = () => {
	//clock
	const elapsedTime = clock.getElapsedTime();
	//update objects
	// mesh.rotation.y = elapsedTime;
	//render
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
