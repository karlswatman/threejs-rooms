import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

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
const sceneColor = {
	color: 0x0,
};

// LOADERS
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/examples/js/libs/draco/");
const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);

const loadingManager = new THREE.LoadingManager();

const textureLoader = new THREE.TextureLoader(loadingManager);

//TEXTURES

// create video element
const video = document.createElement("video");
video.src = "./vid.mov";

// create three js video texture
const videoTexture = new THREE.VideoTexture(video);

video.loop = true;
const videoMaterial = new THREE.MeshBasicMaterial({
	map: videoTexture,
});

// baked texture
const bakedTexture = new THREE.TextureLoader().load("./static/baked-test.jpg");
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

const nameScreenTexture = textureLoader.load(
	"./static/textures/nameScreen.jpg"
);

const woman10Texture = textureLoader.load("./static/textures/woman10.jpg");
woman10Texture.flipY = false;
woman10Texture.encoding = THREE.sRGBEncoding;
// MATERIALS

//  baked material
const bakedMaterial = new THREE.MeshBasicMaterial({
	// map: bakedTexture,
	color: 0xffff,
});

// name screen material
const nameScreenMaterial = new THREE.MeshBasicMaterial({
	map: nameScreenTexture,
	side: THREE.DoubleSide,
});
// woman material
const woman10Material = new THREE.MeshBasicMaterial({
	map: woman10Texture,
});

// MODELS
let screen;
loader.load("./static/screens.glb", (gltf) => {
	const model = gltf.scene;
	console.log(model);
	model.traverse((child) => {
		if (child.isMesh) {
			child.material = bakedMaterial;
		}
	});
	const woman10 = model.children.find((child) => child.name === "Woman10");
	woman10.material = woman10Material;
	screen = model.children.find((child) => child.name === "nameScreen");

	screen.material = nameScreenMaterial;
	screen.rotateZ(Math.PI);
	scene.add(model);
});

// FONTS

// AXES HELPER

// OBJECTS

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
	80,
	window.innerWidth / window.innerHeight
);

camera.position.x = 0.6;
camera.position.z = 3.76;
camera.position.y = 0.5;
scene.add(camera);

// CONTROLS
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
// controls.enablePan = false;
// controls.enableZoom = false;
// controls.minPolarAngle = Math.PI / 5;
// controls.maxPolarAngle = Math.PI / 2 - 0.1;
// controls.minAzimuthAngle = -Math.PI / 4; // radians
// controls.maxAzimuthAngle = Math.PI / 4; // radians

// RENDERER
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.outputEncoding = THREE.sRGBEncoding;

// ANIMATIONS

// EVENTS

document.addEventListener("keydown", (event) => {
	console.log(event.keyCode);
	bakedMaterial.map = videoTexture;
	setTimeout(() => {
		bakedMaterial.map = bakedTexture;
	}, 5000);
	bakedMaterial.needsUpdate = true;
	console.log(screen.material);
	video.play();
});

// CLOCK
const clock = new THREE.Clock();

// TICK
const tick = () => {
	// TIME
	const elapesedTime = clock.getElapsedTime();

	// UPDATE OBJECTS

	// UPDATE CONTROLS
	const delta = clock.getDelta();
	controls.update();

	// RENDER
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
