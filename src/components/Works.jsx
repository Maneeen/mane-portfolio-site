import { useRef, useEffect, useState } from 'react';
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
        <div key={project.title}>
          {/* Title */}
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

          {/* Image */}
          <div
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
          </div>

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
        </div>
      ))}
    </section>
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
          padding: 'clamp(24px, 3vw, 40px)',
        }}
      >
        {/* Image */}
        <div
          style={{
            width: '100%',
            aspectRatio: '4/3',
            position: 'relative',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {projects.map((project, i) => (
            <img
              key={project.title}
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
        </div>

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
      </div>

      {/* Right — project titles */}
      <div style={{ padding: '50vh clamp(20px, 3vw, 40px) 20vh 20px' }}>
        {projects.map((project, i) => (
          <div
            key={project.title}
            className="work-title"
            style={{
              padding: '20px 0',
              cursor: 'pointer',
            }}
          >
            <h2
              style={{
                fontSize: 'clamp(32px, 5vw, 72px)',
                fontWeight: 600,
                color: i === activeIndex ? 'var(--text)' : 'var(--dim)',
                transition: 'color 0.4s ease',
                lineHeight: 1.15,
              }}
            >
              {project.title}
            </h2>
          </div>
        ))}

        <div style={{ height: '50vh' }} />
      </div>
    </section>
  );
}
