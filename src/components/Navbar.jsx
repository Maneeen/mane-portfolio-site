import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { usePrefs } from '../context/Prefs';
import { useIsTablet } from '../hooks/useMediaQuery';
import { sectionIds, CONTACT_HREF } from '../data/site';

function ThemeToggle() {
  const { theme, setTheme, t } = usePrefs();
  return (
    <div className="theme-toggle">
      <button aria-label={t.theme.light} aria-pressed={theme === 'light'} onClick={() => setTheme('light')}>
        <Sun size={18} />
      </button>
      <button aria-label={t.theme.dark} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')}>
        <Moon size={18} />
      </button>
    </div>
  );
}

function LangToggle() {
  const { lang, setLang } = usePrefs();
  return (
    <div className="lang-toggle">
      <button aria-pressed={lang === 'ru'} onClick={() => setLang('ru')}>Ru</button>
      <button aria-pressed={lang === 'en'} onClick={() => setLang('en')}>En</button>
    </div>
  );
}

// `home`: on the home page the side panel carries the menu on desktop,
// so the bar only shows a contact button elsewhere.
export default function Navbar({ home = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isTablet = useIsTablet();
  const navigate = useNavigate();
  const { t } = usePrefs();
  const floating = home && !isTablet;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // section lives on the home page — navigate there first
      navigate('/', { state: { scrollTo: id } });
    }
    setMenuOpen(false);
  };

  return (
    <>
      {/* desktop home: the flying word is the logo, so only the tools float top-right */}
      <header
        className={`topbar ${floating ? 'topbar--floating' : scrolled ? 'topbar--solid' : ''}`}
      >
        {!floating && <Link to="/" className="topbar__name">{t.name}</Link>}

        <div className="topbar__tools">
          <ThemeToggle />
          <LangToggle />
          {isTablet ? (
            <button className="burger" aria-label={t.menu.open} onClick={() => setMenuOpen(true)}>
              <span />
              <span />
              <span />
            </button>
          ) : (
            !home && (
              <a className="btn btn--sm" href={CONTACT_HREF} target="_blank" rel="noopener noreferrer">
                {t.contactMe}
              </a>
            )
          )}
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="menu-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="menu-overlay__head">
              <span className="topbar__name">{t.name}</span>
              <button className="menu-overlay__close" aria-label={t.menu.close} onClick={() => setMenuOpen(false)}>
                ×
              </button>
            </div>

            <nav className="menu-overlay__nav">
              {sectionIds.map((id) => (
                <button key={id} onClick={() => scrollTo(id)}>
                  {t.nav[id]}
                </button>
              ))}
            </nav>

            <a className="btn btn--block" href={CONTACT_HREF} target="_blank" rel="noopener noreferrer">
              {t.contactMe}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
