const tMin = -Math.PI;
const tMax = 3 * Math.PI;
const yRangeMin = -1.5;
const yRangeMax = 1.5;
const xMin = -Math.PI;
const xMax = 3 * Math.PI;


function computeX(t) { return Math.cos(t); }
function computeY(t) { return Math.sin(t); }

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

const canvasYT = document.getElementById('canvasYT');
const canvasYX = document.getElementById('canvasYX');
const tRange = document.getElementById('tRange');
const tValSpan = document.getElementById('tVal');
const xValSpan = document.getElementById('xVal');
const yValSpan = document.getElementById('yVal');

const ctxYT = canvasYT.getContext('2d');
const ctxYX = canvasYX.getContext('2d');

canvasYX.width  = Math.floor(window.innerWidth * 0.9);
canvasYX.height = 600;

function fixCanvasDPI(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width  = Math.round(rect.width  * dpr);
  canvas.height = Math.round(rect.height * dpr);
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}

// その値を使って初期化
let selectedX = null;
let dragging = false;

fixCanvasDPI(canvasYT);
fixCanvasDPI(canvasYX);
const w = canvasYX.width;
selectedX = getYAxisX(w); // ★赤丸を y軸の位置に初期化


// 座標変換関数
function xToCanvas(x, w) {
  return (x + 1) / 2 * w;
}
function yToCanvas(y, h) {
  return (1 - (y - yRangeMin) / (yRangeMax - yRangeMin)) * h;
}
function tToCanvas(t, w) {
  const xZero = getYAxisX(w);        // y軸のキャンバス位置
  const scale = w / (tMax - tMin);   // 1ラジアンあたりの幅
  return xZero + t * scale;          // t=0 が y軸位置に一致
}


// グリッド描画
function drawGrid(ctx, w, h) {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#14182b';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = '#2b3250';
  ctx.lineWidth = 1;
  const gx = 10, gy = 8;
  for (let i = 0; i <= gx; i++) {
    const x = (i / gx) * w;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let j = 0; j <= gy; j++) {
    const y = (j / gy) * h;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#1e2440';
  ctx.strokeRect(0, 0, w, h);
}

function getYAxisX(w) {
  const gx = 10; // グリッド分割数
  const gridWidth = w / gx;
  // 中央から2マス分左にずらした位置
  return xToCanvas(0, w) - 3 * gridWidth;
}

// y–x グラフ用の軸描画
function drawAxesYX(ctx, w, h) {
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.font = "16px sans-serif";
  ctx.fillStyle = '#ffffff';

  // y軸（上向き矢印）
  const xZero = getYAxisX(w);
  drawArrow(ctx, xZero, h, xZero, 0); // 下→上
  ctx.fillText("y", xZero + 10, 20);  // 矢印近くにラベル

  // x軸（右向き矢印）
  const yZero = yToCanvas(0, h);
  drawArrow(ctx, 0, yZero, w, yZero); // 左→右
  ctx.fillText("x", w - 20, yZero - 10);
}



function drawArrow(ctx, x1, y1, x2, y2, headLength = 10) {
  // 軸本体
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  // 矢印の角度
  const angle = Math.atan2(y2 - y1, x2 - x1);

  // 矢印の両側
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


// y–t グラフ用の軸描画
function drawAxesYT(ctx, w, h) {
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.font = "16px sans-serif";
  ctx.fillStyle = '#ffffff';

  // y軸（上向き矢印）
  const xZero = getYAxisX(w);
  drawArrow(ctx, xZero, h, xZero, 0);
  ctx.fillText("y", xZero + 10, 20);

  // t軸（右向き矢印）
  const yZero = yToCanvas(0, h);
  drawArrow(ctx, 0, yZero, w, yZero);
  ctx.fillText("t", w - 20, yZero - 10);
}


function canvasXToMathX(canvasX, w) {
  const xZero = getYAxisX(w);             // y軸位置（x=0 に対応）
  const scale = w / (xMax - xMin);        // renderYX と同じスケール
  return (canvasX - xZero) / scale;       // ラジアンに戻す
}

// y–t グラフ
function renderYT(tCurrent) {
  const w = canvasYT.width, h = canvasYT.height;
  drawGrid(ctxYT, w, h);
  drawAxesYT(ctxYT, w, h);

  // ★キャンバス座標→ラジアン
  const xSelectedRad = canvasXToMathX(selectedX, canvasYX.width);

  ctxYT.strokeStyle = '#7bd389';
  ctxYT.lineWidth = 2;
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

  // ★ここで ctxYX に赤丸を描いていたのは誤り。削除。
}


canvasYX.addEventListener('mousedown', (e) => {
  const rect = canvasYX.getBoundingClientRect();
  const xClick = (e.clientX - rect.left) / rect.width * canvasYX.width;
  const yClick = (e.clientY - rect.top) / rect.height * canvasYX.height;

  // 丸の近くをクリックしたらドラッグ開始
  const xC = selectedX;
  const yC = yToCanvas(0, canvasYX.height);
  const dist = Math.hypot(xClick - xC, yClick - yC);
  if (dist < 10) dragging = true;
});

canvasYX.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const rect = canvasYX.getBoundingClientRect();
  const xClick = (e.clientX - rect.left) / rect.width * canvasYX.width;
  selectedX = xClick;
  update(parseFloat(tRange.value));
});

canvasYX.addEventListener('mouseup', () => {
  dragging = false;
});


// y–x グラフ
function renderYX(tCurrent) {
  const w = canvasYX.width, h = canvasYX.height;
  drawGrid(ctxYX, w, h);
  drawAxesYX(ctxYX, w, h);

  ctxYX.strokeStyle = '#6ec1e4';
  ctxYX.lineWidth = 2;
  ctxYX.beginPath();

  const steps = 1000;
  const xZero = getYAxisX(w); // y軸の位置

  // ★スケールはキャンバス全幅に対して計算
  const scale = w / (xMax - xMin);

  for (let i = 0; i <= steps; i++) {
    const x = xMin + (xMax - xMin) * (i / steps);
    const y = Math.sin(x - tCurrent);

    // ★x=0 がキャンバス上の xZero に来るように変換
    const xCanvas = xZero + x * scale;
    const yCanvas = yToCanvas(y, h);

    if (i === 0) ctxYX.moveTo(xCanvas, yCanvas);
    else ctxYX.lineTo(xCanvas, yCanvas);
  }
  ctxYX.stroke();

  // 赤丸も y軸基準で描画
  const xC = selectedX;
  const yC = yToCanvas(0, h);
  ctxYX.fillStyle = '#52ff80ff';
  ctxYX.beginPath();
  ctxYX.arc(xC, yC, 5, 0, Math.PI * 2);
  ctxYX.fill();
}



function update(t) {
  t = clamp(t, tMin, tMax);
  let tDisplay = t.toFixed(2);
  if (tDisplay === "-0.00") tDisplay = "0.00";
  tValSpan.textContent = tDisplay;
  renderYX(t);
  renderYT(t);
}

update(parseFloat(tRange.value));

tRange.addEventListener('input', (e) => {
  update(parseFloat(e.target.value));
});

window.addEventListener('resize', () => {
  fixCanvasDPI(canvasYT);
  fixCanvasDPI(canvasYX);
  update(parseFloat(tRange.value));
});
