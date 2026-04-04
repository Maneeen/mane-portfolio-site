import { useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from 'framer-motion';

function GridPattern({ id, offsetX, offsetY, color, strokeWidth = 0.5 }) {
  return (
    <svg style={{ width: '100%', height: '100%', background: 'transparent' }}>
      <defs>
        <motion.pattern
          id={id}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export default function InfiniteGrid({ parentRef }) {
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  useEffect(() => {
    const el = parentRef?.current || containerRef.current?.parentElement;
    if (!el) return;
    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left);
      mouseY.set(e.clientY - rect.top);
    };
    el.addEventListener('mousemove', handleMouseMove);
    return () => el.removeEventListener('mousemove', handleMouseMove);
  }, [parentRef, mouseX, mouseY]);

  useAnimationFrame(() => {
    gridOffsetX.set((gridOffsetX.get() + 0.3) % 40);
    gridOffsetY.set((gridOffsetY.get() + 0.3) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Static visible grid — yellow/gold tint matching keyboard */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
        <GridPattern
          id="grid-static"
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          color="#FFC82E"
          strokeWidth={0.5}
        />
      </div>

      {/* Mouse-reveal grid — bright purple/violet like keyboard keys */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.7,
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        <GridPattern
          id="grid-hover"
          offsetX={gridOffsetX}
          offsetY={gridOffsetY}
          color="#A78BFA"
          strokeWidth={1}
        />
      </motion.div>
    </div>
  );
}
