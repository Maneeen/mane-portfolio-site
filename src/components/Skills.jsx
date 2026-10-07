import { useState } from 'react';
import { LayoutGroup, motion, AnimatePresence } from 'framer-motion';
import { usePrefs } from '../context/Prefs';

// Four-point sparkles scattered around the block (see .sparkle in globals.css)
const SPARKLES = [
  { x: 4, y: 8, s: 18, d: 0 },
  { x: 22, y: 86, s: 10, d: 0.9 },
  { x: 36, y: 2, s: 12, d: 1.6 },
  { x: 58, y: 94, s: 14, d: 0.4 },
  { x: 74, y: 6, s: 22, d: 2.1 },
  { x: 91, y: 30, s: 12, d: 1.2 },
  { x: 96, y: 78, s: 16, d: 2.6 },
  { x: 12, y: 54, s: 8, d: 1.9 },
];

function Sparkle({ x, y, s, d }) {
  return (
    <svg
      className="sparkle"
      viewBox="0 0 24 24"
      width={s}
      height={s}
      style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${d}s` }}
      aria-hidden="true"
    >
      <path d="M12 0C12 8 16 12 24 12C16 12 12 16 12 24C12 16 8 12 0 12C8 12 12 8 12 0Z" />
    </svg>
  );
}

const spring = { type: 'spring', stiffness: 420, damping: 38, mass: 0.9 };

export default function Skills() {
  const { t, lang } = usePrefs();
  const [open, setOpen] = useState(null);
  const a = t.about;

  return (
    <div className="skills" key={lang}>
      {SPARKLES.map((sp) => (
        <Sparkle key={`${sp.x}-${sp.y}`} {...sp} />
      ))}

      <div className="skills__word" aria-hidden="true">
        {a.skillsLabel}
      </div>

      <LayoutGroup>
        <motion.ul className="skills__tabs" layout transition={spring}>
          {a.skills.map((group, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={group.title}
                layout
                transition={spring}
                className={`skills__tab ${isOpen ? 'is-open' : ''}`}
              >
                <motion.button
                  layout="position"
                  transition={spring}
                  type="button"
                  className="skills__tab-head"
                  aria-expanded={isOpen}
                  aria-controls={`skill-panel-${i}`}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span>{group.title}</span>
                  <span className="skills__plus" aria-hidden="true" />
                </motion.button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`skill-panel-${i}`}
                      className="skills__panel"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.12, duration: 0.25 } }}
                      exit={{ opacity: 0, transition: { duration: 0.12 } }}
                    >
                      {group.items.map((item) => (
                        <span key={item} className="skills__item">
                          {item}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.li>
            );
          })}
        </motion.ul>
      </LayoutGroup>
    </div>
  );
}
