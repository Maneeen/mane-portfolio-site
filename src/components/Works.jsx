import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { projects, localize } from '../data/projects';
import { usePrefs } from '../context/Prefs';
import { useIsMobile } from '../hooks/useMediaQuery';

function DetailRow({ label, children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 16,
        padding: '14px 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>{label}</span>
      <div style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function ViewCaseButton({ slug }) {
  const { t } = usePrefs();
  return (
    <Link to={`/work/${slug}`} className="btn-outline" style={{ marginTop: 20 }}>
      {t.works.viewCase}
      <span className="arrow" aria-hidden="true">↗</span>
    </Link>
  );
}

function ProjectDetails({ project }) {
  const { t } = usePrefs();
  return (
    <div>
      <DetailRow label={t.works.overview}>
        <p style={{ margin: 0 }}>{project.desc}</p>
      </DetailRow>
      <DetailRow label={t.works.tags}>
        {project.tags.map((tag) => (
          <p key={tag} style={{ margin: 0 }}>{tag}</p>
        ))}
      </DetailRow>
      <DetailRow label={t.works.industry}>
        {project.industry.map((ind) => (
          <p key={ind} style={{ margin: 0 }}>{ind}</p>
        ))}
      </DetailRow>
    </div>
  );
}

function MobileWorks() {
  const { lang } = usePrefs();
  return (
    <section
      id="works"
      style={{
        padding: '80px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 80,
      }}
    >
      {projects.map((project) => (
        <div key={project.slug}>
          {/* Title */}
          <Link to={`/work/${project.slug}`}>
            <h2
              style={{
                fontSize: 'clamp(36px, 9vw, 56px)',
                fontWeight: 600,
                lineHeight: 1.1,
                marginBottom: 24,
                wordBreak: 'break-word',
              }}
            >
              {project.title}
            </h2>
          </Link>

          {/* Image */}
          <Link
            to={`/work/${project.slug}`}
            style={{
              width: '100%',
              aspectRatio: '4/3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <img
              src={project.image}
              alt={project.title}
              style={{
                maxWidth: project.small ? '55%' : '90%',
                maxHeight: project.small ? '55%' : '90%',
                objectFit: 'contain',
              }}
            />
          </Link>

          <ProjectDetails project={localize(project, lang)} />

          <ViewCaseButton slug={project.slug} />
        </div>
      ))}
    </section>
  );
}

// Scroll distance (in viewport heights) each project holds the stage for
const STEP_VH = 70;

export default function Works() {
  const sectionRef = useRef(null);
  const cursorRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
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
        {t.works.viewCase}
      </span>
    </section>
  );
}
