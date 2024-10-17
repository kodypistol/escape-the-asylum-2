import Player from '../Player';

export default class PlayerManager {
    constructor(axis) {
        this.players = [];
        this.axis = axis;
    }

    addPlayer(id, model, buttons) {
        // Pass the 3D model to the player
        const player = new Player({
            id,
            model,  // Now we pass the correct model here
            buttons
        });
        this.players.push(player);
    }

    getPlayers() {
        return this.players;
    }

    updatePlayers(delta) {
        this.players.forEach(player => {
            player.update(delta);
        });
    }
}
