import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import Stats from "stats.js";

import gsap from "gsap";
import * as dat from "dat.gui";
import { MeshBasicMaterial } from "three";

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
const macInstructionsTexture = textureLoader.load("./static/macAccess.jpeg");
macInstructionsTexture.flipY = false;
macInstructionsTexture.encoding = THREE.sRGBEncoding;
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
// macScreenTexture.format = THREE.RGBAFormat;
macScreenTexture.flipY = false;

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
	color: 0x08beff,
});
const screenTwoColor = {
	color: 0xffffff,
};
gui.addColor(screenTwoColor, "color").onChange((color) => {
	screenTwoMaterial.color = new THREE.Color(color);
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
	side: THREE.DoubleSide,
});

const macMaterial = new THREE.MeshBasicMaterial({
	map: macTexture,
});

const macScreenMaterial = new THREE.MeshStandardMaterial({
	map: macScreenTexture,
	emissive: 0xffffff,
	emissiveMap: macScreenTexture,
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

	// hoverboard = model.children.find((child) => child.name === "Hoverboard");
	// hoverboard.material = hoverboardMaterial;
	// hoverboard.visible = false;
	// hoverboard.position.x = 10;

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
let lamp;
let light;
let backButton;
let secondContinue;
let macScreen;
let leaveButton;
loader.load("./static/comp.glb", (gltf) => {
	comp = gltf.scene;
	console.log(comp);
	comp.traverse((child) => {
		child.material = compMaterial;
		child.castShadow = true;
		child.receiveShadow = true;
	});
	leaveButton = comp.children.find((child) => child.name === "leaveButton");
	leaveButton.material = screenTwoMaterial;
	mac = comp.children.find((child) => child.name === "macBook_BottomPart");
	mac.material = macMaterial;
	const backWall = comp.children.find((child) => child.name === "backWall");
	backWall.material = screenTwoMaterial;
	lamp = comp.children.find((child) => child.name === "lamp");

	light = comp.children.find((child) => child.name === "Light");
	console.log(light);
	light.children[0].shadow.camera.near = 0.2;
	light.children[0].shadow.camera.far = 1;
	light.children[0].shadow.bias = 0.0001;
	light.children[0].castShadow = true;
	light.children[0].angle = 0.76;
	light.children[0].distance = 10;
	light.children[0].intensity = 10;
	light.children[0].penumbra = 0.07;
	const spotLightFolder = gui.addFolder("Spot Light");
	const desk = comp.children.find((child) => child.name === "desk");
	desk.material = new THREE.MeshStandardMaterial({
		map: compTexture,
	});
	desk.receiveShadow = true;
	desk.castShadow = true;
	secondContinue = comp.children.find(
		(child) => child.name === "secondContinue"
	);
	backButton = comp.children.find((child) => child.name === "backButton");
	macScreen = comp.children.find((child) => child.name === "macScreen");
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
const defaultMaterial = new CANNON.Material("plastic");

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
	position: new CANNON.Vec3(4, 0.88, 2.66),
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

	physicsCubebody.quaternion.setFromAxisAngle(
		new CANNON.Vec3(0, 1, 0),
		Math.PI / 4
	);
	world.addBody(physicsCubebody);
	// create three js cube
	const cube = new THREE.Mesh(
		new THREE.BoxBufferGeometry(width, height, depth),
		new THREE.MeshStandardMaterial({ color: 0x08beff })
	);
	cube.castShadow = true;
	cube.receiveShadow = false;
	cube.name = name;
	cube.position.set(x, y, z);
	scene.add(cube);
	return { physicsCubebody, cube };
};

const cubeData = [
	[4.05, 1, 3],
	[4.1, 1, 3],
	[4.15, 1, 3],
];

const physicsCube1 = createPhysicsCube(4.5, 1, 2.8, 0.1, 0.1, 0.1, 1, "cube1");
console.log(physicsCube1);
const physicsCube2 = createPhysicsCube(4.6, 1, 2.8, 0.1, 0.1, 0.1, 1, "cube2");
const physicsCube3 = createPhysicsCube(4.7, 1, 2.8, 0.1, 0.1, 0.1, 1, "cube3");
const physicsCube4 = createPhysicsCube(
	4.55,
	1.1,
	2.8,
	0.1,
	0.1,
	0.1,
	1,
	"cube4"
);
const physicsCube5 = createPhysicsCube(
	4.65,
	1.1,
	2.8,
	0.1,
	0.1,
	0.1,
	1,
	"cube5"
);
const physicsCube6 = createPhysicsCube(
	4.6,
	1.2,
	2.8,
	0.1,
	0.1,
	0.1,
	1,
	"cube6"
);
// LIGHT

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

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
camera.focus = 0.2;
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

controls.minPolarAngle = Math.PI / 3;
controls.maxPolarAngle = Math.PI / 2.3;

controls.maxAzimuthAngle = Math.PI / 7.5;
controls.minAzimuthAngle = -Math.PI / 7.5;

controls.maxDistance = 4.3;
controls.minDistance = 3.4;
controls.zoomSpeed = 0.1;

controls.rotateSpeed = 0.1;
// RENDERER
const renderer = new THREE.WebGLRenderer({
	canvas,
	antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// POST PROCESSING
// RAYCASTER
// update the picking ray with the camera and pointer position

function checkIntersection() {
	raycaster.setFromCamera(pointer, camera);

	// calculate objects intersecting the picking ray
	intersects = raycaster.intersectObjects(scene.children, true);

	if (intersects.length > 0) {
		const name = intersects[0].object.name;
		const selectedMaterial = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.5,
			color: 0xffffff,
			side: THREE.DoubleSide,
		});

		const lampMaterial = new THREE.MeshStandardMaterial({
			side: THREE.DoubleSide,
			color: 0xffffff,
		});

		continueText.material =
			name === "continue" ? selectedMaterial : framesandtextMaterial;
		mac.material = name === "macBook_BottomPart" ? selectedMaterial : macMaterial;
		lamp.material = name === "lamp" ? selectedMaterial : lampMaterial;
		backButton.material = name === "backButton" ? selectedMaterial : compMaterial;
		secondContinue.material =
			name === "secondContinue" ? selectedMaterial : compMaterial;
	}
}

// ANIMATIONS

const toSecondScene = () => {
	gsap.to(controls.target, {
		duration: 2,

		x: 4,
		y: 0,
		z: 0,
	});
	gsap
		.to(camera.position, {
			duration: 2,
			x: 4,
			y: 1.6,
			z: 4,
			ease: "power3.inOut",
		})
		.then(() => {
			video.src = "./macScreen.mov";
			video.play();
			controls.minDistance = 3.4;
		});
};

const backToFirstScene = () => {
	video.src = "./load.mp4";
	video.play();
	gsap.to(controls.target, {
		duration: 1,
		x: 0,
		y: 0,
		z: 0,
	});

	gsap.to(camera.position, {
		duration: 1,
		x: 0,
		y: 1.6,
		z: 4,
		ease: "power3.inOut",
	});
};
const zoomToMac = () => {
	gsap.to(camera.position, {
		duration: 3,
		x: 3.7,
		y: 1.3,
		z: 2.9,
		ease: "power3.inOut",
	});
	gsap
		.to(controls.target, {
			duration: 3,
			x: 3.54,
			y: 1,
			z: 2,
			ease: "power3.inOut",
		})
		.then(() => {
			macScreen.material.map = macInstructionsTexture;
			macScreen.material.emissiveMap = macInstructionsTexture;
			macScreen.material.needsUpdate = true;
		});
};

// EVENTS

// change channel
let tvOn = false;
let mouseMoving = false;
let mouseDown = false;
let mouseTimeout;
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
			video.src = "./load.mp4";
			video.play();
			tvOn = true;
		}
	}
});

// turn on mass for text physics on first scene
document.addEventListener("mousedown", () => {
	mouseDown = true;
});
document.addEventListener("mouseup", (event) => {
	if (intersects.length > 0 && !mouseMoving) {
		// object clicked on
		const name = intersects[0].object.name;
		// title text physics
		if (name === "leaveButton") {
			toSecondScene();
			macScreen.material.map = macScreenTexture;
			macScreen.material.emissiveMap = macScreenTexture;
			macScreen.material.needsUpdate = true;
		}
		if (name === "continue") {
			continueTextBody.mass = 1;
			continueTextBody.updateMassProperties();
			nameTextBody.mass = 1;
			nameTextBody.updateMassProperties();
			nameTitleBody.mass = 1;
			nameTitleBody.updateMassProperties();
			toSecondScene();
		}
		if (name === "backButton") {
			backToFirstScene();
		}
		if (name === "lamp") {
			light.children[0].visible = !light.children[0].visible;
		}
		if (name === "macBook_BottomPart") {
			controls.minDistance = 0;
			zoomToMac();
		}
		if (name === "macScreen") {
			window.open("https://karl-swatman.netlify.app/", "_blank");
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
		// cube interactions
		const force = new THREE.Vector3(0, 0.1, 0);
		if (/[cube]/g.test(name)) {
			switch (name) {
				case "cube1":
					physicsCube1.physicsCubebody.applyLocalForce(
						force,
						physicsCube1.physicsCubebody.position
					);
					physicsCube1.physicsCubebody.velocity.y = 2;
					// physicsCube1.physicsCubebody.velocity.x = 1;
					break;
				case "cube2":
					physicsCube2.physicsCubebody.applyLocalForce(
						force,
						physicsCube2.physicsCubebody.position
					);
					physicsCube2.physicsCubebody.velocity.y = 2;
					break;
				case "cube3":
					physicsCube3.physicsCubebody.applyLocalForce(
						force,
						physicsCube3.physicsCubebody.position
					);
					physicsCube3.physicsCubebody.velocity.y = 2;
					break;
				case "cube4":
					physicsCube4.physicsCubebody.applyLocalForce(
						force,
						physicsCube4.physicsCubebody.position
					);
					physicsCube4.physicsCubebody.velocity.y = 2;
					break;
				case "cube5":
					physicsCube5.physicsCubebody.applyLocalForce(
						force,
						physicsCube5.physicsCubebody.position
					);
					physicsCube5.physicsCubebody.velocity.y = 2;
					break;
				case "cube6":
					physicsCube6.physicsCubebody.applyLocalForce(
						force,
						physicsCube6.physicsCubebody.position
					);
					physicsCube6.physicsCubebody.velocity.y = 2;
					break;
				default:
					break;
			}
		}
	}
});

// track mouse x y
document.addEventListener("mousemove", (event) => {
	if (mouseDown) {
		mouseMoving = true;

		clearTimeout(mouseTimeout);
		mouseTimeout = setTimeout(() => {
			mouseMoving = false;
			mouseDown = false;
		}, 500);
	}
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
	// light.target.position.set(0, -20, 0);
	// lightHelper.parent.updateMatrixWorld();
	// lightHelper.update();
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
	// cannonDebugger.update();
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
