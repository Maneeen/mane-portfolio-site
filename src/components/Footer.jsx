import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SplineScene from './SplineScene';

function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const utc4 = new Date(now.getTime() + (4 * 60 + now.getTimezoneOffset()) * 60000);
      setTime(
        utc4.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }) + ' UTC+4'
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return <span>{time}</span>;
}

const links = [
  { label: 'Home', id: 'hero' },
  { label: 'Work', id: 'works' },
  { label: 'About', id: 'about' },
  { label: 'Contact', id: 'footer' },
];

const socialsData = [
  { label: 'Email', href: 'mailto:mane.airapetyan12345@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/mane-airapetyan-38b023331/' },
  { label: 'Whatsapp', href: 'https://t.me/maneaira' },
  { label: 'Github', href: 'https://github.com/' },
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
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer
      id="footer"
      style={{
        position: 'relative',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        background: 'var(--bg)',
      }}
    >
      {/* Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 40,
          padding: '60px 40px',
          maxWidth: 1200,
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

        <div style={colStyle}>
          <span style={headStyle}>Local Time</span>
          <span style={{ fontSize: 14, opacity: 0.6 }}>
            <LiveClock />
          </span>
        </div>

        <div style={colStyle}>
          <span style={headStyle}>Version</span>
          <span style={{ fontSize: 14, opacity: 0.6 }}>2026 &copy; Edition</span>
        </div>
      </div>

      {/* Contact buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          padding: '0 40px 40px',
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
        {/* Robot floating above text */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: 360,
            height: 360,
            marginBottom: -80,
          }}
        >
          <SplineScene scene="https://prod.spline.design/TB3MdzrjidkTZ6l9/scene.splinecode" />
        </div>

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
    </footer>
  );
}
