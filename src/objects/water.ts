import * as THREE from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import vertexShader from "../shaders/water.vs";
import fragmentShader from "../shaders/water.fs";

export class Water extends THREE.Mesh {

  material: THREE.ShaderMaterial;

  constructor(options: any) {
    super();
    const geometry = new THREE.PlaneGeometry(100, 100, 512, 512);
    const material = new THREE.ShaderMaterial({
      // lights: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        // ...THREE.UniformsLib.lights,
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Color(0x006994) },
        uOpacity: { value: 0.8 },
        uEnvironmentMap: { value: options.environmentMap },
        uAmplitude: { value: 5.0 },
        uAmplitudeFactor: { value: 0.8 },
        uFrequency: { value: 0.5 },
        uFrequencyFactor: { value: 1.2 },
        uIterations: { value: 5.0 },
        uRandom: { value: Math.random() },
      },
      transparent: true,
      depthTest: true,
      depthWrite: true,
      side: THREE.DoubleSide,
    });

    this.material = material;
    this.geometry = geometry;
		this.rotation.x = -Math.PI / 2;
    this.setupGUI(options.gui);

  }

  private setupGUI(gui: GUI) {
    const waterFolder = gui.addFolder("Water");
    waterFolder
      .addColor(this.material.uniforms.uColor, "value")
      .name("Water Color");
    waterFolder
      .add(this.material.uniforms.uOpacity, "value", 0, 1)
      .name("Opacity");
    waterFolder
      .add(this.material.uniforms.uAmplitude, "value", 0.1, 5.0)
      .name("Amplitude");
    waterFolder
      .add(this.material.uniforms.uAmplitudeFactor, "value", 0.1, 1.0)
      .name("Amplitude Factor");
    waterFolder
      .add(this.material.uniforms.uFrequency, "value", 0.01, 5.0)
      .name("Frequency");
    waterFolder
      .add(this.material.uniforms.uFrequencyFactor, "value", 1.0, 5.0)
      .name("Frequency Factor");
    waterFolder
      .add(this.material.uniforms.uIterations, "value", 1, 32)
      .name("Iterations");
    waterFolder.open();
  }

  public update(time: number) {
    this.material.uniforms.uTime.value = time;
  }
}
