import { stage1 } from '../stage/stage1.js';
import { player, updatePlayer, drawPlayer } from './characterController.js';
import { obstacles, loadObstacles, updateObstacles, drawObstacles, isColliding } from './obstacleController.js';

const canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const playerImg = new Image();
playerImg.src = "asset/bbb.png"; // ✅ 修正

const backgroundImg = new Image();
let stageOffsetX = 0;
let goal = {};
const keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function loadStage(stage) {
  loadObstacles(stage);
  goal = stage.goal;
  backgroundImg.src = stage.background;
  stageOffsetX = 0;
}

function update() {
  updatePlayer(keys);
  const { canScrollRight, canScrollLeft, grounded } = updateObstacles(player, keys, stageOffsetX);
  player.grounded = grounded;

  if (keys["ArrowRight"] && canScrollRight) stageOffsetX -= player.speed;
  if (keys["ArrowLeft"] && canScrollLeft) stageOffsetX += player.speed;

  const adjustedPlayer = { ...player, x: player.x - stageOffsetX };
  if (isColliding(adjustedPlayer, goal)) {
    alert("ゴールに到達しました！");
    resetGame();
  }

  if (player.y > canvas.height) {
    alert("ゲームオーバー！");
    resetGame();
  }
}

function resetGame() {
  loadStage(stage1);

  backgroundImg.onload = () => {
    const ground = obstacles.find(ob => ob.img.includes("ground1"));
    player.y = ground ? ground.y - player.height : 236;
    player.velocityY = 0;
    player.grounded = true;
    for (let key in keys) keys[key] = false;

    gameLoop(); // ✅ 背景画像が読み込まれてから開始
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, 364, canvas.width, canvas.height - 364);
  drawObstacles(ctx, stageOffsetX);
  ctx.fillStyle = "gold";
  ctx.fillRect(goal.x + stageOffsetX, goal.y, goal.width, goal.height);
  drawPlayer(ctx, playerImg);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

playerImg.onload = () => {
  resetGame(); // ✅ プレイヤー画像が読み込まれてからゲーム開始
};
