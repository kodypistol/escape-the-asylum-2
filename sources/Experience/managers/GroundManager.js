import * as THREE from 'three';
import Experience from '../Experience.js';
import AudioManager from './AudioManager.js';
export default class GroundManager {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.groundTiles = [];
        this.tileLength = 20;
        this.nbTilesGenerated = 0;
        this.changeBiomEach = 10;

        this.AudioManager = new AudioManager();

        // Use an array to store both models
        this.models = [
            // this.experience.resources.items['corridorMesh'],
            // this.experience.resources.items['strecherMesh'],
            // this.experience.resources.items['chairMesh'],
            this.experience.resources.items['slideMesh'],
        ];

        // Store references to the models individually
        this.corridorMesh = this.experience.resources.items['corridorMesh'];
        this.stretcherMesh = this.experience.resources.items['strecherMesh'];
        this.chairMesh = this.experience.resources.items['chairMesh'];
        this.pizzaMesh = this.experience.resources.items['pizzaMesh'];
        this.slideMesh = this.experience.resources.items['slideMesh'];
        this.slideMeshOrange = this.experience.resources.items['slideMeshOrange'];
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

        switch (selectedModel) {
            case this.stretcherMesh:
                floor = this.prepareStretcherMesh(positionZ);
                break;
            case this.chairMesh:
                floor = this.prepareChairMesh(positionZ);
            case this.slideMesh:
                floor = this.prepareSlideMesh(positionZ);
                break;
            default:
                floor = this.prepareFloorMesh(positionZ);
                break;
        }

        this.nbTilesGenerated++;

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

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        stretcherMeshClone.add(pizza1Mesh, pizza2Mesh);
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

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        chairMeshClone.add(pizza1Mesh, pizza2Mesh);
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

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        corridorMesh.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        corridorMesh.userData.colliders = colliders;

        return corridorMesh;
    }

    prepareSlideMesh(positionZ) {
        let slideMesh;
        if (this.nbTilesGenerated > this.changeBiomEach) {
            slideMesh = this.slideMeshOrange.scene.clone(true);
        } else if (this.nbTilesGenerated > this.changeBiomEach) {
            slideMesh = this.slideMesh.scene.clone(true);
        } else {
            slideMesh = this.slideMesh.scene.clone(true);
        }
        slideMesh.position.set(0, 0, positionZ);

        // Array to store colliders
        const colliders = [];

        // Define obstacle positions and dimensions
        const obstacles = [
            { x: 1.5, y: 0.5, z: -7, width: 3, height: 0.5, depth: 0.3 },
            { x: -1.5, y: 1.8, z: -1, width: 3, height: 1, depth: 0.5 },
            { x: 1.5, y: 0.75, z: 5.5, width: 1, height: 1.5, depth: 2 },
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
            slideMesh.add(collider);
            colliders.push(collider);
        }

        // Create pizzas with colliders
        let pizza1 = this.createPizzaWithCollider(1.5, 0.1, 1);
        let pizza2 = this.createPizzaWithCollider(-1.5, 0.1, -6);

        let pizza1Mesh = pizza1.mesh;
        let pizza2Mesh = pizza2.mesh;

        pizza1Mesh.add(pizza1.collider);
        pizza2Mesh.add(pizza2.collider);

        slideMesh.add(pizza1Mesh, pizza2Mesh);
        colliders.push(pizza1.collider, pizza2.collider);

        slideMesh.userData.colliders = colliders;

        return slideMesh;
    }

    createPizzaWithCollider(x, y, z) {
        const pizza = this.pizzaMesh.scene.clone(true);
        pizza.scale.set(0.2, 0.2, 0.2);
        pizza.position.set(x, y, z);

        const collider = new THREE.Mesh(
            new THREE.BoxGeometry(1.5, 1.5, 1.3),
            new THREE.MeshBasicMaterial({ visible: false, color: 0xff0000 })
        );
        collider.position.set(0, 0, 0);
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
                                player.eat();
                                const pizzaMesh = collider.parent;
                                this.AudioManager.playEating();
                                tile.remove(pizzaMesh);
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
