import * as THREE from 'three'
import Experience from './Experience.js'
import Player from "./Player";

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.axis = this.experience.axis
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.setDummy()
            }
        })

        this.setPlayers()
    }

    setDummy()
    {
        this.resources.items.lennaTexture.encoding = THREE.sRGBEncoding
        
        const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({ map: this.resources.items.lennaTexture })
        )
        this.scene.add(cube)
    }

    handlePlayerCount(playerId, event) {
        if (event.key === "a") {
            const playerIndex = playerId - 1
            const players = this.players

            players[playerIndex].count++
            this.experience.countElements[playerIndex].textContent = players[playerIndex].count
        }
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
            ]
        })

        this.player2 = new Player({
            id: 2,
            joysticks: this.axis.instance.joystick2,
            buttons: [
                this.axis.instance.registerKeys('ArrowLeft', 'a', 2),
                this.axis.instance.registerKeys('ArrowRight', 'x', 2),
                this.axis.instance.registerKeys('ArrowUp', 'i', 2),
                this.axis.instance.registerKeys('ArrowDown', 's', 2),
            ]
        });

        this.players = [this.player1, this.player2]

        this.player1.instance.addEventListener('keydown', (e) => {
            this.handlePlayerCount(1, e)
        })

        this.player2.instance.addEventListener('keydown', (e) => {
            this.handlePlayerCount(2, e)
        })
    }

    resize()
    {
    }

    update()
    {
    }

    destroy()
    {
    }
}