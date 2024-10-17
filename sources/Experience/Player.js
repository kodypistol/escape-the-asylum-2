import Experience from './Experience';

import AnimationManager from './managers/AnimationManager';

export default class Player {
  constructor(_options) {
    this.id = _options.id;
    this.model = _options.model;  // Now we use the correct 3D model
    this.buttons = _options.buttons;
    this.count = 0;

    this.experience = new Experience();
    this.axis = this.experience.axis.instance;

    this.setPlayer();
  }

  setPlayer() {
    // Initialize the AnimationManager with the correct 3D model
    this.animationManager = new AnimationManager(this.model);

    // Handle control input for different animations
    this.handleInput();
  }

  handleInput() {
    // Example key bindings for different animations
    window.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'r':
          this.animationManager.play('run');
          break;
        case 'j':
          this.animationManager.play('jump');
          break;
        case 's':
          this.animationManager.play('slide');
          break;
      }
    });
  }

  update(delta) {
    // Update the animation each frame
    this.animationManager.update(delta);
  }
}
