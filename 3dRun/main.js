import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';
import { createCharacter, updateCharacterMovement, getCharacter, resetLane } from './character.js';
import { loadStages, spawnStage, getObstacles, updateStages, autoSpawnStages,resetStageState } from './stageManager.js';
import { checkLaserCollision } from './laser.js';

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

//ジャンプボタン
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const jumpButton = document.getElementById('jumpButton');

leftButton.addEventListener('touchstart', () => moveLeft = true);
leftButton.addEventListener('touchend', () => moveLeft = false);

rightButton.addEventListener('touchstart', () => moveRight = true);
rightButton.addEventListener('touchend', () => moveRight = false);

jumpButton.addEventListener('touchstart', () => {
  if (!isJumping && character.position.y <= 1) {
    isJumping = true;
    velocityY = 0.2; // ✅ 同じジャンプ初速
  }
});

// ライトの設定
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

const speedSlider = document.getElementById('speedSlider');
const speedValueDisplay = document.getElementById('speedValue');

// スライダー変更時に表示を更新
speedSlider.addEventListener('input', () => {
  speedValueDisplay.textContent = speedSlider.value;
});

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

    if (life === 0) {
      gameOver();
    }
  }
}

function gameOver() {
  gameStarted = false;
  gameOverScreen.style.display = 'block';
}

// ステージ管理用の変数（追加）
let activeStages = [];
let obstacles = [];
let stageCount = 0;

retryButton.addEventListener('click', () => {
  life = 3;
  heartElements.forEach(h => {
    h.style.display = 'inline-block';
    h.style.visibility = 'visible';
  });

  // キャラクター状態リセット
  isHit = false;
  isInvincible = false;
  hitTimer = 0;
  blinkInterval = 0;
  character.visible = true;
  character.position.set(0, 1, 0);
  resetLane(); // ✅ 横位置の基準を初期化
  currentSpeed = 0; // ✅ 横方向の動きをリセット

  // ✅ 横移動の入力状態もリセット
  moveLeft = false;
  moveRight = false;

  camera.position.set(0, 5, 10);
 
  // ステージ・障害物・クイズの初期化
  activeStages = [];
  obstacles = [];
  stageCount = 0;
  score.value = 0;
  updateScoreDisplay();
  
  // クイズ関連オブジェクトを削除
  scene.children = scene.children.filter(obj => {
    if (
      obj.name === "laserObstacle" ||
      obj.name === "quizLabel"
    ) {
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
  const forwardSpeed = speedSlider.value; // スライダーの値を使用
  updateCharacterMovement(character, forwardSpeed);
checkLaserCollision(character, scene, score, updateScoreDisplay, loseLife); // ✅ 毎フレーム判定
}

  if (gameStarted) {
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
