// Short marketing & research cases for the /marketing page. `image` is the
// picture Mane picked (shown whole, the card takes its background colour `bg`);
// `logos` are drawn on white when there is no picture.
// DRAFT copy: Mane checks the wording and numbers.
export const marketingCases = [
  {
    id: 'devteam-space',
    logos: ['/logos/devteam-space-icon.svg', '/logos/devteam-space-text.svg'],
    ru: {
      title: 'DevTeam Space: SEO и рассылки',
      desc: 'Настроила SEO сайта и придумала инструмент для рекламных рассылок. Он привёл компании 10 новых клиентов.',
      metrics: [
        { value: '10', label: 'новых клиентов' },
        { value: '$70 000', label: 'в месяц' },
      ],
      tags: ['SEO', 'Email-рассылки', 'Лидогенерация'],
    },
    en: {
      title: 'DevTeam Space: SEO and outreach',
      desc: 'Set up SEO for the website and came up with a tool for promotional email outreach. It brought the company 10 new clients.',
      metrics: [
        { value: '10', label: 'new clients' },
        { value: '$70,000', label: 'per month' },
      ],
      tags: ['SEO', 'Email outreach', 'Lead generation'],
    },
  },
  {
    id: 'avito',
    image: '/marketing/avito.webp',
    bg: '#FFFFFF',
    pad: '8%',
    ru: {
      title: 'Реклама на Авито',
      desc: 'Запускала и вела рекламу на Авито: писала объявления, подбирала продвижение и следила, какие объявления приводят заявки.',
      tags: ['Авито', 'Продвижение объявлений', 'Тексты'],
    },
    en: {
      title: 'Avito ads',
      desc: 'Launched and ran ads on Avito: wrote the listings, chose the promotion options and tracked which listings brought in leads.',
      tags: ['Avito', 'Listing promotion', 'Ad copy'],
    },
  },
  {
    id: 'direct',
    image: '/marketing/direct.webp',
    bg: '#FFFFFF',
    pad: '6%',
    ru: {
      title: 'Реклама в Яндекс Директе',
      desc: 'Настраивала кампании в Яндекс Директе: собирала поисковые запросы, писала объявления и проводила их через модерацию.',
      tags: ['Яндекс Директ', 'Семантика', 'Тексты объявлений'],
    },
    en: {
      title: 'Yandex Direct ads',
      desc: 'Set up Yandex Direct campaigns: collected search queries, wrote the ads and got them through moderation.',
      tags: ['Yandex Direct', 'Keywords', 'Ad copy'],
    },
  },
  {
    id: '2gis',
    image: '/marketing/2gis.webp',
    bg: '#FFFFFF',
    ru: {
      title: '2ГИС: исследование с eye-tracking',
      desc: 'Вместе с командой исследовали интерфейс 2ГИС с помощью eye-tracking: записывали, куда смотрят пользователи, и искали места, где интерфейс их путает.',
      tags: ['Eye-tracking', 'UX-исследование', 'Юзабилити'],
    },
    en: {
      title: '2GIS: eye-tracking study',
      desc: 'With my team we studied the 2GIS interface with eye-tracking: recorded where people look and found the spots where the interface confuses them.',
      tags: ['Eye-tracking', 'UX research', 'Usability'],
    },
  },
  {
    id: 'hse',
    image: '/marketing/hse.webp',
    bg: '#0D2D68',
    pad: '12%',
    ru: {
      title: 'Доверие к рекламе, созданной ИИ',
      desc: 'Дипломное исследование в ВШЭ. На прототипе ленты Instagram сравниваю, как люди доверяют ИИ-инфлюенсеру и сгенерированному товару и что меняет ярлык «AI info».',
      tags: ['Эксперимент', 'Прототип ленты', 'Опрос'],
    },
    en: {
      title: 'Trust in AI-generated ads',
      desc: 'My thesis at HSE University. On a prototype Instagram feed I compare how people trust an AI influencer versus a generated product, and what the "AI info" label changes.',
      tags: ['Experiment', 'Feed prototype', 'Survey'],
    },
  },
  {
    id: 'lavka',
    image: '/marketing/lavka.webp',
    fit: 'cover',
    bg: '#02ADFF',
    ru: {
      title: 'Спрос на Яндекс Лавку',
      desc: 'Исследование для ВШЭ: опрос о быстрой доставке продуктов и готовой еды. Собрала анкету с ветвлением под разные сегменты покупателей.',
      tags: ['Опрос', 'Сегментация', 'Google Forms'],
    },
    en: {
      title: 'Demand for Yandex Lavka',
      desc: 'A study for HSE University: a survey on fast grocery and ready-meal delivery. I built a branching questionnaire for different customer segments.',
      tags: ['Survey', 'Segmentation', 'Google Forms'],
    },
  },
];
