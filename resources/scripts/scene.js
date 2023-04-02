import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export { run };

// setup scene, camera, and renderer.
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3, 2, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });

// shadowmap type: needed?
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

renderer.gammaOutput = true;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// setup controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;

// candleFlames
let candleFlame = {};
let candleFlame2 = {};

let cube = {};

// light
const candleColor = 0xe7e06d;
const light = new THREE.AmbientLight(candleColor);
light.intensity = 0.1;
scene.add(light);

// helper
var axesHelper = new THREE.AxesHelper(10);
//scene.add( axesHelper );

function run() {
  loadObjects();
  console.log(scene);
}

function loadObjects() {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshStandardMaterial();
  cube = new THREE.Mesh(geometry, material);

  const loader = new GLTFLoader();
  loader.load(
    "./resources/models/WVCake2023.glb",
    function (gltf) {
      scene.add(gltf.scene);
      lightScene();
      animate();
    },
    function (xhr) {
      const progress = (xhr.loaded / xhr.total) * 100;
      // loading.
    },
    function (error) {
      console.log(error);
    }
  );
}

function lightScene() {
  candleFlame = scene.getObjectByName("CandleFlame1", true);
  candleFlame2 = scene.getObjectByName("CandleFlame2", true);

  const material = new THREE.MeshStandardMaterial();
  material.emissive = new THREE.Color(0xe7e06d);
  material.emissiveIntensity = 1;
  material.transparent = true;
  material.opacity = 0.8;

  candleFlame.material = material;
  candleFlame2.material = material;

  const light = new THREE.PointLight(candleColor, 0.5, 100);
  light.castShadow = true;
  light.shadow.radius = 10;
  light.position.set(0, 3, 0);

  const light2 = new THREE.PointLight(candleColor, 0.5, 100);
  light2.castShadow = true;
  light2.shadow.radius = 10;
  light2.position.set(0, 3, 0);

  //light2.add(cube);

  candleFlame.add(light);

  candleFlame2.add(light2);

  const cakeBody = scene.getObjectByName("SimplifiedWV001", true);
  cakeBody.receiveShadow = true;

  scene.getObjectByName("Layer1001", true).receiveShadow = true;

  const num3 = scene.getObjectByName("FirstNumber");
  //   num3.castShadow = true;
  //   num3.receiveShadow = true;

  const num4 = scene.getObjectByName("SecondNumber");
  //   num4.castShadow = true;
  //   num4.receiveShadow = true;

  const redGlowMaterial = new THREE.MeshLambertMaterial({ emissive: 0xff0000 });
  const outline1 = scene.getObjectByName("ThreeOutline002");
  outline1.material = redGlowMaterial;

  [
    "ThreeOutline002",
    "ThreeOutline003",
    "SevenOutline002",
    "SevenOutline003",
  ].forEach((mesh) => {
    scene.getObjectByName(mesh).material = redGlowMaterial;
  });

  console.log("outline1", outline1);
}

const clock = new THREE.Clock();

// animation handler.
function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  const mult = 0.1;

  candleFlame.rotation.x = mult * Math.sin(elapsed * 2);
  candleFlame.rotation.y = mult * Math.sin(elapsed * 2);

  candleFlame2.rotation.x = -mult * Math.sin(5 + elapsed * 2);
  candleFlame2.rotation.y = -mult * Math.sin(5 + elapsed * 2);

  renderer.render(scene, camera);
  controls.update();
}

// update renderer size and camera projection matrix when the window is resized to keep everything proportionate
// courtesy https://stackoverflow.com/a/20434960/5511776
function onWindowResize() {
  const w = window.innerWidth;
  const h = window.innerHeight;

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  //composer.setSize(w, h);
}
window.addEventListener("resize", onWindowResize, false);
