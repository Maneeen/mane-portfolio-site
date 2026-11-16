// Tark Software: светлый лист поверх первого экрана, тон шапки, подвал из-под листа,
// мега-меню «Услуги», мобильное меню, появление блоков, вкладки «Что нужно бизнесу», форма заявки.
(() => {
  const root = document.documentElement;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Первый экран появляется, когда загрузились шрифты (но не дольше 700 мс)
  const reveal = () => root.classList.add('is-in');
  Promise.race([
    document.fonts ? document.fonts.ready : Promise.resolve(),
    new Promise((r) => setTimeout(r, 700)),
  ]).then(() => requestAnimationFrame(reveal));

  /* ---------- Тёмное → светлое по скроллу ----------
     Первый экран прилипает к верху, на него наезжает светлый лист.
     Если первый экран выше окна (телефон), он сначала доезжает до своего низа. */
  const hdr = document.querySelector('[data-hdr]');
  const pin = document.querySelector('[data-pin]');
  const hero = pin && pin.querySelector('.hero');
  const sheet = document.querySelector('[data-sheet]');
  const foot = document.querySelector('[data-foot]');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const darkPanels = [...document.querySelectorAll('[data-dark]')]; // чёрные блоки внутри листа

  // Высота «маленького» окна (100svh): не прыгает, когда на телефоне прячется адресная строка
  const probe = document.createElement('div');
  probe.setAttribute('aria-hidden', 'true');
  probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);

  let cover = 0;   // сколько прокрутки занимает наезд листа
  let start = 0;   // с какой прокрутки он начинается
  let covered = false;
  let tone = hdr ? hdr.dataset.tone : 'dark';
  let metaDark = true;

  const measure = () => {
    const vh = probe.offsetHeight || window.innerHeight;
    if (pin && hero && sheet) {
      const h = hero.offsetHeight;
      cover = Math.min(h, vh);
      start = Math.max(0, h - vh);
      pin.style.height = h + cover + 'px';
      hero.style.top = Math.min(0, vh - h) + 'px';
      sheet.style.marginTop = -cover + 'px';
    }
    // Подвал открывается из-под листа, только если целиком помещается в окно
    if (foot) foot.classList.toggle('is-reveal', foot.offsetHeight <= vh - 24);
    update();
  };

  const setTone = (t) => {
    if (!hdr || t === tone) return;
    tone = t;
    hdr.dataset.tone = t;
  };
  // Цвет строки браузера на телефоне: чёрный над первым экраном и подвалом, светлый над листом
  const setMeta = (dark) => {
    if (!themeMeta || dark === metaDark) return;
    metaDark = dark;
    themeMeta.content = dark ? '#000000' : '#f2f4f6';
  };
  const under = (el, y) => {
    const r = el.getBoundingClientRect();
    return r.top < y && r.bottom > y;
  };

  let ticking = false;
  function update() {
    ticking = false;
    if (hero && cover) {
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / cover));
      hero.style.setProperty('--p', p.toFixed(4));
      const now = p > 0.999;
      if (now !== covered) {
        covered = now;
        document.dispatchEvent(new CustomEvent('hero:cover', { detail: covered }));
      }
    }
    // Шапка светлая, пока под её серединой светлый лист, и тёмная над чёрными блоками
    if (sheet) {
      const mid = (hdr ? hdr.getBoundingClientRect().top : 12) + 30;
      const onSheet = under(sheet, mid);
      setMeta(!onSheet);
      setTone(onSheet && !darkPanels.some((el) => under(el, mid)) ? 'light' : 'dark');
    }
  }
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(() => measure());
    if (hero) ro.observe(hero);
    if (foot) ro.observe(foot);
  }
  measure();

  /* ---------- Мега-меню ---------- */
  const toggle = document.querySelector('[data-mega-toggle]');
  const mega = document.querySelector('[data-mega]');
  const bar = document.querySelector('.hdr-bar');

  if (toggle && mega && bar) {
    mega.hidden = false;
    let closeTimer = 0;

    const setMega = (open) => {
      clearTimeout(closeTimer);
      mega.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    const isOpen = () => mega.classList.contains('is-open');

    // Наведение открывает панель. Клик сразу после наведения её не закрывает
    let hoverOpenedAt = 0;
    toggle.addEventListener('click', () => {
      if (isOpen() && performance.now() - hoverOpenedAt < 700) return;
      setMega(!isOpen());
    });

    if (canHover) {
      toggle.addEventListener('pointerenter', () => {
        if (!isOpen()) hoverOpenedAt = performance.now();
        setMega(true);
      });
      // Закрываем с задержкой, чтобы курсор успел дойти до панели
      bar.addEventListener('pointerleave', () => {
        closeTimer = setTimeout(() => setMega(false), 220);
      });
      bar.addEventListener('pointerenter', () => clearTimeout(closeTimer));
      // Наведение на другие пункты меню закрывает панель
      bar.querySelectorAll('.nav-link:not([data-mega-toggle])').forEach((a) =>
        a.addEventListener('pointerenter', () => setMega(false))
      );
    }

    mega.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMega(false);
    });
    document.addEventListener('click', (e) => {
      if (isOpen() && !bar.contains(e.target)) setMega(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        setMega(false);
        toggle.focus();
      }
    });
  }

  /* ---------- Мобильное меню ---------- */
  const burger = document.querySelector('[data-burger]');
  const menu = document.querySelector('[data-mobile-menu]');

  if (burger && menu) {
    menu.hidden = false;
    menu.setAttribute('aria-hidden', 'true');
    menu.querySelectorAll('.mm-nav > *').forEach((el, i) => el.style.setProperty('--i', i));

    const setMenu = (open) => {
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      menu.inert = !open;
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
      if (hdr) hdr.classList.toggle('is-menu', open);
      root.style.overflow = open ? 'hidden' : '';
    };
    menu.inert = true;

    burger.addEventListener('click', () => setMenu(!menu.classList.contains('is-open')));
    menu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        setMenu(false);
        burger.focus();
      }
    });
    // Если окно стало широким, меню закрываем
    matchMedia('(min-width: 1121px)').addEventListener('change', (e) => {
      if (e.matches) setMenu(false);
    });
  }

  /* ---------- Появление блоков при прокрутке ---------- */
  const rv = document.querySelectorAll('[data-rv]');
  if ('IntersectionObserver' in window && !reduced) {
    const io = new IntersectionObserver((entries) => {
      let n = 0; // блоки, появившиеся одновременно, идут лесенкой
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.style.setProperty('--d', String(n++));
        el.classList.add('is-vis');
        io.unobserve(el);
        // после появления убираем служебный атрибут, чтобы работали обычные переходы элемента
        setTimeout(() => el.removeAttribute('data-rv'), 1300 + n * 90);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    rv.forEach((el) => io.observe(el));
  } else {
    rv.forEach((el) => { el.classList.add('is-vis'); el.removeAttribute('data-rv'); });
  }

  /* ---------- Вкладки «Что нужно вашему бизнесу?» ---------- */
  const tablist = document.querySelector('[data-needs]');
  if (tablist) {
    const tabs = [...tablist.querySelectorAll('[role="tab"]')];
    const narrow = matchMedia('(max-width: 900px)');
    const setOrient = () => tablist.setAttribute('aria-orientation', narrow.matches ? 'horizontal' : 'vertical');
    setOrient();
    narrow.addEventListener('change', setOrient);

    const select = (tab, focus) => {
      tabs.forEach((t) => {
        const on = t === tab;
        const panel = document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (!panel) return;
        if (on && panel.hidden) {
          panel.hidden = false;
          panel.classList.remove('is-entering');
          void panel.offsetWidth; // перезапуск анимации
          panel.classList.add('is-entering');
        } else if (!on) {
          panel.hidden = true;
        }
      });
      if (focus) tab.focus({ preventScroll: narrow.matches });
      // на телефоне вкладки в одну строку: докручиваем выбранную в зону видимости
      if (narrow.matches) {
        const left = tab.offsetLeft - (tablist.clientWidth - tab.offsetWidth) / 2;
        tablist.scrollTo({ left, behavior: reduced ? 'auto' : 'smooth' });
      }
    };

    tablist.addEventListener('click', (e) => {
      const t = e.target.closest('[role="tab"]');
      if (t) select(t);
    });
    tablist.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      const last = tabs.length - 1;
      const next = { ArrowDown: i + 1, ArrowRight: i + 1, ArrowUp: i - 1, ArrowLeft: i - 1, Home: 0, End: last }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  }

  /* ---------- Форма заявки ---------- */
  const form = document.querySelector('[data-lead-form]');
  if (!form) return;
  const done = document.querySelector('[data-form-done]');
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = submit.querySelector('.send-l');
  const submitText = submitLabel.textContent;
  const comment = form.elements.comment;
  const TG = 'https://t.me/'; // TODO: ссылка на Telegram Tark Software

  // Комментарий растёт по мере набора текста
  const grow = () => {
    if (!comment) return;
    comment.style.height = 'auto';
    comment.style.height = comment.scrollHeight + 'px';
  };
  if (comment) comment.addEventListener('input', grow);

  // Клик по услуге или кнопке с data-pick отмечает направление в форме и подписывает услугу в комментарий
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-pick]');
    if (!a) return;
    const key = a.dataset.pick;
    const box = form.querySelector(`[data-pick-key="${key}"]`);
    if (box) box.checked = true;
    if (key !== 'unknown') {
      const unsure = form.querySelector('[data-pick-key="unknown"]');
      if (unsure) unsure.checked = false;
    }
    const svc = a.dataset.service;
    if (svc && comment) {
      const auto = comment.dataset.auto;
      const untouched = !comment.value.trim() || comment.value === auto;
      if (untouched) {
        const list = auto ? auto.replace(/^Интересует: /, '').split(', ') : [];
        if (!list.includes(svc)) list.push(svc);
        comment.value = 'Интересует: ' + list.join(', ');
        comment.dataset.auto = comment.value;
        grow();
      }
    }
  });

  // Проверка полей
  const isContact = (raw) => {
    const s = raw.trim();
    if (s.replace(/\D/g, '').length >= 7) return true; // телефон
    if (/^(https?:\/\/)?t\.me\/[A-Za-z0-9_]{4,}/i.test(s)) return true; // ссылка t.me
    if (/^@?[A-Za-z][A-Za-z0-9_]{3,31}$/.test(s)) return true; // ник в Telegram
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); // почта тоже подойдёт
  };
  const checks = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Напишите, как к вам обращаться'),
    contact: (v) => (isContact(v) ? '' : 'Оставьте ник в Telegram или номер телефона'),
  };
  const setError = (input, msg) => {
    const field = input.closest('.field');
    field.classList.toggle('is-invalid', Boolean(msg));
    input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    field.querySelector('.field-err').textContent = msg;
  };
  const validate = () => {
    let first = null;
    Object.keys(checks).forEach((name) => {
      const input = form.elements[name];
      const msg = checks[name](input.value);
      setError(input, msg);
      if (msg && !first) first = input;
    });
    return first;
  };
  let tried = false;
  Object.keys(checks).forEach((name) => {
    form.elements[name].addEventListener('input', (e) => {
      if (tried) setError(e.target, checks[name](e.target.value));
    });
  });

  const setBusy = (busy) => {
    submit.disabled = busy;
    submit.setAttribute('aria-busy', String(busy));
    submitLabel.textContent = busy ? 'Отправляем…' : submitText;
  };
  const showDone = () => {
    // на широком экране держим высоту блока, чтобы страница не прыгала
    const body = form.parentElement;
    if (matchMedia('(min-width: 981px)').matches) body.style.minHeight = body.offsetHeight + 'px';
    form.hidden = true;
    done.hidden = false;
    done.focus({ preventScroll: true });
    done.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
  };
  const isLocal = location.protocol === 'file:' || ['localhost', '127.0.0.1', ''].includes(location.hostname);

  // когда начали заполнять: защита от ботов, которые отправляют форму мгновенно
  let formStarted = 0;
  form.addEventListener('focusin', () => { formStarted = formStarted || Date.now(); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    tried = true;
    status.textContent = '';
    const bad = validate();
    if (bad) { bad.focus(); return; }

    const data = new FormData(form);
    const payload = {
      name: data.get('name'),
      contact: data.get('contact'),
      topic: data.getAll('need').join(', '),
      idea: data.get('comment') || '',
      page: location.pathname.replace(/^\/+/, '') || 'index.html',
      ref: (location.search.slice(1) || document.referrer).slice(0, 160),
      x_note: data.get('x_note') || '',
      vid: (() => { try { return sessionStorage.getItem('ts_vid') || ''; } catch { return ''; } })(),
      fill_ms: formStarted ? Date.now() - formStarted : 0,
    };

    setBusy(true);
    try {
      // text/plain: простой запрос без предварительной проверки CORS, тело всё равно JSON
      const r = await fetch((window.TS_API || '').replace(/\/+$/, '') + '/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify(payload),
      });
      if (r.ok) { window.tsTrack && window.tsTrack('lead'); return showDone(); }
      // Локальный просмотр без сервера заявок: показываем экран успеха, ничего не отправляя
      if (isLocal && [404, 405, 501].includes(r.status)) {
        console.info('Локальный просмотр: /api/lead нет, заявка не отправлена', payload);
        return showDone();
      }
      throw new Error('status ' + r.status);
    } catch (err) {
      if (isLocal && location.protocol === 'file:') return showDone();
      status.innerHTML = `Не получилось отправить. Попробуйте ещё раз или <a href="${TG}" target="_blank" rel="noopener">напишите в Telegram</a>.`;
    } finally {
      setBusy(false);
    }
  });
})();
