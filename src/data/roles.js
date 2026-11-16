// The three sides of the portfolio. Each is the home page layout with its own
// copy (see i18n/roleStrings.js); product design lives at the root.
export const roles = [
  { id: 'product', path: '/', en: 'Product designer', ru: 'Продуктовый дизайнер' },
  { id: 'marketing', path: '/marketing', en: 'Marketing', ru: 'Маркетинг' },
];

export const getRole = (id) => roles.find((r) => r.id === id);
