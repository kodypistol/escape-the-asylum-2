import Axis from 'axis-api';

import Experience from './Experience';

export default class AxisManager {
    constructor(_options) {
        this.experience = new Experience();
        this.instance = Axis;
    }

    addEventListener(listener, callback) {
        this.instance.addEventListener(listener, callback);
    }
}
