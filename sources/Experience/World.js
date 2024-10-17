import * as THREE from 'three';

import Experience from './Experience.js';
import Player from './Player';

export default class World {
    constructor(_options) {
        this.experience = new Experience();
        this.axis = this.experience.axis;
        this.config = this.experience.config;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;
        this.offsetFactorPosition = 0.01;

        this.vertexSnapping();

        this.resources.on('groupEnd', (_group) => {
            if (_group.name === 'base') {
                this.setDummy();
            }
        });

        this.setPlayers();
    }

    vertexSnapping() {
        // Define the resolution
        const resolution = new THREE.Vector2(320, 240);

        // Replace existing THREE vertex shader to apply snapping to all objects across the scene
        THREE.ShaderChunk.project_vertex = THREE.ShaderChunk.project_vertex.replace(
            'gl_Position = projectionMatrix * mvPosition;',
            `
          // PS1 Vertex Snapping
          vec4 pos = projectionMatrix * mvPosition;

          // Apply vertex snapping
          pos.xyz /= pos.w;
          pos.xy = floor(vec2(${resolution.toArray()}) * pos.xy) / vec2(${resolution.toArray()});
          pos.xyz *= pos.w;
          gl_Position = pos;
          `
        );
    }

    handlePlayerCount(playerId, event) {
        const key = event.key;

        if (key === 'a' || key === 'x') {
            const playerIndex = playerId - 1;
            const players = this.players;

            players[playerIndex].count++;
            this.experience.countElements[playerIndex].textContent = players[playerIndex].count;

            this.playerModels[playerIndex].position.z += 0.2;
        }

        if (!this.playersInRange) return;

        if (key === 's') {
            console.log(`Player${playerId} pressed special button`);
        }
    }

    detectPlayer2OutOfFOV() {
        // Check if player 2 is out of camera FOV
        const frustum = new THREE.Frustum();
        const camera = this.experience.camera.instance;
        const projectionMatrix = camera.projectionMatrix.clone();
        const viewMatrix = camera.matrixWorldInverse.clone();

        frustum.setFromProjectionMatrix(new THREE.Matrix4().multiplyMatrices(projectionMatrix, viewMatrix));

        // Check the position of Player 2's head
        const headOffset = 3; // Adjust this based on your model
        const headPosition = new THREE.Vector3(this.p2.position.x, this.p2.position.y + headOffset, this.p2.position.z);

        if (!frustum.containsPoint(headPosition) && !this.player2OutOfFOV) {
            this.player2OutOfFOV = true; // Set flag to true
            console.log('Player 1 wins! Player 2 is out of view.');
            // You may want to add additional logic here, like resetting the game or ending it.
        } else if (frustum.containsPoint(headPosition) && this.player2OutOfFOV) {
            this.player2OutOfFOV = false; // Reset the flag if Player 2 comes back into view
        }
    }

    detectPlayerRange() {
        // Calculate the distance between p1 and p2
        const distance = this.p1.position.distanceTo(this.p2.position);
        const threshold = 1; // Set your threshold distance here

        if (distance < threshold) {
            this.playersInRange = true;
        } else {
            this.playersInRange = false;
        }
    }

    spawnGroundTile() {
        const playerZ = this.p1.position.z;

        // Check if player has passed the middle of the second tile
        if (playerZ > this.groundTiles[1].position.z + this.tileLength / 2) {
            // Remove the first tile
            const oldTile = this.groundTiles.shift();
            this.scene.remove(oldTile);

            // Create a new tile ahead
            const lastTile = this.groundTiles[this.groundTiles.length - 1];
            const newTilePositionZ = lastTile.position.z + this.tileLength;
            const newTile = new THREE.Mesh(
                new THREE.PlaneGeometry(this.tileLength, 4, 10, 5),
                new THREE.MeshBasicMaterial({
                    color: 'red',
                    wireframe: true,
                })
            );
            newTile.rotation.set(Math.PI * -0.5, 0, Math.PI * 0.5);
            newTile.position.set(0, 0, newTilePositionZ);
            this.scene.add(newTile);
            this.groundTiles.push(newTile);
        }
    }

    setDummy() {
        this.light = new THREE.AmbientLight('#FFFFFF', 1.0);
        this.scene.add(this.light);

        this.p1 = this.resources.items.player1Model;
        this.p1.scale.set(0.01, 0.01, 0.01);
        this.p1.position.set(0, 0, 0);

        this.p1_mixer = new THREE.AnimationMixer(this.p1);
        const p1_idle = this.p1_mixer.clipAction(this.p1.animations[0]);
        p1_idle.play();

        this.p2 = this.resources.items.player2Model;
        this.p2.scale.set(0.01, 0.01, 0.01);
        this.p2.position.set(0, 0, -3);

        this.p2.children.forEach((child) => {
            child.traverse((m) => {
                if (m.isMesh) {
                    m.material.color = new THREE.Color('blue');
                }
            });
        });

        this.p2_mixer = new THREE.AnimationMixer(this.p2);
        const p2_idle = this.p2_mixer.clipAction(this.p2.animations[0]);
        p2_idle.play();

        this.playerModels = [this.p1, this.p2];

        this.groundTiles = [];

        this.tileLength = 20;
        const tileWidth = 4;

        for (let i = 0; i < 3; i++) {
            const floor = new THREE.Mesh(
                new THREE.PlaneGeometry(this.tileLength, tileWidth, 10, 5),
                new THREE.MeshBasicMaterial({
                    color: 'red',
                    wireframe: true,
                })
            );
            floor.rotation.set(Math.PI * -0.5, 0, Math.PI * 0.5);
            // Position the floor tiles along z
            floor.position.set(0, 0, i * this.tileLength - this.tileLength);
            this.scene.add(floor);
            this.groundTiles.push(floor);
        }

        this.scene.add(this.p1, this.p2);
    }

    setPlayers() {
        this.player1 = new Player({
            id: 1,
            joysticks: this.axis.instance.joystick1,
            buttons: [
                this.axis.instance.registerKeys('q', 'a', 1),
                this.axis.instance.registerKeys('d', 'x', 1),
                this.axis.instance.registerKeys('z', 'i', 1),
                this.axis.instance.registerKeys('s', 's', 1),
            ],
        });

        this.player2 = new Player({
            id: 2,
            joysticks: this.axis.instance.joystick2,
            buttons: [
                this.axis.instance.registerKeys('ArrowLeft', 'a', 2),
                this.axis.instance.registerKeys('ArrowRight', 'x', 2),
                this.axis.instance.registerKeys('ArrowUp', 'i', 2),
                this.axis.instance.registerKeys('ArrowDown', 's', 2),
            ],
        });

        this.players = [this.player1, this.player2];

        this.player1.instance.addEventListener('keydown', (e) => {
            this.handlePlayerCount(1, e);
        });

        this.player2.instance.addEventListener('keydown', (e) => {
            this.handlePlayerCount(2, e);
        });
    }

    resize() {}

    update() {
        const delta = this.experience.time.delta;

        if (this.p1_mixer && this.p2_mixer) {
            this.p1_mixer.update(delta / 2000);
            this.p2_mixer.update(delta / 2500);
        }

        if (this.p1 && this.p2) {
            this.detectPlayer2OutOfFOV();
            this.detectPlayerRange();
            this.spawnGroundTile();

            this.p1.position.z += delta * this.offsetFactorPosition * 0.2;
            this.p2.position.z += delta * this.offsetFactorPosition * 0.2;
            this.experience.camera.instance.position.z = this.p1.position.z - 5;
        }
    }
    destroy() {}
}
