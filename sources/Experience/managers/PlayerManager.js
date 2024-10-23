import { Vector3 } from 'three';

import Player from '../Player.js';
import Experience from '../Experience.js';


export default class PlayerManager {
    constructor() {
        this.experience = new Experience();
        this.axis = this.experience.axis.instance;
        this.players = [];
        this.isStarted = false; //To optimize

    }

    isGameStarted(){
        return this.isStarted;
    }

    startGame() {
        this.isStarted = true; // Global start
        console.log("Game has started");
        // You can add any logic here that you want to run when the game starts
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
                    ['r', 'w'],
                ],
                position: new Vector3(0, 0, 0),
                defaultAnimation: 'run',
                playerManager : this
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
                    ['Shift', 'w'],
                ],
                position: new Vector3(0, 0, -3),
                defaultAnimation: 'fast_run',
                playerManager : this

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
