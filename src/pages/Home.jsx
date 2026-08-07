import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Works from '../components/Works';
import Footer from '../components/Footer';

export default function Home() {
  const location = useLocation();

  useEffect(() => {
    const id = location.state?.scrollTo;
    if (!id) return;
    // let the page paint first, then glide to the section
    const t = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    window.history.replaceState({}, '');
    return () => clearTimeout(t);
  }, [location.state]);

  useEffect(() => {
    document.title = 'Mane Airapetyan — UX/UI Designer';
  }, []);

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Works />
      <Footer />
    </>
  );
}
