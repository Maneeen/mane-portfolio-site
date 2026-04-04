import { Suspense, Component, lazy, useRef, useCallback, useEffect } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback || null;
    }
    return this.props.children;
  }
}

function SplineInner({ scene, style }) {
  const wrapperRef = useRef(null);

  const onLoad = useCallback(() => {
    if (wrapperRef.current) {
      const canvas = wrapperRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.background = 'transparent';
      }
    }
  }, []);

  // Remove Spline watermark logo
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      // Find and hide the logo link
      const links = el.querySelectorAll('a[href*="spline"]');
      links.forEach((a) => (a.style.display = 'none'));
      // Also hide any div with the spline logo image
      el.querySelectorAll('div').forEach((div) => {
        const style = div.getAttribute('style') || '';
        if (style.includes('favicon') || style.includes('spline.design')) {
          div.style.display = 'none';
        }
      });
      // Hide the logo container (usually last absolute-positioned child)
      el.querySelectorAll('div[style*="position: absolute"]').forEach((div) => {
        if (div.querySelector('img') || div.querySelector('a')) {
          div.style.display = 'none';
        }
      });
    });

    observer.observe(el, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} style={{ width: '100%', height: '100%', position: 'relative', ...style }}>
      <Spline scene={scene} onLoad={onLoad} />
    </div>
  );
}

export default function SplineScene({ scene, style }) {
  return (
    <ErrorBoundary fallback={<div style={{ width: '100%', height: '100%' }} />}>
      <Suspense fallback={<div style={{ width: '100%', height: '100%' }} />}>
        <SplineInner scene={scene} style={style} />
      </Suspense>
    </ErrorBoundary>
  );
}
