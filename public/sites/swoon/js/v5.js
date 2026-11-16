(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const bar = document.getElementById('bar');
  const zones = [...document.querySelectorAll('[data-tone]')];
  if (bar && zones.length && 'IntersectionObserver' in window) {
    let io;
    const live = new Set();
    const pick = () => {
      let cur = null;
      live.forEach((z) => { if (![...live].some((o) => o !== z && z.contains(o))) cur = z; });
      bar.classList.toggle('on-dark', !!cur && cur.dataset.tone === 'dark');
    };
    const watch = () => {
      if (io) io.disconnect();
      live.clear();
      const h = bar.offsetHeight;
      io = new IntersectionObserver((es) => {
        es.forEach((e) => (e.isIntersecting ? live.add(e.target) : live.delete(e.target)));
        pick();
      }, { rootMargin: `0px -49.5% ${h - innerHeight}px -49.5%` });
      zones.forEach((z) => io.observe(z));
    };
    watch();
    addEventListener('resize', () => { clearTimeout(watch.t); watch.t = setTimeout(watch, 200); });
    addEventListener('ax', pick);
  }

  const stacks = [...document.querySelectorAll('.note-stack')];
  if (stacks.length) {
    const n = stacks[0].children.length;
    let i = 0, timer = 0;
    const show = () => stacks.forEach((st) => [...st.children].forEach((x, k) => x.classList.toggle('is-on', k === i)));
    const tick = () => { i = (i + 1) % n; show(); };
    const run = () => {
      clearInterval(timer);
      if (still.matches || document.hidden) return;
      stacks.forEach((st) => st.classList.add('is-live'));
      show();
      timer = setInterval(tick, 3600);
    };
    document.addEventListener('visibilitychange', run);
    still.addEventListener('change', run);
    run();
  }

  const collage = document.getElementById('collage');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  if (collage && fine.matches) {
    const layers = [...collage.querySelectorAll('[data-depth]')];
    const base = layers.map((l) => getComputedStyle(l).transform);
    let raf = 0, px = 0, py = 0;
    const apply = () => {
      raf = 0;
      layers.forEach((l, k) => {
        const d = +l.dataset.depth;
        const b = base[k] === 'none' ? '' : base[k];
        l.style.transform = `translate3d(${(px * d).toFixed(1)}px, ${(py * d).toFixed(1)}px, 0) ${b}`;
      });
    };
    collage.closest('.hero').addEventListener('pointermove', (e) => {
      if (still.matches) return;
      const r = collage.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - 0.5;
      py = (e.clientY - r.top) / r.height - 0.5;
      if (!raf) raf = requestAnimationFrame(apply);
    });
    collage.closest('.hero').addEventListener('pointerleave', () => { px = 0; py = 0; if (!raf) raf = requestAnimationFrame(apply); });
  }

  const story = document.getElementById('story');
  const menu = document.getElementById('menu');
  const mbtn = document.getElementById('menu-btn');
  const rail = document.getElementById('rail');
  if (story && menu && mbtn && rail) {
    const LAND = [10, 24.85, 35.5, 50, 65, 81.9, 98];
    const ST = 100 / 7;
    const sda = window.CSS && CSS.supports('animation-timeline: view()');
    const wideQ = matchMedia('(min-width: 1100px)');
    const live = () => false; // истории стопкой: каждая карточка на экран
    const top = (el) => el.getBoundingClientRect().top + scrollY;
    const shown = (el) => el.getClientRects().length > 0;
    const stage = () => [...story.querySelectorAll('.stage-b')].find(shown) || story;
    const beats = () => stage().querySelectorAll('.beat');
    const span = (el) => Math.max(1, el.offsetHeight - innerHeight);
    const beatH = () => (beats()[0] ? beats()[0].offsetHeight : innerHeight);
    const beatY = (k) => top(stage()) + k * beatH();
    const curBeat = () => {
      if (live()) return Math.max(0, Math.min(6, Math.floor(((scrollY - top(story)) / span(story) * 100 + 1.5) / ST)));
      const n = beats().length;
      return Math.max(0, Math.min(n - 1, Math.floor((scrollY - top(stage())) / beatH() + 0.45)));
    };
    const worldEls = [...document.querySelectorAll('.world')];
    const wscroll = document.querySelector('.wscroll');
    const wtrack = document.querySelector('.wtrack');
    const worldY = (i) => {
      if (live() && wideQ.matches) return top(wscroll) + (i === worldEls.length - 1 ? 95 : i * 18 + 5) / 100 * span(wscroll);
      let y = top(wtrack);
      for (let j = 0; j < i; j++) y += worldEls[j].offsetHeight;
      return y;
    };
    const secY = (id) => {
      const el = document.getElementById(id);
      if (!el) return scrollY;
      if (id === 'system') return top(el) + Math.max(0, (el.offsetHeight - innerHeight) * 0.6);
      return top(el);
    };
    const go = (y, smooth) => scrollTo({ top: Math.max(0, Math.round(y)), behavior: 'instant' });
    const targetY = (a) => {
      if (a.dataset.k != null) return beatY(+a.dataset.k);
      if (a.dataset.w != null) return worldY(+a.dataset.w);
      return secY(a.getAttribute('href').slice(1));
    };
    const center = (el) => { const r = el.getBoundingClientRect(); return r.top <= innerHeight / 2 && r.bottom > innerHeight / 2 && r.left <= innerWidth / 2 && r.right > innerWidth / 2; };

    const links = [...rail.querySelectorAll('.rail-list a')];
    const now = rail.querySelector('.rail-now');
    const [prev, next] = rail.querySelectorAll('.rail-step');
    const strip = [...document.querySelectorAll('.strip a')];
    const secs = strip.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
    let cur = -1;
    const setCur = (k) => {
      cur = k;
      links.forEach((a, i) => (i === k ? a.setAttribute('aria-current', 'step') : a.removeAttribute('aria-current')));
      const a = links[k];
      now.querySelector('b').textContent = a.textContent;
      now.querySelector('small').textContent = `${k + 1} из ${links.length}`;
      now.style.setProperty('--sw', a.style.getPropertyValue('--sw'));
      now.setAttribute('aria-label', `${a.textContent}, ${k + 1} из ${links.length}. Открыть меню`);
      prev.setAttribute('aria-disabled', String(k === 0));
      next.setAttribute('aria-disabled', String(k === links.length - 1));
    };
    let rq = 0, here = -1;
    const tick = () => {
      rq = 0;
      const r = story.getBoundingClientRect();
      const on = r.top < innerHeight * 0.5 && r.bottom > innerHeight * 0.75;
      if (on !== rail.classList.contains('is-on')) rail.classList.toggle('is-on', on);
      if (on) { const k = curBeat(); if (k !== cur) setCur(k); }
      const h = secs.findIndex((el) => el && center(el));
      if (h !== here) { here = h; strip.forEach((a, i) => (i === h ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'))); }
    };
    addEventListener('scroll', () => { if (!rq) rq = requestAnimationFrame(tick); }, { passive: true });
    addEventListener('resize', () => { if (!rq) rq = requestAnimationFrame(tick); });
    setCur(0);
    tick();

    rail.addEventListener('click', (e) => {
      const s = e.target.closest('[data-step]');
      if (s) {
        if (s.getAttribute('aria-disabled') === 'true') return;
        go(beatY(Math.max(0, Math.min(links.length - 1, cur + +s.dataset.step))), true);
        return;
      }
      const a = e.target.closest('a[data-k]');
      if (a) { e.preventDefault(); const k = +a.dataset.k; go(beatY(k), Math.abs(k - cur) <= 1); }
    });
    strip.forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); go(targetY(a), false); }));

    let back = mbtn, jumped = false;
    const markHere = () => {
      menu.querySelectorAll('[aria-current]').forEach((x) => x.removeAttribute('aria-current'));
      let el = null;
      if (rail.classList.contains('is-on')) el = menu.querySelector(`.mg-story a[data-k="${curBeat()}"]`);
      else {
        const w = worldEls.filter(center).pop();
        if (w) el = menu.querySelector(`[data-w="${worldEls.indexOf(w)}"]`);
        else {
          const s = ['app', 'author', 'system', 'price', 'zayavka'].find((id) => { const x = document.getElementById(id); return x && center(x); });
          if (s) el = menu.querySelector(`[data-s="${s}"]`);
        }
      }
      if (el) el.setAttribute('aria-current', 'location');
    };
    const openMenu = (from, k) => {
      back = from || mbtn;
      jumped = false;
      markHere();
      menu.showModal();
      mbtn.setAttribute('aria-expanded', 'true');
      if (k != null && k >= 0) { const a = menu.querySelector(`.mg-story a[data-k="${k}"]`); if (a) a.focus(); }
    };
    mbtn.addEventListener('click', () => openMenu(mbtn));
    now.addEventListener('click', () => openMenu(now, cur));
    document.getElementById('menu-x').addEventListener('click', () => menu.close());
    menu.addEventListener('close', () => {
      mbtn.setAttribute('aria-expanded', 'false');
      (jumped || !shown(back) || getComputedStyle(back).visibility === 'hidden' ? mbtn : back).focus({ preventScroll: true });
    });
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const f = [...menu.querySelectorAll('a[href], button:not([disabled])')].filter(shown);
      const a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    });
    const root = document.documentElement;
    const who = document.getElementById('who');
    const say = document.getElementById('aud-live');
    const pickers = [...document.querySelectorAll('[data-pick]')];
    const KEYS = [...new Set(pickers.map((b) => b.dataset.pick))];
    const nameOf = (k) => { const b = document.querySelector(`.fw-o[data-pick="${k}"] b`); return b ? b.textContent : k; };
    const setFor = (k, quiet) => {
      if (!KEYS.includes(k)) k = KEYS[0];
      if (!quiet) {
        root.classList.add('is-switching');
        clearTimeout(setFor.t);
        setFor.t = setTimeout(() => root.classList.remove('is-switching'), 400);
      }
      root.setAttribute('data-for', k);
      pickers.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pick === k)));
      if (quiet) return;
      const u = new URL(location.href);
      if (k === KEYS[0]) u.searchParams.delete('for'); else u.searchParams.set('for', k);
      history.replaceState(history.state, '', u);
      if (say) say.textContent = `Пример перестроен под нишу: ${nameOf(k)}`;
    };
    setFor(root.getAttribute('data-for') || KEYS[0], true);
    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-pick]');
      if (b) {
        setFor(b.dataset.pick);
        if (who && who.contains(b) && who.matches(':popover-open')) who.hidePopover();
        if (menu.open && menu.contains(b)) menu.close();
        return;
      }
      const sh = e.target.closest('[data-show]');
      if (sh) {
        const k = sh.dataset.show;
        setFor(k);
        const ax = document.getElementById('app');
        if (ax && (ax.dataset.has || '').split(' ').includes(k)) {
          requestAnimationFrame(() => { go(top(ax), false); ax.focus({ preventScroll: true }); });
          return;
        }
        go(top(story), false);
        const h = stage().querySelector('h2') || story;
        h.setAttribute('tabindex', '-1');
        h.focus({ preventScroll: true });
      }
    });

    menu.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      jumped = true;
      menu.close();
      go(targetY(a), false);
    });
  }

  const form = document.getElementById('lead');
  const sent = document.getElementById('sent');
  if (form && sent) {
    const btn = form.querySelector('button[type="submit"]');
    const msg = form.querySelector('.form-msg');
    const f = { name: form.elements.name, contact: form.elements.contact };
    const lead = window.swLead(form, 'lead');
    const setErr = (input, on) => {
      const ids = input.getAttribute('aria-describedby').split(' ');
      const e = document.getElementById(ids[ids.length - 1]);
      input.setAttribute('aria-invalid', on ? 'true' : 'false');
      e.hidden = !on;
    };
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      msg.textContent = '';
      const name = f.name.value.trim();
      const contact = f.contact.value.trim();
      setErr(f.name, !name);
      setErr(f.contact, contact.length < 3);
      if (!name) { f.name.focus(); return; }
      if (contact.length < 3) { f.contact.focus(); return; }
      btn.disabled = true;
      btn.textContent = 'Отправляем';
      const body = {
        name, contact,
        topic: form.elements.topic.value,
        idea: form.elements.idea.value.trim(),
        x_note: form.elements.x_note.value,
        ref: ('v5 ' + location.search).trim().slice(0, 150)
      };
      lead.send(body)
        .then((d) => {
          document.getElementById('sent-contact').textContent = contact;
          sent.querySelector('h3').textContent = d.dup ? 'Эта заявка у нас уже есть' : 'Заявка у нас';
          form.hidden = true;
          sent.hidden = false;
          sent.focus();
        })
        .catch((e) => lead.say(msg, e))
        .finally(() => {
          btn.disabled = false;
          btn.textContent = 'Получить разбор и расчёт';
        });
    });
    document.getElementById('again').addEventListener('click', () => {
      lead.reset();
      form.reset();
      setErr(f.name, false);
      setErr(f.contact, false);
      sent.hidden = true;
      form.hidden = false;
      f.name.focus();
    });
  }
})();
