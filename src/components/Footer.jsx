import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import SplineScene from './SplineScene';
import { useIsMobile, useIsTablet } from '../hooks/useMediaQuery';

const links = [
  { label: 'Home', id: 'hero' },
  { label: 'Work', id: 'works' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'footer' },
];

const socialsData = [
  { label: 'Email', href: 'mailto:mane.airapetyan12345@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mane-airapetyan-38b023331/' },
];

const colStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const headStyle = {
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: 2,
  color: 'var(--muted)',
  marginBottom: 8,
};

const linkStyle = {
  fontSize: 14,
  color: 'var(--text)',
  opacity: 0.6,
  transition: 'opacity 0.2s ease',
  cursor: 'pointer',
  background: 'none',
  border: 'none',
  fontFamily: 'var(--font)',
  textAlign: 'left',
  padding: 0,
};

export default function Footer() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const navigate = useNavigate();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollTo: id } });
    }
  };

  return (
    <footer
      id="footer"
      style={{
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'var(--bg)',
        overflow: 'hidden',
      }}
    >
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(2, 1fr)',
          gap: isMobile ? 32 : 40,
          padding: isMobile ? '40px 24px' : '60px 40px',
          maxWidth: 800,
        }}
      >
        <div style={colStyle}>
          <span style={headStyle}>Links</span>
          {links.map((link) => (
            <button
              key={link.label}
              onClick={() => scrollTo(link.id)}
              style={linkStyle}
              onMouseEnter={(e) => (e.target.style.opacity = 1)}
              onMouseLeave={(e) => (e.target.style.opacity = 0.6)}
            >
              {link.label}
            </button>
          ))}
        </div>

        <div style={colStyle}>
          <span style={headStyle}>Socials</span>
          {socialsData.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              style={linkStyle}
              onMouseEnter={(e) => (e.target.style.opacity = 1)}
              onMouseLeave={(e) => (e.target.style.opacity = 0.6)}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      {/* Contact buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: isMobile ? 'flex-start' : 'flex-end',
          gap: 12,
          padding: isMobile ? '0 24px 32px' : '0 40px 40px',
        }}
      >
        <a
          href="https://t.me/maneaira"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '10px 24px',
            borderRadius: 40,
            border: '1px solid rgba(255,255,255,0.15)',
            fontSize: 14,
            color: 'var(--text)',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
        >
          Telegram
        </a>
        <a
          href="mailto:mane.airapetyan12345@gmail.com"
          style={{
            padding: '10px 24px',
            borderRadius: 40,
            border: '1px solid rgba(255,255,255,0.15)',
            fontSize: 14,
            color: 'var(--text)',
            transition: 'border-color 0.2s ease',
            wordBreak: 'break-all',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
        >
          mane.airapetyan12345@gmail.com
        </a>
      </div>

      {/* MANE + Robot */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 40,
        }}
      >
        {/* Robot floating above text — hidden on mobile, scaled on tablet */}
        {!isMobile && (
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              width: 360,
              height: 360,
              marginBottom: isTablet ? -50 : -80,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                transform: isTablet ? 'scale(0.7)' : 'scale(1)',
                transformOrigin: 'center center',
              }}
            >
              <SplineScene scene="/robot.splinecode" />
            </div>
          </div>
        )}

        {/* Big MANE text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{
            position: 'relative',
            zIndex: 1,
            fontSize: 'clamp(80px, 20vw, 280px)',
            fontWeight: 800,
            lineHeight: 0.85,
            textAlign: 'center',
            overflow: 'visible',
            letterSpacing: '-0.02em',
          }}
        >
          MANE
        </motion.div>
      </div>

      {/* Vertical Portfolio text */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            right: 20,
            bottom: 120,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            color: 'var(--dim)',
            fontSize: 11,
            letterSpacing: 4,
            textTransform: 'uppercase',
            fontVariant: 'all-small-caps',
          }}
        >
          Portfolio
        </div>
      )}
    </footer>
  );
}
