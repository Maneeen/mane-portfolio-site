// Первый экран: объёмный «стек» из 4 слоёв, по одному на направление.
// Снизу вверх: разработка софта, упаковка, продвижение, лидген и продажи.
// Рисуется шейдером (raymarching по SDF), без библиотек. Подсвеченный слой
// выезжает вбок и становится акцентного цвета. Легенда справа синхронизирована.
(() => {
  const stage = document.querySelector('[data-stack]');
  if (!stage) return;

  const view = stage.querySelector('.stage-view');
  const canvas = stage.querySelector('canvas');
  const legend = stage.querySelector('.legend');
  const items = [...stage.querySelectorAll('[data-slab]')];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Активный слой и автопереключение ---------- */
  const ORDER = [3, 2, 1, 0]; // сверху вниз, как в легенде
  let active = -1;
  let ready = false; // true, когда WebGL готов рисовать
  let hold = false;
  let cycleTimer = 0;
  let resumeTimer = 0;

  const setActive = (i) => {
    active = i;
    items.forEach((li) => li.classList.toggle('is-active', Number(li.dataset.slab) === i));
    if (reduce && ready) requestDraw();
  };
  const step = () => {
    if (hold) return;
    const k = ORDER.indexOf(active);
    setActive(ORDER[(k + 1) % ORDER.length]);
  };
  const startCycle = () => {
    clearInterval(cycleTimer);
    if (!reduce) cycleTimer = setInterval(step, 3600);
  };
  const holdOn = (i) => {
    hold = true;
    clearTimeout(resumeTimer);
    if (i !== active) setActive(i);
  };
  const holdOff = () => {
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(() => { hold = false; startCycle(); }, 2200);
  };

  items.forEach((li) => {
    const btn = li.querySelector('button');
    const i = Number(li.dataset.slab);
    btn.addEventListener('pointerenter', () => holdOn(i));
    btn.addEventListener('pointerleave', holdOff);
    btn.addEventListener('focus', () => holdOn(i));
    btn.addEventListener('blur', holdOff);
    btn.addEventListener('click', () => holdOn(i));
  });

  /* ---------- WebGL ---------- */
  const gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'high-performance',
  });

  const fallback = () => {
    stage.classList.add('no-gl');
    setActive(3);
    startCycle();
  };
  if (!gl) return fallback();

  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.0,1.0);}';

  const FS = `
precision highp float;
uniform vec2 uRes;
uniform vec3 uRo, uRight, uUp, uFwd;
uniform float uFocal;
uniform vec4 uS0, uS1, uS2, uS3;   // смещение x, y, z каждого слоя
uniform vec4 uC, uSn;              // cos и sin поворота каждого слоя
uniform vec4 uHi;                  // подсветка каждого слоя 0..1
uniform vec3 uBase, uAccent;       // цвета в линейном sRGB
uniform float uShadows;
uniform vec4 uBound;               // ограничивающая сфера

const vec3 HB = vec3(0.92, 0.155, 0.92); // половина размера плитки
const float RP = 0.30;                   // скругление углов в плане
const float RE = 0.05;                   // фаска по кромке

float sdSlab(vec3 p) {
  vec2 q = abs(p.xz) - HB.xz + RP;
  float d2 = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - RP;
  vec2 w = vec2(d2 + RE, abs(p.y) - HB.y + RE);
  return min(max(w.x, w.y), 0.0) + length(max(w, 0.0)) - RE;
}
vec3 loc(vec3 p, vec4 s, float c, float sn) {
  p -= s.xyz;
  return vec3(c * p.x + sn * p.z, p.y, -sn * p.x + c * p.z);
}
float map(vec3 p) {
  float d = sdSlab(loc(p, uS0, uC.x, uSn.x));
  d = min(d, sdSlab(loc(p, uS1, uC.y, uSn.y)));
  d = min(d, sdSlab(loc(p, uS2, uC.z, uSn.z)));
  d = min(d, sdSlab(loc(p, uS3, uC.w, uSn.w)));
  return d;
}
float hiAt(vec3 p) {
  float m = sdSlab(loc(p, uS0, uC.x, uSn.x)); float h = uHi.x;
  float d = sdSlab(loc(p, uS1, uC.y, uSn.y)); if (d < m) { m = d; h = uHi.y; }
  d = sdSlab(loc(p, uS2, uC.z, uSn.z)); if (d < m) { m = d; h = uHi.z; }
  d = sdSlab(loc(p, uS3, uC.w, uSn.w)); if (d < m) { m = d; h = uHi.w; }
  return h;
}
vec3 nrm(vec3 p) {
  vec2 k = vec2(1.0, -1.0);
  float e = 0.0007;
  return normalize(k.xyy * map(p + k.xyy * e) + k.yyx * map(p + k.yyx * e) +
                   k.yxy * map(p + k.yxy * e) + k.xxx * map(p + k.xxx * e));
}
float shadow(vec3 ro, vec3 rd) {
  float res = 1.0, t = 0.015;
  for (int i = 0; i < 32; i++) {
    float h = map(ro + rd * t);
    res = min(res, 9.0 * h / t);
    t += clamp(h, 0.015, 0.2);
    if (res < 0.003 || t > 3.5) break;
  }
  return clamp(res, 0.0, 1.0);
}
float occl(vec3 p, vec3 n) {
  float o = 0.0, s = 1.0;
  for (int i = 0; i < 5; i++) {
    float h = 0.01 + 0.06 * float(i);
    o += (h - map(p + n * h)) * s;
    s *= 0.8;
  }
  return clamp(1.0 - 2.5 * o, 0.0, 1.0);
}
float ggx(vec3 n, vec3 v, vec3 l, float r) {
  vec3 h = normalize(v + l);
  float nh = max(dot(n, h), 0.0), nl = max(dot(n, l), 0.001), nv = max(dot(n, v), 0.001);
  float a = r * r, a2 = a * a;
  float dd = nh * nh * (a2 - 1.0) + 1.0;
  float D = a2 / (3.14159 * dd * dd);
  float k = (r + 1.0) * (r + 1.0) / 8.0;
  float G = nl / (nl * (1.0 - k) + k) * nv / (nv * (1.0 - k) + k);
  float F = 0.04 + 0.96 * pow(1.0 - max(dot(h, v), 0.0), 5.0);
  return D * G * F / (4.0 * nv * nl);
}
// Студия: тёмный фон, большой софтбокс сверху слева, холодная полоса справа
vec3 env(vec3 r) {
  vec3 c = mix(vec3(0.006, 0.007, 0.014), vec3(0.035, 0.04, 0.07), smoothstep(-0.4, 0.9, r.y));
  c += vec3(1.0, 0.97, 0.93) * 2.0 * smoothstep(0.80, 0.97, dot(r, normalize(vec3(-0.5, 0.82, 0.3))));
  c += vec3(0.5, 0.56, 1.0) * 1.2 * smoothstep(0.90, 0.99, dot(r, normalize(vec3(0.95, 0.15, -0.1))));
  return c;
}
vec3 shade(vec3 p, vec3 rd) {
  vec3 n = nrm(p);
  vec3 v = -rd;
  float hi = hiAt(p);
  vec3 alb = mix(uBase, uAccent, hi);
  float rough = mix(0.46, 0.34, hi);
  vec3 L1 = normalize(vec3(-0.55, 0.85, 0.5));
  vec3 L2 = normalize(vec3(0.9, 0.3, -0.45));
  vec3 C1 = vec3(1.0, 0.96, 0.92) * 2.6;
  vec3 C2 = vec3(0.45, 0.52, 1.0) * 1.1;
  float o = occl(p, n);
  float sh = uShadows > 0.5 ? shadow(p + n * 0.003, L1) : 1.0;
  float d1 = max(dot(n, L1), 0.0);
  float d2 = max(dot(n, L2), 0.0);
  vec3 hemi = mix(vec3(0.012, 0.013, 0.024), vec3(0.07, 0.075, 0.12), n.y * 0.5 + 0.5);
  vec3 col = alb * (C1 * d1 * sh + C2 * d2 + hemi * 3.0 * o);
  col += C1 * ggx(n, v, L1, rough) * d1 * sh;
  col += C2 * ggx(n, v, L2, rough) * d2;
  float F = 0.04 + 0.96 * pow(1.0 - max(dot(n, v), 0.0), 5.0);
  col += env(reflect(rd, n)) * F * o;
  return col;
}
vec3 aces(vec3 x) { return clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0); }

void main() {
  vec2 uv = (2.0 * gl_FragCoord.xy - uRes) / uRes.y;
  vec3 rd = normalize(uv.x * uRight + uv.y * uUp + uFocal * uFwd);
  vec3 oc = uRo - uBound.xyz;
  float b = dot(oc, rd);
  float c = dot(oc, oc) - uBound.w * uBound.w;
  float h = b * b - c;
  if (h < 0.0) { gl_FragColor = vec4(0.0); return; }
  h = sqrt(h);
  float t = max(-b - h, 0.001);
  float tMax = -b + h;
  float pix = 2.0 / (uRes.y * uFocal);
  float best = 1e9, tBest = t;
  bool hit = false;
  for (int i = 0; i < 100; i++) {
    float d = map(uRo + rd * t);
    float ratio = d / t;
    if (ratio < best) { best = ratio; tBest = t; }
    if (d < 0.35 * pix * t) { hit = true; break; }
    t += d;
    if (t > tMax) break;
  }
  float alpha = 0.0;
  vec3 col = vec3(0.0);
  if (hit) { alpha = 1.0; col = shade(uRo + rd * t, rd); }
  else if (best < pix) { alpha = 1.0 - best / pix; col = shade(uRo + rd * tBest, rd); }
  if (alpha <= 0.0) { gl_FragColor = vec4(0.0); return; }
  col = pow(aces(col), vec3(1.0 / 2.2));
  gl_FragColor = vec4(col * alpha, alpha);
}`;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[stack] shader:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VS);
  const fs = compile(gl.FRAGMENT_SHADER, FS);
  if (!vs || !fs) return fallback();
  const prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.warn('[stack] link:', gl.getProgramInfoLog(prog));
    return fallback();
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aP = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(aP);
  gl.vertexAttribPointer(aP, 2, gl.FLOAT, false, 0, 0);

  const U = {};
  ['uRes', 'uRo', 'uRight', 'uUp', 'uFwd', 'uFocal', 'uS0', 'uS1', 'uS2', 'uS3', 'uC', 'uSn', 'uHi',
    'uBase', 'uAccent', 'uShadows', 'uBound'].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });

  // Цвета в линейном sRGB. Акцент подобран так, чтобы освещённая верхняя грань
  // совпадала с цветом кнопки (#175af0, oklch(0.53 0.235 263) из styles.css). База = графит.
  gl.uniform3f(U.uBase, 0.026, 0.029, 0.045);
  gl.uniform3f(U.uAccent, 0.004, 0.036, 0.72);
  gl.clearColor(0, 0, 0, 0);

  /* ---------- Камера ---------- */
  let FOCAL = 3.5; // на узкой сцене пересчитывается в layout()
  const DIST = 7.4;
  const PITCH = 0.5;
  const SPACING = 0.42;
  const SLIDE = 0.46;
  const SLIDE_DIR = [-0.2, 0, 0.98]; // к зрителю, как выдвинутый ящик

  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const norm = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };

  let shiftX = 0;
  const camera = (yawOff, pitchOff) => {
    const pitch = PITCH + pitchOff;
    const target = [shiftX, -0.02, 0];
    const ro = [
      target[0] + DIST * Math.sin(yawOff) * Math.cos(pitch),
      target[1] + DIST * Math.sin(pitch),
      target[2] + DIST * Math.cos(yawOff) * Math.cos(pitch),
    ];
    const fwd = norm(sub(target, ro));
    const right = norm(cross(fwd, [0, 1, 0]));
    const up = cross(right, fwd);
    return { ro, fwd, right, up };
  };

  /* ---------- Размеры, легенда ---------- */
  let W = 0, H = 0, scale = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), 2);
  let shadows = 1;
  let spreadK = 1.3; // насколько разведены слои в начале
  let restY = [0, 0, 0, 0];

  const layout = () => {
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    if (!W || !H) return;
    canvas.width = Math.round(W * scale);
    canvas.height = Math.round(H * scale);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Если легенда стоит поверх сцены справа, сдвигаем объект влево
    const overlay = getComputedStyle(legend).position === 'absolute';
    shiftX = overlay ? 0.4 : 0;
    // Узкая сцена (телефон): объект крупнее, занимает ~3/4 ширины
    // Масштаб привязан к пропорциям холста: на десктопе (W/H ≈ 1.16) FOCAL = 3.5
    FOCAL = overlay ? Math.min(4.8, 3.02 * (W / H)) : Math.min(5.4, 4.25 * (W / H));
    spreadK = overlay ? 1.3 : 0.7;

    // Подписи легенды ставим на высоту своих слоёв
    const cam = camera(0, 0);
    restY = [0, 1, 2, 3].map((i) => {
      const v = sub([0, (i - 1.5) * SPACING, 0], cam.ro);
      const y = (FOCAL * dot(v, cam.up)) / dot(v, cam.fwd);
      return (H / 2) * (1 - y);
    });
    items.forEach((li) => {
      const i = Number(li.dataset.slab);
      li.style.setProperty('--y', overlay ? `${restY[i].toFixed(1)}px` : '');
    });
    requestDraw();
  };

  /* ---------- Состояние анимации ---------- */
  const hi = [0, 0, 0, 0];
  const tilt = [0, 0];
  const tiltTarget = [0, 0];
  let time = 0;
  let intro = reduce ? 10 : 0;

  const easeOut = (x) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 4);

  const draw = () => {
    if (!W || !H) return;
    const assemble = easeOut((intro - 0.25) / 1.7);
    const spread = 1 + spreadK * (1 - assemble);   // в начале слои разведены
    const baseYaw = 0.62 + time * 0.1;

    const s = [];
    const cs = [], sn = [];
    let maxY = 0;
    for (let i = 0; i < 4; i++) {
      const fan = (i - 1.5) * 0.55 * (1 - assemble);
      const yaw = baseYaw + fan + 0.05 * Math.sin(time * 0.6 + i * 0.9);
      const y = (i - 1.5) * SPACING * spread + 0.012 * Math.sin(time * 1.1 + i * 1.3);
      const k = SLIDE * hi[i];
      s.push([SLIDE_DIR[0] * k, y, SLIDE_DIR[2] * k, 0]);
      cs.push(Math.cos(yaw));
      sn.push(Math.sin(yaw));
      maxY = Math.max(maxY, Math.abs(y));
    }

    const cam = camera(tilt[0], tilt[1]);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform3fv(U.uRo, cam.ro);
    gl.uniform3fv(U.uRight, cam.right);
    gl.uniform3fv(U.uUp, cam.up);
    gl.uniform3fv(U.uFwd, cam.fwd);
    gl.uniform1f(U.uFocal, FOCAL);
    gl.uniform4fv(U.uS0, s[0]);
    gl.uniform4fv(U.uS1, s[1]);
    gl.uniform4fv(U.uS2, s[2]);
    gl.uniform4fv(U.uS3, s[3]);
    gl.uniform4fv(U.uC, cs);
    gl.uniform4fv(U.uSn, sn);
    gl.uniform4fv(U.uHi, hi);
    gl.uniform1f(U.uShadows, shadows);
    gl.uniform4f(U.uBound, 0, 0, 0, Math.hypot(1.25 + SLIDE, maxY + 0.2));
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  /* ---------- Цикл ---------- */
  let raf = 0;
  let last = 0;
  let visible = true;
  let covered = false; // первый экран целиком закрыт светлым листом (app.js)
  let frames = 0;
  let slowSum = 0;
  let degraded = 0;
  let introDone = reduce;

  const tick = (now) => {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 0.016;
    last = now;

    time += dt;
    intro += dt;
    if (!introDone && intro > 1.6) {
      introDone = true;
      setActive(3);
      startCycle();
    }

    const kHi = 1 - Math.exp(-dt * 7);
    for (let i = 0; i < 4; i++) hi[i] += ((i === active ? 1 : 0) - hi[i]) * kHi;
    const kTilt = 1 - Math.exp(-dt * 3.5);
    tilt[0] += (tiltTarget[0] - tilt[0]) * kTilt;
    tilt[1] += (tiltTarget[1] - tilt[1]) * kTilt;

    draw();

    // Если устройство не тянет, снижаем качество (до двух раз)
    frames++;
    if (frames > 20 && frames <= 80) slowSum += dt;
    if (frames === 80 && degraded < 2 && slowSum / 60 > 1 / 38) {
      degraded++;
      shadows = 0;
      scale = Math.max(1, scale * 0.7);
      frames = 0;
      slowSum = 0;
      layout();
    }

    if (visible && !covered && !reduce) raf = requestAnimationFrame(tick);
  };

  function requestDraw() {
    if (reduce) {
      for (let i = 0; i < 4; i++) hi[i] = i === active ? 1 : 0;
      draw();
    } else if (!raf && visible && !covered) {
      last = 0;
      raf = requestAnimationFrame(tick);
    }
  }

  // Наведение на объект: выбираем ближайший слой по высоте, лёгкий наклон камеры
  if (finePointer) {
    view.addEventListener('pointermove', (e) => {
      const r = view.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tiltTarget[0] = (px - 0.5) * 0.22;
      tiltTarget[1] = (py - 0.5) * -0.1;
      if (!introDone) return;
      const y = e.clientY - r.top;
      let best = 0;
      for (let i = 1; i < 4; i++) if (Math.abs(restY[i] - y) < Math.abs(restY[best] - y)) best = i;
      holdOn(best);
    });
    view.addEventListener('pointerleave', () => {
      tiltTarget[0] = 0;
      tiltTarget[1] = 0;
      holdOff();
    });
  }

  document.addEventListener('hero:cover', (e) => {
    covered = Boolean(e.detail);
    if (!covered) requestDraw();
  });

  new ResizeObserver(layout).observe(view);
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) requestDraw();
  }).observe(stage);

  ready = true;
  if (reduce) setActive(3);
  layout();
  requestAnimationFrame(() => stage.classList.add('is-live'));
})();
