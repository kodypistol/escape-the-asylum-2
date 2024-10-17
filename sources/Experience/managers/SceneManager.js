import * as THREE from 'three';

export default class SceneManager {
    constructor(scene, resources) {
        this.scene = scene;
        this.resources = resources;
        this.setLighting();
        this.setFloor();
    }

    setLighting() {
        const light = new THREE.AmbientLight("#FFFFFF", 1.0);
        this.scene.add(light);
    }

    setFloor() {
        const floor = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 4, 10, 5),
            new THREE.MeshBasicMaterial({
                color: 'red',
                wireframe: true
            })
        );
        floor.position.set(0, 0, 40);
        floor.rotation.set(Math.PI * -0.5, 0, Math.PI * 0.5);
        this.scene.add(floor);
    }

    addModel(model) {
        this.scene.add(model);
    }
}
