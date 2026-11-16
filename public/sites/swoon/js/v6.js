(() => {
  // шаги работы
  const dots = [...document.querySelectorAll('.ps-dot')], cards = [...document.querySelectorAll('.ps-card')];
  dots.forEach((d) => d.addEventListener('click', () => {
    dots.forEach((x) => x.setAttribute('aria-pressed', String(x === d)));
    cards.forEach((c) => (c.hidden = c.dataset.i !== d.dataset.i));
  }));

  // разбор продукта: квиз → оценка потенциала и точки роста
  const qEl = document.getElementById('rz-q'), resEl = document.getElementById('rz-res'), prog = document.getElementById('rz-prog');
  if (!qEl) return;
  const NICHES = [['food', 'Питание и здоровье'], ['fit', 'Фитнес или йога'], ['beauty', 'Красота и стиль'], ['edu', 'Обучение и репетиторство'], ['other', 'Другое']];
  const Q = {
    has: { t: 'У вас уже есть продукт?', o: [['yes', 'Да, продаю курс, марафон или консультации'], ['no', 'Пока нет, но есть аудитория']] },
    niche: { t: 'Ваша ниша?', o: NICHES },
    what: { t: 'Что продаёте сейчас?', o: [['Курс', 'Курс'], ['Марафон', 'Марафон'], ['Консультации', 'Консультации'], ['Клуб или подписку', 'Клуб или подписку']] },
    price: { t: 'Сколько стоит основной тариф?', o: [['3000', 'До 5 000 ₽'], ['10000', '5 000–15 000 ₽'], ['25000', '15 000–40 000 ₽'], ['50000', 'Больше 40 000 ₽']] },
    size: { t: 'Сколько у вас подписчиков?', o: [['3000', 'До 5 тысяч'], ['20000', 'От 5 до 50 тысяч'], ['80000', 'Больше 50 тысяч']] },
    buy: { t: 'Как человек покупает?', o: [['dm', 'Пишет в личку, платит переводом'], ['link', 'По ссылке на оплату'], ['site', 'На сайте с тарифами и оплатой']] },
    after: { t: 'Что происходит после покупки?', o: [['none', 'Курс закончился, человек ушёл'], ['next', 'Предлагаю следующий продукт'], ['club', 'Остаётся в клубе по подписке']] },
    where: { t: 'Где основная аудитория?', o: [['Instagram', 'Instagram'], ['Telegram', 'Telegram'], ['YouTube', 'YouTube'], ['VK', 'VK']] },
    time: { t: 'Сколько времени готовы отдавать продукту?', o: [['low', 'Пару часов в неделю'], ['mid', 'Несколько часов в неделю'], ['high', 'Готов вести поток каждый день']] },
  };
  const FLOW = { yes: ['has', 'niche', 'what', 'price', 'size', 'buy', 'after'], no: ['has', 'niche', 'size', 'where', 'time'] };
  let a = {}, path = ['has'];
  const label = (k, v) => (Q[k].o.find((o) => o[0] === v) || [, v])[1];
  const rub = (n) => (Math.round(n / 1000) * 1000).toLocaleString('ru-RU') + ' ₽';
  const esc = (t) => String(t).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));

  function ask() {
    const k = path[path.length - 1], total = a.has ? FLOW[a.has].length : FLOW.yes.length, n = path.length;
    prog.style.width = Math.round(((n - 1) / total) * 100) + '%';
    qEl.hidden = false; resEl.hidden = true;
    qEl.innerHTML = `<p class="rz-n">Вопрос ${n} из ${total}</p><h3>${Q[k].t}</h3><div class="rz-ops">${Q[k].o.map(([v, t]) => `<button class="rz-op" type="button" data-val="${v}">${t}</button>`).join('')}</div>` +
      (k === 'niche' ? '<form class="rz-other" hidden><input type="text" maxlength="60" placeholder="Например, психология или финансы" aria-label="Ваша ниша"><button class="pill solid" type="submit">Дальше</button></form>' : '') +
      (n > 1 ? '<button class="rz-back" type="button">← Назад</button>' : '');
    qEl.querySelectorAll('.rz-op').forEach((b) => b.addEventListener('click', () => {
      if (k === 'niche' && b.dataset.val === 'other') {
        const f = qEl.querySelector('.rz-other'); f.hidden = false; f.querySelector('input').focus();
        f.onsubmit = (e) => { e.preventDefault(); const v = f.querySelector('input').value.trim(); if (!v) return f.querySelector('input').focus(); a.nicheText = v; pick(k, 'other'); };
        return;
      }
      pick(k, b.dataset.val);
    }));
    const back = qEl.querySelector('.rz-back');
    if (back) back.addEventListener('click', () => { path.pop(); delete a[path[path.length - 1]]; ask(); });
  }
  function pick(k, v) {
    a[k] = v;
    const flow = FLOW[a.has], i = flow.indexOf(k);
    if (i < flow.length - 1) { path.push(flow[i + 1]); ask(); } else result();
  }
  const nicheName = () => (a.niche === 'other' ? a.nicheText : label('niche', a.niche));

  // что выгоднее всего запускать первым: ниша × аудитория
  const START = {
    food: { 3000: ['Личное ведение питания на 2 недели', 'разбор тарелок в чате и меню под человека'], 20000: ['Марафон с меню на 21 день', 'тарифы «сама», «с разбором», «лично» и общий чат потока'], 80000: ['Курс с потоками и клуб с меню на месяц', 'курс продаёт поток, клуб приносит деньги между потоками'] },
    fit: { 3000: ['Онлайн-тренировки в малой группе', 'до 10 человек, вы видите технику каждого'], 20000: ['Программа на 4 недели с тренировкой дня', 'приложение показывает, что делать сегодня, вы проверяете отчёты'], 80000: ['Клуб по подписке с тренировками', 'новые тренировки каждую неделю, оплата раз в месяц'] },
    beauty: { 3000: ['Разбор по фото', 'человек присылает фото, вы отвечаете голосом или текстом'], 20000: ['Мини-курс с разбором домашки', 'короткие уроки и проверка фото от вас'], 80000: ['Курс с тарифами и клуб', 'тарифы под разный бюджет и клуб для тех, кто закончил'] },
    edu: { 3000: ['Пробный урок и мини-группа', 'пробный урок продаёт группу без уговоров'], 20000: ['Онлайн-группа с домашкой и проверкой', 'ученик видит план на день, вы видите, кто отстаёт'], 80000: ['Курс с потоками и кабинет ученика', 'потоки идут по расписанию, проверку можно делить с кураторами'] },
    other: { 3000: ['Консультации пакетом', 'не одна встреча, а три с заданиями между ними'], 20000: ['Марафон на 2–3 недели', 'короткий срок, понятный результат, поток раз в месяц'], 80000: ['Курс с потоками и клуб', 'курс даёт выручку в запуск, клуб между запусками'] },
  };
  const PRICE = { 3000: 5000, 20000: 9000, 80000: 15000 };
  const WHY_TIME = { low: 'Времени немного, поэтому почти всё, что можно, делает автоматика: бот отвечает и продаёт, оплата и доступ без вас.', mid: 'На это хватит нескольких часов в неделю: вы ведёте эфиры и проверяете, рутину забирает бот.', high: 'Раз готовы вести поток каждый день, можно брать больше за личное участие: это самый дорогой тариф.' };

  function result() {
    prog.style.width = '100%'; qEl.hidden = true; resEl.hidden = false;
    let html = '', summary = [];
    const size = +a.size, reach = size * 0.15;
    if (a.has === 'yes') {
      const price = +a.price;
      const conv = { dm: 0.008, link: 0.013, site: 0.02 }[a.buy];
      const now = reach * conv * price;
      const buyersSys = reach * 0.018;
      const club = a.after === 'club' ? 0 : buyersSys * 0.3 * Math.max(990, price * 0.15) * 3;
      const upsell = a.after === 'none' ? buyersSys * 0.15 * price : 0;
      const sys = Math.min(buyersSys * price + club + upsell, now * 3), x = Math.max(1.3, sys / now), xs = (Math.round(x * 10) / 10).toString().replace('.', ',');
      const pts = [];
      if (a.buy !== 'site') pts.push(['Продажи без вас', a.buy === 'dm' ? 'Сейчас каждую покупку вы закрываете в переписке, и ночью продажи стоят.' : 'Ссылка на оплату есть, но человеку не с чем сравнить тарифы и не у кого спросить.', 'Бот в Telegram отвечает, подбирает тариф и присылает оплату']);
      if (a.after !== 'club') pts.push(['Деньги между потоками', 'После курса человек уходит, и следующую продажу приходится начинать с нуля.', 'Клуб по подписке, где ученики остаются после курса']);
      if (a.after === 'none') pts.push(['Второй продукт', 'Тем, кто дошёл до конца, нечего купить дальше.', 'Продолжение или личный тариф прямо в приложении курса']);
      pts.push(['Кто бросил и почему', 'Обычно до конца курса доходит меньше половины учеников. Отзывы и повторные покупки дают только те, кто дошёл.', 'Приложение курса с прогрессом и напоминаниями']);
      pts.push(['Откуда покупатели', 'Видно, какой пост или канал привёл людей, и не приходится гадать, что снимать дальше.', 'Кабинет с цифрами по каждому потоку']);
      html = `<p class="rz-k">${esc(nicheName())} · ${esc(a.what.toLowerCase())} · ${label('price', a.price)}</p>
<h3>С системой поток может приносить примерно в ${xs} раза больше</h3>
<div class="rz-num"><div><small>Сейчас за поток</small><b>≈ ${rub(now)}</b></div><div class="is-up"><small>С ботом, оплатой и клубом</small><b>≈ ${rub(sys)}</b></div></div>
<p class="rz-note">Грубая оценка: пост видят около 15% подписчиков, покупают 1–2% из них. Точнее посчитаем по вашим цифрам.</p>
<p class="rz-sub">Где эти деньги</p><ul class="rz-gaps">${pts.slice(0, 4).map((g) => `<li><b>${g[0]}</b>${g[1]}<em>Что поможет: ${g[2]}</em></li>`).join('')}</ul>`;
      summary = [`Ниша: ${nicheName()}`, `Продаю: ${a.what}`, `Цена: ${label('price', a.price)}`, `Подписчики: ${label('size', a.size)}`, `Покупка: ${label('buy', a.buy)}`, `После покупки: ${label('after', a.after)}`];
    } else {
      const [name, how] = START[a.niche][a.size], price = PRICE[a.size];
      const first = reach * 0.015 * price;
      const mods = a.where === 'Telegram' ? 'Бот в Telegram, оплата и приложение для учеников' : `Страница с тарифами, бот в Telegram и оплата. Аудитория в ${a.where}, поэтому бот принимает людей из ссылки в профиле`;
      html = `<p class="rz-k">${esc(nicheName())} · ${label('size', a.size).toLowerCase()} подписчиков</p>
<h3>Самый выгодный старт для вас: ${name.charAt(0).toLowerCase() + name.slice(1)}</h3>
<p>${how.charAt(0).toUpperCase() + how.slice(1)}.</p>
<div class="rz-num"><div class="is-up"><small>Первый запуск может принести</small><b>≈ ${rub(first)}</b></div><div><small>При цене тарифа около</small><b>${rub(price)}</b></div></div>
<p class="rz-note">Грубая оценка: пост видят около 15% подписчиков, покупают около 1,5% из них.</p>
<ul class="rz-gaps"><li><b>Почему именно это</b>${WHY_TIME[a.time]}</li><li><b>Из чего собрать</b>${mods}. Клуб и приложение можно добавить после первых продаж.</li></ul>`;
      summary = ['Продукта пока нет', `Ниша: ${nicheName()}`, `Подписчики: ${label('size', a.size)}`, `Аудитория: ${a.where}`, `Время: ${label('time', a.time)}`];
    }
    if (a.has === 'yes') html += `<div class="rz-link"><label for="rz-url">Ссылка на продукт <span>(можно пропустить)</span></label><input id="rz-url" type="url" inputmode="url" placeholder="Сайт, Taplink или Telegram-канал" maxlength="300"><small>Посчитаем по вашим реальным тарифам и добавим в разбор.</small></div>`;
    html += `<div class="rz-go"><button class="pill solid big" type="button" id="rz-send">${a.has === 'yes' ? 'Получить разбор с расчётом' : 'Получить план запуска'}</button><button class="pill line big" type="button" id="rz-again">Пройти заново</button></div>`;
    resEl.innerHTML = html;
    document.getElementById('rz-again').addEventListener('click', () => { a = {}; path = ['has']; ask(); });
    document.getElementById('rz-send').addEventListener('click', () => {
      const u = document.getElementById('rz-url'), url = u ? u.value.trim() : '';
      const idea = document.getElementById('f-idea'), topic = document.getElementById('f-topic');
      if (idea) idea.value = 'Разбор продукта:\n' + summary.join('\n') + (url ? '\nСсылка: ' + url : '');
      if (topic) topic.value = a.has === 'yes' ? a.what : 'Пока думаю';
      const z = document.getElementById('zayavka');
      if (z) { z.scrollIntoView({ behavior: 'instant' }); setTimeout(() => document.getElementById('f-name')?.focus({ preventScroll: true }), 300); }
    });
  }
  ask();
})();
