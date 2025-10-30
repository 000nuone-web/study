import * as THREE from './libs/three.module.js';
import { getShuffledChoices } from './quizUtil.js';
import { createTextSpriteWithBoard } from './textSprite.js';
import { getCurrentSpeed } from './main.js';

// レーザーのビジュアルを作成
function createLaserSquare(color) {
  const group = new THREE.Group();
  const lineCount = 25;
  const height = 8;
  const width = 5;

  for (let i = 0; i < lineCount; i++) {
    const y = (i / (lineCount - 1)) * height;
    const geometry = new THREE.BoxGeometry(width, 0.05, 0.1);
    const material = new THREE.MeshPhysicalMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
      metalness: 1,
      emissive: color,
      emissiveIntensity: 3,
      clearcoat: 0.4,
      clearcoatRoughness: 0.1
    });
    const line = new THREE.Mesh(geometry, material);
    line.position.set(0, y, 0);
    group.add(line);
  }

  //縦の棒
  const poleGeometry = new THREE.BoxGeometry(0.2, height, 0.2);
const poleMaterial = new THREE.MeshStandardMaterial({
  color: 0xffd700,           // 黄金色！
  metalness: 1,              // 金属感MAX
  roughness: 0.05,           // つるつる光沢
  emissive: 0xffcc00,        // ほんのり金色の輝き
  emissiveIntensity: 0.3     // 光らせる
});

  const leftPole = new THREE.Mesh(poleGeometry, poleMaterial);
  leftPole.position.set(-width / 2, 1.5, 0);
  group.add(leftPole);

  const rightPole = new THREE.Mesh(poleGeometry, poleMaterial);
  rightPole.position.set(width / 2, 1.5, 0);
  group.add(rightPole);

  return group;
}

// レーザー3本と選択肢・問題文を配置
export async function placeLaserTriplet(scene, zPosition,quizItem) {
  const spacing = 6;
  const baseY = 0.5;
  const choices = getShuffledChoices(quizItem);

  const laserPositions = [-spacing, 0, spacing];
  const laserColors = [0xff0000, 0x00ff00, 0x0000ff];

  for (let i = 0; i < 3; i++) {
    const laser = createLaserSquare(laserColors[i]);
    laser.position.set(laserPositions[i], baseY, zPosition);
    laser.userData.answer = choices[i].text;
    laser.userData.isCorrect = choices[i].id === quizItem.correct;
    laser.name = "laserObstacle";
    scene.add(laser);

const label = await createTextSpriteWithBoard(
  choices[i].text,
  './textures/wood.jpg',
  { width: 5.2, height: 4.5 },
  { x: 12, y: 3 }
);

label.position.set(laser.position.x, baseY + 7.3, zPosition+0.1);
label.name = "quizLabel"; // ✅ ここに追加！
scene.add(label);

  }

  const questionLabel = await createTextSpriteWithBoard(
    quizItem.question, // ✅ 直接使う
    './textures/wood0.jpg',
    { width: 17.6, height: 4.5 },
    { x: 14, y: 4 }
  );
  questionLabel.position.set(0, baseY + 11.5, zPosition+0.1);
  questionLabel.name = "quizLabel"; // ✅ 問題文にも名前を付ける
  scene.add(questionLabel);
}

export function checkLaserCollision(character, scene, score, updateScoreDisplay, loseLife) {
  const charBox = new THREE.Box3().setFromObject(character);

  scene.children.forEach(obj => {
    if (obj.name === "laserObstacle") {
      const objBox = new THREE.Box3().setFromObject(obj);
      if (charBox.intersectsBox(objBox)) {
        if (obj.userData?.hasCollided) return;
        obj.userData = obj.userData || {};
        obj.userData.hasCollided = true;

        if (obj.userData.isCorrect) {
          score.value += 10 + 50 * (getCurrentSpeed()-0.3); // スピードに応じて得点変化
          updateScoreDisplay();
        } else {
          loseLife();
        }
      }
    }
  });
}


