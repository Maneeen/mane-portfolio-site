(() => {
  const app = document.getElementById('app');
  const au = document.getElementById('author');
  if (!app || !au || !window.fetch || !('content' in document.createElement('template'))) return;
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 900px)');
  const has = (app.dataset.has || '').split(' ').filter(Boolean);
  const slotA = app.querySelector('.ax-slot');
  const slotB = au.querySelector('.ax-slot');
  const cache = {};
  let want = '', shown = '', armed = false, br = null;
  const key = () => root.getAttribute('data-for') || 'beauty';
  const get = (k) => cache[k] || (cache[k] = fetch(`app/${k}.html`).then((r) => { if (!r.ok) throw new Error(r.status); return r.text(); }).catch((e) => { delete cache[k]; throw e; }));
  const ping = () => dispatchEvent(new Event('ax'));

  const sync = () => {
    const k = key();
    const on = has.includes(k);
    app.hidden = !on;
    au.hidden = !on;
    if (!on) { want = ''; ping(); return; }
    if (!armed || k === shown) { ping(); return; }
    want = k;
    get(k).then((html) => {
      if (want !== k) return;
      const t = document.createElement('template');
      t.innerHTML = html;
      const a = t.content.querySelector('[data-slot="app"]');
      const b = t.content.querySelector('[data-slot="author"]');
      const sp = t.content.querySelector('.ax-sprite');
      closeSheet(false);
      stopTimers();
      stopBreath();
      slotA.replaceChildren(sp, a);
      slotB.replaceChildren(b);
      app.dataset.ax = k;
      au.dataset.ax = k;
      app.dataset.tone = a.dataset.tone;
      app.classList.add('is-ready');
      au.classList.add('is-ready');
      shown = k;
      ping();
    }).catch(() => { if (want === k) { want = ''; app.hidden = true; au.hidden = true; ping(); } });
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) { armed = true; io.disconnect(); sync(); }
    }, { rootMargin: '150% 0px 150% 0px' });
    io.observe(app);
    io.observe(au);
  } else armed = true;
  new MutationObserver(sync).observe(root, { attributes: true, attributeFilter: ['data-for'] });
  sync();
  if (!armed) setTimeout(() => { if (!armed) { armed = true; sync(); } }, 2500);

  const $ = (s, el = app) => el.querySelector(s);
  const $$ = (s, el = app) => [...el.querySelectorAll(s)];
  const tabs = () => $$('.ax-tab');
  let openSh = null, opener = null;

  const markDay = (go, item) => {
    const days = $$('.dd');
    const pick = item || days.find((d) => d.dataset.go === go);
    days.forEach((d) => (d === pick ? d.setAttribute('aria-current', 'true') : d.removeAttribute('aria-current')));
  };
  const select = (k, focus, item) => {
    const list = tabs();
    const t = list.find((x) => x.id === 'ax-t-' + k) || list[0];
    if (!t) return;
    closeSheet(false);
    stopBreath();
    list.forEach((x) => {
      const on = x === t;
      x.setAttribute('aria-selected', String(on));
      x.tabIndex = on ? 0 : -1;
      const p = document.getElementById(x.getAttribute('aria-controls'));
      if (p) p.hidden = !on;
    });
    if (focus) t.focus({ preventScroll: true });
    markDay(k, item);
  };
  const openSheet = (id, from) => {
    const sh = document.getElementById('ax-s-' + id);
    if (!sh) return;
    closeSheet(false);
    const ax = sh.closest('.ax');
    [...ax.children].forEach((c) => { if (c !== sh && !c.classList.contains('ax-sb')) c.inert = true; });
    sh.hidden = false;
    openSh = sh;
    opener = from || null;
    const x = sh.querySelector('.ax-x');
    if (x) x.focus({ preventScroll: true });
  };
  function closeSheet(back) {
    if (!openSh) return;
    const ax = openSh.closest('.ax');
    openSh.hidden = true;
    if (ax) [...ax.children].forEach((c) => { c.inert = false; });
    openSh = null;
    if (back && opener && document.contains(opener)) opener.focus({ preventScroll: true });
    opener = null;
  }

  const timers = new Set();
  const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  function stopTimers() { timers.forEach((st) => clearInterval(st.id)); timers.clear(); }
  const runTimer = (box, restart) => {
    if (!box) return;
    const out = $('.ax-tm', box);
    const b = $('[data-timer]', box);
    const full = +box.dataset.sec || 60;
    let st = box._st;
    if (st && st.id && !restart) {
      clearInterval(st.id);
      st.id = 0;
      box.classList.remove('is-on');
      b.textContent = 'Дальше';
      return;
    }
    if (!st || st.left <= 0 || restart) st = box._st = { left: full, id: 0 };
    clearInterval(st.id);
    timers.add(st);
    box.classList.add('is-on');
    b.textContent = 'Пауза';
    st.id = setInterval(() => {
      st.left -= 1;
      out.textContent = fmt(Math.max(0, st.left));
      if (st.left <= 0) {
        clearInterval(st.id);
        st.id = 0;
        box.classList.remove('is-on');
        b.textContent = 'Старт';
        out.textContent = fmt(full);
      }
    }, 1000);
  };

  function stopBreath() {
    if (!br) return;
    clearTimeout(br.id);
    br.box.style.setProperty('--bd', '0.4s');
    br.box.removeAttribute('data-ph');
    br.out.textContent = 'Нажмите «Начать»';
    br.btn.textContent = 'Начать';
    br = null;
  }
  const startBreath = (btn) => {
    const box = $('.ax-breath', btn.closest('.ax-pn') || app);
    if (!box) return;
    const ph = box.dataset.phases.split('|').map((x) => { const [n, t] = x.split(','); return [n, +t || 4]; });
    let i = 0;
    br = { box, btn, out: $('.ax-bp', box), id: 0 };
    btn.textContent = 'Остановить';
    const step = () => {
      const [n, t] = ph[i];
      box.style.setProperty('--bd', `${t}s`);
      box.dataset.ph = String(i);
      br.out.textContent = `${n}, ${t} с`;
      i = (i + 1) % ph.length;
      br.id = setTimeout(step, t * 1000);
    };
    step();
  };

  app.addEventListener('keydown', (e) => {
    const t = e.target.closest('.ax-tab');
    if (t) {
      const list = tabs();
      let i = list.indexOf(t);
      if (e.key === 'ArrowRight') i = (i + 1) % list.length;
      else if (e.key === 'ArrowLeft') i = (i - 1 + list.length) % list.length;
      else if (e.key === 'Home') i = 0;
      else if (e.key === 'End') i = list.length - 1;
      else return;
      e.preventDefault();
      select(list[i].id.slice(5), true);
      return;
    }
    if (e.key === 'Escape' && openSh) { e.preventDefault(); closeSheet(true); }
  });

  app.addEventListener('change', (e) => {
    const c = e.target.closest('input[type="checkbox"][data-g]');
    if (!c) return;
    const ax = c.closest('.ax');
    const all = $$(`input[data-g="${c.dataset.g}"]`, ax);
    const n = all.filter((x) => x.checked).length;
    $$(`[data-cnt="${c.dataset.g}"]`, ax).forEach((x) => { x.textContent = `${n} из ${all.length}`; });
    const sum = $(`[data-sum="${c.dataset.g}"]`, ax);
    if (sum) {
      const on = all.filter((x) => x.checked);
      const total = on.reduce((s, x) => s + (+x.dataset.price || 0), +sum.dataset.base || 0);
      sum.textContent = `${total.toLocaleString('ru-RU')}\u00a0₽`;
      const num = $(`[data-num="${c.dataset.g}"]`, ax);
      if (num) {
        const q = on.length + (+num.dataset.base || 0);
        const f = num.dataset.forms.split('|');
        const a = q % 10, b = q % 100;
        num.textContent = `${q} ${f[a === 1 && b !== 11 ? 0 : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 1 : 2]}`;
      }
    }
    if (c.checked && c.hasAttribute('data-timer-start')) runTimer($('.ax-timer', c.closest('.ax-pn')), true);
  });

  app.addEventListener('click', (e) => {
    const el = e.target;
    const t = el.closest('.ax-tab');
    if (t) { select(t.id.slice(5)); return; }
    const d = el.closest('.dd');
    if (d) {
      select(d.dataset.go, false, d);
      if (d.dataset.sheet) openSheet(d.dataset.sheet, d);
      if (!wide.matches) { const ph = $('.axp'); if (ph) ph.scrollIntoView({ block: 'nearest', behavior: still.matches ? 'instant' : 'smooth' }); }
      return;
    }
    if (openSh && el === openSh) { closeSheet(true); return; }
    if (el.closest('[data-close]')) { closeSheet(true); return; }
    const o = el.closest('[data-open]');
    if (o) { openSheet(o.dataset.open, o); return; }
    const g = el.closest('[data-go]');
    if (g) { select(g.dataset.go, true); return; }
    const s = el.closest('[data-seg]');
    if (s) {
      const scope = s.closest('.ax-pn, .ax-sh-in') || app;
      $$(`[data-seg="${s.dataset.seg}"]`, scope).forEach((b) => b.setAttribute('aria-pressed', String(b === s)));
      $$(`[data-seg-of="${s.dataset.seg}"]`, scope).forEach((p) => { p.hidden = p.dataset.val !== s.dataset.val; });
      return;
    }
    const sw = el.closest('[role="switch"]');
    if (sw) { sw.setAttribute('aria-checked', String(sw.getAttribute('aria-checked') !== 'true')); return; }
    const lb = el.closest('.ax-lab-b');
    if (lb) {
      const open = lb.getAttribute('aria-expanded') !== 'true';
      lb.setAttribute('aria-expanded', String(open));
      const dd = document.getElementById(lb.getAttribute('aria-controls'));
      if (dd) dd.hidden = !open;
      return;
    }
    const inc = el.closest('[data-inc]');
    if (inc) {
      const ax = inc.closest('.ax');
      const n = $(`[data-n="${inc.dataset.inc}"]`, ax);
      const max = +inc.dataset.max || 8;
      const v = Math.min(max, (+n.textContent || 0) + 1);
      n.textContent = v;
      const bar = inc.parentElement.querySelector('.ax-bar i');
      if (bar) bar.style.setProperty('--p', (v / max).toFixed(2));
      if (v >= max) { inc.classList.add('is-done'); inc.setAttribute('aria-disabled', 'true'); }
      return;
    }
    const tm = el.closest('[data-timer]');
    if (tm) { runTimer(tm.closest('.ax-timer')); return; }
    const bb = el.closest('[data-breath]');
    if (bb) { if (br) stopBreath(); else startBreath(bb); return; }
    const done = el.closest('[data-done]');
    if (done && done.getAttribute('aria-disabled') !== 'true') {
      done.textContent = done.dataset.done;
      done.classList.add('is-done');
      done.setAttribute('aria-disabled', 'true');
      if (done.dataset.reveal) { const r = document.getElementById(done.dataset.reveal); if (r) r.hidden = false; }
    }
  });

  au.addEventListener('click', (e) => {
    const el = e.target;
    const ok = el.closest('[data-ok]');
    if (ok) {
      const li = ok.closest('.aum-case');
      const cb = $('.aum-cb', li);
      li.classList.add('is-done');
      $('.ax-tag', li).textContent = ok.dataset.alt ? 'ответ записан' : 'согласовано';
      cb.setAttribute('aria-expanded', 'false');
      $('.aum-cd', li).hidden = true;
      const left = $$('.aum-case:not(.is-done)', au).length;
      const n = $('[data-left]', au);
      if (n) n.textContent = left;
      if (!left) $('.aum-empty', au).hidden = false;
      cb.focus({ preventScroll: true });
      return;
    }
    const cb = el.closest('.aum-cb');
    if (cb) {
      const open = cb.getAttribute('aria-expanded') !== 'true';
      cb.setAttribute('aria-expanded', String(open));
      const dd = document.getElementById(cb.getAttribute('aria-controls'));
      if (dd) dd.hidden = !open;
      return;
    }
    const r = el.closest('.aum-rule');
    if (r) r.setAttribute('aria-checked', String(r.getAttribute('aria-checked') !== 'true'));
  });

  document.addEventListener('visibilitychange', () => { if (document.hidden) { $$('.ax-timer.is-on').forEach((b) => runTimer(b)); stopBreath(); } });
})();
