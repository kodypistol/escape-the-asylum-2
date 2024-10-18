import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';

import Experience from './Experience.js';

import AnimationManager from './managers/AnimationManager.js';


export default class Player {
    constructor(_options) {
        this.id = _options.id;
        this.keys = _options.keys;
        this.position = _options.position;
        this.defaultAnimation = _options.defaultAnimation;

        this.experience = new Experience();
        this.resources = this.experience.resources;
        this.axisManager = this.experience.axis;
        this.axis = this.axisManager.instance;

        this.count = 0;

        this.loadModel();
        this.setupInput();
    }

    loadModel() {
        const modelKey = 'playerRig';
        const resourceModel = this.resources.items[modelKey];

        if (!resourceModel) {
            console.error(`Model '${modelKey}' is not loaded.`);
            return;
        }

        this.model = SkeletonUtils.clone(resourceModel.scene)

        // Apply transformations
        this.model.position.copy(this.position);

        // Initialize the AnimationManager
        this.animations = resourceModel.animations;
        this.animationManager = new AnimationManager(this.model, this.animations);

        // Play the default animation
        this.animationManager.playAnimation(this.defaultAnimation);
    }

    setupInput() {
        // Access joysticks from AxisManager
        const buttons = this.keys.map((key) => {
            return this.axis.registerKeys(key[0], key[1], this.id);
        });

        // Create player with correct parameters
        this.instance = this.axis.createPlayer({
            id: this.id,
            buttons: buttons,
        });

        // Check if instance is valid
        if (!this.instance) {
            console.error(`Failed to create player instance for player ${this.id}`);
            return;
        }

        // Add event listener for keydown events
        this.instance.addEventListener('keydown', (e) => this.handleInput(e));
        this.axis[`joystick${this.id}`].addEventListener("joystick:quickmove",(e) => this.handleJoystickQuickmoveHandler(e));

    }

    handleJoystickQuickmoveHandler(event) {
        if (event.direction === "left") {
            console.log('left');
        }
        if (event.direction === "right") {
            console.log('right');
        }
        if (event.direction === "up") {
            console.log('up');
        }
        if (event.direction === "down") {
            console.log('down');
        }
    }

    handleInput(event) {
        switch (event.key) {
            case 'a':
                this.count++;
                this.model.position.z += 0.2;
                this.experience.countElements[this.id - 1].textContent = this.count;
                break;

            case 'x':
                this.animationManager.playAnimation('run_jump')
                break;

            case 'i':
                this.animationManager.playAnimation('run_slide')
                break;

            case 's':
                this.animationManager.playAnimation('dodge_right')
                break;

            case 'w':
                if (!this.experience.world.gameLogic.isPlayersInThreshold) {
                    return
                }

                console.log(`Player ${this.id} won!`);
                break;
            default:
                break;
        }
    }

    update(delta) {
        // Update the animation manager
        if (this.animationManager) {
            this.animationManager.update(delta / 2000); // Convert milliseconds to seconds
        }

        this.model.position.z += delta * 0.01 * 0.2;
    }
}
