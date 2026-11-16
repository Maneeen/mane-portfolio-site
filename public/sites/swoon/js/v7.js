(() => {
  // огромное слово на первом экране занимает всю ширину
  const btn = document.querySelector('.hx-btn');
  function fit() {
    if (!btn) return;
    const f = btn.querySelector('.hx-fit'), sv = btn.querySelector('svg');
    // один размер для всех слов барабана: по самому длинному, чтобы строка не прыгала
    f.style.fontSize = '100px';
    const m = document.createElement('span');
    m.setAttribute('aria-hidden', 'true');
    m.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap';
    m.style.setProperty('display', 'inline-block', 'important');
    f.appendChild(m);
    let w = 1;
    [...f.children].forEach((s) => { if (s !== m) { m.textContent = s.textContent; w = Math.max(w, m.getBoundingClientRect().width); } });
    m.remove();
    const avail = btn.clientWidth - (sv ? sv.getBoundingClientRect().width + 8 : 0);
    f.style.fontSize = Math.max(20, Math.floor(100 * avail / w)) + 'px';
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  fit(); addEventListener('resize', fit);
  new MutationObserver(fit).observe(document.documentElement, { attributes: true, attributeFilter: ['data-for'] });

  // строка «Разбор продукта бесплатно»: метрики под блюром + заявка на полный отчёт
  const f = document.getElementById('rzs');
  if (!f) return;
  const res = document.getElementById('rzs-res');
  let url = '';
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const inp = document.getElementById('rzs-url'); url = inp.value.trim();
    if (!url) { inp.setAttribute('aria-invalid', 'true'); inp.focus(); return; }
    inp.removeAttribute('aria-invalid');
    document.getElementById('rzs-host').textContent = url.replace(/^https?:\/\//, '').replace(/\/$/, '').slice(0, 60);
    const st = document.getElementById('rzs-st');
    res.classList.remove('is-ready'); res.hidden = false; st.textContent = 'Смотрим сайт…';
    res.querySelectorAll('.rzs-list li').forEach((li, i) => li.style.setProperty('--i', i));
    setTimeout(() => { res.classList.add('is-ready'); st.textContent = 'Предварительно. Цифры откроются в полном отчёте'; }, 1400);
    res.scrollIntoView({ behavior: 'instant', block: 'nearest' });
  });
  const lf = document.getElementById('rzs-lead');
  const lead = window.swLead(lf, 'rzs');
  lf.addEventListener('submit', (e) => {
    e.preventDefault();
    const n = lf.elements.name, c = lf.elements.contact, msg = document.getElementById('rzs-msg'), btn = lf.querySelector('button');
    n.setAttribute('aria-invalid', !n.value.trim()); c.setAttribute('aria-invalid', c.value.trim().length < 3);
    if (!n.value.trim()) return n.focus();
    if (c.value.trim().length < 3) return c.focus();
    btn.disabled = true; btn.textContent = 'Отправляем'; msg.textContent = '';
    lead.send({ name: n.value.trim(), contact: c.value.trim(), topic: 'Разбор по ссылке', idea: 'Разбор продукта по ссылке: ' + url, url, x_note: lf.elements.x_note.value, ref: ('rzs ' + location.search).trim().slice(0, 150) })
      .then((d) => { lf.innerHTML = '<p class="rzs-lh">' + (d.dup ? 'Эта заявка у нас уже есть' : 'Заявка у нас') + '</p><p class="rzs-msg">Пришлём полный отчёт на ' + c.value.trim().replace(/[<>&]/g, '') + ' в течение рабочего дня.</p>'; })
      .catch((err) => { btn.disabled = false; btn.textContent = 'Получить полный отчёт'; lead.say(msg, err); });
  });
})();
