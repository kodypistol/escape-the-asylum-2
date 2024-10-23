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
            this.experience.resources.items['strecherMesh'],
            this.experience.resources.items['chairMesh'],
        ];

        // Store references to the models individually
        this.corridorMesh = this.experience.resources.items['corridorMesh'];
        this.stretcherMesh = this.experience.resources.items['strecherMesh'];
        this.chairMesh = this.experience.resources.items['chairMesh'];
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
            // Clone the selected model
            floor = selectedModel.scene.clone(true);
            // Position the new tile
            floor.position.set(0, 0, positionZ);
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
            { x: 1.25, y: 1, z: 3, width: 4, height: 2, depth: 1.5 },
            { x: -1.25, y: 0.75, z: -5, width: 4, height: 1.5, depth: 2 },
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
            { x: -2.5, y: 1, z: 3.9, width: 4, height: 2, depth: 1.5 },
            { x: 2.5, y: 0.75, z: -4, width: 4, height: 1.5, depth: 2 },
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

        chairMeshClone.userData.colliders = colliders;

        return chairMeshClone;
    }

    update(leadPlayerPosition) {
        const playerZ = leadPlayerPosition.z;

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
        this.checkCollisions(leadPlayerPosition);
    }

    checkCollisions(playerPosition) {
        for (const tile of this.groundTiles) {
            // Check if the tile has colliders
            if (tile.userData.colliders) {
                for (const collider of tile.userData.colliders) {
                    const colliderBox = new THREE.Box3().setFromObject(collider);
                    const playerBox = new THREE.Box3().setFromCenterAndSize(playerPosition, new THREE.Vector3(1, 2, 1));

                    if (colliderBox.intersectsBox(playerBox)) {
                        // console.log('Collision detected with collider!');
                        // Handle collisio
                    }
                }
            }
        }
    }
}
