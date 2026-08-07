import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../hooks/useMediaQuery';

const navItems = [
  { label: 'Home', id: 'hero' },
  { label: 'About', id: 'about' },
  { label: 'Works', id: 'works' },
  { label: 'Contact', id: 'footer' },
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

function ContactPillButton({ href, label = 'Contact' }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        color: '#000',
        border: 'none',
        padding: '11px 24px',
        borderRadius: 50,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        fontFamily: 'var(--font)',
        position: 'relative',
        overflow: 'hidden',
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        textDecoration: 'none',
      }}
    >
      <span
        aria-label={label}
        style={{
          position: 'relative',
          display: 'inline-flex',
          overflow: 'hidden',
          height: '1.2em',
          lineHeight: '1.2em',
        }}
      >
        <span style={{ display: 'inline-flex' }}>
          {label.split('').map((ch, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: hovered ? 'translateY(-110%)' : 'translateY(0)',
                transition: `transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) ${i * 0.025}s`,
              }}
            >
              {ch}
            </span>
          ))}
        </span>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            display: 'inline-flex',
          }}
        >
          {label.split('').map((ch, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: hovered ? 'translateY(0)' : 'translateY(110%)',
                transition: `transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) ${i * 0.025}s`,
              }}
            >
              {ch}
            </span>
          ))}
        </span>
      </span>
    </a>
  );
}

function MobileMenuItem({ label, onClick, delay }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        padding: '12px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'block',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: 'clamp(40px, 11vw, 64px)',
          fontWeight: 700,
          color: '#fff',
          lineHeight: 0.95,
        }}
      >
        <div>
          {label.split('').map((ch, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: hovered ? 'translateY(-100%)' : 'translateY(0)',
                transition: `transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) ${i * 0.03}s`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
        <div style={{ position: 'absolute', inset: 0, color: 'var(--accent)' }}>
          {label.split('').map((ch, i) => (
            <span
              key={i}
              style={{
                display: 'inline-block',
                transform: hovered ? 'translateY(0)' : 'translateY(100%)',
                transition: `transform 0.4s cubic-bezier(0.65, 0, 0.35, 1) ${i * 0.03}s`,
              }}
            >
              {ch}
            </span>
          ))}
        </div>
      </div>
      <div
        style={{
          color: '#fff',
          fontSize: 28,
          fontWeight: 300,
          marginLeft: 16,
        }}
      >
        +
      </div>
    </motion.div>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
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

  if (isMobile) {
    return (
      <>
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
            justifyContent: 'space-between',
            padding: '14px 20px',
            background: scrolled ? 'rgba(0,0,0,0.85)' : 'transparent',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1 }}><Link to="/">M. A.</Link></div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ContactPillButton href="https://t.me/maneaira" label="Contact" />
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                padding: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <span style={{ width: 22, height: 1.5, background: '#fff' }} />
              <span style={{ width: 22, height: 1.5, background: '#fff' }} />
              <span style={{ width: 16, height: 1.5, background: '#fff', alignSelf: 'flex-end' }} />
            </button>
          </div>
        </motion.nav>

        {/* Fullscreen menu overlay */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.65, 0, 0.35, 1] }}
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 200,
                background: '#000',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                overflowY: 'auto',
              }}
            >
              {/* Close */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 40,
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: 1 }}><Link to="/">M. A.</Link></div>
                <button
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    cursor: 'pointer',
                    padding: 8,
                    fontSize: 28,
                    lineHeight: 1,
                    fontWeight: 300,
                  }}
                >
                  ×
                </button>
              </div>

              {/* Nav items */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                {navItems.map((item, i) => (
                  <MobileMenuItem
                    key={item.label}
                    label={item.label}
                    delay={0.05 + i * 0.06}
                    onClick={() => scrollTo(item.id)}
                  />
                ))}
              </div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#666',
                  fontSize: 12,
                  marginTop: 32,
                }}
              >
                <div>
                  Made with <span style={{ color: 'var(--accent)' }}>♥</span> by Mane
                </div>
                <div>© 2026</div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

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
        background: scrolled ? 'rgba(0,0,0,0.82)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        transition: 'background 0.35s ease',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 40,
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: 1,
        }}
      >
        <Link to="/">M. A.</Link>
      </div>

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

        {navItems.slice(1).map((item) => (
          <div key={item.label} style={{ position: 'relative', zIndex: 2 }}>
            <NavLink label={item.label === 'About' ? 'About me' : item.label === 'Contact' ? 'Contacts' : item.label} onClick={() => scrollTo(item.id)} />
          </div>
        ))}
      </div>

      {/* Contact me — white pill */}
      <div style={{ position: 'absolute', right: 40 }}>
        <ContactPillButton href="https://t.me/maneaira" label="Contact" />
      </div>
    </motion.nav>
  );
}
