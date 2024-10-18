import * as THREE from 'three';

export default class ShaderManager {
    constructor() {
        this.applyVertexSnapping();
    }

    applyVertexSnapping() {
        const resolution = new THREE.Vector2(320, 240);

        THREE.ShaderChunk.project_vertex = THREE.ShaderChunk.project_vertex.replace(
            'gl_Position = projectionMatrix * mvPosition;',
            `
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
}
