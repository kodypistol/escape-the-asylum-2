import Axis from 'axis-api';

import Experience from './Experience.js';

export default class AxisManager {
    constructor(_options) {
        this.experience = new Experience();
        this.instance = Axis;

        this.joysticks = {};
    }

    addEventListener(listener, callback) {
        this.instance.addEventListener(listener, callback);
    }
}
