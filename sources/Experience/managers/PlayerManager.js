import Player from '../Player.js';
import Experience from '../Experience.js';
import { Vector3 } from 'three';

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
                color: 'red',
                position: new Vector3(0, 0, 0),
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
                color: 'blue',
                position: new Vector3(0, 0, -3),
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
