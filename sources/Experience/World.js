import * as THREE from 'three'

import Experience from './Experience.js'
import Player from "./Player";

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.axis = this.experience.axis
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.offsetFactorPosition = 0.01

        this.vertexSnapping();

        this.resources.on('groupEnd', (_group) => {
            if (_group.name === 'base') {
                this.setDummy();
            }
        });

        this.setPlayers();
    }

    vertexSnapping() {
      // Define the resolution
      const resolution = new THREE.Vector2(320, 240);

      // Replace existing THREE vertex shader to apply snapping to all objects across the scene
      THREE.ShaderChunk.project_vertex = THREE.ShaderChunk.project_vertex.replace(
          'gl_Position = projectionMatrix * mvPosition;',
          `
          // PS1 Vertex Snapping
          vec4 pos = projectionMatrix * mvPosition;
          float dist = length(mvPosition);
          float affine = dist + (mvPosition.w * 8.0) / dist * 0.5;
          vAffine = affine;
          pos.xyz /= pos.w;
          pos.xy = floor(vec2(${resolution.toArray()}) * pos.xy) / vec2(${resolution.toArray()});
          pos.xyz *= pos.w;
          gl_Position = pos;
          `
      );

      // Modify the default fragment shader for affine texture mapping
      THREE.ShaderChunk.uv_pars_vertex = `
          varying vec2 vUv;
          varying float vAffine;
      ` + THREE.ShaderChunk.uv_pars_vertex;

      THREE.ShaderChunk.uv_pars_fragment = `
          varying vec2 vUv;
          varying float vAffine;
      ` + THREE.ShaderChunk.uv_pars_fragment;

      THREE.ShaderChunk.map_fragment = THREE.ShaderChunk.map_fragment.replace(
          'vec4 texelColor = texture2D( map, vUv );',
          `
          vec2 uv = vUv / vAffine;
          vec4 texelColor = texture2D( map, uv );
          `
      );
  }

  handlePlayerCount(playerId, event) {
    if (event.key === "a" || event.key === "x") {
      const playerIndex = playerId - 1
      const players = this.players

      players[playerIndex].count++
      this.experience.countElements[playerIndex].textContent = players[playerIndex].count

      this.playerModels[playerIndex].position.z += 0.2
    }
  }

  setDummy() {
    this.light = new THREE.AmbientLight("#FFFFFF", 1.0)
    this.scene.add(this.light)

    this.p1 = this.resources.items.player1Model;
    this.p1.scale.set(0.01, 0.01, 0.01)
    this.p1.position.set(0, 0, 0)

    this.p1_mixer = new THREE.AnimationMixer(this.p1)
    const p1_idle = this.p1_mixer.clipAction(this.p1.animations[0])
    p1_idle.play()

    this.p2 = this.resources.items.player2Model;
    this.p2.scale.set(0.01, 0.01, 0.01)
    this.p2.position.set(0, 0, -3)

    this.p2.children.forEach((child) => {
      child.traverse((m) => {
        if (m.isMesh) {
          m.material.color = new THREE.Color('blue')
        }
      })
    })

    this.p2_mixer = new THREE.AnimationMixer(this.p2)
    const p2_idle = this.p2_mixer.clipAction(this.p2.animations[0])
    p2_idle.play()

    this.playerModels = [this.p1, this.p2]

    this.floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 4, 10, 5),
        new THREE.MeshBasicMaterial({
          color: 'red',
          wireframe: true
        })
    )
    this.floor.position.set(0, 0, 40)
    this.floor.rotation.set(Math.PI * -0.5, 0, Math.PI * 0.5)

    this.scene.add(this.p1, this.p2, this.floor);

  }

  setPlayers() {

    this.player1 = new Player({
      id: 1,
      joysticks: this.axis.instance.joystick1,
      buttons: [
        this.axis.instance.registerKeys('q', 'a', 1),
        this.axis.instance.registerKeys('d', 'x', 1),
        this.axis.instance.registerKeys('z', 'i', 1),
        this.axis.instance.registerKeys('s', 's', 1),
      ]
    })

    this.player2 = new Player({
      id: 2,
      joysticks: this.axis.instance.joystick2,
      buttons: [
        this.axis.instance.registerKeys('ArrowLeft', 'a', 2),
        this.axis.instance.registerKeys('ArrowRight', 'x', 2),
        this.axis.instance.registerKeys('ArrowUp', 'i', 2),
        this.axis.instance.registerKeys('ArrowDown', 's', 2),
      ]
    });

    this.players = [this.player1, this.player2]

    this.player1.instance.addEventListener('keydown', (e) => {
      this.handlePlayerCount(1, e)
    })

    this.player2.instance.addEventListener('keydown', (e) => {
      this.handlePlayerCount(2, e)
    })
  }

  resize() {}

  update() {
    const delta = this.experience.time.delta

    if (this.p1_mixer && this.p2_mixer) {
      this.p1_mixer.update(delta /2000)
      this.p2_mixer.update(delta / 2500)
    }

    if (this.p1 && this.p2) {
      this.p1.position.z += delta * this.offsetFactorPosition * 0.2
      this.p2.position.z += delta * this.offsetFactorPosition * 0.2
      this.experience.camera.instance.position.z = this.p1.position.z - 5
    }


  }
  destroy() {}
}