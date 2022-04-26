import * as THREE from "three";
import cube from "./cube";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// CANVAS
const canvas = document.querySelector(".webgl");

// SCENE
const scene = new THREE.Scene();

// CUBE
const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// AXES HELPER FOR CUBE
const axes = new THREE.AxesHelper(2);
scene.add(axes);

// SIZES
const sizes = {
	width: window.innerWidth,
	height: window.innerHeight,
};

//RESIZE
window.addEventListener("resize", () => {
	sizes.width = window.innerWidth;
	sizes.height = window.innerHeight;
	renderer.setSize(sizes.width, sizes.height);
	camera.aspect = sizes.width / sizes.height;
	camera.updateProjectionMatrix();
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

//FULLSCREEN
window.addEventListener("dblclick", () => {
	const fullscreenElement =
		document.fullscreenElement || document.webkitFullscreenElement;
	if (!fullscreenElement) {
		if (canvas.fullscreenElement) {
			canvas.requestFullscreen();
		} else if (canvas.webkitFullscreenElement) {
			document.exitFullscreen();
		}
	}
});

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

// CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// RENDERER
const renderer = new THREE.WebGLRenderer({
	canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// ANIMATIONS

// gsap.to(mesh.rotation, {
// 	duration: 2,
// 	y: Math.PI * 2,
// 	delay: 1,
// 	repeat: -1,
// });

// TICK
const tick = () => {
	//update objects
	// mesh.rotation.y = elapsedTime;
	//update camera
	// camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3;
	// camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3;
	// camera.position.y = cursor.y * 5;
	// camera.lookAt(mesh.position);

	// UPDATE CONTROLS
	controls.update();

	// RENDER
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
