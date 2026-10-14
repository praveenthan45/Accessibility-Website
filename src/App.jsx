import { useEffect, useLayoutEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Features from './pages/Features';
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';
import { metadata, site } from './config/site';
function RouteEffects() {
  const { pathname, hash } = useLocation(); const first = useRef(true); const previous = useRef(pathname);
  useLayoutEffect(() => {
    const [title, description] = metadata[pathname] || ['Page not found', 'Find your way back to AccesseEase.'];
    document.title = `${title} | AccesseEase`;
    const setMeta = (selector, content) => document.querySelector(selector)?.setAttribute('content', content);
    setMeta('meta[name="description"]', description); setMeta('meta[property="og:title"]', `${title} | AccesseEase`); setMeta('meta[property="og:description"]', description);
    if (site.url) {
      let canonical = document.querySelector('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); } canonical.href = `${site.url}${pathname}`;
      let ogUrl = document.querySelector('meta[property="og:url"]'); if (!ogUrl) { ogUrl = document.createElement('meta'); ogUrl.setAttribute('property', 'og:url'); document.head.append(ogUrl); } ogUrl.content = `${site.url}${pathname}`;
      setMeta('meta[property="og:image"]', `${site.url}/share-preview.png`);
    }
    if (hash) { requestAnimationFrame(() => { const target = document.getElementById(decodeURIComponent(hash.slice(1))); target?.scrollIntoView({ behavior: 'instant', block: 'start' }); if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); } }); }
    else { window.scrollTo({ top: 0, behavior: 'instant' }); if (!first.current && previous.current !== pathname) document.getElementById('main-content')?.focus({ preventScroll: true }); }
    previous.current = pathname; first.current = false;
  }, [pathname, hash]);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.remove('reveal-pending'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    const elements = document.querySelectorAll('.reveal'); elements.forEach(el => { el.classList.add('reveal-pending'); observer.observe(el); });
    return () => { observer.disconnect(); elements.forEach(el => el.classList.remove('reveal-pending')); };
  }, [pathname]);
  return null;
}
export default function App() {
  return <><a className="skip-link" href="#main-content">Skip to content</a><RouteEffects/><Navbar/><main id="main-content" tabIndex={-1}><Routes><Route path="/" element={<Home/>}/><Route path="/features" element={<Features/>}/><Route path="/how-it-works" element={<HowItWorks/>}/><Route path="/about" element={<About/>}/><Route path="/contact" element={<Contact/>}/><Route path="/faq" element={<FAQ/>}/><Route path="/privacy" element={<Privacy/>}/><Route path="/terms" element={<Terms/>}/><Route path="*" element={<NotFound/>}/></Routes></main><Footer/></>;
}
