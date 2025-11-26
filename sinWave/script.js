const tMin = -Math.PI;
const tMax = 3 * Math.PI;
const yRangeMin = -1.1;
const yRangeMax = 1.1;
const xMin = -Math.PI;
const xMax = 3 * Math.PI;

const canvasYT = document.getElementById('canvasYT');
const canvasYX = document.getElementById('canvasYX');
const tRange   = document.getElementById('tRange');
const tValSpan = document.getElementById('tVal');

const ctxYT = canvasYT.getContext('2d');
const ctxYX = canvasYX.getContext('2d');

let selectedX = null;
let dragging  = false;

const btnUp   = document.getElementById('btnUp');
const btnDown = document.getElementById('btnDown');

btnUp.addEventListener('click', () => {
  let t = parseFloat(tRange.value);
  t += 0.01;
  tRange.value = clamp(t, tMin, tMax);
  update(parseFloat(tRange.value));
});

btnDown.addEventListener('click', () => {
  let t = parseFloat(tRange.value);
  t -= 0.01;
  tRange.value = clamp(t, tMin, tMax);
  update(parseFloat(tRange.value));
});

// DPI補正
function fixCanvasDPI(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.round(rect.width  * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

function resizeCanvas() {
  fixCanvasDPI(canvasYT);
  fixCanvasDPI(canvasYX);

  // 初期化時に selectedX を原点 (x=0) に対応するキャンバス座標にする
  if (selectedX === null) {
    selectedX = xToCanvas(0, canvasYX.width);
  }

  update(parseFloat(tRange.value));
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// 座標変換
function xToCanvas(x, w) {
  const scale = w / (xMax - xMin)/2;
  return (x - xMin) * scale;
}

function yToCanvas(y, h) {
  return (yRangeMax - y) / (yRangeMax - yRangeMin) * (h/2);
}


function tToCanvas(t, w) {
  const scale = w / (tMax - tMin)/2;
  return (t - tMin) * scale;
}


// グリッド描画
function drawGrid(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#14182b';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#2b3250';
  ctx.lineWidth = 1;
  const gridSize = 50;

  for (let x = 0; x <= w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#1e2440';
  ctx.strokeRect(0, 0, w, h);
}


// 軸描画
function drawAxes(ctx, w, h, labelX) {
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;

  // 縦軸 (x=0)
  const xZero = xToCanvas(0, w);
  ctx.beginPath();
  ctx.moveTo(xZero, 0);
  ctx.lineTo(xZero, h);
  ctx.stroke();

  // 縦軸の矢印（上方向）
  drawArrow(ctx, xZero, h, xZero, 0);

  // 横軸 (y=0)
  const yZero = yToCanvas(0, h);
  ctx.beginPath();
  ctx.moveTo(0, yZero);
  ctx.lineTo(w, yZero);
  ctx.stroke();

  // 横軸の矢印（右方向）
  drawArrow(ctx, w/2-40, yZero, w/2, yZero);

  // ラベル描画
  ctx.fillStyle = '#ffffff';
  ctx.font = '32px Arial';
  ctx.fillText('y', xZero + 8, 22);       // 縦軸の上に y
  ctx.fillText(labelX, xZero*3.93, yZero - 12);
  ctx.fillText('O', xZero-30, yZero+30);
}




function drawArrow(ctx, x1, y1, x2, y2, headLength = 10) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6),
             y2 - headLength * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6),
             y2 - headLength * Math.sin(angle + Math.PI / 6));
  ctx.lineTo(x2, y2);
  ctx.fillStyle = ctx.strokeStyle;
  ctx.fill();
}

function canvasXToMathX(canvasX, w) {
  const scale = (xMax - xMin) / (w/2);
  return xMin + canvasX * scale;
}



// y–t グラフ
function renderYT(tCurrent) {
  const w = canvasYT.width, h = canvasYT.height;
  drawGrid(ctxYT, w, h);
  drawAxes(ctxYT, w, h, "t");

  const xSelectedRad = canvasXToMathX(selectedX, canvasYX.width);

  ctxYT.strokeStyle = '#7bd389';
  ctxYT.lineWidth = 3.5;
  ctxYT.beginPath();

  const steps = 1000;
  for (let i = 0; i <= steps; i++) {
    const u = tMin + (tCurrent - tMin) * (i / steps);
    const x = tToCanvas(u, w);
    const y = yToCanvas(Math.sin(xSelectedRad - u), h);
    if (i === 0) ctxYT.moveTo(x, y);
    else ctxYT.lineTo(x, y);
  }
  ctxYT.stroke();
}

// y–x グラフ
function renderYX(tCurrent) {
  const w = canvasYX.width, h = canvasYX.height;
  drawGrid(ctxYX, w, h);
  drawAxes(ctxYX, w, h, "x");

  ctxYX.strokeStyle = '#1883b1ff';
  ctxYX.lineWidth = 3.5;
  ctxYX.beginPath();

  const steps = 1000;
  const scale = w / (xMax - xMin);

  for (let i = 0; i <= steps; i++) {
    const x = xMin + (xMax - xMin) * (i / steps);
    const y = Math.sin(x - tCurrent);
    const xCanvas = xToCanvas(x, w);   // ← getYAxisX を使わず直接変換
    const yCanvas = yToCanvas(y, h);

    if (i === 0) ctxYX.moveTo(xCanvas, yCanvas);
    else ctxYX.lineTo(xCanvas, yCanvas);
  }
  ctxYX.stroke();

  // --- ここから追加 ---
// y軸のキャンバス座標を取得
  const xZero = xToCanvas(0, w);

  // 縦の点線
  ctxYX.strokeStyle = "#4aaf51ff";
  ctxYX.setLineDash([6, 6]);
  ctxYX.beginPath();
  ctxYX.moveTo(xZero, 0);
  ctxYX.lineTo(xZero, h);
  ctxYX.stroke();
  ctxYX.setLineDash([]);


// 赤い丸（横軸上に固定）
const yZero = yToCanvas(0, h); // 横軸のキャンバス座標
ctxYX.fillStyle = '#12aa98ff';
ctxYX.beginPath();
ctxYX.arc(xZero, yZero, 6, 0, 2 * Math.PI);
ctxYX.fill();

  // --- ここまで追加 ---
}
// 更新処理
function update(t) {
  t = clamp(t, tMin, tMax);
  tValSpan.textContent = t.toFixed(2);
  renderYX(t);
  renderYT(t);
}

// clamp関数
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// 初期描画
update(parseFloat(tRange.value));

// スライダー操作
tRange.addEventListener('input', (e) => {
  update(parseFloat(e.target.value));
});

// ドラッグ操作
canvasYX.addEventListener('mousedown', (e) => {
  const rect = canvasYX.getBoundingClientRect();
  const xClick = (e.clientX - rect.left) / rect.width * canvasYX.width/2;
  const yClick = (e.clientY - rect.top) / rect.height * canvasYX.height/2;

  const yZero = yToCanvas(0, canvasYX.height);
  const dist = Math.hypot(xClick - selectedX, yClick - yZero);
  if (dist < 10) dragging = true;
});


canvasYX.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const rect = canvasYX.getBoundingClientRect();
  const xClick = (e.clientX - rect.left) / rect.width * canvasYX.width / 2;
  selectedX = xClick;
  update(parseFloat(tRange.value));
});

canvasYX.addEventListener('mouseup', () => {
  dragging = false;
});
