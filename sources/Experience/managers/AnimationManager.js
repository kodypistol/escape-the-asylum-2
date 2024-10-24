import { AnimationMixer, LoopOnce, LoopRepeat } from 'three';

export default class AnimationManager {
    constructor(model, animations, player) {
        this.model = model;
        this.mixer = new AnimationMixer(this.model);
        this.actions = {};
        this.activeAction = null;
        this.previousAction = null;
        this.player = player;
        this.end = false;

        this.loadAnimations(animations);
    }

    loadAnimations(animations) {
        // Load all animations from the passed animations array
        animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
        });
    }

    playAnimation(name, isLooping = true) {

        if (this.end) {
            return;
        }

        const action = this.actions[name];
        if (!action) {
            console.warn(`Animation ${name} not found`);
            return;
        }

        if (this.activeAction !== action) {
            this.previousAction = this.activeAction;
            this.activeAction = action;

            // Smooth transition
            if (this.previousAction) {
                this.previousAction.fadeOut(0.5);
            }

            if (!isLooping) {// Set the loop mode to only play the animation once
                this.activeAction.setLoop(LoopOnce);
                this.activeAction.reset().fadeIn(0.5).play();

                // Event listener for when the animation finishes playing
                this.activeAction.clampWhenFinished = true; // Keeps the model in the final pose
                this.mixer.addEventListener('finished', () => {
                    // this.activeAction.stop(); // Stop the action once finished
                    this.playAnimation(this.player.defaultAnimation); // Play the default animation       
                });
            } else {
                // Play the animation with looping enabled
                this.activeAction.setLoop(LoopRepeat);
                this.activeAction.reset().fadeIn(0).play();
            }
        }
    }

    pauseCurrentAnimation() {
        if (this.activeAction) {
            this.activeAction.paused = true;
        }
    }

    update(delta) {
        this.mixer.update(delta);
    }
}
