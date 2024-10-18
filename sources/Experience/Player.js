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
        this.currentColumn = 1; // 0: gauche, 1: centre, 2: droite
        this.columnWidth = 1.5; // Largeur de chaque colonne
        this.players = this.experience.world.playerManager.players;
        this.speed = 0; // Current speed
        this.targetSpeed = 0; // Speed we're interpolating to
        this.maxSpeed = 8; // Maximum speed
        this.minSpeed = 4; // Minimum speed
        this.acceleration = 0.3; // Increase per button press
        this.deceleration = 1; // Decrease per second when not pressing
        this.timeSinceLastPress = 0;
        this.buttonPressInterval = 0.2; // Seconds

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
        this.animationManager = new AnimationManager(this.model, this.animations, this);

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
            this.moveRight();
        }
        if (event.direction === "right") {
            console.log('right');
            this.moveLeft();
        }
        if (event.direction === "up") {
            console.log('up');
        }
        if (event.direction === "down") {
            console.log('down');
        }
    }

    handleInput(event) {
        this.player1 = this.players[0];
        this.player2 = this.players[1];
        const distance = this.player1.model.position.distanceTo(this.player2.model.position);
        const threshold = 1;

        switch (event.key) {
            case 'a':
                this.count++;
                this.experience.countElements[this.id - 1].textContent = this.count;

                this.targetSpeed = Math.min(this.targetSpeed + this.acceleration, this.maxSpeed);
                this.timeSinceLastPress = 0; //
                break;

            case 'x':
                this.animationManager.playAnimation('run_jump', false)
                break;

            case 'i':
                this.animationManager.playAnimation('run_slide', false)
                break;

            case 's':
                if (this.id === 1 && distance < threshold) {
                    this.animationManager.playAnimation('dodge_right', false)
                } else if (this.id === 2 && distance < threshold) {
                    this.animationManager.playAnimation('grab', false)
                }
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

    moveLeft() {
        if (this.currentColumn > 0) {
            this.currentColumn--;
            this.updatePosition();
        }
    }

    moveRight() {
        if (this.currentColumn < 2) {
            this.currentColumn++;
            this.updatePosition();
        }
    }

    updatePosition() {
        this.model.position.x = (this.currentColumn - 1) * this.columnWidth;
    }

    get currentSpeed() {
        return this.speed;
    }

    update(delta) {
        const deltaSeconds = delta / 1000;

        // Increase time since last button press
        this.timeSinceLastPress += deltaSeconds;

        // Decrease target speed if no recent button press
        if (this.timeSinceLastPress > this.buttonPressInterval) {
            this.targetSpeed = Math.max(this.targetSpeed - this.deceleration * deltaSeconds, this.minSpeed);
        }



        // Smoothly interpolate current speed towards target speed
        const speedChangeRate = 5; // Adjust for desired responsiveness
        this.speed += (this.targetSpeed - this.speed) * speedChangeRate * deltaSeconds;

        // Update animation manager
        if (this.animationManager) {
            // Optionally adjust animation speed
            this.animationManager.mixer.timeScale = 0.5 + (this.speed / this.maxSpeed) * 0.5;
            this.animationManager.update(deltaSeconds);
        }

        const player1 = this.players[0];
        const player2 = this.players[1];

        if (this.id === 2 && this.experience.world.gameLogic.isPlayersInThreshold) {
            const player1Speed = player1 ? player1.currentSpeed : 0;

            // Limit targetSpeed to not exceed Player 1's speed
            this.targetSpeed = Math.min(this.targetSpeed, player1Speed);
        }
        // Update position based on current speed
        this.model.position.z += this.speed * deltaSeconds;

    }
}
