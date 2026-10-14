import { useId, useRef, useState } from 'react';
import { ArrowUpRight, Bookmark, Sun } from 'lucide-react';
import { sampleParagraphs, simpleParagraphs } from '../../data/workbenchSettings';
export default function ArticlePreview({settings}) {
  const id=useId(); const [progress,setProgress]=useState(0); const scroller=useRef(null);
  const paragraphs=settings.simpleText?simpleParagraphs:sampleParagraphs;
  return <div className={`workbench-article theme-${settings.theme} ${settings.spacing?'wb-spaced':''} ${settings.font?'wb-reading-font':''} ${settings.links||settings.colorCues?'wb-links':''} ${settings.grayscale?'wb-grayscale':''} ${settings.paragraphs?'wb-paragraphs':''} ${settings.zoom?'wb-zoom':''}`} style={{'--wb-size':`${settings.textSize/100*(settings.zoom?1.15:1)}rem`,'--wb-position':`${settings.position}%`}}>
    {settings.progress&&<progress className="wb-scroll-progress" value={progress} max="100" aria-label={`Article reading progress: ${progress}%`}/>}
    <div className="workbench-article-scroll" ref={scroller} tabIndex={0} role="region" aria-label="Live sample article" onScroll={e=>{const element=e.currentTarget;setProgress(Math.round(element.scrollTop/Math.max(1,element.scrollHeight-element.clientHeight)*100));}}>
      <nav className="wb-sample-nav" aria-label="Sample article navigation"><span><Sun size={17} aria-hidden="true"/> daybreak.</span><a href={`#${id}-reflection`}>Find a moment <ArrowUpRight size={13} aria-hidden="true"/></a></nav>
      <article style={{textAlign:settings.alignment}}>
        <div className="wb-article-category">{settings.colorCues?'Category: Everyday ideas':'EVERYDAY IDEAS'}</div><h3>Make room for<br/>your perspective.</h3><p className="wb-article-intro">Small choices. A reading space that feels more like you.</p>
        {!settings.quiet&&<figure className="wb-image-viewport"><img src="/images/workspace.webp" width="1200" height="800" alt="A sunlit reading space with plants, a desk and comfortable seating" loading="lazy" style={{filter:`brightness(${settings.brightness/100}) saturate(${settings.saturation/100})`}}/></figure>}
        <h4>Your view, at your pace.</h4>{paragraphs.map((paragraph,index)=><p key={index}>{paragraph}</p>)}
        <a className="wb-story-link" href={`#${id}-reflection`}>Continue to a short reflection <ArrowUpRight size={15} aria-hidden="true"/></a>
        <section id={`${id}-reflection`} className="wb-article-reflection" aria-labelledby={`${id}-reflection-title`}><h4 id={`${id}-reflection-title`}>A moment to reflect</h4><p>Which adjustment would you like to keep? Compare your settings, save a combination or start fresh.</p><span><Bookmark size={15} aria-hidden="true"/> Your preferences stay in your hands.</span></section>
      </article>
    </div>
    {settings.mask&&<div className="wb-reading-mask" aria-hidden="true"/>}{settings.guide&&<div className="wb-reading-guide" aria-hidden="true"/>}
  </div>;
}
