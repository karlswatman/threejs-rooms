import * as THREE from "three";
import * as CANNON from "cannon-es";

const geometry = new THREE.BoxGeometry(10, 6, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);

const size = 2;
const halfExtents = new CANNON.Vec3(5, size, size);
const boxShape = new CANNON.Box(halfExtents);
const boxBody = new CANNON.Body({ mass: 20, shape: boxShape });

export default { cube, boxBody };
