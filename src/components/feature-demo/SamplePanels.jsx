import { useEffect, useId, useRef, useState } from 'react';
import { ArrowRight, Bell, Check, Play, Pause, Eye, EyeOff, RotateCcw } from 'lucide-react';
import VoiceDemo from './VoiceDemo';
import ArticlePreview from './ArticlePreview';

export function KeyboardPreview({feature,settings,update,reset,announce}) {
  const heading=useRef(null);const scanSurface=useRef(null);const [scanIndex,setScanIndex]=useState(0);const [chosen,setChosen]=useState('');const [altReady,setAltReady]=useState(false);
  const options=['Explore','Read','Reflect'];
  useEffect(()=>{if(!settings.switchScan)return;const interval=setInterval(()=>setScanIndex(index=>(index+1)%options.length),1400);return()=>clearInterval(interval);},[settings.switchScan]);
  useEffect(()=>{if(settings.switchScan&&feature.id==='switch-device'){scanSurface.current?.focus();}},[settings.switchScan,feature.id]);
  const activate=label=>{setChosen(`${label} selected.`);announce(`${label} selected in the input sample.`);};
  const keys=event=>{
    if(settings.switchScan&&(event.key===' '||event.key==='Enter')){event.preventDefault();activate(options[scanIndex]);}
    if(event.key==='Escape'){update('switchScan',false,'Switch scanning');setAltReady(false);}
    if(settings.stickyMode&&event.key==='Alt'){event.preventDefault();setAltReady(true);}
    else if(settings.stickyMode&&altReady&&event.key==='ArrowRight'){event.preventDefault();activate('Next section');setAltReady(false);}
  };
  return <>{feature.id==='voice-commands'&&<VoiceDemo update={update} reset={reset} announce={announce}/>}<div className={`wb-input-sample ${settings.largeTargets?'wb-large-targets':''} ${settings.strongFocus?'wb-strong-focus':''}`}>
    <button className="wb-skip-control" onClick={()=>{heading.current?.focus();announce('Moved to the sample content heading.');}}>Skip to sample content</button>
    {settings.keyboardTips&&<p className="wb-tip">Tab / Shift+Tab: move focus. Enter / Space: activate. No custom keyboard trap.</p>}
    <div className="wb-scan-surface" ref={scanSurface} tabIndex={0} role="group" aria-label="Input demonstration. Space or Enter selects the highlighted item when scanning is on. Escape stops scanning." onKeyDown={keys}>
      <nav aria-label="Sample section choices">{options.map((label,index)=><button key={label} className={settings.switchScan&&index===scanIndex?'wb-scan-active':''} onClick={()=>activate(label)}>{label}{settings.switchScan&&index===scanIndex&&<span aria-hidden="true"> · scanning</span>}</button>)}</nav>
      <h3 ref={heading} tabIndex={-1}>Your reading space</h3><p style={{fontSize:`${settings.textSize/100}rem`,background:settings.theme==='dark'?'#102447':'transparent',color:settings.theme==='dark'?'#fff':'#14243c',padding:'14px',borderRadius:'8px'}}>Move through a familiar set of controls, then find a place to read at your own pace.</p>
      {settings.stickyMode&&<p className="wb-tip">Sequential key example: press Alt, release it, then press Right Arrow while this group has focus. {altReady?'Alt is latched for the next key.':'No modifier is latched.'}</p>}
    </div><p className="wb-local-status" role="status">{chosen||'Choose a sample section to see its status here.'}</p>
    {feature.id==='switch-device'&&<p className="wb-panel-note">Scanning cycles through these three items. Focus the scan group and use Space or Enter to select; Escape stops it. Physical switch devices need to map an activation key and be tested with your setup.</p>}
    {feature.id==='sticky-keys'&&<p className="wb-panel-note">This is a sequential-key interaction inside the sample. It does not change operating-system Sticky Keys. Standard buttons remain usable with individual keys.</p>}
  </div></>;
}

export const captionLines=['Make room for your perspective.','Small choices can shape a comfortable reading space.','Compare text, spacing and contrast at your own pace.','Your preferences stay in your hands.'];
export function HearingPreview({feature,settings,update,reset,announce}) {
  const [playing,setPlaying]=useState(false);const [line,setLine]=useState(0);const [notices,setNotices]=useState(0);
  useEffect(()=>{if(!playing)return;const timeout=setTimeout(()=>{if(line===captionLines.length-1)setPlaying(false);else setLine(value=>value+1);},2200);return()=>clearTimeout(timeout);},[playing,line]);
  return <>{feature.id==='live-captions'?<VoiceDemo key="captions" mode="captions" update={update} reset={reset} announce={announce}/>:<><div className="wb-caption-stage"><img src="/images/caption-forest.webp" width="1000" height="666" alt="Sunlight falls between trees behind the authored caption sequence" loading="lazy"/>{settings.captions&&<p className="wb-caption-text">{captionLines[line]}</p>}</div><div className="wb-caption-actions"><button className="button button-outline" aria-pressed={playing} onClick={()=>{if(line===captionLines.length-1)setLine(0);setPlaying(!playing);}}>{playing?<Pause size={16} aria-hidden="true"/>:<Play size={16} aria-hidden="true"/>}{playing?'Pause caption sequence':'Play caption sequence'}</button><span>Line {line+1} / {captionLines.length}</span></div><details className="wb-transcript" open={feature.id==='audio-transcripts'}><summary>Read the matching sample transcript</summary>{captionLines.map(text=><p key={text}>{text}</p>)}</details><button className="button button-outline" onClick={()=>{setNotices(value=>value+1);announce('A visual sample notification appeared.');}}><Bell size={17} aria-hidden="true"/>Show visual notification</button>{notices>0&&<div className="wb-visible-notice" role="status"><Check size={18} aria-hidden="true"/>Notification {notices}: your reading space is ready.</div>}<p className="wb-panel-note">The caption sequence uses supplied text over a still photograph. It is an authored layout example, with a matching transcript.</p></>}</>;
}

const steps=[['Choose a starting view','Start with a text size or a theme that feels comfortable.'],['Read at your pace','Explore a guide or some extra space between lines.'],['Keep what feels useful','Adjust again, save a combination or return to the defaults.']];
export function CognitivePreview({feature,settings,announce}) {
  const [step,setStep]=useState(0);const [seconds,setSeconds]=useState(30);const [running,setRunning]=useState(false);
  useEffect(()=>{if(!running)return;const timer=setInterval(()=>setSeconds(value=>Math.max(0,value-1)),1000);return()=>clearInterval(timer);},[running]);
  useEffect(()=>{if(seconds===0&&running){setRunning(false);announce('The sample timer ended. Your content remains available.');}},[seconds,running,announce]);
  return <div className={`wb-guided-sample ${settings.quiet?'wb-quiet':''} ${settings.paused?'wb-paused':''}`}>
    {!settings.quiet&&<div className="wb-reading-decoration"><span aria-hidden="true"/><p>A little room for your next idea.</p></div>}
    <p className="wb-step-label" role="status">Step {step+1} of {steps.length}</p>
    {(settings.progress||feature.id==='step-instructions')&&<progress value={step+1} max={steps.length} aria-label={`Reading progress: step ${step+1} of ${steps.length}`}/>}
    <h3>{steps[step][0]}</h3><p>{settings.summary?'Choose a view. Read at your pace. Keep your useful preferences.':steps[step][1]}</p>
    {!settings.simpleNav&&<nav aria-label="Sample reading steps">{steps.map(([title],index)=><button key={title} aria-pressed={index===step} onClick={()=>setStep(index)}>{index+1}. {title}</button>)}</nav>}
    <div className="button-row"><button className="button button-outline" disabled={step===0} onClick={()=>setStep(value=>value-1)}>Previous step</button><button className="button button-primary" disabled={step===steps.length-1} onClick={()=>setStep(value=>value+1)}>Next step <ArrowRight size={16} aria-hidden="true"/></button></div>
    {feature.id==='extended-time'&&<div className="wb-timer"><p>Reading timer: <strong>{seconds} seconds</strong></p><div className="button-row"><button className="button button-outline" disabled={seconds===0} onClick={()=>setRunning(!running)}>{running?'Pause timer':'Start timer'}</button><button className="button button-outline" onClick={()=>{setSeconds(value=>value+30);announce('Added 30 seconds to the sample timer.');}}>Add 30 seconds</button></div><p className="wb-panel-note">The timer never removes your content. Add time or pause it whenever you wish.</p></div>}
    <p className="wb-panel-note">The summary and instructions are authored for this short example.</p>
  </div>;
}

export function MotionPreview({feature,settings,update,announce}) {
  const [playing,setPlaying]=useState(false);const [blocked,setBlocked]=useState(false);const [systemReduced,setSystemReduced]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce)');const changed=()=>setSystemReduced(media.matches);media.addEventListener('change',changed);return()=>media.removeEventListener('change',changed);},[]);
  useEffect(()=>{if(settings.stopAutoplay)setPlaying(false);},[settings.stopAutoplay]);
  const enable=()=>{update('reduced',false,'Reduce motion');update('paused',false,'Pause animations');setPlaying(true);announce('Gentle sample motion requested. System reduced motion is still respected.');};
  const moving=playing&&!settings.reduced&&!settings.paused&&!systemReduced;
  return <><div className={`wb-motion-stage ${moving?'wb-motion-playing':''}`}><img src="/images/sensory-nature.webp" width="1000" height="1651" alt="Mountain meadow used to compare image brightness and color intensity" loading="lazy" style={{filter:`brightness(${settings.brightness/100}) saturate(${settings.saturation/100})`}}/><span className="wb-motion-indicator" aria-hidden="true"/><span className="wb-motion-label">{systemReduced?'System reduced motion: on':moving?'Gentle sample motion':'Still view'}</span></div>
    <div className="button-row"><button className="button button-outline" disabled={systemReduced} onClick={moving?()=>setPlaying(false):enable}>{moving?<Pause size={16} aria-hidden="true"/>:<Play size={16} aria-hidden="true"/>}{moving?'Pause sample motion':'Try gentle sample motion'}</button></div>
    {feature.id==='flashing-protection'&&<div className="wb-media-guard"><button className="button button-outline" onClick={()=>{setBlocked(true);announce(settings.mediaGuard?'The known sample media request was blocked.':'A static alternative was displayed instead.');}}>Test a sample media request</button>{blocked&&<p role="status">{settings.mediaGuard?'Sample media blocked. A still alternative is available.':'Static alternative displayed. No flashing content is played.'}</p>}{blocked&&!settings.mediaGuard&&<div className="wb-static-alternative">A calm, still media alternative.</div>}<p className="wb-panel-note">This guard handles a known request in this demo. It does not detect or filter flashing content on other websites. The test never displays flashing media.</p></div>}
    <p className="wb-panel-note">Playback starts through your action. Pause, reduced-motion and stop-autoplay controls apply to this sample; operating-system motion preferences take priority.</p>
  </>;
}

export function SemanticPreview({settings,announce}) {
  const id=useId();const [name,setName]=useState('');const [count,setCount]=useState(0);
  return <article className={`wb-semantic-sample ${settings.structure?'wb-structure-visible':''}`} aria-labelledby={`${id}-heading`}>
    {settings.structure&&<div className="wb-structure-tags" aria-hidden="true"><span>Article</span><span>Heading level 3</span><span>Labeled input</span><span>Polite status</span></div>}
    <h3 id={`${id}-heading`}>Meaning beyond the visual layout.</h3><img src="/images/sample-library.webp" width="1000" height="586" alt="Rows of books line the wooden shelves of a quiet library" loading="lazy"/>
    {settings.showAlt&&<p className="wb-alt-description"><strong>Image description:</strong> Rows of books line the wooden shelves of a quiet library.</p>}
    <div className="wb-labeled-field"><label htmlFor={id}>Sample display name (optional)</label><input id={id} value={name} onChange={event=>setName(event.target.value)} autoComplete="off"/>{settings.showLabels&&<p>The visible label stays connected to this field after you enter a value.</p>}</div>
    <button className="button button-outline" onClick={()=>{setCount(value=>value+1);announce(`Sample status ${count+1}: ${name.trim()||'your reading space'} is ready.`);}}>Announce sample status</button>
    <p className="wb-panel-note">Semantic HTML, labels and alternative text remain present with the visual annotations off. Test the sample with your screen reader and browser; device compatibility is not established by this example alone.</p>
  </article>;
}

export function FormPreview({feature,settings,update,announce}) {
  const id=useId();const emailRef=useRef(null);const passwordRef=useRef(null);const dialog=useRef(null);const [errors,setErrors]=useState({});const [signedIn,setSignedIn]=useState(false);const [bookmark,setBookmark]=useState(true);const authentication=feature.id==='accessible-authentication';
  const submit=event=>{event.preventDefault();const next={};if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email.trim()))next.email='Enter an email address such as reader@example.test.';
    if(authentication){if(settings.email.trim()!=='reader@example.test')next.email='Use the displayed demo address: reader@example.test.';if(settings.password!=='Read-42!')next.password='Use the displayed demo password: Read-42!';}
    setErrors(next);if(Object.keys(next).length){(next.email?emailRef:passwordRef).current?.focus();announce('Check the described fields in the local sample form.');}
    else if(authentication){setSignedIn(true);announce('Signed in to the local demonstration. No real account was accessed.');}
    else announce('Sample validation passed. Nothing was submitted.');
  };
  return <div className="wb-form-sample"><h3>{authentication?'Local sign-in demonstration':'A form with clear feedback'}</h3>
    {authentication&&<div className="wb-demo-account"><p>Demo address: <strong>reader@example.test</strong><br/>Demo password: <strong>Read-42!</strong></p><button className="button button-outline" onClick={()=>{update('email','reader@example.test','Demo address');update('password','Read-42!','Demo password');setErrors({});}}>Fill demo credentials</button><p className="wb-panel-note">This demonstrates a local sign-in flow. It creates no account and provides no production authentication or session security. Use only the displayed sample values.</p></div>}
    {signedIn&&authentication?<div className="wb-local-signed-in"><Check size={20} aria-hidden="true"/><h4>Local demo view unlocked.</h4><p>Your demonstration stays in this page’s memory.</p><button className="button button-outline" onClick={()=>{setSignedIn(false);update('password','','Password');announce('Signed out of the local demonstration.');}}>Sign out of demo</button></div>:<form noValidate onSubmit={submit}>
      <div className="wb-labeled-field"><label htmlFor={`${id}-email`}>Demo email address (required)</label><input ref={emailRef} id={`${id}-email`} type="email" required autoComplete="off" value={settings.email} onChange={event=>{update('email',event.target.value,'Email');setErrors(value=>({...value,email:''}));}} aria-invalid={!!errors.email} aria-describedby={errors.email?`${id}-email-error`:undefined}/>{errors.email&&<p className="field-error" id={`${id}-email-error`}>{errors.email}</p>}</div>
      <div className="wb-labeled-field"><label htmlFor={`${id}-password`}>Demo password {authentication?'(required)':'(optional)'}</label><div className="wb-password-field"><input ref={passwordRef} id={`${id}-password`} type={settings.showPassword?'text':'password'} required={authentication} autoComplete="off" value={settings.password} onChange={event=>{update('password',event.target.value,'Password');setErrors(value=>({...value,password:''}));}} aria-invalid={!!errors.password} aria-describedby={errors.password?`${id}-password-error`:undefined}/><button type="button" aria-pressed={settings.showPassword} aria-label={settings.showPassword?'Hide demo password':'Show demo password'} onClick={()=>update('showPassword',!settings.showPassword,'Password visibility')}>{settings.showPassword?<EyeOff size={17} aria-hidden="true"/>:<Eye size={17} aria-hidden="true"/>}</button></div>{errors.password&&<p className="field-error" id={`${id}-password-error`}>{errors.password}</p>}</div>
      <button className="button button-primary" type="submit">{authentication?'Sign in to local demo':'Validate demo form'}</button><p className="wb-panel-note">Inputs are labeled, paste is allowed and errors are associated with their fields. Sample values are never sent or saved.</p>
    </form>}
    {feature.id==='action-confirmation'&&<div className="wb-bookmark"><p>Sample bookmark: <strong>{bookmark?'Saved':'Removed'}</strong></p><button className="button button-outline" onClick={()=>bookmark?dialog.current?.showModal():setBookmark(true)}>{bookmark?'Remove sample bookmark':'Restore sample bookmark'}</button><dialog className="sample-dialog" ref={dialog} aria-labelledby={`${id}-confirmation`}><h4 id={`${id}-confirmation`}>Remove this sample bookmark?</h4><p>Review the local action before applying it. Cancel or press Escape to keep the bookmark.</p><div className="button-row"><button className="button button-outline" autoFocus onClick={()=>dialog.current?.close()}>Cancel</button><button className="button button-primary" onClick={()=>{setBookmark(false);dialog.current?.close();announce('Sample bookmark removed. You can restore it.');}}>Confirm removal</button></div></dialog></div>}
  </div>;
}

export function PreferencesPreview({settings}) {
  return <><div className="wb-preference-summary"><span>{settings.textSize}% text</span><span>{settings.theme} theme</span><span>{settings.spacing?'Expanded':'Default'} spacing</span><span>{settings.guide?'Guide on':'Guide off'}</span></div><ArticlePreview settings={settings}/><p className="wb-panel-note">Save is explicit and browser-local. It keeps visual and reading settings, excludes form entries, and never enables a microphone. Reset clears this demo’s saved values.</p></>;
}
