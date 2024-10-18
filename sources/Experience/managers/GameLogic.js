import { Frustum, Matrix4, Vector3 } from 'three';

import Experience from '../Experience.js';

export default class GameLogic {
    constructor(players, groundManager) {
        this.players = players;
        this.groundManager = groundManager;
        this.experience = new Experience();
        this.player2OutOfFOV = false;
        this.isPlayersInThreshold = false
    }

    update() {
        this.detectPlayer2OutOfFOV();
        this.detectPlayerProximity();
    }

    detectPlayer2OutOfFOV() {
        const frustum = new Frustum();
        const camera = this.experience.camera.instance;
        const projectionMatrix = camera.projectionMatrix.clone();
        const viewMatrix = camera.matrixWorldInverse.clone();

        frustum.setFromProjectionMatrix(
            new Matrix4().multiplyMatrices(projectionMatrix, viewMatrix)
        );

        const player2 = this.players[1];
        const headOffset = 3;
        const headPosition = new Vector3(
            player2.model.position.x,
            player2.model.position.y + headOffset,
            player2.model.position.z
        );

        if (!frustum.containsPoint(headPosition) && !this.player2OutOfFOV) {
            this.player2OutOfFOV = true;
            console.log('Player 1 wins! Player 2 is out of view.');
            // Additional game-over logic here
        } else if (frustum.containsPoint(headPosition) && this.player2OutOfFOV) {
            this.player2OutOfFOV = false;
        }
    }

    detectPlayerProximity() {
        const player1 = this.players[0];
        const player2 = this.players[1];

        const distance = player1.model.position.distanceTo(player2.model.position);
        const threshold = 1;

        if (distance < threshold && player1.model.position.x === player2.model.position.x) {
            this.isPlayersInThreshold = true
            console.log('Players are within threshold distance!');
        }
    }
}
