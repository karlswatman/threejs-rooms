import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import Stats from "stats.js";

import gsap from "gsap";
import * as dat from "dat.gui";

// DEBUG
const gui = new dat.GUI();
gui.close();

// STATS

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

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
let macIntersects;
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
video.loop = true;
video.muted = true;
// instruction text for first scene tv screen
const instructionsTexture = textureLoader.load("./static/Drawing.jpeg");
instructionsTexture.flipY = false;
instructionsTexture.encoding = THREE.sRGBEncoding;
// baked texture for first scene
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

const hoverboardTexture = new THREE.TextureLoader().load(
	"./static/hoverboard.png"
);

// MATERIALS

//  baked material
const bakedMaterial = new THREE.MeshBasicMaterial({
	map: bakedTexture,
	color: 0xffffff,
});

const screenOneMaterial = new THREE.MeshBasicMaterial({
	map: instructionsTexture,
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

const HatMaterial = new THREE.MeshBasicMaterial({
	color: 0x0,
});

const hoverboardMaterial = new THREE.MeshBasicMaterial({
	map: hoverboardTexture,
});
// MODELS

let model;
let continueText;
let continueTextSize;
let name;
let nameTitle;
let screen;
let batmanHat;
let cowboyHat;
let hoverboard;
let floor;
loader.load("./static/test.glb", (gltf) => {
	model = gltf.scene;
	console.log(model);
	model.traverse((child) => {
		child.material = bakedMaterial;
	});

	floor = model.children.find((child) => child.name === "floor");

	screen = model.children.find((child) => child.name === "screen");
	screen.material = screenOneMaterial;

	name = model.children.find((child) => child.name === "name");
	name.material = framesandtextMaterial;

	nameTitle = model.children.find((child) => child.name === "nameTitle");
	nameTitle.material = framesandtextMaterial;

	continueText = model.children.find((child) => child.name === "continue");
	continueText.material = framesandtextMaterial;

	// batmanHat = model.children.find((child) => child.name === "batmanHat");
	// batmanHat.material = HatMaterial;
	// batmanHat.visible = false;
	// batmanHat.position.x = 4;

	cowboyHat = model.children.find((child) => child.name === "hat01");
	cowboyHat.material = HatMaterial;
	cowboyHat.visible = false;

	hoverboard = model.children.find((child) => child.name === "Hoverboard");
	hoverboard.material = hoverboardMaterial;
	hoverboard.visible = false;

	const frame1 = model.children.find((child) => child.name === "frame1");
	frame1.material = framesandtextMaterial;

	const frame2 = model.children.find((child) => child.name === "frame2");
	frame2.material = framesandtextMaterial;

	const frame3 = model.children.find((child) => child.name === "frame3");
	frame3.material = framesandtextMaterial;

	const frame4 = model.children.find((child) => child.name === "frame4");
	frame4.material = framesandtextMaterial;

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

// PHYSICS
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.8, 0);
const cannonDebugger = new CannonDebugger(scene, world);

// materials
const defaultMaterial = new CANNON.Material("default");

const defaultContactMaterial = new CANNON.ContactMaterial(
	defaultMaterial,
	defaultMaterial,
	{
		friction: 0.5,
		restitution: 0.6,
	}
);

world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// continue text
const continueTextShape = new CANNON.Box(new CANNON.Vec3(0.6, 0.03, 0.1));
const continueTextBody = new CANNON.Body({
	mass: 1,
	position: new CANNON.Vec3(0.4, 0.5, 2.9),
	shape: continueTextShape,
});
continueTextBody.mass = 0;
continueTextBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 1);
continueTextBody.allowSleep = false;

world.addBody(continueTextBody);

// name text
const nameTextShape = new CANNON.Box(new CANNON.Vec3(0.7, 0.03, 0.1));
const nameTextBody = new CANNON.Body({
	mass: 1,
	position: new CANNON.Vec3(0.52, 1.1, 2.7),
	shape: nameTextShape,
});
nameTextBody.mass = 0;
nameTextBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 1);
nameTextBody.allowSleep = false;

world.addBody(nameTextBody);

// name title text
const nameTitleShape = new CANNON.Box(new CANNON.Vec3(0.9, 0.03, 0.1));
const nameTitleBody = new CANNON.Body({
	mass: 1,
	position: new CANNON.Vec3(0.73, 0.9, 2.8),
	shape: nameTitleShape,
});
nameTitleBody.mass = 0;
nameTitleBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 1);
// nameTitleBody.allowSleep = false;

world.addBody(nameTitleBody);

// floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
	mass: 0,
	shape: floorShape,
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
world.addBody(floorBody);

// desk
const deskShape = new CANNON.Box(new CANNON.Vec3(1, 0.1, 0.52));

const deskBody = new CANNON.Body({
	position: new CANNON.Vec3(4, 0.9, 2.66),
	mass: 0,
	shape: deskShape,
});
// deskBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
world.addBody(deskBody);

// OBJECTS

const createPhysicsCube = (x, y, z, width, height, depth, mass, name) => {
	const shape = new CANNON.Box(
		new CANNON.Vec3(width / 2, height / 2, depth / 2)
	);
	const physicsCubebody = new CANNON.Body({
		mass: mass,
		shape: shape,
		position: new CANNON.Vec3(x, y, z),
	});

	physicsCubebody.allowSleep = true;
	physicsCubebody.sleepSpeedLimit = 1.0;
	physicsCubebody.sleepTimeLimit = 0.1;

	physicsCubebody.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), -2);
	world.addBody(physicsCubebody);
	// create three js cube
	const cube = new THREE.Mesh(
		new THREE.BoxBufferGeometry(width, height, depth),
		new THREE.MeshNormalMaterial({})
	);
	cube.name = name;
	cube.position.set(x, y, z);
	scene.add(cube);
	return { physicsCubebody, cube };
};

const cubeData = [];

const physicsCube1 = createPhysicsCube(4.05, 1, 3, 0.1, 0.1, 0.1, 1, "cube1");
const physicsCube2 = createPhysicsCube(4.1, 1, 3, 0.1, 0.1, 0.1, 1, "cube2");
const physicsCube3 = createPhysicsCube(4.15, 1, 3, 0.1, 0.1, 0.1, 1, "cube3");
const physicsCube4 = createPhysicsCube(
	4.075,
	1.1,
	3,
	0.1,
	0.1,
	0.1,
	1,
	"cube4"
);
const physicsCube5 = createPhysicsCube(
	4.125,
	1.1,
	3,
	0.1,
	0.1,
	0.1,
	1,
	"cube5"
);
const physicsCube6 = createPhysicsCube(4.1, 1.2, 3, 0.1, 0.1, 0.1, 1, "cube6");
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

camera.position.set(0, 1.6, 4);
camera.rotation.x = -0.4;

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "x", -10, 10);
cameraFolder.add(camera.position, "y", -10, 10);
cameraFolder.add(camera.position, "z", -10, 10);
cameraFolder.add(camera.rotation, "x", -10, 10, 0.1);
cameraFolder.add(camera.rotation, "y", -10, 10, 0.1);
cameraFolder.add(camera.rotation, "z", -10, 10, 0.1);
scene.add(camera);

// CONTROLS;
const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
controls.target.set(0, 0, 0);

// RENDERER
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;

// POST PROCESSING
// RAYCASTER
// update the picking ray with the camera and pointer position

function checkIntersection() {
	raycaster.setFromCamera(pointer, camera);

	// calculate objects intersecting the picking ray
	intersects = raycaster.intersectObjects(scene.children, true);

	if (intersects[0].object.name === "continue") {
		continueText.material = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.5,
			color: 0xffffff,
		});
	} else {
		if (continueText) continueText.material = framesandtextMaterial;
	}

	if (mac) {
		macIntersects = raycaster.intersectObjects(mac.children);
		if (macIntersects.length > 0) {
			macMaterial.transparent = true;
			macMaterial.opacity = 0.8;
			macMaterial.needsUpdate = true;
		} else {
			macMaterial.transparent = false;
			macMaterial.needsUpdate = true;
		}
	}
}

// ANIMATIONS

const toSecondScene = () => {
	gsap
		.to(camera.position, {
			delay: 3,
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

const backToFirstScene = () => {
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
				y: 1.6,
				ease: "power3.inOut",
			});
		});
};

// EVENTS

// change channel
let tvOn = false;
document.addEventListener("keydown", (event) => {
	if (event.key === "ArrowLeft") {
		backToFirstScene();
	}
	if (event.key === "Enter") {
		if (tvOn) {
			screen.material.map = instructionsTexture;
			video.pause();
			tvOn = false;
		} else {
			screen.material.map = videoTexture;
			video.play();
			tvOn = true;
		}
	}
});

// turn on mass for text physics on first scene

document.addEventListener("mousedown", (event) => {
	// title text physics
	if (intersects.find((intersect) => intersect.object.name === "continue")) {
		continueTextBody.mass = 1;
		continueTextBody.updateMassProperties();
		nameTextBody.mass = 1;
		nameTextBody.updateMassProperties();
		nameTitleBody.mass = 1;
		nameTitleBody.updateMassProperties();
		toSecondScene();
	}
	console.log(intersects);
	// change hat
	if (intersects.find((intersect) => intersect.object.name === "poster2")) {
		batmanHat.visible = true;
		cowboyHat.visible = false;
		hoverboard.visible = false;
	}
	if (intersects.find((intersect) => intersect.object.name === "poster3")) {
		cowboyHat.visible = true;
		batmanHat.visible = false;
		hoverboard.visible = false;
	}
	if (intersects.find((intersect) => intersect.object.name === "poster4")) {
		hoverboard.visible = true;
		cowboyHat.visible = false;
		batmanHat.visible = false;
	}
	if (intersects.find((intersect) => intersect.object.name === "cube1")) {
		physicsCube1.physicsCubebody.applyForce(
			new THREE.Vector3(0, 1.5, 0),
			physicsCube1.physicsCubebody.position
		);
	}
	if (intersects.find((intersect) => intersect.object.name === "cube2")) {
		physicsCube2.physicsCubebody.applyForce(
			new THREE.Vector3(0, 1.5, 0),
			physicsCube2.physicsCubebody.position
		);
	}
	if (intersects.find((intersect) => intersect.object.name === "cube3")) {
		physicsCube3.physicsCubebody.applyForce(
			new THREE.Vector3(0, 1.5, 0),
			physicsCube3.physicsCubebody.position
		);
	}
	if (intersects.find((intersect) => intersect.object.name === "cube4")) {
		physicsCube4.physicsCubebody.applyForce(
			new THREE.Vector3(0, 1.5, 0),
			physicsCube4.physicsCubebody.position
		);
	}
	if (intersects.find((intersect) => intersect.object.name === "cube5")) {
		physicsCube5.physicsCubebody.applyForce(
			new THREE.Vector3(0, 1.5, 0),
			physicsCube5.physicsCubebody.position
		);
	}
	if (intersects.find((intersect) => intersect.object.name === "cube6")) {
		physicsCube6.physicsCubebody.applyForce(
			new THREE.Vector3(0, 2, 0),
			physicsCube6.physicsCubebody.position
		);
	}
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
let oldElapsed = 0;
// TICK
const tick = () => {
	stats.begin();
	// TIME
	const elapsedTime = clock.getElapsedTime();
	const deltaTime = elapsedTime - oldElapsed;
	oldElapsed = elapsedTime;
	// ROTATE SCENE
	// targetX = mouseX * 0.00003;
	// targetY = mouseY * 0.00003;

	// if (model) {
	// 	model.rotation.y += 0.05 * (targetX - model.rotation.y);
	// 	model.rotation.x += 0.05 * (targetY - model.rotation.x);
	// }
	// if (comp) {
	// 	comp.rotation.y += 0.05 * (targetX - comp.rotation.y);
	// 	comp.rotation.x += 0.05 * (targetY - comp.rotation.x);
	// }

	// UPDATE OBJECTS

	// UPDATE PHYSICS
	world.step(1 / 60, deltaTime, 3);
	cannonDebugger.update();
	// update model physics
	if (model) {
		continueText.position.copy(continueTextBody.position);
		continueText.quaternion.copy(continueTextBody.quaternion);

		name.position.copy(nameTextBody.position);
		name.quaternion.copy(nameTextBody.quaternion);

		nameTitle.position.copy(nameTitleBody.position);
		nameTitle.quaternion.copy(nameTitleBody.quaternion);
	}

	// update objects not loaded from a GLTF model
	physicsCube1.cube.position.copy(physicsCube1.physicsCubebody.position);
	physicsCube2.cube.position.copy(physicsCube2.physicsCubebody.position);
	physicsCube3.cube.position.copy(physicsCube3.physicsCubebody.position);
	physicsCube4.cube.position.copy(physicsCube4.physicsCubebody.position);
	physicsCube5.cube.position.copy(physicsCube5.physicsCubebody.position);
	physicsCube6.cube.position.copy(physicsCube6.physicsCubebody.position);

	physicsCube1.cube.quaternion.copy(physicsCube1.physicsCubebody.quaternion);
	physicsCube2.cube.quaternion.copy(physicsCube2.physicsCubebody.quaternion);
	physicsCube3.cube.quaternion.copy(physicsCube3.physicsCubebody.quaternion);
	physicsCube4.cube.quaternion.copy(physicsCube4.physicsCubebody.quaternion);
	physicsCube5.cube.quaternion.copy(physicsCube5.physicsCubebody.quaternion);
	physicsCube6.cube.quaternion.copy(physicsCube6.physicsCubebody.quaternion);

	// UPDATE CONTROLS
	const delta = clock.getDelta();
	controls.update();

	// RENDER
	renderer.render(scene, camera);
	stats.end();
	window.requestAnimationFrame(tick);
};

tick();
