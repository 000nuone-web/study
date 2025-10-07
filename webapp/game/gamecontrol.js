const canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");


// 画像の読み込み
const playerImg = new Image();
playerImg.src = "asset/bbb.png";

const backgroundImg = new Image();

// プレイヤー設定
const player = {
  x: 400,
  y: 236,
  width: 64,
  height: 64,
  speed: 4,
  velocityY: 0,
  gravity: 0.5,
  grounded: false
};

let stageOffsetX = 0;
let obstacles = [];
let goal = {};

// キー入力管理
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// 矩形あたり判定
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// 円形あたり判定
function isCircleColliding(player, circle) {
  const playerCenterX = player.x + player.width / 2;
  const playerCenterY = player.y + player.height / 2;

  const circleCenterX = circle.x + circle.width / 2;
  const circleCenterY = circle.y + circle.height / 2;

  const dx = playerCenterX - circleCenterX;
  const dy = playerCenterY - circleCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const playerRadius = Math.min(player.width, player.height) / 2;
  const circleRadius = Math.min(circle.width, circle.height) / 2;

  return distance < playerRadius + circleRadius;
}

// ステージ読み込み
function loadStage(stage) {
  obstacles = stage.obstacles.map(ob => ({
    ...ob,
    imgObj: (() => {
      const img = new Image();
      img.src = ob.img;
      return img;
    })()
  }));
  goal = stage.goal;
  backgroundImg.src = stage.background;
  stageOffsetX = 0;
}

// ゲーム更新
function update() {
  if (keys["ArrowUp"] && player.grounded) {
    player.velocityY = -10;
    player.grounded = false;
  }

  player.velocityY += player.gravity;
  player.y += player.velocityY;

  let canScrollRight = true;
  let canScrollLeft = true;
  let groundedByObstacle = false;

  obstacles.forEach(ob => {
    const px = { ...player, x: player.x - stageOffsetX };
    const ox = ob;

    const collided = ob.circle ? isCircleColliding(px, ox) : isColliding(px, ox);

    if (collided) {
      // obstacle2: 真上から乗った
      if (ob.circle && px.y + px.height <= ox.y + 10 && player.velocityY >= 0) {
        player.y = ox.y - player.height;
        player.velocityY = 0;
        groundedByObstacle = true;
      }

      // obstacle1: 上から乗ったまま判定
      if (!ob.movable && !ob.circle) {
        const onTop =
          px.y + px.height >= ox.y &&
          px.y + px.height <= ox.y + 10 &&
          px.x + px.width > ox.x &&
          px.x < ox.x + ox.width &&
          player.velocityY >= 0;

        if (onTop) {
          player.y = ox.y - player.height;
          player.velocityY = 0;
          groundedByObstacle = true;
        }

        // obstacle1: 横衝突でスクロール制限
        if (
          px.x + px.width > ox.x &&
          px.x < ox.x &&
          px.y + px.height > ox.y + 1 &&
          px.y < ox.y + ox.height - 1
        ) {
          canScrollRight = false;
        }

        if (
          px.x < ox.x + ox.width &&
          px.x + px.width > ox.x + ox.width &&
          px.y + px.height > ox.y + 1 &&
          px.y < ox.y + ox.height - 1
        ) {
          canScrollLeft = false;
        }
      }

      // 天井衝突
      if (px.y < ox.y + ox.height && px.y + px.height > ox.y + ox.height && player.velocityY < 0) {
        player.velocityY = 0;
      }

      // obstacle2 を押す（横移動のみ）
      if (ob.movable) {
        if (keys["ArrowRight"]) ob.x += player.speed;
        if (keys["ArrowLeft"]) ob.x -= player.speed;
      }
    }
  });

  player.grounded = groundedByObstacle;

  if (keys["ArrowRight"] && canScrollRight) stageOffsetX -= player.speed;
  if (keys["ArrowLeft"] && canScrollLeft) stageOffsetX += player.speed;

  const adjustedPlayer = { ...player, x: player.x - stageOffsetX };
  if (isColliding(adjustedPlayer, goal)) {
    alert("ゴールに到達しました！");
  // ステージを再読み込みして障害物の位置をリセット
  loadStage(stage1);

  // プレイヤーを地面の上に再配置
  const ground = obstacles.find(ob => ob.img.includes("ground1"));
  if (ground) {
    player.y = ground.y - player.height;
  } else {
    player.y = 236;
  }

  player.velocityY = 0;
  player.grounded = true;

  for (let key in keys) keys[key] = false;
  }

  // ✅ ゲームオーバー判定（画面下に落ちたら）
if (player.y > canvas.height) {
  alert("ゲームオーバー！");

  // ステージを再読み込みして障害物の位置をリセット
  loadStage(stage1);

  // プレイヤーを地面の上に再配置
  const ground = obstacles.find(ob => ob.img.includes("ground1"));
  if (ground) {
    player.y = ground.y - player.height;
  } else {
    player.y = 236;
  }

  player.velocityY = 0;
  player.grounded = true;

  for (let key in keys) keys[key] = false;
}

}

// 描画処理
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, 364, canvas.width, canvas.height - 364);

  obstacles.forEach(ob => {
    ctx.drawImage(ob.imgObj, ob.x + stageOffsetX, ob.y, ob.width, ob.height);
  });

  ctx.fillStyle = "gold";
  ctx.fillRect(goal.x + stageOffsetX, goal.y, goal.width, goal.height);

  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// ゲームループ
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// ゲーム開始
playerImg.onload = () => {
  loadStage(stage1);
  gameLoop();
};
