import Experience from './Experience';

export default class Player {
    constructor(_options) {
        this.id = _options.id;
        this.joysticks = _options.joysticks;
        this.buttons = _options.buttons;
        this.count = 0;

        this.experience = new Experience();
        this.axis = this.experience.axis.instance;

        this.setPlayer();
    }

    setPlayer() {
        this.instance = this.axis.createPlayer({
            id: this.id,
            joysticks: this.joysticks,
            buttons: this.buttons,
        });

        // console.log('this', this.id)
    }
}
