export let obstacles = [];

export function loadObstacles(stage) {
  obstacles = stage.obstacles.map(ob => ({
    ...ob,
    imgObj: (() => {
      const img = new Image();
      img.src = ob.img;
      return img;
    })()
  }));
}

export function updateObstacles(player, keys, stageOffsetX) {
  let canScrollRight = true;
  let canScrollLeft = true;
  let grounded = false;

  obstacles.forEach(ob => {
    // obstacle3: 重力と回転
    if (ob.angle !== undefined && ob.gravity !== undefined) {
      ob.velocityY += ob.gravity;
      ob.y += ob.velocityY;

      // 地面に着地（仮に y=364 が地面）
      if (ob.y + ob.height >= 364) {
        ob.y = 364 - ob.height;
        ob.velocityY = 0;
      }

      // 回転
      ob.angle += 2;
    }

    const px = { ...player, x: player.x - stageOffsetX };
    const collided = ob.circle ? isCircleColliding(px, ob) : isColliding(px, ob);

    if (collided) {
      // 上から乗った判定（obstacle1, obstacle2, obstacle3）
      if (px.y + px.height <= ob.y + 10 && player.velocityY >= 0) {
        player.y = ob.y - player.height;
        player.velocityY = 0;
        grounded = true;
      }

      // 横衝突でスクロール制限（obstacle1）
      if (!ob.movable && !ob.circle) {
        if (px.x + px.width > ob.x && px.x < ob.x && px.y + px.height > ob.y + 1 && px.y < ob.y + ob.height - 1) {
          canScrollRight = false;
        }
        if (px.x < ob.x + ob.width && px.x + px.width > ob.x + ob.width && px.y + px.height > ob.y + 1 && px.y < ob.y + ob.height - 1) {
          canScrollLeft = false;
        }
      }

      // 天井衝突
      if (px.y < ob.y + ob.height && px.y + px.height > ob.y + ob.height && player.velocityY < 0) {
        player.velocityY = 0;
      }

      // movable 押す（obstacle2, obstacle3）
      if (ob.movable) {
        if (keys["ArrowRight"]) ob.x += player.speed;
        if (keys["ArrowLeft"]) ob.x -= player.speed;
      }
    }
  });

  return { canScrollRight, canScrollLeft, grounded };
}

export function drawObstacles(ctx, stageOffsetX) {
  obstacles.forEach(ob => {
    const drawX = ob.x + stageOffsetX + ob.width / 2;
    const drawY = ob.y + ob.height / 2;

    if (ob.angle !== undefined) {
      ctx.save();
      ctx.translate(drawX, drawY);
      ctx.rotate((ob.angle * Math.PI) / 180);
      ctx.drawImage(ob.imgObj, -ob.width / 2, -ob.height / 2, ob.width, ob.height);
      ctx.restore();
    } else {
      ctx.drawImage(ob.imgObj, ob.x + stageOffsetX, ob.y, ob.width, ob.height);
    }
  });
}

export function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function isCircleColliding(player, circle) {
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
