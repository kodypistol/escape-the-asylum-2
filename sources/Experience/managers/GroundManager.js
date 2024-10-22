import * as THREE from 'three';
import Experience from '../Experience.js';

export default class GroundManager {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.groundTiles = [];
        this.tileLength = 20;

        // Use an array to store both models
        this.models = [
            this.experience.resources.items['corridorMesh'],
            // this.experience.resources.items['strecherMesh'],
            // this.experience.resources.items['chairMesh'],
        ];

        // Store references to the models individually
        this.corridorMesh = this.experience.resources.items['corridorMesh'];
        this.stretcherMesh = this.experience.resources.items['strecherMesh'];
        this.chairMesh = this.experience.resources.items['chairMesh'];
        this.pizzaMesh = this.experience.resources.items['pizzaMesh'];
    }

    initializeGround() {
        for (let i = 0; i < 5; i++) {
            const floor = this.createTile(i * this.tileLength - this.tileLength);
            this.scene.add(floor);
            this.groundTiles.push(floor);
        }
    }

    createTile(positionZ) {
        // Randomly select a model from the models array
        const randomIndex = Math.floor(Math.random() * this.models.length);
        const selectedModel = this.models[randomIndex];

        let floor;

        if (selectedModel === this.stretcherMesh) {
            // If the selected model is the stretcher mesh, prepare it with colliders
            floor = this.prepareStretcherMesh(positionZ);
        } else if (selectedModel === this.chairMesh) {
            // If the selected model is the chair mesh, prepare it with colliders
            floor = this.prepareChairMesh(positionZ);
        } else {
            // Else prepare the floor mesh
            floor = this.prepareFloorMesh(positionZ);
        }

        return floor;
    }

    prepareStretcherMesh(positionZ) {
        const stretcherMeshClone = this.stretcherMesh.scene.clone(true);
        stretcherMeshClone.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: 1, y: 1, z: 3, width: 3, height: 2, depth: 1 },
            { x: -1, y: 0.75, z: -5, width: 3, height: 0.8, depth: 0.2 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xff0000 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            stretcherMeshClone.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(0, 0.1, -2);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, 8);

        stretcherMeshClone.add(pizza1.mesh, pizza2.mesh);
        stretcherMeshClone.add(pizza1.collider, pizza2.collider);
        colliders.push(pizza1.collider, pizza2.collider);


        stretcherMeshClone.userData.colliders = colliders;

        return stretcherMeshClone;
    }

    prepareChairMesh(positionZ) {
        const chairMeshClone = this.chairMesh.scene.clone(true);
        chairMeshClone.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: -1.5, y: 1, z: 3.9, width: 1, height: 2, depth: 1.5 },
            { x: 1.5, y: 0.75, z: -4, width: 1, height: 1.5, depth: 2 },
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xffff00 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            chairMeshClone.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(1.5, 0.1, 1);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, 8);

        chairMeshClone.add(pizza1.mesh, pizza2.mesh);
        chairMeshClone.add(pizza1.collider, pizza2.collider);
        colliders.push(pizza1.collider, pizza2.collider);

        chairMeshClone.userData.colliders = colliders;

        return chairMeshClone;
    }

    prepareFloorMesh(positionZ) {
        const corridorMesh = this.corridorMesh.scene.clone(true);
        corridorMesh.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: -1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
            { x: 1.5, y: 1, z: -10, width: 1.5, height: 2, depth: 0.2 },
        ];

        for (const obstacle of obstacles) {
            const collider = new THREE.Mesh(
                new THREE.BoxGeometry(obstacle.width, obstacle.height, obstacle.depth),
                new THREE.MeshBasicMaterial({ visible: false, color: 0xffff00 })
            );
            collider.position.set(obstacle.x, obstacle.y, obstacle.z);
            collider.userData.isCollider = true;
            corridorMesh.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(1.5, 0.1, 1);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, -6);

        corridorMesh.add(pizza1.mesh, pizza2.mesh);
        corridorMesh.add(pizza1.collider, pizza2.collider);
        colliders.push(pizza1.collider, pizza2.collider);

        corridorMesh.userData.colliders = colliders;

        return corridorMesh;
    }

    createPizzaWithCollider(x, y, z) {
        const pizza = this.pizzaMesh.scene.clone(true);
        pizza.scale.set(0.2, 0.2, 0.2);
        pizza.position.set(x, y, z);

        const collider = new THREE.Mesh(
            new THREE.BoxGeometry(0.5, 0.5, 0.3),
            new THREE.MeshBasicMaterial({ visible: true, color: 0xff0000 })
        );
        collider.position.set(x, y, z);
        collider.userData.isCollider = true;
        collider.name = 'pizza';

        return { mesh: pizza, collider: collider };
    }

    update(playerManager) {
        const playerZ = playerManager.getLeadPlayerPosition().z;

        if (playerZ > this.groundTiles[1].position.z + this.tileLength / 2) {
            const oldTile = this.groundTiles.shift();
            this.scene.remove(oldTile);

            const lastTile = this.groundTiles[this.groundTiles.length - 1];
            const newTilePositionZ = lastTile.position.z + this.tileLength;
            const newTile = this.createTile(newTilePositionZ);

            this.scene.add(newTile);
            this.groundTiles.push(newTile);
        }

        // Collision detection
        this.checkCollisions(playerManager);
    }

    checkCollisions(playerManager) {
        for (const tile of this.groundTiles) {
            // Check if the tile has colliders
            if (tile.userData.colliders) {
                for (const collider of tile.userData.colliders) {
                    const colliderBox = new THREE.Box3().setFromObject(collider);

                    for (const player of playerManager.players) {
                        const playerPosition = player.model.position.clone();
                        // playerPosition.y = 1;
                        const playerBox = new THREE.Box3().setFromCenterAndSize(playerPosition, new THREE.Vector3(1, 2, 1));
                        if (colliderBox.intersectsBox(playerBox)) {
                            // console.log('Collision detected with collider and player ' + player.id);
                            if (collider.name === 'pizza') {
                                // player.eat();
                                const pizzaMesh = collider.parent;
                                tile.remove(pizzaMesh);
                                console.log(pizzaMesh)

                            } else if (!player.isImmune) {
                                player.collide();
                            }
                        }
                    }
                }
            }
        }
    }
}
