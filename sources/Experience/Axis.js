import Axis from "axis-api"

import Experience from "./Experience";

export default class AxisManager {
  constructor(_options) {

    this.experience = new Experience()
    this.instance = Axis

    this.instance.registerKeys(" ", "a", 1); // keyboard key "q" to button "a" from group 1
    this.instance.registerKeys("Enter", "a", 2); // keyboard key "q" to button "a" from group 1

    const buttonA1 = this.instance.buttonManager.getButton('a', 1);
    const buttonA2 = this.instance.buttonManager.getButton('a', 2);

    buttonA1.addEventListener('keydown', this.handleCount.bind(this));
    buttonA2.addEventListener('keydown', this.handleCount.bind(this));

    this.setPlayers()
    this.setListeners()

    return this.instance
  }

  handleCount() {
    this.experience.clicCount++
    this.experience.clicCountElement.textContent = this.experience.clicCount
  }

  setPlayers() {

  }

  setListeners() {

  }

  addEventListener(listener, callback) {
    this.instance.addEventListener(listener, callback)
  }
}