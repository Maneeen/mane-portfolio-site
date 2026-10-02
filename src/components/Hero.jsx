import { usePrefs } from '../context/Prefs';
import { useIsTablet } from '../hooks/useMediaQuery';
import SidePanel from './SidePanel';
import photo from '../assets/mane.webp';

export default function Hero() {
  const { t } = usePrefs();
  const isTablet = useIsTablet();

  return (
    <section id="hero" className="hero">
      {/* on desktop the word is the fixed .fly-word rendered by SidePanel */}
      {isTablet && <div className="hero__word" aria-hidden="true">MANE</div>}
      <img className="hero__photo" src={photo} alt={t.name} width="696" height="1252" />

      <h1 className="hero__role">
        <span className="sr-only">{t.name} — </span>
        {t.role[0]}
        <br />
        {t.role[1]}
      </h1>

      {/* on desktop the panel is fixed and rendered by Home */}
      {isTablet && <SidePanel className="hero__panel" />}
    </section>
  );
}
