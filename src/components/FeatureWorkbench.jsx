import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowDown, ArrowRight, Check, Search, RotateCcw, Save, SlidersHorizontal } from 'lucide-react';
import { features } from '../data/features';
import { featureCategories } from '../data/featureCategories';
import { capabilityFor, readWorkbench, sanitizeWorkbench, workbenchDefaults, workbenchKey } from '../data/workbenchSettings';
import DemoControls from './feature-demo/DemoControls';
import ArticlePreview from './feature-demo/ArticlePreview';
import { useDemoSpeech } from './feature-demo/useDemoSpeech';
import { CognitivePreview, FormPreview, HearingPreview, KeyboardPreview, MotionPreview, PreferencesPreview, SemanticPreview } from './feature-demo/SamplePanels';

export default function FeatureWorkbench() {
  const {hash}=useLocation();const [settings,setSettings]=useState(readWorkbench);
  const [active,setActive]=useState(features[0].id);const [query,setQuery]=useState('');const [category,setCategory]=useState('all');
  const [announcement,setAnnouncement]=useState('Choose a setting on the left to explore its demo.');const [resetCount,setResetCount]=useState(0);const [saved,setSaved]=useState(false);const previewHeading=useRef(null);
  const announce=useCallback(message=>setAnnouncement(message),[]);
  const update=useCallback((key,value,label)=>{setSettings(previous=>({...previous,[key]:value}));if(!['email','password'].includes(key))setAnnouncement(`${label}: ${typeof value==='boolean'?(value?'on':'off'):value}.`);setSaved(false);},[]);
  const speech=useDemoSpeech(settings,announce);
  const reset=()=>{speech.stop();setSettings({...workbenchDefaults});setResetCount(value=>value+1);setSaved(false);try{localStorage.removeItem(workbenchKey);announce('Demo settings reset and saved preferences cleared.');}catch{announce('Demo settings reset. Browser storage prevented clearing saved preferences.');}};
  const save=()=>{try{const {email,password,...preferences}=sanitizeWorkbench(settings);localStorage.setItem(workbenchKey,JSON.stringify(preferences));setSaved(true);announce('Demo preferences saved in this browser. Form entries and microphone state were excluded.');}catch{announce('Preferences could not be saved. Browser storage may be restricted.');}};
  const applyProfile=label=>{const values={...workbenchDefaults};if(label==='Larger view')Object.assign(values,{textSize:130,theme:'contrast',links:true});if(label==='Reading focus')Object.assign(values,{textSize:110,spacing:true,guide:true,font:true});setSettings(values);setSaved(false);announce(`${label} applied. Fine-tune the controls or explicitly save this view.`);};
  const filtered=useMemo(()=>features.filter(feature=>(category==='all'||feature.category===category)&&`${feature.title} ${feature.category} ${feature.description}`.toLowerCase().includes(query.trim().toLowerCase())),[query,category]);
  const feature=features.find(item=>item.id===active)||features[0];
  const group=featureCategories.find(item=>item.title===feature.category);
  const choose=id=>{speech.stop();setActive(id);announce(`${features.find(item=>item.id===id).title} selected. Its controls and preview are ready.`);};
  useEffect(()=>{const target=decodeURIComponent(hash.slice(1));const match=features.find(feature=>feature.id===target);const selectedCategory=featureCategories.find(item=>`category-${item.id}`===target);if(match||selectedCategory){setActive(match?.id||features.find(feature=>feature.category===selectedCategory.title).id);setCategory('all');setQuery('');}},[hash]);
  const preview=()=>{
    const props={feature,settings,update,reset,announce};
    if(group.id==='keyboard')return <KeyboardPreview {...props}/>;
    if(group.id==='hearing')return <HearingPreview {...props}/>;
    if(group.id==='cognitive')return <CognitivePreview {...props}/>;
    if(group.id==='motion')return <MotionPreview {...props}/>;
    if(group.id==='screen-reader')return <SemanticPreview {...props}/>;
    if(group.id==='forms')return <FormPreview {...props}/>;
    if(group.id==='personalization')return <PreferencesPreview {...props}/>;
    return <ArticlePreview settings={settings}/>;
  };
  return <section className="feature-workbench-section" id="feature-workbench" aria-labelledby="workbench-title"><div className="container">
    <div className="workbench-intro"><div><p className="eyebrow"><span aria-hidden="true"/>CHOOSE. ADJUST. COMPARE.</p><h2 id="workbench-title">Your accessibility playground.</h2><p>{features.length} settings. Nine categories. A useful example beside every choice.</p></div><span className="workbench-scope"><Check size={16} aria-hidden="true"/>Changes stay inside the demo</span></div>
    <div className="workbench-layout">
      <aside className="workbench-picker" aria-labelledby="settings-list-title"><div className="workbench-picker-head"><span><SlidersHorizontal size={20} aria-hidden="true"/></span><div><h3 id="settings-list-title">Explore your settings</h3><p>Choose one to see how it works.</p></div></div>
        <div className="workbench-search"><Search size={17} aria-hidden="true"/><label className="sr-only" htmlFor="workbench-search">Search accessibility settings</label><input id="workbench-search" type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Find a setting…"/></div>
        <div className="workbench-category-filter"><label htmlFor="workbench-category">Accessibility category</label><select id="workbench-category" value={category} onChange={event=>setCategory(event.target.value)}><option value="all">All nine categories</option>{featureCategories.map(item=><option key={item.id} value={item.title}>{item.title}</option>)}</select></div>
        <div className="workbench-search-status"><p role="status">{filtered.length} settings shown</p>{(query||category!=='all')&&<button className="text-link" onClick={()=>{setQuery('');setCategory('all');}}>Clear Filters</button>}</div>
        <div className="workbench-feature-list" tabIndex={0} role="region" aria-label="Scrollable list of accessibility settings">
          {filtered.length===0&&<div className="workbench-empty"><h3>No matching settings.</h3><p>Try “captions”, “text” or another category.</p></div>}
          {featureCategories.map(item=>{const matches=filtered.filter(feature=>feature.category===item.title);return matches.length>0&&<section className="workbench-category-group" id={`category-${item.id}`} key={item.id} aria-labelledby={`workbench-group-${item.id}`}><h3 id={`workbench-group-${item.id}`}><item.icon size={15} aria-hidden="true"/>{item.title}<span>{matches.length}</span></h3>{matches.map(feature=><button type="button" key={feature.id} id={feature.id} className={`workbench-feature-button ${active===feature.id?'is-selected':''}`} aria-pressed={active===feature.id} onClick={()=>choose(feature.id)}><span className="workbench-setting-number">{String(feature.number).padStart(2,'0')}</span><span>{feature.title}</span>{active===feature.id?<Check size={16} aria-hidden="true"/>:<ArrowRight size={14} aria-hidden="true"/>}</button>)}</section>;})}
        </div>
        <button className="workbench-jump" onClick={()=>{previewHeading.current?.scrollIntoView({behavior:'instant',block:'start'});previewHeading.current?.focus({preventScroll:true});}}>Go to selected demo <ArrowDown size={15} aria-hidden="true"/></button>
      </aside>
      <div className="workbench-demo-pane"><div className="workbench-selected"><div className="workbench-selected-meta"><span>{group.title}</span><span className="workbench-capability">{capabilityFor(feature.id)}</span></div><div className="workbench-selected-title"><span><feature.icon size={25} aria-hidden="true"/></span><h2 ref={previewHeading} id="selected-demo-heading" tabIndex={-1}>{feature.title}</h2></div><p>{feature.description}</p><DemoControls feature={feature} settings={settings} update={update} speech={speech} save={save} reset={reset} applyProfile={applyProfile}/></div>
        <div className="workbench-preview-shell"><div className="workbench-preview-bar"><span><i/><i/><i/></span><p>A11yEase · {group.id==='forms'?'local interaction example':'contained preview'}</p><span className="wb-live-label">Live sample</span></div><div className={`workbench-preview-content wb-preview-${group.id}`} key={`${group.id}-${resetCount}`}>{preview()}</div></div>
        <div className="workbench-status" role="status" aria-live="polite" aria-atomic="true"><Check size={16} aria-hidden="true"/><p>{announcement}</p></div>
        <div className="workbench-preference-actions"><button onClick={save}><Save size={16} aria-hidden="true"/>{saved?'Preferences saved':'Save preferences'}</button><button onClick={reset}><RotateCcw size={16} aria-hidden="true"/>Reset all demo settings</button></div>
        <details className="workbench-feature-context" key={feature.id}><summary>How this setting works</summary><p>{feature.detail}</p><strong>Put it in context</strong><p>{feature.example}</p></details>
      </div>
    </div><p className="workbench-footnote">These are contained demonstrations. Browser speech needs browser support; physical devices and assistive technology require testing in your setup. The sign-in and media guard examples do not establish production security or protection on other websites.</p>
  </div></section>;
}
