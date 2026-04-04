import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const segments = [
  { text: 'Product Designer with ', accent: false, bold: false },
  { text: '4+ years', accent: true, bold: true },
  { text: ' of experience spanning brand identity, UX/UI, and frontend development.', accent: false, bold: false },
  { text: " I've worked across B2C, B2B and SaaS platforms — handling everything from early research and strategy to final implementation.", accent: false, bold: false },
  { text: '\nFor ', accent: false, bold: false },
  { text: '2 years I worked at an ', accent: true, bold: true },
  { text: 'American', accent: true, bold: true },
  { text: ' company, collaborating closely with American and European clients and navigating the full design cycle in an international, cross-cultural environment.', accent: false, bold: false },
  { text: ' That experience sharpened both my design thinking and my ability to communicate and deliver in fast-paced, high-expectation teams.', accent: false, bold: false },
];

export default function About() {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);

  useEffect(() => {
    const words = wordsRef.current.filter(Boolean);
    const nonAccent = words.filter((el) => !el.dataset.accent);

    gsap.set(nonAccent, { color: '#333' });

    gsap.to(nonAccent, {
      color: '#fff',
      stagger: 0.02,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: 1,
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  let wordIdx = 0;

  const renderText = () => {
    return segments.map((segment, i) => {
      const words = segment.text.split(/(\s+)/);
      return words.map((word, j) => {
        if (word.trim() === '') return word;
        const idx = wordIdx++;
        const isNewline = word.startsWith('\n');
        const cleanWord = word.replace(/^\n/, '');
        return (
          <span key={`${i}-${j}`}>
            {isNewline && <br />}
            <span
              ref={(el) => (wordsRef.current[idx] = el)}
              data-accent={segment.accent ? 'true' : undefined}
              style={{
                color: segment.accent ? 'var(--accent)' : '#333',
                fontWeight: segment.bold ? 700 : 400,
                transition: 'color 0.1s ease',
              }}
            >
              {cleanWord}
            </span>
          </span>
        );
      });
    });
  };

  return (
    <section
      id="about"
      style={{
        position: 'relative',
        padding: '160px 40px',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div style={{ maxWidth: 680, width: '100%' }}>
        <p
          ref={containerRef}
          style={{
            fontSize: 'clamp(18px, 2.2vw, 22px)',
            lineHeight: 1.75,
          }}
        >
          {renderText()}
        </p>
      </div>
    </section>
  );
}
