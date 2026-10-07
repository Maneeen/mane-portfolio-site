import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, localize } from '../data/projects';
import { usePrefs } from '../context/Prefs';
import { useIsTablet } from '../hooks/useMediaQuery';

function MobileWorks() {
  const { lang, t } = usePrefs();
  return (
    <section id="works" className="section mworks">
      {projects.map((raw) => {
        const project = localize(raw, lang);
        const mediaClass = project.cover ? 'is-cover' : project.mockup ? 'is-mockup' : project.cardBg ? 'is-fill' : '';
        return (
          <article key={project.slug} className="mwork">
            <Link to={`/work/${project.slug}`}>
              <h2 className="mwork__title">{project.title}</h2>
            </Link>

            <ul className="mwork__tags" aria-label={t.works.industry}>
              {project.industry.map((ind) => (
                <li key={ind} className="pill pill--tag">
                  {ind}
                </li>
              ))}
            </ul>

            <Link
              to={`/work/${project.slug}`}
              className={`mwork__media ${mediaClass}`}
              style={{ background: project.cardBg }}
              aria-label={`${project.title} — ${t.works.viewCase}`}
            >
              <img src={project.image} alt="" loading="lazy" />
            </Link>

            <Link to={`/work/${project.slug}`} className="btn btn--block mwork__cta">
              {t.works.viewCase}
              <span className="arrow" aria-hidden="true">↗</span>
            </Link>
          </article>
        );
      })}
    </section>
  );
}

// Scroll distance (in viewport heights) each project holds the stage for
const STEP_VH = 35;

export default function Works() {
  const sectionRef = useRef(null);
  const cursorRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsTablet();
  const { t, lang } = usePrefs();

  // The section is tall and its stage is sticky: scroll progress through the
  // section picks which project is on stage.
  useEffect(() => {
    if (isMobile) return;
    const onScroll = () => {
      const rect = sectionRef.current.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / travel, 0), 0.9999);
      setActiveIndex(Math.floor(progress * projects.length));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isMobile]);

  if (isMobile) {
    return <MobileWorks />;
  }

  const active = localize(projects[activeIndex], lang);

  const goTo = (i) => {
    const rect = sectionRef.current.getBoundingClientRect();
    const travel = rect.height - window.innerHeight;
    window.scrollTo({
      top: window.scrollY + rect.top + ((i + 0.5) / projects.length) * travel,
      behavior: 'smooth',
    });
  };

  const moveCursor = (e) => {
    cursorRef.current.style.left = `${e.clientX}px`;
    cursorRef.current.style.top = `${e.clientY}px`;
  };

  return (
    <section
      id="works"
      ref={sectionRef}
      className="works with-panel"
      style={{ height: `${projects.length * STEP_VH + 100}vh` }}
    >
      <div className="works__stage">
        <Link
          to={`/work/${active.slug}`}
          className="works__card"
          aria-label={`${active.title} — ${t.works.viewCase}`}
          onMouseEnter={(e) => {
            moveCursor(e);
            setHovered(true);
          }}
          onMouseMove={moveCursor}
          onMouseLeave={() => setHovered(false)}
        >
          {projects.map((project, i) => (
            <img
              key={project.slug}
              src={project.image}
              alt=""
              className={
                project.cover ? 'is-cover' : project.mockup ? 'is-mockup' : project.cardBg ? 'is-fill' : undefined
              }
              style={{ opacity: i === activeIndex ? 1 : 0, background: project.cardBg }}
            />
          ))}
        </Link>

        <ul className="works__titles">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <button aria-current={i === activeIndex ? 'true' : undefined} onClick={() => goTo(i)}>
                {project.title}
              </button>
            </li>
          ))}
        </ul>

        <div className="works__meta">
          <p className="works__desc">{active.desc}</p>
          <p className="works__tags">{active.tags.join(' · ')}</p>
        </div>
      </div>

      <span ref={cursorRef} className={`works__cursor ${hovered ? 'is-on' : ''}`} aria-hidden="true">
        {t.works.cursor}
      </span>
    </section>
  );
}
