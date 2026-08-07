import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects } from '../data/projects';
import { useIsMobile } from '../hooks/useMediaQuery';

gsap.registerPlugin(ScrollTrigger);

function DetailRow({ label, children }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '120px 1fr',
        gap: 16,
        padding: '14px 0',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <span style={{ color: 'var(--text)', fontSize: 14, fontWeight: 500 }}>{label}</span>
      <div style={{ color: '#999', fontSize: 14, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

function ViewCaseButton({ slug }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      to={`/work/${slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginTop: 20,
        padding: '11px 24px',
        borderRadius: 40,
        border: `1px solid ${hovered ? 'var(--accent)' : 'rgba(255,255,255,0.18)'}`,
        color: hovered ? 'var(--accent)' : 'var(--text)',
        fontSize: 14,
        fontWeight: 500,
        transition: 'color 0.25s ease, border-color 0.25s ease',
      }}
    >
      View case
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          transition: 'transform 0.25s ease',
          transform: hovered ? 'translate(3px, -3px)' : 'none',
        }}
      >
        ↗
      </span>
    </Link>
  );
}

function MobileWorks() {
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

          {/* Details */}
          <div>
            <DetailRow label="Overview">
              <p style={{ margin: 0 }}>{project.desc}</p>
            </DetailRow>
            <DetailRow label="Tags">
              {project.tags.map((tag) => (
                <p key={tag} style={{ margin: 0 }}>{tag}</p>
              ))}
            </DetailRow>
            <DetailRow label="Industry">
              {project.industry.map((ind) => (
                <p key={ind} style={{ margin: 0 }}>{ind}</p>
              ))}
            </DetailRow>
          </div>

          <ViewCaseButton slug={project.slug} />
        </div>
      ))}
    </section>
  );
}

function WorkTitle({ project, active }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="work-title" style={{ padding: '20px 0' }}>
      <Link
        to={`/work/${project.slug}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ display: 'inline-block' }}
      >
        <h2
          style={{
            fontSize: 'clamp(32px, 5vw, 72px)',
            fontWeight: 600,
            color: active ? 'var(--text)' : 'var(--dim)',
            transition: 'color 0.4s ease',
            lineHeight: 1.15,
          }}
        >
          {project.title}
          {/* zero-width so it never wraps to its own line on long titles */}
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: 0,
              overflow: 'visible',
              whiteSpace: 'nowrap',
              textIndent: '0.18em',
              fontWeight: 500,
              color: 'var(--accent)',
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.3s ease, transform 0.3s ease',
              transform: hovered ? 'translate(0, 0)' : 'translate(-8px, 8px)',
            }}
          >
            ↗
          </span>
        </h2>
      </Link>
    </div>
  );
}

export default function Works() {
  const sectionRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;

    const items = gsap.utils.toArray('.work-title');

    items.forEach((item, i) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      });
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [isMobile]);

  if (isMobile) {
    return <MobileWorks />;
  }

  const active = projects[activeIndex];

  return (
    <section
      id="works"
      ref={sectionRef}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Left — sticky detail panel */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '92px clamp(24px, 3vw, 40px) 28px',
        }}
      >
        {/* Image — flexible height so it never clips under the navbar */}
        <Link
          to={`/work/${active.slug}`}
          style={{
            width: '100%',
            flex: '1 1 auto',
            minHeight: 0,
            position: 'relative',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          {projects.map((project, i) => (
            <img
              key={project.slug}
              src={project.image}
              alt={project.title}
              style={{
                position: 'absolute',
                maxWidth: project.small ? '50%' : '85%',
                maxHeight: project.small ? '50%' : '85%',
                objectFit: 'contain',
                opacity: i === activeIndex ? 1 : 0,
                transition: 'opacity 0.5s ease',
              }}
            />
          ))}
        </Link>

        {/* Details table */}
        <div>
          <DetailRow label="Overview">
            <p style={{ margin: 0 }}>{active.desc}</p>
          </DetailRow>
          <DetailRow label="Tags">
            {active.tags.map((tag) => (
              <p key={tag} style={{ margin: 0 }}>{tag}</p>
            ))}
          </DetailRow>
          <DetailRow label="Industry">
            {active.industry.map((ind) => (
              <p key={ind} style={{ margin: 0 }}>{ind}</p>
            ))}
          </DetailRow>
        </div>

        <div>
          <ViewCaseButton slug={active.slug} />
        </div>
      </div>

      {/* Right — project titles */}
      <div style={{ padding: '50vh clamp(20px, 3vw, 40px) 20vh 20px' }}>
        {projects.map((project, i) => (
          <WorkTitle key={project.slug} project={project} active={i === activeIndex} />
        ))}

        <div style={{ height: '50vh' }} />
      </div>
    </section>
  );
}
