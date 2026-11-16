(() => {
  const root = document.documentElement;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const word = document.querySelector('.hx .hx-word');
  const fit = word && word.querySelector('.hx-fit');
  if (fit) {
    const spin = () => {
      const vam = !root.hasAttribute('data-pick') && fit.querySelector('[data-v="vam"]');
      const reveal = () => { word.classList.add('is-done'); if (vam) word.classList.add('is-vam'); dispatchEvent(new Event('resize')); };
      // медленная сеть: слово уже показалось само, второй раз не крутим
      if (still.matches || getComputedStyle(fit).opacity === '1') { reveal(); return; }
      const spans = [...fit.children].filter((s) => vam || s.dataset.v !== 'vam');
      const n = spans.length;
      const t = vam ? spans.indexOf(vam) : spans.findIndex((s) => s.dataset.v === root.getAttribute('data-for'));
      if (t < 0 || n < 3) { reveal(); return; }
      const steps = [...Array(n - 1).fill(0).map((_, j) => Math.round(110 + 260 * (j / (n - 2)) ** 2)), 420];
      let i = ((t - steps.length) % n + n) % n;
      let k = 0;
      word.classList.add('is-spin');
      const done = () => {
        word.classList.remove('is-spin');
        reveal();
        spans.forEach((s) => { s.removeAttribute('data-spin'); s.style.removeProperty('--dd'); });
      };
      const show = () => {
        spans.forEach((s) => s.removeAttribute('data-spin'));
        i = (i + 1) % n;
        spans[i].style.setProperty('--dd', Math.min(260, Math.max(90, steps[k])) + 'ms');
        spans[i].setAttribute('data-spin', '');
        const wait = steps[k];
        k += 1;
        setTimeout(k < steps.length ? show : done, wait);
      };
      show();
    };
    new MutationObserver(() => { if (!word.classList.contains('is-done')) return; const on = root.getAttribute('data-for') === 'vam'; if (on !== word.classList.contains('is-vam')) { word.classList.toggle('is-vam', on); dispatchEvent(new Event('resize')); } }).observe(root, { attributes: true, attributeFilter: ['data-for'] });
    const go = () => setTimeout(spin, 100);
    if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 600))]).then(go); else go();
  }
})();
