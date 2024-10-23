export default class AudioManager {
    constructor() {
      this.clickAudio = new Audio('assets/audio/click.mp3');
      this.ambientAudio = new Audio('assets/audio/ambient.mp3');  // Added ambient audio
      this.ambientAudio.loop = true;  // Set ambient audio to loop
    }

    playAmbient() {
      this.ambientAudio.play();
      this.ambientAudio.loop = true;
    }

    stopAmbient() {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;  // Resets the track to the start
    }

    playClick() {
      this.clickAudio.play();
      console.log('click');
    }

    update(delta) {
      // You could manage audio effects or adjustments here based on delta
    }
}
