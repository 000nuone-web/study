const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

const rayCountSelect = document.getElementById("rayCount");
const rayHeightSlider = document.getElementById("rayHeight");

let rayCount = parseInt(rayCountSelect.value);
let rayHeight = canvas.height - parseInt(rayHeightSlider.value);

rayCountSelect.addEventListener("change", () => {
  rayCount = parseInt(rayCountSelect.value);
  draw();
});

rayHeightSlider.addEventListener("input", () => {
  const sliderValue = parseInt(rayHeightSlider.value);
  rayHeight = canvas.height - sliderValue; // ← 上下反転！
  draw();
});


// 図形のパス（当たり判定用）
let prismPath = new Path2D();
let concavePath = new Path2D();
let convexPath = new Path2D();

function drawOpticalElements() {
  const centerX = canvas.width / 2;

  const prismY = canvas.height / 2 - 280;
  const concaveY = canvas.height / 2;
  const convexY = canvas.height / 2 + 260;

  // プリズム
  prismPath = new Path2D();
  prismPath.moveTo(centerX - 40, prismY + 100);
  prismPath.lineTo(centerX, prismY - 50);
  prismPath.lineTo(centerX + 40, prismY + 100);
  prismPath.closePath();
  ctx.fillStyle = "rgba(154, 230, 255, 1)";
  ctx.fill(prismPath);

  // 凹レンズ（くびれた形）
  concavePath = new Path2D();
  concavePath.moveTo(centerX - 40, concaveY - 80);
  concavePath.bezierCurveTo(centerX - 10, concaveY - 40, centerX - 10, concaveY + 40, centerX - 40, concaveY + 80);
  concavePath.lineTo(centerX + 40, concaveY + 80);
  concavePath.bezierCurveTo(centerX + 10, concaveY + 40, centerX + 10, concaveY - 40, centerX + 40, concaveY - 80);
  concavePath.closePath();
  ctx.fillStyle = "rgba(154, 230, 255, 1)";
  ctx.fill(concavePath);

  // 凸レンズ（上下とんがり）
  convexPath = new Path2D();
  convexPath.moveTo(centerX, convexY - 80);
  convexPath.bezierCurveTo(centerX - 40, convexY - 60, centerX - 40, convexY + 60, centerX, convexY + 80);
  convexPath.bezierCurveTo(centerX + 40, convexY + 60, centerX + 40, convexY - 60, centerX, convexY - 80);
  convexPath.closePath();
  ctx.fillStyle = "rgba(154, 230, 255, 1)";
  ctx.fill(convexPath);
}

function drawRay(y) {
  const centerX = canvas.width / 2;
  const endX = canvas.width;

  // 光線の左側（入射）
  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(centerX, y);
  ctx.stroke();

  // 屈折の判定と角度計算
  let angle = 0; // 0なら直進
  let n1 = 1.0; // 空気
  let n2 = 1.5; // ガラスやレンズ素材

 if (ctx.isPointInPath(prismPath, centerX, y)) {
  const spectrum = [
    { color: "red", angleOffset: 0.02 },
    { color: "orange", angleOffset: 0.03 },
    { color: "yellow", angleOffset: 0.04 },
    { color: "green", angleOffset: 0.05 },
    { color: "blue", angleOffset: 0.06 },
    { color: "indigo", angleOffset: 0.07 },
    { color: "violet", angleOffset: 0.08 }
  ];

  spectrum.forEach(({ color, angleOffset }) => {
    const dx = canvas.width - centerX;
    const dy = Math.tan(angleOffset) * dx;

    ctx.strokeStyle = color;
    ctx.lineWidth = 3; // ← 光線を太く！
    ctx.beginPath();
    ctx.moveTo(centerX, y);
    ctx.lineTo(canvas.width, y + dy);
    ctx.stroke();
  });
  ctx.lineWidth = 1; // ← 他の光線に影響しないように戻す
  return; // プリズムで分光したら他の屈折は描かない
}else if (ctx.isPointInPath(concavePath, centerX, y)) {
    const dy = y - canvas.height / 2;
    const theta1 = Math.atan2(dy, 100); // 入射角（仮）
    const sinTheta2 = (n1 / n2) * Math.sin(theta1);
    const theta2 = Math.asin(sinTheta2);
    angle = -(theta2 - theta1); // 凹レンズはマイナス
  } else if (ctx.isPointInPath(convexPath, centerX, y)) {
    const dy = y - (canvas.height / 2 + 260);
    const theta1 = Math.atan2(dy, 100);
    const sinTheta2 = (n1 / n2) * Math.sin(theta1);
    const theta2 = Math.asin(sinTheta2);
    angle = theta2 - theta1;
  }

  // 光線の右側（屈折後）
  const dx = endX - centerX;
  const dy = Math.tan(angle) * dx;

  ctx.strokeStyle = "white";
  ctx.beginPath();
  ctx.moveTo(centerX, y);
  ctx.lineTo(endX, y + dy);
  ctx.stroke();
}


function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawOpticalElements();

  const spacing = 12; // 狭めた
  const centerY = rayHeight;

  let positions = [];
  for (let i = 0; i < rayCount; i++) {
    const offset = (i - Math.floor(rayCount / 2)) * spacing;
    positions.push(centerY + offset);
  }

  positions.forEach(y => drawRay(y));
}


draw();
