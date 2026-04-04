import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { label: 'About me', id: 'about' },
  { label: 'Works', id: 'works' },
  { label: 'Contacts', id: 'footer' },
];

function NavLink({ label, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--text)',
        fontSize: 15,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'var(--font)',
        position: 'relative',
        overflow: 'hidden',
        display: 'block',
        height: '1.4em',
        lineHeight: '1.4em',
        padding: 0,
      }}
    >
      <span
        style={{
          display: 'block',
          transition: 'transform 0.3s ease',
          transform: hovered ? 'translateY(-100%)' : 'translateY(0)',
        }}
      >
        {label}
      </span>
      <span
        style={{
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          color: 'var(--accent)',
          transition: 'transform 0.3s ease',
          transform: hovered ? 'translateY(0)' : 'translateY(100%)',
        }}
      >
        {label}
      </span>
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 40px',
      }}
    >
      {/* Logo — left */}
      <div
        style={{
          position: 'absolute',
          left: 40,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        M. A.
      </div>

      {/* Glass pill nav — center */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 40,
          padding: '14px 42px',
          borderRadius: 50,
          overflow: 'hidden',
        }}
      >
        {/* Glass layers */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 50,
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            zIndex: 0,
          }}
        />
        {/* Top edge highlight */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
            zIndex: 1,
          }}
        />
        {/* Inner glow */}
        <div
          style={{
            position: 'absolute',
            inset: 1,
            borderRadius: 50,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 40%)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {navItems.map((item) => (
          <div key={item.label} style={{ position: 'relative', zIndex: 2 }}>
            <NavLink label={item.label} onClick={() => scrollTo(item.id)} />
          </div>
        ))}
      </div>

      {/* Contact me — right */}
      <div style={{ position: 'absolute', right: 40 }}>
        <button
          onClick={() => scrollTo('footer')}
          style={{
            position: 'relative',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            borderRadius: 50,
          }}
        >
          {/* Gradient border glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 50,
              background: `radial-gradient(70% 80% at 70% 80%, var(--accent) 0%, transparent 100%)`,
              filter: 'blur(2px)',
              opacity: 0.5,
            }}
          />
          {/* Inner black fill */}
          <div
            style={{
              position: 'absolute',
              inset: 2,
              borderRadius: 50,
              background: '#000',
            }}
          />
          <span
            style={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text)',
              fontFamily: 'var(--font)',
            }}
          >
            Contact me
          </span>
        </button>
      </div>
    </motion.nav>
  );
}
