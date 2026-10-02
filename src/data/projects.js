// Case study canvases live in /public/cases/<slug>/ as vertical WebP slices
// exported from Figma at 1.5x. `sliceHeights` keeps layout stable while lazy-loading.

const caseSlices = (dir, width, sliceHeights, bg) => ({
  dir,
  width,
  sliceHeights,
  slices: sliceHeights.map((h, i) => ({
    src: `${dir}/${String(i + 1).padStart(2, '0')}.webp`,
    height: h,
  })),
  bg,
});

export const projects = [
  {
    slug: 'bai',
    ru: {
      tagline: 'AI SaaS-платформа для врачей',
      tags: ['Продуктовый дизайн', 'UX/UI дизайн', 'Дизайн-система', 'AI-продукт'],
      industry: ['Медицина', 'AI', 'SaaS'],
      desc: 'Фоновый AI-ассистент, который превращает каждый приём в готовую клиническую запись: слушает разговор врача и пациента в реальном времени и собирает из него точную запись, готовую для медкарты. Я спроектировала весь UX: исследование и профили пользователей, сценарии AI-поддержки в реальном времени, шаблоны и макросы, пошаговую настройку приёма, админ-панель и полную дизайн-систему.',
    },
    title: 'BAI',
    tagline: 'AI SaaS platform for doctors',
    year: '2026',
    tags: ['Product Design', 'UX/UI Design', 'Design System', 'AI Product'],
    industry: ['Healthcare', 'AI', 'SaaS'],
    client: 'BAI',
    desc: 'An ambient AI that turns every consultation into a finished clinical note — capturing the live doctor–patient conversation in real time and structuring it into an accurate, EMR-ready record. I designed the end-to-end UX lifecycle: research and target user profiles, real-time AI support flows, templates and macros, guided visit setup, an admin dashboard, and a full design system built for modern, intuitive healthcare management.',
    image: '/mockups/bai.png',
    // transparent mockup: the card takes the page colour (white / black by theme)
    cardBg: 'var(--bg)',
    mockup: true,
    caseStudy: caseSlices(
      '/cases/bai',
      2880,
      [2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2050],
      '#FAFAFA'
    ),
  },
  {
    slug: 'services',
    ru: {
      tagline: 'Одна платформа для всей B2B-цепочки поставок',
      tags: ['Продуктовый дизайн', 'UX/UI дизайн', 'Веб и мобайл', 'Дизайн-система'],
      industry: ['B2B', 'Цепочки поставок', 'SaaS'],
      desc: 'B2B-платформа для ресторанов, поставщиков и производителей, которую я спроектировала от начала до конца. ServiceS заменяет разрозненные письма и таблицы одним связанным процессом: запросы цен, заказы, счета, цифровые каталоги и автоматические документы работают синхронно, от первого заказа ресторана до счёта производителя.',
    },
    title: 'ServiceS',
    tagline: 'One platform for the entire B2B supply chain',
    year: '2026',
    tags: ['Product Design', 'UX/UI Design', 'Web & Mobile', 'Design System'],
    industry: ['B2B', 'Supply Chain', 'SaaS'],
    client: 'ServiceS',
    desc: 'A B2B commerce platform designed and built end-to-end for restaurants, vendors and manufacturers. ServiceS replaces scattered email threads and spreadsheets with one connected flow — quotations, orders, invoices, digital catalogs and auto-generated documents, all in sync from a restaurant\'s first order to a manufacturer\'s invoice.',
    image: '/mockups/services.png',
    // transparent mockup: the card takes the page colour (white / black by theme)
    cardBg: 'var(--bg)',
    mockup: true,
    caseStudy: caseSlices(
      '/cases/services',
      2880,
      [2131, 2131, 2131, 2131, 2131, 2131, 2131, 2131, 2131, 2131, 2131, 2122],
      '#FFFFFF'
    ),
  },
  {
    slug: 'sovushkas-bag',
    ru: {
      tagline: 'Армянские ковровые сумки: традиция, вплетённая в моду',
      tags: ['UX-исследование', 'CJM', 'Прототипирование', 'UI дизайн', 'Бренд-дизайн'],
      industry: ['Мода', 'E-commerce'],
      desc: 'Полный цикл UX/UI для международного бренда сумок, от исследования до финального дизайна. Провела исследование пользователей и построила CJM, чтобы найти проблемные места, сделала анализ конкурентов, который показал пробелы в UX ниши, и перестроила сценарии под реальное поведение покупателей. Итоговый продукт получил узнаваемый визуальный стиль, верный эстетике и философии бренда.',
    },
    title: 'Sovushkas Bag',
    tagline: 'Armenian carpet bags — where tradition weaves into fashion',
    year: '2024',
    tags: ['UX Research', 'CJM', 'Prototyping', 'UI Design', 'Brand Design'],
    industry: ['Fashion', 'E-commerce'],
    client: 'Sovushkas Bag',
    desc: "Full UX/UI cycle for an international bag brand — from discovery to final design. Conducted user research and CJM to uncover friction points, ran competitive analysis that revealed niche UX gaps, and redesigned user flows around real customer behaviour. The final product delivers a distinct visual style that feels true to the brand's aesthetic and philosophy.",
    image: '/mockups/sovushka.png',
    cover: true,
    caseStudy: caseSlices(
      '/cases/sovushkas-bag',
      2710,
      [2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2178],
      '#FFFFFF'
    ),
  },
  {
    slug: 'soul-guide',
    ru: {
      tagline: 'Медитации, дневник и хорошее самочувствие',
      tags: ['UI/UX дизайн', 'Дизайн-система', 'Айдентика', 'Мобайл'],
      industry: ['Велнес', 'Ментальное здоровье'],
      desc: 'UI/UX дизайн велнес-приложения с медитациями, живыми сессиями, дневником и трекером настроения. Собрала дизайн-систему с нуля: компоненты, типографика, цвет, иконки. Разработала цельную айдентику, спокойную, личную и вызывающую доверие. Это приложение я также полностью разработала сама с помощью Cursor и Claude Code.',
    },
    title: 'Soul Guide',
    tagline: 'Meditate, journal and feel better',
    year: '2024',
    tags: ['UI/UX Design', 'Design System', 'Visual Identity', 'Mobile'],
    industry: ['Wellness', 'Mental Health'],
    client: 'Soul Guide',
    desc: 'End-to-end UI/UX design for a wellness app covering meditations, live sessions, journaling, and mood tracking. Built the full design system from scratch — components, typography, colour, iconography — and developed a cohesive visual identity that feels calm, personal, and trustworthy. I also fully developed this app myself using Cursor and Claude Code.',
    image: '/mockups/soulguide.png',
    // transparent mockup: the card takes the page colour (white / black by theme)
    cardBg: 'var(--bg)',
    mockup: true,
    caseStudy: caseSlices(
      '/cases/soul-guide',
      2145,
      [2021, 2021, 2021, 2021, 2021, 2021, 2021, 2020],
      '#FFFFFF'
    ),
  },
  {
    slug: 'architecture-bureau',
    ru: {
      tags: ['Айдентика', 'Веб-дизайн', 'Фронтенд-разработка', 'Полиграфия'],
      industry: ['Архитектура', 'Дизайн'],
      desc: 'Сольный проект с полным объёмом работ: стратегия, айдентика, печатные материалы и фронтенд. Разработала систему бренда, которая передаёт точность и видение, и собрала адаптивный лендинг на Framer с портфолио бюро. Все решения, от шрифта до вёрстки, принимала и реализовывала самостоятельно.',
    },
    title: 'Architecture Bureau',
    year: '2023',
    tags: ['Brand Identity', 'Web Design', 'Frontend Development', 'Print'],
    industry: ['Architecture', 'Design'],
    client: 'Architecture Bureau',
    desc: "Solo project covering the full scope — strategy, visual identity, print materials, and frontend implementation. Designed a brand system that communicates precision and vision, then built a responsive Framer landing page to showcase the bureau's portfolio. Every decision from typeface to layout was made and executed independently.",
    image: '/mockups/arch.png',
    cover: true,
  },
  {
    slug: 'vk-mini-app',
    ru: {
      tags: ['UI/UX дизайн', 'Гейм-дизайн', 'Мини-приложение', 'Мобайл'],
      industry: ['Развлечения', 'Соцсети'],
      desc: 'Игра-калькулятор для платформы мини-приложений VK, сделанная вместе с командой компании. Концепция соединяет пользу и юмор в формате, знакомом русскоязычной аудитории. Интерфейс понятен с первого взгляда, с ним весело взаимодействовать, и он органично смотрится в экосистеме VK.',
    },
    title: 'VK Mini App',
    year: '2023',
    tags: ['UI/UX Design', 'Game Design', 'Mini App', 'Mobile'],
    industry: ['Entertainment', 'Social Media'],
    client: 'VK',
    desc: "A creative calculator game built for VK's mini-app platform in collaboration with the company's team. The concept blends utility and humour in a format familiar to Russian-speaking users. Designed to be instantly understandable, fun to interact with, and native to the VK ecosystem.",
    image: '/mockups/vk.png',
    // transparent mockup: the card takes the page colour (white / black by theme)
    cardBg: 'var(--bg)',
    mockup: true,
  },
  {
    slug: 'devteam-space',
    ru: {
      tagline: 'Логотип и айдентика для devteam.space',
      tags: ['Логотип', 'Айдентика', 'Брендбук'],
      industry: ['Разработка ПО', 'IT-услуги'],
      desc: 'Логотип и айдентика для DevTeam Space, компании по IT-аутсорсингу и разработке ПО. Логотип отражает техническую экспертизу, командный дух и взгляд в будущее. Подготовила подробный брендбук: правила использования логотипа, охранное поле, палитра и типографика, чтобы бренд выглядел единообразно во всех точках контакта.',
    },
    title: 'DevTeam Space',
    tagline: 'Logo & brand identity for devteam.space',
    year: '2023',
    tags: ['Logo Design', 'Brand Identity', 'Brand Guidelines'],
    industry: ['Software Development', 'IT Services'],
    client: 'DevTeam Space',
    desc: 'Logo and brand identity for DevTeam Space, an IT outsourcing and software development company. The logo reflects the company\'s technical expertise, collaborative spirit, and forward-thinking approach. A comprehensive brand guide was developed — covering logo usage rules, clear space, colour palette, and typography — to ensure consistent representation across all touchpoints.',
    image: '/mockups/brands.png',
    // wide logo artwork: show it whole; the card continues the image's top and
    // bottom edge colours so the letterbox bands are seamless
    cardBg: 'linear-gradient(#084dff 50%, #163fab 50%)',
    caseStudy: caseSlices(
      '/cases/devteam-space',
      2400,
      [2184, 2184, 2184, 2184],
      '#FFFFFF'
    ),
  },
  {
    slug: 'evertop',
    ru: {
      tagline: 'AI, который читает резюме за вас',
      tags: ['Логотип', 'Айдентика', 'AI-продукт', 'Визуальный дизайн'],
      industry: ['Искусственный интеллект', 'HR Tech', 'Рекрутинг'],
      desc: 'Айдентика для Evertop, AI-агента для рекрутинга, который мгновенно сверяет резюме с описанием вакансии. Логотип и стиль должны были передавать интеллект, скорость и точность. Разработала современный технологичный знак и систему айдентики, которая поддерживает позиционирование продукта как умного инструмента найма.',
    },
    title: 'Evertop',
    tagline: 'The AI that reads resumes for you',
    year: '2023',
    tags: ['Logo Design', 'Brand Identity', 'AI Product', 'Visual Design'],
    industry: ['Artificial Intelligence', 'HR Tech', 'Recruitment'],
    client: 'Evertop',
    desc: 'Visual identity for Evertop, an AI-powered recruitment agent that instantly screens resumes against job descriptions. The logo and identity needed to communicate intelligence, speed, and precision. Designed a mark that feels modern and tech-native, paired with an identity system that supports the product\'s positioning as a smart hiring tool.',
    image: '/mockups/evertop.webp',
    cover: true,
    caseStudy: caseSlices(
      '/cases/evertop',
      2160,
      [2139, 2139, 2139, 2139, 2139, 2139, 2136],
      '#070B00'
    ),
  },
];

// Russian copy lives in `project.ru`; anything missing falls back to English.
export const localize = (project, lang) =>
  lang === 'ru' && project.ru ? { ...project, ...project.ru } : project;

export const getProject = (slug) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
