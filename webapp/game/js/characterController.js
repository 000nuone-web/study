export const player = {
  x: 400,
  y: 236,
  width: 64,
  height: 64,
  speed: 4,
  velocityY: 0,
  gravity: 0.5,
  grounded: false
};

export function updatePlayer(keys) {
  if (keys["ArrowUp"] && player.grounded) {
    player.velocityY = -10;
    player.grounded = false;
  }

  player.velocityY += player.gravity;
  player.y += player.velocityY;
}

export function drawPlayer(ctx, playerImg) {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}
