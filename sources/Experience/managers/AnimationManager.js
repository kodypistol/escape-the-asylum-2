import { AnimationMixer } from 'three';

export default class AnimationManager {
    constructor(playerModel) {
        this.playerModel = playerModel;
        this.mixer = new AnimationMixer(this.playerModel);
        this.currentAction = null;
        this.actions = {};

        this.loadAnimations();
    }

    loadAnimations() {
        console.log('load');
        if (!this.playerModel.animations || this.playerModel.animations.length === 0) {
            console.error("No animations found in player model.");
            return;
        }

        // Assuming animations are named 'run', 'jump', and 'slide'
        console.log('run', this.playerModel.animations);
        this.actions['run'] = this.mixer.clipAction(this.playerModel.animations.find(clip => clip.name === 'Armature|run'));
        console.log('run', this.actions);
        // this.actions['jump'] = this.mixer.clipAction(this.playerModel.animations.find(clip => clip.name === 'jump'));
        // this.actions['slide'] = this.mixer.clipAction(this.playerModel.animations.find(clip => clip.name === 'slide'));

        // Set initial animation
        if (this.actions['run']) {
            this.play('run');
        } else {
            console.warn("Running animation not found.");
        }
    }

    play(animationName) {
        const nextAction = this.actions[animationName];

        if (nextAction && nextAction !== this.currentAction) {
            if (this.currentAction) {
                // Smooth transition from one animation to another
                this.currentAction.fadeOut(0.5);
            }
            nextAction.reset().fadeIn(0.5).play();
            this.currentAction = nextAction;
        }
    }

    update(delta) {
        if (this.mixer) {
            this.mixer.update(delta * 0.0005);
        }
    }
}
