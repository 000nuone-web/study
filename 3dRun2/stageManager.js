import { GLTFLoader } from './libs/GLTFLoader.js';
import * as THREE from './libs/three.module.js';
import { placeLaserTriplet } from './laser.js'; // ← 追加
import { getFilteredQuiz } from './quizUtil.js';

const loader = new GLTFLoader();
const stageModels = [];
let stageStartModel = null;

const activeStages = [];
const obstacles = [];
let stageCount = 0;

const STAGE_DEPTH = 100;
const STAGE_INTERVAL = 100;

export const mixers = []; 
export const stageModelGLTFs = []; 

export async function loadStages(selectedCourse) {
  // 最初のステージ（固定）
  const startGltf = await loader.loadAsync('./stage/stageStart.glb');
  stageStartModel = startGltf.scene;

  // ランダムステージ
  // 🔽 静／動コースに応じてステージを選ぶ
  let paths = [];

  if (selectedCourse === "calmCourse") {
    paths = [
      './stage/stage1.glb',
      './stage/stage2.glb',
      './stage/stage3.glb',
    ];
  } else {
    paths = [
      './stage/stage1.glb',
      './stage/stage2.glb',
      './stage/stage3.glb',
      './stage/stage4.glb',
    ];
  }

  for (const path of paths) {
    const gltf = await loader.loadAsync(path);
    stageModels.push(gltf.scene);
    stageModelGLTFs.push(gltf); 
  }
}

export function spawnStage(scene, selectedTag) {
  let model;
  let randomIndex = -1; // 初期化しておく

if (stageCount === 0) {
    model = stageStartModel.clone();
  } else {
    randomIndex = Math.floor(Math.random() * stageModels.length);
    model = stageModels[randomIndex].clone();
  }

  const stageZ = -stageCount * STAGE_INTERVAL;
  model.position.z = stageZ;
  stageCount++;

  scene.add(model);

model.traverse(obj => {
  if (obj.name.includes('move')) {
    const mixer = new THREE.AnimationMixer(obj);
    const originalGltf = stageModelGLTFs[randomIndex];
    originalGltf.animations.forEach(clip => {
      const action = mixer.clipAction(clip);
      action.play();
    });
    mixers.push(mixer);
  }
});

  model.traverse(obj => {
    if (obj.isMesh) {
      obj.castShadow = true;
      obj.receiveShadow = true;
      obj.visible = true;

      const worldPos = new THREE.Vector3();
      obj.getWorldPosition(worldPos);
       

      // 衝突判定用に obstacle を登録
      if (
        obj.name &&
        (obj.name.includes("Wall") || obj.name.includes("obstacle")|| obj.name.includes("move")) &&
        obj.name !== "ground" &&
        !(Math.abs(worldPos.x - 0) < 0.1 && Math.abs(worldPos.z - 0) < 0.1)
      ) {
        obstacles.push(obj);
      }
    }
  });

  activeStages.push(model);

  // ✅ ステージ終端にクイズを出す
  const filtered = getFilteredQuiz(selectedTag);
  if (!filtered || filtered.length === 0) {
    return; // クイズを出さずに終了
  }
  const quizItem = filtered[Math.floor(Math.random() * filtered.length)];
  const quizZ = stageZ + STAGE_INTERVAL - 50;
  placeLaserTriplet(scene, quizZ, quizItem);
}

export function updateStages(scene, cameraZ) {
  for (let i = activeStages.length - 1; i >= 0; i--) {
    const stage = activeStages[i];
    if (stage.position.z > cameraZ + STAGE_DEPTH) {
      scene.remove(stage);
      activeStages.splice(i, 1);
    }
  }
}

export function autoSpawnStages(scene, cameraZ,selectedTag) {
  const lastStageZ = -stageCount * STAGE_INTERVAL;

  if (cameraZ - lastStageZ < STAGE_DEPTH * 2) {
    spawnStage(scene,selectedTag);
  }
}

export function getObstacles() {
  return obstacles;
}

export function resetStageState() {
  activeStages.length = 0;
  obstacles.length = 0;
  stageCount = 0;
}
