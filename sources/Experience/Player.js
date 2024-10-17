import * as THREE from 'three';
import Experience from './Experience.js';

export default class Player {
    constructor(_options) {
        this.id = _options.id;
        this.keys = _options.keys;
        this.color = _options.color;
        this.position = _options.position;

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.axisManager = this.experience.axis;
        this.axis = this.axisManager.instance;

        this.count = 0;

        this.loadModel();
        this.setupInput();
    }

    loadModel() {
        const modelKey = this.id === 1 ? 'player1Model' : 'player2Model';
        const resourceModel = this.resources.items[modelKey];

        if (!resourceModel) {
            console.error(`Model '${modelKey}' is not loaded.`);
            return;
        }

        this.model = resourceModel

        this.model.scale.set(0.01, 0.01, 0.01);
        this.model.position.copy(this.position);

        if (this.color !== 'red') {
            this.model.children.forEach((child) => {
                child.traverse((m) => {
                    if (m.isMesh) {
                        m.material.color = new THREE.Color(this.color);
                    }
                });
            });
        }

        this.mixer = new THREE.AnimationMixer(this.model);
        const idleAction = this.mixer.clipAction(this.model.animations[0]);
        idleAction.play();
    }

    setupInput() {
        // Access joysticks from AxisManager
        const joystick = this.axis[`joystick${this.id}`];

        // Register buttons correctly
        const buttons = this.keys.map((key) => {
            return this.axis.registerKeys(key[0], key[1], this.id);
        });

        // Create player with correct parameters
        this.instance = this.axis.createPlayer({
            id: this.id,
            joysticks: joystick,
            buttons: buttons,
        });

        // Check if instance is valid
        if (!this.instance) {
            console.error(`Failed to create player instance for player ${this.id}`);
            return;
        }

        // Add event listener for keydown events
        this.instance.addEventListener('keydown', (e) => this.handleInput(e));
    }

    handleInput(event) {
        switch(event.key) {
            case 'a':
                console.log('inside comm');
                this.count++;
                this.model.position.z += 0.2;
                this.experience.countElements[this.id - 1].textContent = this.count
            break;
            default:
                break;
        }
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta / 2000);
        }
        this.model.position.z += delta * 0.01 * 0.2;
    }
}
