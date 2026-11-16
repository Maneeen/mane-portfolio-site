// Per-role overrides of the home page copy. Anything not listed here falls
// back to the product-designer strings in strings.js.
// DRAFT: Mane reviews and replaces this copy.
export const roleStrings = {
  en: {
    marketing: {
      pageTitle: 'Mane Airapetyan — Marketing',
      role: ['Marketing'],
      roleSplit: { left: ['Marketing'], right: '' },
      experience: { value: '1', label: 'year in marketing', lines: ['1 year', 'in marketing'] },
      about: {
        statement:
          'I look at marketing as a designer and a researcher. First I find out who buys and why, then I build the copy and visuals around it.',
        experience: [
          'One year in marketing: audience research, ads on Yandex Direct and Avito, SEO, ad copy and landing pages.',
          'My design and sociology background helps me test ideas on real people before spending the budget.',
        ],
        skills: [
          {
            title: 'Ads & traffic',
            items: ['Yandex Direct', 'Avito ads', 'Ad moderation rules', 'Creative A/B tests', 'Landing pages', 'Email outreach'],
          },
          {
            title: 'SEO',
            items: ['Keyword research', 'On-page SEO', 'Search query analysis', 'SEO copy'],
          },
          {
            title: 'AI creatives',
            items: ['Nano Banana', 'Seedance', 'Kling', 'Midjourney', 'Runway', 'AI ad creatives and video', 'ChatGPT and Claude for copy'],
          },
          {
            title: 'Strategy',
            items: ['Target audience analysis', 'Customer personas', 'Positioning', 'Selling copy', 'Storytelling'],
          },
          {
            title: 'Analytics',
            items: ['Yandex Metrica', 'AARRR funnel', 'Python, SQL', 'Yandex DataLens'],
          },
          {
            title: 'Research',
            items: ['In-depth interviews', 'Surveys', 'Eye-tracking', 'Background in sociology (HSE)'],
          },
        ],
      },
      roleWorks: {
        label: 'Cases',
        title: 'Marketing cases are on the way',
        note: 'Strategies, ad campaigns and content will appear here soon.',
      },
    },
  },
  ru: {
    marketing: {
      pageTitle: 'Мане Айрапетян — маркетинг',
      role: ['Маркетинг'],
      roleSplit: { left: ['Маркетинг'], right: '' },
      experience: { value: '1', label: 'год в маркетинге', lines: ['1 год', 'в маркетинге'] },
      about: {
        statement:
          'Я смотрю на маркетинг глазами дизайнера и исследователя. Сначала разбираюсь, кто покупает и почему, потом собираю под это тексты и визуал.',
        experience: [
          'Год в маркетинге: анализ аудитории, реклама в Яндекс Директе и на Авито, SEO, рекламные тексты и посадочные страницы.',
          'Опыт в дизайне и социологии помогает проверять идеи на живых людях до того, как тратить бюджет.',
        ],
        skills: [
          {
            title: 'Реклама и трафик',
            items: ['Яндекс Директ', 'Реклама на Авито', 'Правила модерации рекламы', 'A/B-тесты креативов', 'Посадочные страницы', 'Email-рассылки'],
          },
          {
            title: 'SEO',
            items: ['Сбор семантики', 'Внутренняя оптимизация', 'Анализ поисковых запросов', 'SEO-тексты'],
          },
          {
            title: 'AI-креативы',
            items: ['Nano Banana', 'Seedance', 'Kling', 'Midjourney', 'Runway', 'Рекламные креативы и видео с AI', 'ChatGPT и Claude для текстов'],
          },
          {
            title: 'Стратегия',
            items: ['Анализ целевой аудитории', 'Портреты клиентов', 'Позиционирование', 'Продающие тексты', 'Сторителлинг'],
          },
          {
            title: 'Аналитика',
            items: ['Яндекс Метрика', 'Воронка AARRR', 'Python, SQL', 'Yandex DataLens'],
          },
          {
            title: 'Исследования',
            items: ['Глубинные интервью', 'Опросы', 'Eye-tracking', 'Социологическое образование (ВШЭ)'],
          },
        ],
      },
      roleWorks: {
        label: 'Кейсы',
        title: 'Кейсы по маркетингу скоро будут',
        note: 'Здесь появятся стратегии, рекламные кампании и контент.',
      },
    },
  },
};
