import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { createCharacter, updateCharacterMovement, getCharacter, resetLane } from './character.js';
import { loadStages, spawnStage, getObstacles, updateStages, autoSpawnStages, resetStageState } from './stageManager.js';
import { checkLaserCollision } from './laser.js';

// スマホ判定関数
function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

// 入力状態
let moveLeft = false;
let moveRight = false;
let isJumping = false;
let velocityY = 0;

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
  leftButton.addEventListener('touchstart', () => moveLeft = true);
  rightButton.addEventListener('touchstart', () => moveRight = true);
  jumpButton.addEventListener('touchstart', () => {
    if (!isJumping && character.position.y <= 1) {
      isJumping = true;
      velocityY = 0.2;
    }
  });
}

// ライト
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(2048, 2048);
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;

const lightTarget = new THREE.Object3D();
scene.add(lightTarget);
directionalLight.target = lightTarget;
scene.add(directionalLight);

// ライフ管理
let life = 3;
const heartElements = document.querySelectorAll('.heart');
const gameOverScreen = document.getElementById('gameOverScreen');
const retryButton = document.getElementById('retryButton');

// スライダー
const speedSlider = document.getElementById('speedSlider');
const speedValueDisplay = document.getElementById('speedValue');
const speedSliderRetry = document.getElementById('speedSliderRetry');
const speedValueDisplayRetry = document.getElementById('speedValueRetry');

if (speedSlider) {
  speedSlider.addEventListener('input', () => {
    speedValueDisplay.textContent = speedSlider.value;
  });
}
if (speedSliderRetry) {
  speedSliderRetry.addEventListener('input', () => {
    speedValueDisplayRetry.textContent = speedSliderRetry.value;
  });
}

// スコア管理
const score = { value: 0 };
function updateScoreDisplay() {
  document.getElementById('scoreDisplay').textContent = `Score: ${score.value}`;
}

function loseLife() {
  if (life > 0) {
    const heart = heartElements[life - 1];
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
      heart.style.visibility = heart.style.visibility === 'hidden' ? 'visible' : 'hidden';
      blinkCount++;
      if (blinkCount >= 6) {
        clearInterval(blinkInterval);
        heart.style.display = 'none';
      }
    }, 150);
    life--;
    if (life === 0) gameOver();
  }
}

function gameOver() {
  gameStarted = false;
  gameOverScreen.style.display = 'block';
}

// ステージ管理
let activeStages = [];
let obstacles = [];
let stageCount = 0;

retryButton.addEventListener('click', () => {
  life = 3;
  heartElements.forEach(h => {
    h.style.display = 'inline-block';
    h.style.visibility = 'visible';
  });

  isHit = false;
  isInvincible = false;
  hitTimer = 0;
  blinkInterval = 0;
  character.visible = true;
  character.position.set(0, 1, 0);
  resetLane();
  currentSpeed = 0;
  moveLeft = false;
  moveRight = false;
  camera.position.set(0, 5, 10);

  activeStages = [];
  obstacles = [];
  stageCount = 0;
  score.value = 0;
  updateScoreDisplay();

  scene.children = scene.children.filter(obj => {
    if (obj.name === "laserObstacle" || obj.name === "quizLabel") {
      scene.remove(obj);
      return false;
    }
    return true;
  });

  resetStageState();
  for (let i = 0; i < 5; i++) spawnStage(scene);

  gameOverScreen.style.display = 'none';
  waitingToStart = true;
  startDelayTimer = 0;
});

// キャラクターと状態
let character;
let isHit = false;
let isInvincible = false;
let hitTimer = 0;
let blinkInterval = 0;
let currentSpeed = 0;
const maxSpeed = 0.2;
const acceleration = 0.002;

const STAGE_INTERVAL = 100;
const stage0EndZ = -STAGE_INTERVAL;

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
      ? parseFloat(speedSliderRetry?.value || "0.8")
      : parseFloat(speedSlider?.value || "0.8");

    updateCharacterMovement(character, forwardSpeed);
    checkLaserCollision(character, scene, score, updateScoreDisplay, loseLife);

  if (isJumping) {
  character.position.y += velocityY * delta * 60;
  velocityY -= 0.014 * delta * 60;
  if (character.position.y <= 1) {
    character.position.y = 1;
    isJumping = false;
    velocityY = 0;
  }
}

if (moveLeft) {
  character.position.x -= currentSpeed;
  currentSpeed = Math.min(currentSpeed + acceleration, maxSpeed);
} else if (moveRight) {
  character.position.x += currentSpeed;
  currentSpeed = Math.min(currentSpeed + acceleration, maxSpeed);
} else {
  currentSpeed = 0;
}

    directionalLight.position.set(
      character.position.x + 50,
      character.position.y + 100,
      character.position.z + 50
    );
    lightTarget.position.copy(character.position);

    if (isHit) {
      hitTimer += delta;
      blinkInterval += delta;
      if (blinkInterval > 0.2) {
        character.visible = !character.visible;
        blinkInterval = 0;
      }
      if (hitTimer <= 0.2) {
        isInvincible = false;
        return;
      } else if (hitTimer <= 2.0) {
        isInvincible = true;
      } else {
        isHit = false;
        isInvincible = false;
        hitTimer = 0;
        character.visible = true;
      }
    }

    if (!isHit && !isInvincible) {
      checkCollision(character, getObstacles());
    }

    updateStages(scene, character.position.z);
    autoSpawnStages(scene, character.position.z);
    camera.position.set(0, 6, character.position.z + 11);
  }

  renderer.render(scene, camera);
}

function checkCollision(character, obstacles) {
  if (isHit || isInvincible) return;

  const charBox = new THREE.Box3().setFromObject(character);

  for (const obj of obstacles) {
    const objBox = new THREE.Box3().setFromObject(obj);
    if (charBox.intersectsBox(objBox)) {
      // 衝突時の押し戻し処理
      const dz = character.position.z - obj.position.z;
      const dx = character.position.x - obj.position.x;
      const pushZ = dz > 0 ? 1.0 : -1.0;
      const pushX = dx > 0 ? 0.5 : -0.5;

      character.position.z += pushZ;
      character.position.x += pushX;

      isHit = true;
      hitTimer = 0;
      blinkInterval = 0;
      character.visible = false;

      loseLife();

      break;
    }
  }
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

main();