import * as THREE from './libs/three.module.js';
import { GLTFLoader } from './libs/GLTFLoader.js';
import { OrbitControls } from './libs/OrbitControls.js';
import {
  lane,
  laneCount,
  createCharacter,
  updateCharacterMovement,
  resetLane,
  moveLaneLeft,
  moveLaneRight,
  triggerJump,
  updateJump,
  getIsJumping,
  setIsJumping,
  setVelocity
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
import { getFilteredQuiz } from './quizUtil.js';
import { placeLaserTriplet } from './laser.js';

// スマホ判定
function isMobileDevice() {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

document.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    triggerJump(); // ← character.js にあるジャンプ関数
  }
  if (e.code === 'ArrowLeft') {
    moveLaneLeft(); // ← lane を減らす
  }
  if (e.code === 'ArrowRight') {
    moveLaneRight(); // ← lane を増やす
  }
});

// 入力状態
let moveLeft = false;
let moveRight = false;

// ゲーム状態
let character;
let currentSpeed = 0;
let selectedTag = "D360";
let gameStarted = false;
let waitingToStart = false;
let startDelayTimer = 0;
let isHit = false;
let isInvincible = false;
let hitTimer = 0;
let blinkInterval = 0;
let life = 3;
const STAGE_INTERVAL = 100;

// シーン・カメラ・レンダラー
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

// UI要素取得
const heartElements = document.querySelectorAll('.heart');
const gameOverScreen = document.getElementById('gameOverScreen');
const retryButton = document.getElementById('retryButton');
const startButton = document.getElementById('startButton');
const speedSlider = document.getElementById('speedSlider');
const speedValueDisplay = document.getElementById('speedValue');
const scoreDisplay = document.getElementById('scoreDisplay');
const leftButton = document.getElementById('leftButton');
const rightButton = document.getElementById('rightButton');
const jumpButton = document.getElementById('jumpButton');

// ステージ管理
let activeStages = [];
let obstacles = [];
let stageCount = 0;

// スコア表示
const score = { value: 0 };
function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score.value}`;
}

// ライフ減少
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

// ゲームオーバー処理
function gameOver() {
// 最初の画面に戻す
document.getElementById('gameOverScreen').style.display = 'block';

// ゲーム状態を完全に初期化
gameStarted = false;
waitingToStart = false;
startDelayTimer = 0;

// 操作ボタンを無効化（スマホ用）
setMobileControlsEnabled(false);

}

// スマホ操作ボタンの有効化
function setMobileControlsEnabled(enabled) {
  [leftButton, rightButton, jumpButton].forEach(btn => {
    if (btn) btn.disabled = !enabled;
  });
}

// 操作ボタンイベント
if (leftButton && rightButton && jumpButton) {
  leftButton.addEventListener('touchstart', () => {
    if (lane > -1) lane--;
  });
  rightButton.addEventListener('touchstart', () => {
    if (lane < laneCount - 2) lane++;
  });
  jumpButton.addEventListener('touchstart', () => {
    if (!character) return;
    if (!getIsJumping() && character.position.y <= 1) {
      setIsJumping(true);
      setVelocityY(isMobileDevice() ? 0.5 : 0.38);
    }
  });
}

// スライダー表示更新
if (speedSlider) {
  speedSlider.addEventListener('input', () => {
    speedValueDisplay.textContent = speedSlider.value;
  });
}


// 範囲選択（スタート画面）
document.querySelectorAll('.rangeButton').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedTag = btn.dataset.tag;
    document.querySelectorAll('.rangeButton').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
  });
});

// スタートボタン処理
if (startButton) {
  startButton.addEventListener('click', () => {
    if (!selectedTag) {
      alert("範囲を選んでください！");
      return;
    }
    currentSpeed = parseFloat(speedSlider?.value || "0.6");
    document.getElementById('startScreen').style.display = 'none';
    setMobileControlsEnabled(true);
    waitingToStart = true;
    startDelayTimer = 0;
    if (!character) main();
  });
}

// リトライ処理
if (retryButton) {
  retryButton.addEventListener('click', () => {
 location.reload();   
  });
}

// メイン処理
async function main() {
  character = createCharacter(scene);
  await loadStages();
  for (let i = 0; i < 5; i++) spawnStage(scene, selectedTag);
  animate();
}

// アニメーションループ
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
       updateCharacterMovement(character, currentSpeed);
  updateJump(character, delta, isMobileDevice());
  checkLaserCollision(character, scene, score, updateScoreDisplay, loseLife);
  }


  const baseSpeed = isMobileDevice() ? 0.45 : 0.3;
  const instantSpeed = baseSpeed * delta * 60;

  if (moveLeft) {
    character.position.x -= instantSpeed;
  }
  if (moveRight) {
    character.position.x += instantSpeed;
  }

  directionalLight.position.set(
    character.position.x + 50,
    character.position.y + 100,
    character.position.z + 50
  );
  lightTarget.position.copy(character.position);

  if (isHit) {
    hitTimer += isMobileDevice() ? delta * 120 : delta;
    blinkInterval += isMobileDevice() ? delta * 120 : delta;
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
  autoSpawnStages(scene, character.position.z,selectedTag);
  camera.position.set(0, 6, character.position.z + 11);

  renderer.render(scene, camera);
}

// 衝突判定
function checkCollision(character, obstacles) {
  if (isHit || isInvincible) return;

  const charBox = new THREE.Box3().setFromObject(character);

  for (const obj of obstacles) {
    const objBox = new THREE.Box3().setFromObject(obj);
    if (charBox.intersectsBox(objBox)) {
      const dz = character.position.z - obj.position.z;
      const dx = character.position.x - obj.position.x;
      const pushZ = dz > 0 ? 1.0 : -1.0;
      const pushX = dx > 0 ? 0.5 : -0.5;

      character.position.z += pushZ;
      character.position.x += pushX;

      isHit = true;
      isInvincible = true;
      hitTimer = 0;
      blinkInterval = 0;
      character.visible = false;

      loseLife();
      break;
    }
  }
}

// ウィンドウリサイズ対応
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
