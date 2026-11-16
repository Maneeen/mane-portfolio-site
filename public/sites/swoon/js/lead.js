(() => {
  const me = document.currentScript;
  const contact = (me && me.dataset.contact) || '';
  const PAUSE = [2000, 5000];
  const id = () => (crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '') : Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 32);
  const vid = () => { try { const v = sessionStorage.getItem('sw_vid') || ''; return /^[a-z0-9]{12,40}$/.test(v) ? v : ''; } catch { return ''; } };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const stop = (msg) => Object.assign(new Error(msg), { last: true });

  const post = (body, k) => {
    const ac = window.AbortController ? new AbortController() : null;
    const t = ac && setTimeout(() => ac.abort(), 20000);
    return fetch('/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, signal: ac ? ac.signal : undefined })
      .then((r) => {
        if (r.ok) return r.json().catch(() => null).then((d) => { if (!d || !d.ok) throw stop('fail'); return d; });
        if (r.status === 429) throw stop('limit');
        if (r.status < 500) throw stop('fail');
        throw new Error('fail');
      })
      .finally(() => clearTimeout(t))
      .catch((e) => {
        if (e.last || k >= PAUSE.length) throw e;
        return wait(PAUSE[k]).then(() => post(body, k + 1));
      });
  };

  window.swLead = (form, name) => {
    let lid = '', t0 = 0;
    form.addEventListener('focusin', () => { if (!t0) t0 = Date.now(); });
    const reset = () => { lid = ''; t0 = 0; };
    return {
      reset,
      send(data) {
        if (!lid) lid = id();
        const body = JSON.stringify(Object.assign({}, data, { form: name, page: location.pathname || '/', vid: vid(), lid, fill_ms: t0 ? Date.now() - t0 : 0 }));
        return post(body, 0).then((d) => { reset(); return d; });
      },
      say(el, e) {
        el.replaceChildren(e && e.message === 'limit'
          ? 'С вашего адреса уже было много заявок. Попробуйте через час.'
          : 'Не получилось отправить заявку: сервер не ответил. Введённое сохранено, попробуйте ещё раз через пару минут.');
        if (contact) el.append(document.createElement('br'), 'Или напишите нам: ' + contact);
      },
    };
  };
})();
