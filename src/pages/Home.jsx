import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Works from '../components/Works';
import RoleWorks from '../components/RoleWorks';
import Footer from '../components/Footer';
import SidePanel from '../components/SidePanel';
import { usePrefs, RoleScope } from '../context/Prefs';
import { useIsTablet } from '../hooks/useMediaQuery';

function HomeContent({ role }) {
  const location = useLocation();
  const { t } = usePrefs();
  const isTablet = useIsTablet();

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
    document.title = t.pageTitle;
  }, [t]);

  return (
    <>
      <Navbar home />
      {!isTablet && <SidePanel className="panel--fixed" fly />}
      <Hero role={role} />
      <About />
      {role === 'product' ? <Works /> : <RoleWorks />}
      <Footer withPanel role={role} />
    </>
  );
}

// `role`: product (home), marketing or ai. Same layout, different copy.
export default function Home({ role = 'product' }) {
  return (
    <RoleScope role={role}>
      <HomeContent role={role} />
    </RoleScope>
  );
}
