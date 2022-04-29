import * as THREE from "three";
import gsap from "gsap";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

import * as dat from "dat.gui";

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
	const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
	const textMesh = new THREE.Mesh(textGeometry, textMaterial);
	scene.add(textMesh);
});

// AXES HELPER

const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

// OBJECTS

// const material = new THREE.MeshBasicMaterial({
// 	map: texture,
// 	// wireframe: true,
// });

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

// const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(1, 1), material);

// plane.geometry.setAttribute(
// 	"uv2",
// 	new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
// );
// plane.position.x = -2;

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

camera.position.z = 2;
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

const clock = new THREE.Clock();

// TICK
const tick = () => {
	const elapesedTime = clock.getElapsedTime();
	//update objects

	// UPDATE CONTROLS
	controls.update();

	// RENDER
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
