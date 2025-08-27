import * as Three from "three";
import vertexShader from "../shaders/ground.vs";
import fragmentShader from "../shaders/ground.fs";

export class Ground extends Three.Mesh {
  
  material: Three.ShaderMaterial;

  constructor(options: any) {
    super();
    this.material = new Three.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTexture: { value: options.texture },
        uTime: { value: 0 },
      },
    });

    this.geometry = new Three.PlaneGeometry(100, 100);
    this.rotation.x = -Math.PI / 2;
  }

  update(time: number) {
    this.material.uniforms.uTime.value = time;
  }
}
