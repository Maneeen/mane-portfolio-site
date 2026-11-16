import { usePrefs } from '../context/Prefs';
import { marketingCases } from '../data/marketingCases';

const casesByRole = { marketing: marketingCases };

// Works block on the marketing page: short cases when there are
// some, a placeholder otherwise
export default function RoleWorks() {
  const { t, lang, role } = usePrefs();
  const w = t.roleWorks;
  const cases = casesByRole[role] ?? [];

  return (
    <section id="works" className="section with-panel role-works">
      <div className="label">{w.label}</div>

      {cases.length ? (
        <div className="mcases">
          {cases.map((raw) => {
            const c = raw[lang] ?? raw.en;
            return (
              <article key={raw.id} className={`mcase mcase--${raw.id}`}>
                <div className="mcase__media" style={{ background: raw.bg, padding: raw.pad }}>
                  {raw.image ? (
                    <img className="mcase__img" src={raw.image} alt="" loading="lazy" style={{ objectFit: raw.fit }} />
                  ) : (
                    raw.logos.map((src) => (
                      <img key={src} className="mcase__logo" src={src} alt="" loading="lazy" />
                    ))
                  )}
                </div>
                <div className="mcase__body">
                  <h3 className="mcase__title">{c.title}</h3>
                  <p className="mcase__desc">{c.desc}</p>
                  {c.metrics && (
                    <dl className="mcase__metrics">
                      {c.metrics.map((m) => (
                        <div key={m.label}>
                          <dt>{m.value}</dt>
                          <dd>{m.label}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  <ul className="mcase__tags">
                    {c.tags.map((tag) => (
                      <li key={tag} className="pill pill--tag">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="role-works__box">
          <h2 className="role-works__title">{w.title}</h2>
          <p className="role-works__note">{w.note}</p>
        </div>
      )}
    </section>
  );
}
