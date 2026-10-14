import { SlidersHorizontal } from 'lucide-react';
import { Eyebrow, ConversionCTA } from '../components/LayoutParts';
import FeatureWorkbench from '../components/FeatureWorkbench';
import { features } from '../data/features';
export default function Features() {
  return <><section className="feature-workbench-hero"><div className="container"><div><Eyebrow>THE A11YEASE FEATURE EXPERIENCE</Eyebrow><h1>Choose a setting.<br/><span>See the difference.</span></h1><p>Explore accessibility preferences with a working example beside each feature. Adjust the controls, compare your view and find a combination that feels useful to you.</p></div><div className="workbench-hero-stamp"><SlidersHorizontal size={27} aria-hidden="true"/><div><strong>{features.length} settings</strong><span>Nine thoughtful categories</span></div></div></div></section><FeatureWorkbench/><ConversionCTA title="Your Preferences. Your Starting Point." description="Try a combination in the workspace, save it in this browser or ask our team about the wider product."/></>;
}
