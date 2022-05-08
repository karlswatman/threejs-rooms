import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { fitTexture } from "./fitTexture";

import gsap from "gsap";
import * as dat from "dat.gui";

// DEBUG
const gui = new dat.GUI();
gui.close();

// CANVAS
const canvas = document.querySelector(".webgl");

// SCENE
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0);

// MOUSE

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;
// raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

// LOADERS
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/js/libs/draco/");
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);

// ELEMENTS

// create video element
const video = document.querySelector("video");
video.src = "./vid.mov";

//TEXTURES

// create three js video texture
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBAFormat;

// baked texture
const bakedTexture = new THREE.TextureLoader().load("./static/testbake.jpg");
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

// MATERIALS

//  baked material
const bakedMaterial = new THREE.MeshBasicMaterial({
	map: bakedTexture,
	color: 0xffffff,
});

const screenMaterial = new THREE.MeshBasicMaterial({
	map: videoTexture,
	color: 0xffffff,
});

const nameTextMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
});
const nameTextColour = {
	color: 0xffffff,
};
const nameTextFolder = gui.addFolder("Name Text");
nameTextFolder.addColor(nameTextColour, "color").onChange(() => {
	nameTextMaterial.color.set(nameTextColour.color);
});

const continueMaterial = new THREE.MeshBasicMaterial({
	color: 0x0,
});
const continueTextColour = {
	color: 0x0,
};
const continueTextFolder = gui.addFolder("Continue Text");
continueTextFolder.addColor(continueTextColour, "color").onChange(() => {
	continueMaterial.color.set(continueTextColour.color);
});

// MODELS

let model;

loader.load("./static/test.glb", (gltf) => {
	model = gltf.scene;
	console.log(model);
	model.traverse((child) => {
		child.material = bakedMaterial;
	});

	// const screen = model.children.find((child) => child.name === "Plane001");
	// screen.scale.set(4, 0, 1);
	// screen.material = screenMaterial;

	const screen = model.children.find((child) => child.name === "Plane001");
	screen.material = screenMaterial;

	const nameText = model.children.find((child) => child.name === "Text");
	const titletext = model.children.find((child) => child.name === "Text001");
	const continueText = model.children.find((child) => child.name === "Text002");
	continueText.material = continueMaterial;
	titletext.material = nameTextMaterial;
	nameText.material = nameTextMaterial;

	scene.add(model);
});

// FONTS

// AXES HELPER

// OBJECTS

// screen
// const screenGeometry = new THREE.BoxGeometry(20, 10, 0.1);
// const screenMaterial = new THREE.MeshBasicMaterial({
// 	map: videoTexture,
// });
// const screen = new THREE.Mesh(screenGeometry, screenMaterial);
// screen.position.set(-1, 4.5, -8.6);
// screen.scale.set(0.8, 0.9, 1);
// const screenFolder = gui.addFolder("Screen");
// screenFolder.add(screen.position, "x", -10, 10);
// screenFolder.add(screen.position, "y", -10, 10);
// screenFolder.add(screen.position, "z", -10, 10);
// screenFolder.add(screen.scale, "x", 0, 10, 0.1);
// screenFolder.add(screen.scale, "y", 0, 10, 0.1);
// screenFolder.add(screen.scale, "z", 0, 10, 0.1);
// scene.add(screen);

// LIGHT

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
	// controls.handleResize();
});

//FULLSCREEN

// CAMERA
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight
);

camera.position.set(1, 1, 4);
// camera.rotation.set(0.4, 0, 0);

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -10, 10);
cameraFolder.add(camera.position, "y", -10, 10);
cameraFolder.add(camera.position, "z", -10, 10);
cameraFolder.add(camera.rotation, "x", -10, 10, 0.1);
cameraFolder.add(camera.rotation, "y", -10, 10, 0.1);
cameraFolder.add(camera.rotation, "z", -10, 10, 0.1);
scene.add(camera);

// CONTROLS
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
controls.enablePan = false;
// controls.enableZoom = false;
// controls.minPolarAngle = Math.PI / 5;
// controls.maxPolarAngle = Math.PI / 2 - 0.1;
// controls.minAzimuthAngle = -Math.PI / 4; // radians
// controls.maxAzimuthAngle = Math.PI / 4; // radians
// controls.target.set(0, 1, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

// ANIMATIONS

// EVENTS

// change channel
let channel = 0;
let keyPressed = false;
const clips = ["./pepe.mp4"];
const videos = ["./vid.mov"];

document.addEventListener("keydown", (event) => {
	if (!keyPressed) {
		keyPressed = true;
		video.src = "./load.mp4";
		video.play();
		setTimeout(() => {
			video.src = [clips[channel]];
			console.log(video);

			video.play();
		}, 1500);
		setTimeout(() => {
			video.src = "./load.mp4";

			video.play();
		}, 3000);
		setTimeout(() => {
			video.src = videos[channel];

			video.play();
			video.loop = true;
			keyPressed = false;
		}, 4500);
	}
});

// track mouse x y
document.addEventListener("mousemove", (event) => {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// CLOCK
const clock = new THREE.Clock();

// TICK
const tick = () => {
	// TIME
	const elapesedTime = clock.getElapsedTime();

	// ROTATE SCENE
	targetX = mouseX * 0.0002;
	targetY = mouseY * 0.0001;

	if (model) {
		model.rotation.y += 0.05 * (targetX - model.rotation.y);
		model.rotation.x += 0.05 * (targetY - model.rotation.x);
	}

	// RAYCASTER

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera(pointer, camera);

	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects(scene.children);

	for (let i = 0; i < intersects.length; i++) {
		if (intersects.find((intersect) => intersect.object.name === "Text002")) {
			continueMaterial.color.set(0xffffff);
		} else {
			continueMaterial.color.set(0x000000);
		}
	}

	// UPDATE OBJECTS

	// UPDATE CONTROLS
	const delta = clock.getDelta();
	controls.update();

	// RENDER
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
