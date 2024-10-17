import Experience from './Experience.js';

import SceneManager from './managers/SceneManager';
import PlayerManager from './managers/PlayerManager';
import ShaderManager from './managers/ShaderManager';
import { Color } from 'three';

export default class World {
    constructor(_options) {
        this.experience = new Experience();
        this.axis = this.experience.axis
        this.scene = this.experience.scene;
        this.resources = this.experience.resources;

        this.shaderManager = new ShaderManager();
        this.sceneManager = new SceneManager(this.scene, this.resources);
        this.playerManager = new PlayerManager(this.experience.axis.instance);

        this.resources.on('groupEnd', (_group) => {
            if (_group.name === 'base') {
                this.setDummy();
            }
        });
    }

    setDummy() {
        const player1Model = this.resources.items.player1Model;
        player1Model.scale.set(0.01, 0.01, 0.01);
        player1Model.position.set(0, 0, 0);
        this.sceneManager.addModel(player1Model);

        const player2Model = this.resources.items.player2Model;
        player2Model.scale.set(0.01, 0.01, 0.01);
        player2Model.position.set(0, 0, -3);
        player2Model.children.forEach((c) => {
            c.traverse((t) => {
                if (t.isMesh) {
                    t.material.color = new Color('blue')
                }
            })
        })
        this.sceneManager.addModel(player2Model);

        // Pass the models instead of Axis API instances
        this.playerManager.addPlayer(1, player1Model, this.getButtonsForPlayer1());
        this.playerManager.addPlayer(2, player2Model, this.getButtonsForPlayer2());

        // Retrieve players from PlayerManager
        this.players = this.playerManager.getPlayers();
    }

    getButtonsForPlayer1() {
        if (!this.axis.instance) {
            console.error('Axis instance not defined');
            return [];
        }

        return [
            this.axis.instance.registerKeys('q', 'a', 1),
            this.axis.instance.registerKeys('d', 'x', 1),
            this.axis.instance.registerKeys('z', 'i', 1),
            this.axis.instance.registerKeys('s', 's', 1)
        ];
    }

    getButtonsForPlayer2() {
        if (!this.axis.instance) {
            console.error('Axis instance not defined');
            return [];
        }

        return [
            this.axis.instance.registerKeys('q', 'a', 2),
            this.axis.instance.registerKeys('d', 'x', 2),
            this.axis.instance.registerKeys('z', 'i', 2),
            this.axis.instance.registerKeys('s', 's', 2)
        ];
    }

    update() {
        const delta = this.experience.time.delta;

        // Update each player (and their animations)
        if (this.players) {
            this.players.forEach(player => {
                player.update(delta);
            });
        }
    }
}
