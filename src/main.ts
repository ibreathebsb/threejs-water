import "./style.css";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  // AxesHelper,
  TextureLoader,
  Clock,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as Three from "three";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

import { Ground } from "./objects/ground";
import { Water } from "./objects/water";

declare global {
  interface Window {
    Three: typeof Three;
    renderer: WebGLRenderer;
    camera: Three.Camera;
  }
}

const scene = new Scene();
const clock = new Clock();
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const rect = canvas.getBoundingClientRect();
const width = rect.width;
const height = rect.height;

const camera = new PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(-80, 40, 30);

const renderer = new WebGLRenderer({
  canvas,
  context: canvas.getContext("webgl2")!,
});

renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);

window.Three = Three;
window.camera = camera;
window.renderer = renderer;

const cubeTextureLoader = new Three.CubeTextureLoader();

const environmentMap = cubeTextureLoader.load([
  "posx.jpg", // positive x
  "negx.jpg", // negative x
  "posy.jpg", // positive y
  "negy.jpg", // negative y
  "posz.jpg", // positive z
  "negz.jpg", // negative z
]);

scene.background = environmentMap;
scene.environment = environmentMap;

const poolTexture = new TextureLoader().load("/threejs-water/ocean_floor.png");
const ground = new Ground({
  texture: poolTexture,
});

ground.position.y = -20;

scene.add(ground);

const gui = new GUI();

const water = new Water({ environmentMap, gui });
scene.add(water);

// const worldAxesHelper = new AxesHelper(200);
// scene.add(worldAxesHelper);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;

function handleResize() {
  const rect = document.body.getBoundingClientRect();
  const width = rect.width;
  const height = rect.height;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);

  controls.update();
}

window.addEventListener("resize", handleResize);

function animate() {
  requestAnimationFrame(animate);

  const time = clock.getElapsedTime();
  ground.update(time);
  water.update(time);
  controls.update(time);

  renderer.render(scene, camera);
}
animate();
