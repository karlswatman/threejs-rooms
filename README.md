# Three.js Portfolio

testing the potential of three js for an upcoming project, will possibly make my main portfolio page

[![Netlify Status](https://api.netlify.com/api/v1/badges/82eab7be-292c-4d50-a55b-8166979d3965/deploy-status)](https://app.netlify.com/sites/threejs-rooms/deploys)

# Visuals

<video src='./demo.mov' />

# Installation

```bash
[git clone https://github.com/becomingjohndoe/gimme-gandalf.git](https://github.com/becomingjohndoe/portfolio-v2.git)
```

```bash
npm install
```

# Usage

```bash
npm start
```

# Built With

Three.js, Cannon-es, blender and Vite.js

# Details

The project consists of three seperate rooms around 4m2 in size. A few interactions are possible using Cannon-es physics engine.

The basic idea of the project is to build a set of 3d objects in the real world and in the physics world and linking them together.

Here we can see the position of the object being declared, the shape and body of the physics object, following on to create the real world (Three.js) object with a Mesh, Geometry and Material. these are then added to each subsequent worlds. a few parameters are set allowing the casting of shadows and some physics collision detection.

```javascript
	const position = { x: 0, y: 0, z: 0 };
	position.x = Math.random() * (10 - 6 + 1) + 6;
	position.y = 0.1;
	position.z = Math.random() * (2 - 0 + 1) + 0;
	const shape = new CANNON.Sphere(radius);
	const physicsSpherebody = new CANNON.Body({
		mass: mass,
		shape: shape,
		position: new CANNON.Vec3(position.x, position.y, position.z),
		material: defaultMaterial,
		angularDamping: 0.7,
	});
	physicsSpherebody.allowSleep = true;
	physicsSpherebody.sleepSpeedLimit = 0.5;
	physicsSpherebody.sleepTimeLimit = 0.1;
	pyhsicSphereUpdate.push(physicsSpherebody);
	physicsSpherebody.addEventListener("collide", playHitSound);
  world.addBody(physicsSpherebody);
  
	// create three js sphere
	const sphere = new THREE.Mesh(
		new THREE.SphereBufferGeometry(radius, 16, 16),
		sphereMaterial
	);
	sphere.castShadow = true;
	sphere.receiveShadow = false;
	sphere.name = "sphere";
	sphere.position.set(position.x, position.y, position.z);
	sphereUpdate.push(sphere);
	scene.add(sphere);
```

The objects are then linked together at each animation frame

```javascript
for (let i = 0; i < pyhsicSphereUpdate.length; i++) {
		sphereUpdate[i].position.copy(pyhsicSphereUpdate[i].position);
		sphereUpdate[i].quaternion.copy(pyhsicSphereUpdate[i].quaternion);
	}
```

