import { usePrefs } from '../context/Prefs';
import { CONTACT_HREF } from '../data/site';

const EMAIL = 'mane.airapetyan12345@gmail.com';

// `withPanel`: leave room for the fixed side panel (home page, desktop)
export default function Footer({ withPanel = false }) {
  const { t } = usePrefs();
  const c = t.contacts;

  const rows = [
    { label: c.telegram, value: '@maneaira', href: CONTACT_HREF },
    { label: c.email, value: EMAIL, href: `mailto:${EMAIL}` },
    {
      label: c.linkedin,
      value: 'Mane Airapetyan',
      href: 'https://www.linkedin.com/in/mane-airapetyan-38b023331/',
    },
  ];

  return (
    <footer id="footer" className={`section contacts ${withPanel ? 'with-panel' : ''}`}>
      <div className="label">{c.label}</div>
      <h2 className="contacts__heading">{c.heading}</h2>

      <ul className="contacts__list">
        {rows.map((row) => (
          <li key={row.label}>
            <a href={row.href} target="_blank" rel="noopener noreferrer">
              <span className="label">{row.label}</span>
              <span className="value">{row.value}</span>
              <span className="arrow" aria-hidden="true">↗</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="contacts__foot">
        <span>{t.name}</span>
        <span>© 2026</span>
      </div>
    </footer>
  );
}
