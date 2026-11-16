(() => {
  const still = matchMedia('(prefers-reduced-motion: reduce)');

  // карусель экранов
  const rl = document.getElementById('reel');
  if (rl) {
    const cards = [...rl.children];
    const paint = () => {
      const c = rl.scrollLeft + rl.clientWidth / 2;
      cards.forEach((el) => {
        const m = el.offsetLeft + el.offsetWidth / 2, d = Math.min(1, Math.abs(m - c) / (el.offsetWidth * 1.6));
        el.style.setProperty('--s', (1 - d * 0.22).toFixed(3));
        el.style.setProperty('--o', (1 - d * 0.55).toFixed(3));
        el.style.setProperty('--o2', d < 0.2 ? 1 : 0);
      });
    };
    rl.addEventListener('scroll', () => requestAnimationFrame(paint), { passive: true });
    addEventListener('resize', paint);
    const start = cards[Math.min(2, cards.length - 1)];
    requestAnimationFrame(() => { rl.scrollLeft = start.offsetLeft + start.offsetWidth / 2 - rl.clientWidth / 2; paint(); });
    let hold = 0, vis = false;
    const pause = () => { hold = Date.now() + 6000; };
    ['pointerdown', 'wheel', 'touchstart', 'focusin'].forEach((e) => rl.addEventListener(e, pause, { passive: true }));
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; }).observe(rl);
    setInterval(() => {
      if (still.matches || !vis || Date.now() < hold) return;
      const c = rl.scrollLeft + rl.clientWidth / 2;
      let i = cards.findIndex((el) => el.offsetLeft + el.offsetWidth / 2 > c + 4);
      if (i < 0) i = 0;
      const el = cards[i];
      rl.scrollTo({ left: el.offsetLeft + el.offsetWidth / 2 - rl.clientWidth / 2, behavior: i === 0 ? 'auto' : 'smooth' });
    }, 2600);
  }

  // шаги работы листаются сами
  const proc = document.querySelector('.proc');
  const dots = [...document.querySelectorAll('.ps-dot')];
  if (proc && dots.length) {
    const T = 3000; proc.style.setProperty('--ps-t', T + 'ms');
    let vis = false, hold = 0, timer = 0;
    const show = (i) => dots[i].click();
    const next = () => {
      if (still.matches || !vis || Date.now() < hold) return;
      const i = dots.findIndex((d) => d.getAttribute('aria-pressed') === 'true');
      auto = true; show((i + 1) % dots.length); auto = false;
    };
    let auto = false;
    dots.forEach((d) => d.addEventListener('click', () => {
      if (!auto) { hold = Date.now() + 10000; proc.classList.add('is-paused'); setTimeout(() => proc.classList.remove('is-paused'), 10000); }
      // перезапуск полоски
      d.style.animation = 'none'; void d.offsetWidth; d.style.animation = '';
    }));
    new IntersectionObserver((es) => { vis = es[0].isIntersecting; }, { threshold: 0.4 }).observe(proc);
    timer = setInterval(next, T);
    if (still.matches) proc.classList.add('is-paused');
  }

  // кнопка тарифа подставляет тариф в заявку
  document.querySelectorAll('[data-plan]').forEach((a) => a.addEventListener('click', () => {
    const idea = document.getElementById('f-idea');
    if (idea && !idea.value.includes('Тариф:')) idea.value = ('Тариф: ' + a.dataset.plan + '\n' + idea.value).trim();
  }));
})();
