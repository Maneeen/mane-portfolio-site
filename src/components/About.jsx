import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePrefs } from '../context/Prefs';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { t, lang } = usePrefs();
  const statementRef = useRef(null);

  // Words fade in as the statement scrolls through the viewport.
  // Opacity (not color) so the effect works in both themes.
  useEffect(() => {
    const words = statementRef.current.querySelectorAll('span');

    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: statementRef.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        }
      );
    }, statementRef);

    // Refresh after layout settles (fonts / images load)
    const timers = [300, 1500].map((ms) => setTimeout(() => ScrollTrigger.refresh(), ms));
    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', onResize);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, [lang]);

  const a = t.about;

  return (
    <section id="about" className="section with-panel">
      <div className="about">
        <div className="label">{a.label}</div>
        <p ref={statementRef} className="about__statement" key={lang}>
          {a.statement.split(' ').map((word, i) => (
            <span key={i}>{word} </span>
          ))}
        </p>

        <div className="about__row">
          <div className="label">{a.experienceLabel}</div>
          <div className="about__text">
            {a.experience.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="about__row">
          <div className="label">{a.skillsLabel}</div>
          <div className="about__skills">
            {a.skills.map((group) => (
              <div key={group.title}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
