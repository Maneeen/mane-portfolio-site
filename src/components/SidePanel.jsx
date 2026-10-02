import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefs } from '../context/Prefs';
import { sectionIds, CONTACT_HREF } from '../data/site';

gsap.registerPlugin(ScrollTrigger);

// Must match .fly-word in globals.css
const WORD_VW = 0.305;
const WORD_LINE = 0.82;
const WORD_TOP = 76;
const LOGO_SIZE = 32;

function useActiveSection() {
  const [active, setActive] = useState(sectionIds[0]);

  useEffect(() => {
    const onScroll = () => {
      // the page bottom always belongs to the last section, even if it is short
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        setActive(sectionIds[sectionIds.length - 1]);
        return;
      }
      const line = window.innerHeight * 0.4;
      let current = sectionIds[0];
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return active;
}

// `fly` (desktop home): the panel is fixed on the left, but while the hero is
// on screen its pieces are spread across the hero — the big word, the menu as
// a row, the experience counter on the right. Scrolling the hero away flies
// them into the left column.
// `stacked` (mobile hero): the experience counter is two equal lines.
export default function SidePanel({ className = '', fly = false, stacked = false }) {
  const { t, lang } = usePrefs();
  const active = useActiveSection();
  const panelRef = useRef(null);
  const wordRef = useRef(null);

  useLayoutEffect(() => {
    if (!fly) return;
    const panel = panelRef.current;
    const word = wordRef.current;
    const pills = [...panel.querySelectorAll('.panel__nav .pill')];
    const exp = panel.querySelector('.panel__exp');

    const vw = () => document.documentElement.clientWidth;
    const rowY = () =>
      Math.min(WORD_TOP + vw() * WORD_VW * WORD_LINE + 28, window.innerHeight - 260);
    const panelTop = () => panel.getBoundingClientRect().top;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: () => `+=${window.innerHeight * 0.6}`,
          scrub: 0.4,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        word,
        {
          x: () => (vw() - word.offsetWidth) / 2 - word.offsetLeft,
          y: () => WORD_TOP - word.offsetTop,
          scale: 1,
          '--p': 0,
        },
        { x: 0, y: 0, scale: () => LOGO_SIZE / (vw() * WORD_VW), '--p': 1 },
        0
      );

      pills.forEach((pill, i) => {
        tl.fromTo(
          pill,
          {
            x: () => pills.slice(0, i).reduce((sum, p) => sum + p.offsetWidth + 8, 0) - pill.offsetLeft,
            y: () => rowY() - (panelTop() + pill.offsetTop),
          },
          { x: 0, y: 0 },
          0
        );
      });

      tl.fromTo(
        exp,
        {
          x: () => vw() - panel.offsetLeft * 2 - exp.offsetWidth - exp.offsetLeft,
          y: () => rowY() - (panelTop() + exp.offsetTop),
        },
        { x: 0, y: 0 },
        0
      );
    });

    return () => ctx.revert();
  }, [fly, lang]);

  return (
    <>
      {fly && (
        <div ref={wordRef} className="fly-word" aria-hidden="true">
          MANE
        </div>
      )}

      <aside ref={panelRef} className={`panel ${className}`}>
        {stacked ? (
          <div className="panel__exp panel__exp--stacked">
            {t.experience.lines[0]}
            <br />
            {t.experience.lines[1]}
          </div>
        ) : (
          <div className="panel__exp">
            <strong>{t.experience.value}</strong>
            <span>{t.experience.label}</span>
          </div>
        )}

        <nav className="panel__nav">
          {sectionIds.map((id) => (
            <button
              key={id}
              className="pill"
              aria-current={active === id ? 'true' : undefined}
              onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.nav[id]}
            </button>
          ))}
        </nav>

        <a className="pill pill--solid" href={CONTACT_HREF} target="_blank" rel="noopener noreferrer">
          {t.contactMe}
        </a>
      </aside>
    </>
  );
}
