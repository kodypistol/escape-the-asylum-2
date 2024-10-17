import { Vector3 } from 'three';

import Player from '../Player.js';
import Experience from '../Experience.js';


export default class PlayerManager {
    constructor() {
        this.experience = new Experience();
        this.axis = this.experience.axis.instance;
        this.players = [];
    }

    setupPlayers() {
        this.players.push(
            new Player({
                id: 1,
                keys: [
                    ['q', 'a'],
                    ['d', 'x'],
                    ['z', 'i'],
                    ['s', 's'],
                ],
                position: new Vector3(0, 0, 0),
                defaultAnimation: 'run',
            })
        );

        this.players.push(
            new Player({
                id: 2,
                keys: [
                    ['ArrowLeft', 'a'],
                    ['ArrowRight', 'x'],
                    ['ArrowUp', 'i'],
                    ['ArrowDown', 's'],
                ],
                position: new Vector3(0, 0, -3),
                defaultAnimation: 'fast_run',
            })
        );
    }

    initializePlayers() {
        this.setupPlayers();
        this.players.forEach((player) => {
            this.experience.scene.add(player.model);
        });
    }

    update(delta) {
        this.players.forEach((player) => {
            player.update(delta);
        });
    }

    getLeadPlayerPosition() {
        // Determine the lead player based on position.z
        return this.players.reduce((lead, player) => {
            return player.model.position.z > lead.model.position.z ? player : lead;
        }, this.players[0]).model.position;
    }
}
