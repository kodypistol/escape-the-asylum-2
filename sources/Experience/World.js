import * as THREE from "three";
import Experience from "./Experience.js";

export default class World {
  constructor(_options) {
    this.experience = new Experience();
    this.config = this.experience.config;
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("groupEnd", (_group) => {
      if (_group.name === "base") {
        this.setDummy();
      }
    });
  }

  setDummy() {
    this.pigeon = this.resources.items.pigeonModel.scene;
    this.pigeonTexture = this.resources.items.pigeonTexture;
    this.pigeonTexture.flipY = false;
    this.pigeonTexture.minFilter = THREE.NearestFilter;
    this.pigeonTexture.magFilter = THREE.NearestFilter;

    this.pigeon.traverse((_child) => {
      if (_child.isMesh) {
        _child.material = new THREE.MeshBasicMaterial({
          map: this.pigeonTexture,
        });
      }
    });

    this.scene.add(this.pigeon);
  }

  resize() {}

  update() {
    if (this.pigeon) {
      this.pigeon.rotation.y += 0.005;
    }
  }

  destroy() {}
}
