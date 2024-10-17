import * as THREE from 'three';
import Experience from '../Experience.js';

export default class GroundManager {
    constructor() {
        this.experience = new Experience();
        this.scene = this.experience.scene;
        this.groundTiles = [];
        this.tileLength = 20;
        this.tileWidth = 4;
    }

    initializeGround() {
        for (let i = 0; i < 3; i++) {
            const floor = this.createTile(i * this.tileLength - this.tileLength);
            this.scene.add(floor);
            this.groundTiles.push(floor);
        }
    }

    createTile(positionZ) {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(this.tileLength, this.tileWidth, 10, 5),
            new THREE.MeshBasicMaterial({
                color: 'red',
                wireframe: true,
            })
        );
        floor.rotation.set(Math.PI * -0.5, 0, Math.PI * 0.5);
        floor.position.set(0, 0, positionZ);
        return floor;
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
    }
}
