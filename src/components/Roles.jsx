import { Link } from 'react-router-dom';
import { usePrefs } from '../context/Prefs';
import { roles } from '../data/roles';
import photo from '../assets/mane.webp';

// Pill tabs that switch between the portfolio's roles (separate pages)
export function RoleTabs({ current = 'product', className = '' }) {
  const { lang, t } = usePrefs();
  return (
    <nav className={`role-tabs ${className}`} aria-label={t.roles.label}>
      {roles.map((r) => (
        <Link
          key={r.id}
          to={r.path}
          className="pill role-tabs__item"
          aria-current={r.id === current ? 'page' : undefined}
        >
          {r[lang]}
        </Link>
      ))}
    </nav>
  );
}

// Preview cards of the other role pages (same hero, other caption), above the contacts
export function RolePreviews({ current = 'product' }) {
  const { lang, t } = usePrefs();
  const others = roles.filter((r) => r.id !== current);

  return (
    <section className="role-previews" aria-label={t.roles.label}>
      <div className="label">{t.roles.label}</div>
      <div className="role-previews__grid">
        {others.map((r) => (
          <Link key={r.id} to={r.path} className={`role-card role-card--${r.id}`}>
            <div className="role-card__word" aria-hidden="true">
              MANE
            </div>
            <img className="role-card__photo" src={photo} alt="" loading="lazy" />
            <div className="role-card__foot">
              <span className="role-card__title">{r[lang]}</span>
              <span className="role-card__arrow" aria-hidden="true">↗</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
