import { useLayoutEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';

function ScrollToTop() {
  const { pathname, state } = useLocation();

  useLayoutEffect(() => {
    if (state?.scrollTo) return; // Home handles anchored scrolls itself
    window.scrollTo(0, 0);
  }, [pathname, state]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home key="product" />} />
        <Route path="/work/:slug" element={<CaseStudy />} />
        <Route path="/marketing" element={<Home key="marketing" role="marketing" />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </>
  );
}
