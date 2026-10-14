import { Accessibility } from 'lucide-react';
export default function Brand({ light = false }) {
  return <span className={`brand ${light ? 'brand-light' : ''}`}><span className="brand-symbol"><Accessibility size={26} strokeWidth={2.2} aria-hidden="true" /></span><span>Accesse<span className="brand-ease">Ease</span></span></span>;
}
