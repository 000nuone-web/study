import * as THREE from './libs/three.module.js';

export async function createTextSpriteWithBoard(
  message,
  texturePath = './textures/wood.jpg',
  boardSize = { width: 13, height: 7 },
  spriteScale = { x: 12, y: 4, z: 1 }
) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = 'Bold 160px Arial';
  ctx.fillStyle = 'black';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

const lines = message.split('\n');
const lineHeight = 60; // ← 行間を広めに（フォントサイズに応じて調整）

lines.forEach((line, i) => {
  const y = canvas.height / 2 + (i - (lines.length - 1) / 2) * lineHeight;
  ctx.fillText(line, canvas.width / 2, y);
});



  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(spriteScale.x, spriteScale.y, spriteScale.z ?? 1);


  const woodTexture = await new THREE.TextureLoader().loadAsync(texturePath);
  const boardMaterial = new THREE.MeshBasicMaterial({ map: woodTexture });
  const boardGeometry = new THREE.PlaneGeometry(boardSize.width, boardSize.height);
  const board = new THREE.Mesh(boardGeometry, boardMaterial);
  board.position.set(0, 0, -0.01);

  const group = new THREE.Group();
  group.add(board);
  group.add(sprite);

  return group;
}