import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { Linear } from "gsap";

import * as dat from "dat.gui";

let mouseX = 0;
let mouseY = 0;

let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// DEBUG
const gui = new dat.GUI();

// CANVAS
const canvas = document.querySelector(".webgl");

// SCENE
const scene = new THREE.Scene();

//TEXTURES
const loadingManager = new THREE.LoadingManager();

const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

const textureLoader = new THREE.TextureLoader(loadingManager);
const texture = textureLoader.load("./static/textures/door/color.jpg");
const matcapTexture = textureLoader.load("./static/textures/matcaps/7.png");

const environmentMapTexture = cubeTextureLoader.load([
	"./static/textures/environmentMaps/2/px.jpg",
	"./static/textures/environmentMaps/2/nx.jpg",
	"./static/textures/environmentMaps/2/py.jpg",
	"./static/textures/environmentMaps/2/ny.jpg",
	"./static/textures/environmentMaps/2/pz.jpg",
	"./static/textures/environmentMaps/2/nz.jpg",
]);

// FONTS

const fontLoader = new FontLoader();

const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 64, 64);

fontLoader.load("./static/fonts/helvetiker_regular.typeface.json", (font) => {
	console.log("font loaded");
	const textGeometry = new TextGeometry("Karl Swatman", {
		font: font,
		size: 0.5,
		height: 0.2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelSegments: 3,
		bevelOffset: 0,
	});
	textGeometry.center();
	const material = new THREE.MeshNormalMaterial({});
	material.flatShading = false;
	const textMesh = new THREE.Mesh(textGeometry, material);
	scene.add(textMesh);

	const nextTextGeom = new TextGeometry("Creative Developer", {
		font: font,
		size: 0.5,
		height: 0.2,
		curveSegments: 5,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelSegments: 3,
		bevelOffset: 0,
	});
	nextTextGeom.center();

	const nextTextMesh = new THREE.Mesh(nextTextGeom, material);
	nextTextMesh.position.set(0, -0.8, 0);

	scene.add(nextTextMesh);

	// Donuts

	console.time("donut");
	for (let i = 0; i < 250; i++) {
		const donut = new THREE.Mesh(donutGeometry, material);

		donut.position.x = (Math.random() - 0.5) * 15;
		donut.position.y = (Math.random() - 0.5) * 15;
		donut.position.z = (Math.random() - 0.5) * 15;
		donut.rotation.x = Math.random() * Math.PI;
		donut.rotation.y = Math.random() * Math.PI;
		const scale = Math.random();
		donut.scale.set(scale, scale, scale);

		scene.add(donut);
	}
	console.timeEnd("donut");
});

// AXES HELPER

// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

// OBJECTS
const geometry = new THREE.PlaneGeometry(10, 10);
const groundMirror = new Reflector(geometry, {
	clipBias: 0.003,
	textureWidth: 512,
	textureHeight: 512,
	color: 0x77,
	reverse: true,
});
groundMirror.position.z = -0.4;
groundMirror.position.y = -1.16;
// groundMirror.rotateZ = 4;
groundMirror.rotateX(-Math.PI / 2);
scene.add(groundMirror);

// const material = new THREE.MeshNormalMaterial();
// const material = new THREE.MeshMatcapMaterial();
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color("red");

// const material = new THREE.MeshToonMaterial();
// const material = new THREE.MeshStandardMaterial({});
// material.envMap = environmentMapTexture;
// gui.add(material, "metalness", 0, 1, 0.01);
// gui.add(material, "roughness", 0, 1, 0.01);
// const sphere = new THREE.Mesh(
// 	new THREE.SphereBufferGeometry(0.5, 16, 16),
// 	material
// );

// sphere.geometry.setAttribute(
// 	"uv2",
// 	new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
// );

// plane.geometry.setAttribute(
// 	"uv2",
// 	new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
// );

// const torus = new THREE.Mesh(
// 	new THREE.TorusBufferGeometry(0.5, 0.3, 16, 100),
// 	material
// );

// torus.geometry.setAttribute(
// 	"uv2",
// 	new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
// );

// torus.position.x = 2;
// scene.add(sphere, plane, torus);

// LIGHT

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

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
	controls.handleResize();
});

//FULLSCREEN
window.addEventListener("dblclick", () => {
	const fullscreenElement =
		document.fullscreenElement || document.webkitFullscreenElement;

	if (!fullscreenElement) {
		if (canvas.requestFullscreen) {
			canvas.requestFullscreen();
		} else if (canvas.webkitRequestFullscreen) {
			canvas.webkitRequestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
});

// CAMERA
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight
);

camera.position.z = 5;
scene.add(camera);

// document.addEventListener("mousemove", onDocumentMouseMove);

// function onDocumentMouseMove(event) {
// 	mouseX = (event.clientX - windowHalfX) * 0.005;
// 	mouseY = (event.clientY - windowHalfY) * 0.005;
// }

// CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
// scene.add(controls);
// const controls = new FirstPersonControls(camera, canvas);
// // controls.enableDamping = true;
// // controls.lookSpeed = 0.0125;
// controls.movementSpeed = 1;
// controls.noFly = true;
// // controls.lookVertical = false;
// // controls.constrainVertical = true;
// controls.verticalMax = 0;

// controls.lookAt(new THREE.Vector3(0, 0, 0));

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

const clock = new THREE.Clock();

// TICK
const tick = () => {
	const elapesedTime = clock.getElapsedTime();
	// camera.position.x += (mouseX - camera.position.x) * 0.05;
	// camera.position.y += (-mouseY - camera.position.y) * 0.05;

	// camera.lookAt(new THREE.Vector3(0, 0, 0));
	//update objects

	// UPDATE CONTROLS
	const delta = clock.getDelta();
	controls.update();
	// camera.lookAt(new THREE.Vector3(0, 0, 0));

	// RENDER
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
