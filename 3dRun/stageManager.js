import { GLTFLoader } from './libs/GLTFLoader.js';
import * as THREE from './libs/three.module.js';


const loader = new GLTFLoader();
const stageModels = [];
let stageStartModel = null;

const activeStages = [];
const obstacles = [];
let stageCount = 0;

const STAGE_DEPTH = 100;
const STAGE_INTERVAL = 100;

export async function loadStages() {
  // 最初のステージ（固定）
  const startGltf = await loader.loadAsync('./stage/stageStart.glb');
  stageStartModel = startGltf.scene;

  // ランダムステージ
  const paths = [
    './stage/stage1.glb',
    './stage/stage2.glb',
    './stage/stage3.glb'
  ];

  for (const path of paths) {
    const gltf = await loader.loadAsync(path);
    stageModels.push(gltf.scene);
  }
}

import { placeLaserTriplet } from './laser.js'; // ← 追加

export function spawnStage(scene) {
  let model;

  if (stageCount === 0) {
    model = stageStartModel.clone();
  } else {
    const randomIndex = Math.floor(Math.random() * stageModels.length);
    model = stageModels[randomIndex].clone();
    model.visible = true;
  }

  const stageZ = -stageCount * STAGE_INTERVAL; // ← 追加
  model.position.z = stageZ;
  stageCount++;

 model.visible = true; // モデル全体を表示

model.traverse(obj => {
  if (obj.isMesh) {
    obj.castShadow = true;
    obj.receiveShadow = true;
    obj.visible = true;

    // ground の色変更（material と color があるか確認）
    if (obj.name === "ground" && obj.material && obj.material.color) {
      obj.material.color.set(0x228B22);
    }

    // 壁や障害物の登録（name が存在するか確認）
const worldPos = new THREE.Vector3();
obj.getWorldPosition(worldPos);

if (
  obj.name &&
  (obj.name.includes("Wall") || obj.name.includes("obstacle")) &&
  obj.name !== "ground" &&
  !(Math.abs(worldPos.x - 0) < 0.1 && Math.abs(worldPos.z - 0) < 0.1)
) {
  obstacles.push(obj);
}


  }
});


  scene.add(model);
  activeStages.push(model);

  // ✅ stageZ を使ってレーザー配置
  placeLaserTriplet(scene, stageZ + STAGE_INTERVAL / 2);
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

export function autoSpawnStages(scene, cameraZ) {
  const lastStageZ = -stageCount * STAGE_INTERVAL;

  if (cameraZ - lastStageZ < STAGE_DEPTH * 2) {
    spawnStage(scene);
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
