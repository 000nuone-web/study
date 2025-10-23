import * as THREE from './libs/three.module.js';
import { CapsuleGeometry } from './libs/CapsuleGeometry.js';

export let lane = 0; //初期レーン数
export const laneCount = 3;
//const laneOffset = 20; //レーン間の距離
let velocityY = 0;
let isJumping = false;
let character;

export function getIsJumping() {
return isJumping;
}

export function setIsJumping(value) {
isJumping = value;
}

export function setVelocity(value) {
velocityY = value;
}

export function resetLane() {
  lane = 0;
}

export function createCharacter(scene) {
  const geometry = new CapsuleGeometry(0.5, 1.5, 4, 8);
 const material = new THREE.MeshStandardMaterial({ color: new THREE.Color(0, 0.8, 0) });
  character = new THREE.Mesh(geometry, material);
  character.castShadow = true;
  character.position.set(0, 1, 0);
  scene.add(character);
  return character;
}

export function updateJump(character, delta, isMobile) {
  if (!isJumping) return;

  const jumpPower = isMobile ? velocityY * delta * 120 : velocityY * delta * 80;
  const gravity = isMobile ? 0.014 * delta * 60 : 0.014 * delta * 40;

  character.position.y += jumpPower;
  velocityY -= gravity;

  if (character.position.y <= 1) {
    character.position.y = 1;
    isJumping = false;
    velocityY = 0;
  }
}

export function getCharacter() {
  return character;
}
export function triggerJump(initialVelocity = 0.38) {
  if (!isJumping && character.position.y <= 1) {
    velocityY = initialVelocity;
    isJumping = true;
  }
}

export function moveLaneLeft() {
  if (lane > -1) lane--;
}

export function moveLaneRight() {
  if (lane < laneCount - 2) lane++;
}

export function updateCharacterMovement(character, forwardSpeed = 0.6) {
  character.position.z -= parseFloat(forwardSpeed); // 前進速度

  // ジャンプ処理
  if (isJumping) {
    character.position.y += velocityY;
    velocityY -= 0.014;// 重力の強さ
    if (character.position.y <= 1) {
      character.position.y = 1;
      isJumping = false;
      velocityY = 0;
    }
  }

  // レーン移動
  const targetX = lane * 5;// レーンの横移動距離
  character.position.x += (targetX - character.position.x) * 0.2;
}
