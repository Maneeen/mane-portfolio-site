import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getProject, getNextProject, localize } from '../data/projects';
import { usePrefs } from '../context/Prefs';
import { useIsMobile } from '../hooks/useMediaQuery';

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
};

function MetaBlock({ label, children }) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          textTransform: 'uppercase',
          letterSpacing: 2,
          color: 'var(--muted)',
          marginBottom: 10,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)', opacity: 0.8 }}>{children}</div>
    </div>
  );
}

function BackLink({ style }) {
  const [hovered, setHovered] = useState(false);
  const { t } = usePrefs();
  return (
    <Link
      to="/"
      state={{ scrollTo: 'works' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 14,
        fontWeight: 500,
        color: hovered ? 'var(--text)' : 'var(--muted)',
        transition: 'color 0.25s ease',
        ...style,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          display: 'inline-block',
          transition: 'transform 0.25s ease',
          transform: hovered ? 'translateX(-4px)' : 'none',
        }}
      >
        ←
      </span>
      {t.caseStudy.back}
    </Link>
  );
}

function CaseCanvas({ project, isMobile }) {
  const { caseStudy } = project;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: isMobile ? '0 10px' : '0 clamp(16px, 3vw, 40px)',
      }}
    >
      <div
        style={{
          background: caseStudy.bg,
          borderRadius: isMobile ? 12 : 20,
          overflow: 'hidden',
          border: '1px solid var(--line)',
          fontSize: 0, // kill inline-image gaps between slices
        }}
      >
        {caseStudy.slices.map((slice, i) => (
          <img
            key={slice.src}
            src={slice.src}
            alt={i === 0 ? `${project.title} case study` : ''}
            loading={i < 2 ? 'eager' : 'lazy'}
            decoding="async"
            style={{
              width: '100%',
              display: 'block',
              aspectRatio: `${caseStudy.width} / ${slice.height}`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ComingSoon({ project, isMobile }) {
  const { t } = usePrefs();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maxWidth: 1440,
        margin: '0 auto',
        padding: isMobile ? '0 10px' : '0 clamp(16px, 3vw, 40px)',
      }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: isMobile ? 12 : 20,
          overflow: 'hidden',
          border: '1px solid var(--line)',
          background: 'var(--surface)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: isMobile ? '56px 20px' : '96px 40px',
          gap: 40,
        }}
      >
        <img
          src={project.image}
          alt={project.title}
          style={{
            maxWidth: project.small ? 'min(360px, 70%)' : 'min(760px, 92%)',
            maxHeight: '60vh',
            objectFit: 'contain',
          }}
        />
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              borderRadius: 40,
              border: '1px solid var(--line)',
              fontSize: 13,
              color: 'var(--muted)',
              letterSpacing: 0.5,
            }}
          >
            {t.caseStudy.comingSoon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function NextProject({ project }) {
  const [hovered, setHovered] = useState(false);
  const { t } = usePrefs();
  return (
    <Link
      to={`/work/${project.slug}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: 'block', textAlign: 'center', padding: '40px 24px' }}
    >
      <div
        style={{
          fontSize: 12,
          textTransform: 'uppercase',
          letterSpacing: 3,
          color: 'var(--muted)',
          marginBottom: 18,
        }}
      >
        {t.caseStudy.next}
      </div>
      <div
        style={{
          fontSize: 'clamp(44px, 8vw, 120px)',
          fontWeight: 700,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: hovered ? 'var(--muted)' : 'var(--text)',
          transition: 'color 0.35s ease',
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
            textIndent: '0.15em',
            transition: 'transform 0.35s ease',
            transform: hovered ? 'translate(8px, -8px)' : 'none',
          }}
        >
          ↗
        </span>
      </div>
      {project.tagline && (
        <div style={{ marginTop: 16, fontSize: 15, color: 'var(--muted)' }}>{project.tagline}</div>
      )}
    </Link>
  );
}

export default function CaseStudy() {
  const { slug } = useParams();
  const { t, lang } = usePrefs();
  const source = getProject(slug);
  const project = source && localize(source, lang);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (project) document.title = `${project.title} — Mane Airapetyan`;
  }, [project]);

  if (!project) return <Navigate to="/" replace />;

  const next = localize(getNextProject(slug), lang);

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          padding: isMobile
            ? '110px 24px 48px'
            : '160px clamp(24px, 5vw, 80px) 72px',
          maxWidth: 1440,
          margin: '0 auto',
        }}
      >
        <motion.div {...fadeUp} transition={{ duration: 0.55, ease: 'easeOut' }}>
          <BackLink style={{ marginBottom: isMobile ? 28 : 44 }} />
        </motion.div>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontSize: 'clamp(48px, 9vw, 128px)',
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: '-0.02em',
            marginBottom: 20,
            wordBreak: 'break-word',
          }}
        >
          {project.title}
        </motion.h1>

        {project.tagline && (
          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontSize: 'clamp(17px, 2.2vw, 24px)',
              color: 'var(--muted)',
              marginBottom: isMobile ? 36 : 56,
              maxWidth: 640,
            }}
          >
            {project.tagline}
          </motion.p>
        )}

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderTop: '1px solid var(--line)',
            paddingTop: isMobile ? 28 : 36,
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : '1.6fr 1fr 1fr 1fr',
            gap: isMobile ? 28 : 40,
          }}
        >
          <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <MetaBlock label={t.caseStudy.overview}>{project.desc}</MetaBlock>
          </div>
          <MetaBlock label={t.caseStudy.client}>
            {project.client}
            <br />
            {project.year}
          </MetaBlock>
          <MetaBlock label={t.caseStudy.industry}>
            {project.industry.map((x) => (
              <div key={x}>{x}</div>
            ))}
          </MetaBlock>
          <MetaBlock label={t.caseStudy.services}>
            {project.tags.map((x) => (
              <div key={x}>{x}</div>
            ))}
          </MetaBlock>
        </motion.div>
      </section>

      {/* Case canvas */}
      {project.caseStudy ? (
        <CaseCanvas project={project} isMobile={isMobile} />
      ) : (
        <ComingSoon project={project} isMobile={isMobile} />
      )}

      {/* Next project */}
      <section style={{ padding: isMobile ? '72px 0 56px' : '120px 0 80px' }}>
        <NextProject project={next} />
      </section>

      <Footer />
    </>
  );
}
