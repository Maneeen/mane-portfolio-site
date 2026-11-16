(() => {
  // «Как строится работа» на мобилке: карточки листаются, цифры синхронизированы
  const box = document.querySelector('.ps-cards');
  const dots = [...document.querySelectorAll('.ps-dot')];
  if (!box || !dots.length) return;
  const mq = matchMedia('(max-width: 760px)');
  const cards = [...box.children];
  let fromScroll = false, t = 0;
  dots.forEach((d, i) => d.addEventListener('click', () => {
    if (!mq.matches || fromScroll) return;
    const c = cards[i];
    box.scrollTo({ left: c.offsetLeft - (box.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
  }));
  box.addEventListener('scroll', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (!mq.matches) return;
      const mid = box.scrollLeft + box.clientWidth / 2;
      let best = 0, dist = 1e9;
      cards.forEach((c, i) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < dist) { dist = d; best = i; } });
      if (dots[best].getAttribute('aria-pressed') !== 'true') { fromScroll = true; dots[best].click(); fromScroll = false; }
    }, 120);
  }, { passive: true });
})();

