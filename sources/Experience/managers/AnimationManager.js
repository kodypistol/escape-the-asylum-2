import { AnimationMixer } from 'three';

export default class AnimationManager {
    constructor(model, animations) {
        this.model = model;
        this.mixer = new AnimationMixer(this.model);
        this.actions = {};
        this.activeAction = null;
        this.previousAction = null;

        this.loadAnimations(animations);
    }

    loadAnimations(animations) {
        // Load all animations from the passed animations array
        animations.forEach((clip) => {
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
        });
    }

    playAnimation(name) {
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
            this.activeAction.reset().fadeIn(0).play();
        }
    }

    update(delta) {
        this.mixer.update(delta);
    }
}
