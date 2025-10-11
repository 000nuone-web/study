import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';
import {
  createCharacter,
  updateCharacterMovement,
  getCharacter,
  resetLane,
  triggerJump,
  moveLaneLeft,
  moveLaneRight
} from './character.js';
import {
  loadStages,
  spawnStage,
  getObstacles,
  updateStages,
  autoSpawnStages,
  resetStageState
} from './stageManager.js';
import { checkLaserCollision } from './laser.js';

function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

let moveLeft = false;
let moveRight = false;

const clock = new THREE.Clock();
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// 操作ボタン（スマホ）
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const jumpButton = document.getElementById('jumpButton');

if (leftButton && rightButton && jumpButton) {
  leftButton.addEventListener('touchstart', () => {
    moveLaneLeft();
    moveLeft = true;
  });
  leftButton.addEventListener('touchend', () => moveLeft = false);

  rightButton.addEventListener('touchstart', () => {
    moveLaneRight();
    moveRight = true;
  });
  rightButton.addEventListener('touchend', () => moveRight = false);

  jumpButton.addEventListener('touchstart', () => {
    triggerJump(isMobileDevice() ? 0.6 : 0.38);
  });
}

// ライト
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;
scene.add(directionalLight);

const lightTarget = new THREE.Object3D();
scene.add(lightTarget);
directionalLight.target = lightTarget;

// キャラクターとステージ
let character;
let gameStarted = false;
let waitingToStart = false;
let startDelayTimer = 0;

document.getElementById('startButton').addEventListener('click', () => {
  waitingToStart = true;
  startDelayTimer = 0;
  document.getElementById('startScreen').style.display = 'none';
});

async function main() {
  character = createCharacter(scene);
  await loadStages();
  for (let i = 0; i < 5; i++) spawnStage(scene);
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  if (waitingToStart && !gameStarted) {
    startDelayTimer += 0.05;
    if (startDelayTimer >= 1.0) {
      character.position.set(0, 1, 0);
      camera.position.set(0, 5, character.position.z + 10);
      gameStarted = true;
      waitingToStart = false;
    }
    renderer.render(scene, camera);
    return;
  }

  if (gameStarted) {
    const forwardSpeed = isMobileDevice()
      ? parseFloat(document.getElementById('speedSliderRetry')?.value || "0.8")
      : parseFloat(document.getElementById('speedSlider')?.value || "0.8");

    updateCharacterMovement(character, forwardSpeed);
    checkLaserCollision(character, scene, score, updateScoreDisplay, loseLife);

    directionalLight.position.set(
      character.position.x + 50,
      character.position.y + 100,
      character.position.z + 50
    );
    lightTarget.position.copy(character.position);

    updateStages(scene, character.position.z);
    autoSpawnStages(scene, character.position.z);
    camera.position.set(0, 6, character.position.z + 11);
  }

  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

main();
