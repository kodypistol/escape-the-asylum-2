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
            pos.xyz /= pos.w;
            pos.xy = floor(vec2(${resolution.toArray()}) * pos.xy) / vec2(${resolution.toArray()});
            pos.xyz *= pos.w;
            gl_Position = pos;
            `
        );
    }

    handlePlayerCount(playerId, event) {
        if (event.key === 'a') {
            const playerIndex = playerId - 1;
            const players = this.players;

            players[playerIndex].count++;
            this.experience.countElements[playerIndex].textContent = players[playerIndex].count;
        }
    }

    setDummy() {
        this.pigeon = this.resources.items.pigeonModel.scene;
        this.pigeonTexture = this.resources.items.pigeonTexture;
        this.pigeonTexture.flipY = false;
        this.pigeonTexture.minFilter = THREE.NearestFilter;
        this.pigeonTexture.magFilter = THREE.NearestFilter;

        this.pigeon.traverse((_child) => {
            if (_child.isMesh) {
                _child.material = new THREE.MeshBasicMaterial({
                    map: this.pigeonTexture,
                });
            }
        });

        this.scene.add(this.pigeon);
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
        if (this.pigeon) {
            this.pigeon.rotation.y += 0.005;
        }
    }
    destroy() {}
}
