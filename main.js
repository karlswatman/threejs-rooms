import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

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

// RAYCASTER

let intersects;
const raycaster = new THREE.Raycaster();
// raycaster for mouse
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
videoTexture.flipY = false;

video.src = "./load.mp4";
video.load();
video.play();
video.loop = true;
video.muted = true;

// baked texture
const bakedTexture = new THREE.TextureLoader().load("./static/testbake.jpg");
bakedTexture.flipY = false;
bakedTexture.encoding = THREE.sRGBEncoding;

const compTexture = new THREE.TextureLoader().load("./static/compbake.jpg");
compTexture.flipY = false;
compTexture.encoding = THREE.sRGBEncoding;

const macTexture = new THREE.TextureLoader().load("./static/macbake.jpg");
macTexture.flipY = false;
macTexture.encoding = THREE.sRGBEncoding;

const macScreenTexture = new THREE.VideoTexture(video);
macScreenTexture.minFilter = THREE.LinearFilter;
macScreenTexture.magFilter = THREE.LinearFilter;
macScreenTexture.format = THREE.RGBAFormat;
macScreenTexture.flipY = false;

const screenTwoTexture = new THREE.TextureLoader().load(
	"./static/scrumBoard.png"
);

const framesAndTextTexture = new THREE.TextureLoader().load(
	"./static/framesandtext.jpg"
);
framesAndTextTexture.flipY = false;
framesAndTextTexture.encoding = THREE.sRGBEncoding;

const poster1Texture = new THREE.TextureLoader().load(
	"./static/isleofdogs.jpeg"
);
poster1Texture.flipY = false;
poster1Texture.encoding = THREE.sRGBEncoding;

const poster2Texture = new THREE.TextureLoader().load("./static/batman.jpeg");
poster2Texture.flipY = false;
poster2Texture.encoding = THREE.sRGBEncoding;

const poster3Texture = new THREE.TextureLoader().load("./static/django.jpeg");
poster3Texture.flipY = false;
poster3Texture.encoding = THREE.sRGBEncoding;

const poster4Texture = new THREE.TextureLoader().load(
	"./static/backtothefuture.jpeg"
);
poster4Texture.flipY = false;
poster4Texture.encoding = THREE.sRGBEncoding;
// MATERIALS

//  baked material
const bakedMaterial = new THREE.MeshBasicMaterial({
	map: bakedTexture,
	color: 0xffffff,
});

const screenOneMaterial = new THREE.MeshBasicMaterial({
	map: videoTexture,
	color: 0xffffff,
});

const screenTwoMaterial = new THREE.MeshBasicMaterial({
	map: screenTwoTexture,
});

const nameTextMaterial = new THREE.MeshBasicMaterial({
	color: 0xffffff,
});
const nameTextColour = {
	color: 0xffffff,
};

const compMaterial = new THREE.MeshBasicMaterial({
	map: compTexture,
	color: 0xffffff,
});

const macMaterial = new THREE.MeshBasicMaterial({
	map: macTexture,
});

const macScreenMaterial = new THREE.MeshBasicMaterial({
	map: macScreenTexture,
});

const framesandtextMaterial = new THREE.MeshBasicMaterial({
	map: framesAndTextTexture,
});

const poster1Material = new THREE.MeshBasicMaterial({
	map: poster1Texture,
});

const poster2Material = new THREE.MeshBasicMaterial({
	map: poster2Texture,
});

const poster3Material = new THREE.MeshBasicMaterial({
	map: poster3Texture,
});

const poster4Material = new THREE.MeshBasicMaterial({
	map: poster4Texture,
});
// MODELS

let model;
let continueText;
loader.load("./static/test.glb", (gltf) => {
	model = gltf.scene;
	console.log(model);
	model.traverse((child) => {
		child.material = bakedMaterial;
	});

	const screen = model.children.find((child) => child.name === "screen");
	screen.material = screenOneMaterial;

	const name = model.children.find((child) => child.name === "name");
	name.material = framesandtextMaterial;

	const nameTitle = model.children.find((child) => child.name === "nameTitle");
	nameTitle.material = framesandtextMaterial;

	continueText = model.children.find((child) => child.name === "continue");
	continueText.material = framesandtextMaterial;

	const poster1 = model.children.find((child) => child.name === "poster1");
	poster1.material = poster1Material;

	const poster2 = model.children.find((child) => child.name === "poster2");
	poster2.material = poster2Material;

	const poster3 = model.children.find((child) => child.name === "poster3");
	poster3.material = poster3Material;

	const poster4 = model.children.find((child) => child.name === "poster4");
	poster4.material = poster4Material;

	scene.add(model);
});

let comp;
let mac;
loader.load("./static/comp.glb", (gltf) => {
	comp = gltf.scene;
	comp.traverse((child) => {
		child.material = compMaterial;
	});
	mac = comp.children.find((child) => child.name === "macBook_BottomPart");
	mac.traverse((child) => {
		child.material = macMaterial;
	});
	const macScreen = comp.children.find((child) => child.name === "macScreen");
	macScreen.material = macScreenMaterial;
	comp.position.set(4, 0, 0);
	scene.add(comp);
});

// FONTS

// AXES HELPER

// OBJECTS

const screenTwoGeometry = new THREE.BoxGeometry(1, 1, 0.1);

const screenTwo = new THREE.Mesh(screenTwoGeometry, screenTwoMaterial);
screenTwo.position.set(4.016, 0.8, -0.21);

screenTwo.scale.set(3.2, 1.81, 1);
scene.add(screenTwo);

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
});

//FULLSCREEN

// CAMERA
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight
);

camera.position.set(0, 1.2, 4);

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -10, 10);
cameraFolder.add(camera.position, "y", -10, 10);
cameraFolder.add(camera.position, "z", -10, 10);
cameraFolder.add(camera.rotation, "x", -10, 10, 0.1);
cameraFolder.add(camera.rotation, "y", -10, 10, 0.1);
cameraFolder.add(camera.rotation, "z", -10, 10, 0.1);
scene.add(camera);

// CONTROLS;
// const controls = new OrbitControls(camera, canvas);

// controls.enableDamping = true;
// controls.enablePan = false;
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

// POST PROCESSING

function checkIntersection() {
	// RAYCASTER

	// update the picking ray with the camera and pointer position
	raycaster.setFromCamera(pointer, camera);

	// calculate objects intersecting the picking ray
	intersects = raycaster.intersectObjects(scene.children, true);

	if (intersects.find((intersect) => intersect.object.name === "continue")) {
		continueText.material = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.5,
			color: 0xffffff,
		});
	} else {
		if (continueText) continueText.material = framesandtextMaterial;
	}

	if (mac) {
		const macIntersects = raycaster.intersectObjects(mac.children);

		if (macIntersects.length > 0) {
			macMaterial.map = null;
			macMaterial.needsUpdate = true;
		} else {
			macMaterial.map = macTexture;
			macMaterial.needsUpdate = true;
		}
	}
}

// ANIMATIONS

const toSecondScene = () => {
	gsap
		.to(camera.position, {
			duration: 1,
			x: 4,
			y: 1.34,
			ease: "power3.inOut",
		})
		.then(() => {
			gsap.to(camera.position, {
				duration: 1,
				z: 3.5,
				ease: "power3.inOut",
			});
		});
};

// EVENTS

// change channel

document.addEventListener("keydown", (event) => {
	if (event.key === "ArrowLeft") {
		gsap
			.to(camera.position, {
				duration: 1,
				z: 4,
				ease: "power3.inOut",
			})
			.then(() => {
				gsap.to(camera.position, {
					duration: 1,
					x: 0,
					y: 1.2,
					ease: "power3.inOut",
				});
			});
	}
});

document.addEventListener("mousedown", (event) => {
	if (intersects.find((intersect) => intersect.object.name === "continue"))
		toSecondScene();
});

// track mouse x y
document.addEventListener("mousemove", (event) => {
	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;

	pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	checkIntersection();
});

// CLOCK
const clock = new THREE.Clock();

// TICK
const tick = () => {
	// TIME
	const elapesedTime = clock.getElapsedTime();

	// ROTATE SCENE
	targetX = mouseX * 0.00003;
	targetY = mouseY * 0.00003;

	if (model) {
		model.rotation.y += 0.05 * (targetX - model.rotation.y);
		model.rotation.x += 0.05 * (targetY - model.rotation.x);
	}
	if (comp) {
		comp.rotation.y += 0.05 * (targetX - comp.rotation.y);
		comp.rotation.x += 0.05 * (targetY - comp.rotation.x);
	}

	// UPDATE OBJECTS

	// UPDATE CONTROLS
	const delta = clock.getDelta();
	// controls.update();

	// RENDER
	renderer.render(scene, camera);
	window.requestAnimationFrame(tick);
};

tick();
