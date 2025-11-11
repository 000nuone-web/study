// SVG要素と中心座標
const svg = document.getElementById('board');
const cx = 500, cy = 500;
const circle = document.getElementById('circle');
const edge = document.getElementById('edge');

// 頂点グループ
const Ag = document.getElementById('A-group');
const Bg = document.getElementById('B-group');
const Cg = document.getElementById('C-group');

// 半径スライダー
const radiusInput = document.getElementById('radius');
const radiusVal = document.getElementById('radius-val');

// スライダー値をピクセル半径に変換
const rMinPx = 50;
const rMaxPx = 450;
const sliderMin = 0.1;
const sliderMax = 10;

const mapSliderToPx = (v) => {
  const t = (v - sliderMin) / (sliderMax - sliderMin);
  return rMinPx + t * (rMaxPx - rMinPx);
};

// 頂点の初期角度
let angles = {
  A: Math.PI * 0.10,
  B: Math.PI * 0.75,
  C: Math.PI * 1.40
};

// 現在の半径(px)
let rpx = mapSliderToPx(parseFloat(radiusInput.value));

// 角度から座標を計算
function posFromAngle(theta) {
  return {
    x: cx + rpx * Math.cos(theta),
    y: cy + rpx * Math.sin(theta)
  };
}

// 距離計算
function distance(p1, p2) {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

// 余弦定理で角度計算
function angleFromSides(a, b, c) {
  return Math.acos((b*b + c*c - a*a) / (2*b*c));
}

function clamp(x, min, max) { return Math.max(min, Math.min(max, x)); }

// 値更新（右側パネル）
function updateValues(pA, pB, pC) {
  const a_px = distance(pB, pC); // ピクセル距離
  const b_px = distance(pA, pC);
  const c_px = distance(pA, pB);

  // ピクセル距離をスライダー値に正規化
  const scale = parseFloat(radiusInput.value) / rpx;
  const a = a_px * scale;
  const b = b_px * scale;
  const c = c_px * scale;

  // 余弦定理で cos を計算
  const cosA = clamp((b*b + c*c - a*a) / (2 * b * c), -1, 1);
  const cosB = clamp((c*c + a*a - b*b) / (2 * c * a), -1, 1);
  const cosC = clamp((a*a + b*b - c*c) / (2 * a * b), -1, 1);

  // ラジアン角
  const AangRad = Math.acos(cosA);
  const BangRad = Math.acos(cosB);
  const CangRad = Math.acos(cosC);

  // 度数法に変換（表示用）
  const Adeg = AangRad * 180 / Math.PI;
  const Bdeg = BangRad * 180 / Math.PI;
  const Cdeg = CangRad * 180 / Math.PI;

  // 表示更新
  document.getElementById('val-a').textContent = a.toFixed(5);
  document.getElementById('val-b').textContent = b.toFixed(5);
  document.getElementById('val-c').textContent = c.toFixed(5);
  document.getElementById('val-A').textContent = Adeg.toFixed(1);
  document.getElementById('val-B').textContent = Bdeg.toFixed(1);
  document.getElementById('val-C').textContent = Cdeg.toFixed(1);
  document.getElementById('val-R').textContent = radiusInput.value;

  // 三角関数（ラジアンで計算）
  document.getElementById('val-sinA').textContent = Math.sin(AangRad).toFixed(3);
  document.getElementById('val-sinB').textContent = Math.sin(BangRad).toFixed(3);
  document.getElementById('val-sinC').textContent = Math.sin(CangRad).toFixed(3);

  document.getElementById('val-cosA').textContent = Math.cos(AangRad).toFixed(3);
  document.getElementById('val-cosB').textContent = Math.cos(BangRad).toFixed(3);
  document.getElementById('val-cosC').textContent = Math.cos(CangRad).toFixed(3);

  document.getElementById('val-tanA').textContent = Math.tan(AangRad).toFixed(3);
  document.getElementById('val-tanB').textContent = Math.tan(BangRad).toFixed(3);
  document.getElementById('val-tanC').textContent = Math.tan(CangRad).toFixed(3);
}


// 幾何更新
function updateGeometry() {
  circle.setAttribute('r', rpx);

  const pA = posFromAngle(angles.A);
  const pB = posFromAngle(angles.B);
  const pC = posFromAngle(angles.C);

  Ag.setAttribute('transform', `translate(${pA.x},${pA.y})`);
  Bg.setAttribute('transform', `translate(${pB.x},${pB.y})`);
  Cg.setAttribute('transform', `translate(${pC.x},${pC.y})`);

  edge.setAttribute('d', `M ${pA.x} ${pA.y} L ${pB.x} ${pB.y} L ${pC.x} ${pC.y} Z`);

  // 値更新
  updateValues(pA, pB, pC);
}

// ドラッグ制御
let dragging = null;

function getMouseSVGPos(evt) {
  const pt = svg.createSVGPoint();
  pt.x = evt.clientX;
  pt.y = evt.clientY;
  const ctm = svg.getScreenCTM().inverse();
  const loc = pt.matrixTransform(ctm);
  return { x: loc.x, y: loc.y };
}

function startDrag(which) {
  dragging = which;
}

function onPointerMove(evt) {
  if (!dragging) return;
  const p = getMouseSVGPos(evt);
  const theta = Math.atan2(p.y - cy, p.x - cx);
  angles[dragging] = theta;
  updateGeometry();
}

function endDrag() {
  dragging = null;
}

// イベント登録
[Ag, Bg, Cg].forEach((g, idx) => {
  const name = idx === 0 ? 'A' : idx === 1 ? 'B' : 'C';
  g.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    startDrag(name);
  });
});

svg.addEventListener('pointermove', onPointerMove);
window.addEventListener('pointerup', endDrag);
svg.addEventListener('pointerleave', endDrag);

// 半径スライダー
radiusInput.addEventListener('input', () => {
  const v = parseFloat(radiusInput.value);
  radiusVal.textContent = v.toFixed(1);
  rpx = mapSliderToPx(v);
  updateGeometry();
});

// 初期化
radiusVal.textContent = parseFloat(radiusInput.value).toFixed(1);
updateGeometry();
