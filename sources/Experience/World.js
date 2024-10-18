import { AmbientLight } from 'three';

import Experience from './Experience.js';

import ShaderManager from './managers/ShaderManager.js';
import PlayerManager from './managers/PlayerManager.js';
import GroundManager from './managers/GroundManager.js';
import GameLogic from './managers/GameLogic.js';


export default class World {
    constructor(_options) {
        this.experience = new Experience();
        this.config = this.experience.config;
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.shaderManager = new ShaderManager();

        // Move PlayerManager initialization inside the resource load callback
        this.resources.on('groupEnd', (_group) => {
            if (_group.name === 'base') {
                this.groundManager = new GroundManager();
                this.initWorld();
            }
        });
    }

    initWorld() {
        this.scene.add(new AmbientLight('#FFFFFF', 1.0));

        // Instantiate PlayerManager here
        this.playerManager = new PlayerManager();
        this.playerManager.initializePlayers();

        // Initialize GameLogic after PlayerManager is ready
        this.gameLogic = new GameLogic(this.playerManager.players, this.groundManager);

        this.groundManager.initializeGround();
    }

    resize() {
        // Handle resize if necessary
    }

    update() {
        const delta = this.experience.time.delta;

        if (this.playerManager && this.groundManager && this.gameLogic) {
            this.playerManager.update(delta);
            this.groundManager.update(this.playerManager.getLeadPlayerPosition());
            this.gameLogic.update();
            // Update camera position based on leading player
            this.experience.camera.instance.position.z = this.playerManager.getLeadPlayerPosition().z - 5;
        }

    }

    destroy() {
        // Clean up if necessary
    }
}
