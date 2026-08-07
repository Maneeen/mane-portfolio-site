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
    title: 'BAI',
    tagline: 'AI SaaS platform for doctors',
    year: '2026',
    tags: ['Product Design', 'UX/UI Design', 'Design System', 'AI Product'],
    industry: ['Healthcare', 'AI', 'SaaS'],
    client: 'BAI',
    desc: 'An ambient AI that turns every consultation into a finished clinical note — capturing the live doctor–patient conversation in real time and structuring it into an accurate, EMR-ready record. I designed the end-to-end UX lifecycle: research and target user profiles, real-time AI support flows, templates and macros, guided visit setup, an admin dashboard, and a full design system built for modern, intuitive healthcare management.',
    image: '/mockups/bai.png',
    caseStudy: caseSlices(
      '/cases/bai',
      2880,
      [2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2057, 2050],
      '#FAFAFA'
    ),
  },
  {
    slug: 'services',
    title: 'ServiceS',
    tagline: 'One platform for the entire B2B supply chain',
    year: '2026',
    tags: ['Product Design', 'UX/UI Design', 'Web & Mobile', 'Design System'],
    industry: ['B2B', 'Supply Chain', 'SaaS'],
    client: 'ServiceS',
    desc: 'A B2B commerce platform designed and built end-to-end for restaurants, vendors and manufacturers. ServiceS replaces scattered email threads and spreadsheets with one connected flow — quotations, orders, invoices, digital catalogs and auto-generated documents, all in sync from a restaurant\'s first order to a manufacturer\'s invoice.',
    image: '/mockups/services.png',
    caseStudy: caseSlices(
      '/cases/services',
      2880,
      [2131, 2131, 2131, 2131, 2131, 2131, 2131, 2131, 2131, 2131, 2131, 2122],
      '#FFFFFF'
    ),
  },
  {
    slug: 'sovushkas-bag',
    title: 'Sovushkas Bag',
    tagline: 'Armenian carpet bags — where tradition weaves into fashion',
    year: '2024',
    tags: ['UX Research', 'CJM', 'Prototyping', 'UI Design', 'Brand Design'],
    industry: ['Fashion', 'E-commerce'],
    client: 'Sovushkas Bag',
    desc: "Full UX/UI cycle for an international bag brand — from discovery to final design. Conducted user research and CJM to uncover friction points, ran competitive analysis that revealed niche UX gaps, and redesigned user flows around real customer behaviour. The final product delivers a distinct visual style that feels true to the brand's aesthetic and philosophy.",
    image: '/mockups/sovushka.png',
    caseStudy: caseSlices(
      '/cases/sovushkas-bag',
      2710,
      [2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2185, 2178],
      '#FFFFFF'
    ),
  },
  {
    slug: 'soul-guide',
    title: 'Soul Guide',
    tagline: 'Meditate, journal and feel better',
    year: '2024',
    tags: ['UI/UX Design', 'Design System', 'Visual Identity', 'Mobile'],
    industry: ['Wellness', 'Mental Health'],
    client: 'Soul Guide',
    desc: 'End-to-end UI/UX design for a wellness app covering meditations, live sessions, journaling, and mood tracking. Built the full design system from scratch — components, typography, colour, iconography — and developed a cohesive visual identity that feels calm, personal, and trustworthy. I also fully developed this app myself using Cursor and Claude Code.',
    image: '/mockups/soulguide.png',
    caseStudy: caseSlices(
      '/cases/soul-guide',
      2145,
      [2021, 2021, 2021, 2021, 2021, 2021, 2021, 2020],
      '#FFFFFF'
    ),
  },
  {
    slug: 'architecture-bureau',
    title: 'Architecture Bureau',
    year: '2023',
    tags: ['Brand Identity', 'Web Design', 'Frontend Development', 'Print'],
    industry: ['Architecture', 'Design'],
    client: 'Architecture Bureau',
    desc: "Solo project covering the full scope — strategy, visual identity, print materials, and frontend implementation. Designed a brand system that communicates precision and vision, then built a responsive Framer landing page to showcase the bureau's portfolio. Every decision from typeface to layout was made and executed independently.",
    image: '/mockups/arch.png',
  },
  {
    slug: 'vk-mini-app',
    title: 'VK Mini App',
    year: '2023',
    tags: ['UI/UX Design', 'Game Design', 'Mini App', 'Mobile'],
    industry: ['Entertainment', 'Social Media'],
    client: 'VK',
    desc: "A creative calculator game built for VK's mini-app platform in collaboration with the company's team. The concept blends utility and humour in a format familiar to Russian-speaking users. Designed to be instantly understandable, fun to interact with, and native to the VK ecosystem.",
    image: '/mockups/vk.png',
  },
  {
    slug: 'devteam-space',
    title: 'DevTeam Space',
    tagline: 'Logo & brand identity for devteam.space',
    year: '2023',
    tags: ['Logo Design', 'Brand Identity', 'Brand Guidelines'],
    industry: ['Software Development', 'IT Services'],
    client: 'DevTeam Space',
    desc: 'Logo and brand identity for DevTeam Space, an IT outsourcing and software development company. The logo reflects the company\'s technical expertise, collaborative spirit, and forward-thinking approach. A comprehensive brand guide was developed — covering logo usage rules, clear space, colour palette, and typography — to ensure consistent representation across all touchpoints.',
    image: '/mockups/brands.png',
    caseStudy: caseSlices(
      '/cases/devteam-space',
      2400,
      [2184, 2184, 2184, 2184],
      '#FFFFFF'
    ),
  },
  {
    slug: 'evertop',
    title: 'Evertop',
    tagline: 'The AI that reads resumes for you',
    year: '2023',
    tags: ['Logo Design', 'Brand Identity', 'AI Product', 'Visual Design'],
    industry: ['Artificial Intelligence', 'HR Tech', 'Recruitment'],
    client: 'Evertop',
    desc: 'Visual identity for Evertop, an AI-powered recruitment agent that instantly screens resumes against job descriptions. The logo and identity needed to communicate intelligence, speed, and precision. Designed a mark that feels modern and tech-native, paired with an identity system that supports the product\'s positioning as a smart hiring tool.',
    image: '/mockups/evertop.svg',
    small: true,
    caseStudy: caseSlices(
      '/cases/evertop',
      2160,
      [2139, 2139, 2139, 2139, 2139, 2139, 2136],
      '#070B00'
    ),
  },
];

export const getProject = (slug) => projects.find((p) => p.slug === slug);

export const getNextProject = (slug) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
