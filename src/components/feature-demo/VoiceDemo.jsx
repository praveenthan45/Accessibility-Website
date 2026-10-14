import { useId, useState } from 'react';
import { Mic, Square } from 'lucide-react';
import { useRecognition } from './useDemoSpeech';
export default function VoiceDemo({mode='commands',update,reset,announce}) {
  const id=useId(); const [text,setText]=useState('');const [draft,setDraft]=useState('');
  const applyCommand=command=>{
    const cleaned=command.toLowerCase().replace(/[.!?,]/g,'').trim();
    const actions={'dark mode':()=>update('theme','dark','Theme'),'light mode':()=>update('theme','light','Theme'),'larger text':()=>update('textSize',130,'Text size'),'smaller text':()=>update('textSize',90,'Text size'),'reset':reset};
    setText(command);
    if(actions[cleaned]){actions[cleaned]();announce(`Command applied: ${cleaned}.`);}else announce('Command not recognized. Try dark mode, light mode, larger text, smaller text or reset.');
  };
  const recognition=useRecognition(mode==='commands'?applyCommand:setText,{continuous:mode==='captions'});
  return <div className="wb-voice-demo">
    <p>{mode==='commands'?'Say a supported command, or test the same command with text.':'Start microphone captioning in a supported browser, or update the clearly labeled text example.'}</p>
    <div className="button-row"><button className="button button-primary" disabled={!recognition.available||recognition.listening} onClick={recognition.start}><Mic size={17} aria-hidden="true"/>{mode==='commands'?'Start voice commands':'Start microphone captions'}</button><button className="button button-outline" disabled={!recognition.listening} onClick={recognition.stop}><Square size={15} aria-hidden="true"/>Stop microphone</button></div>
    <p className="wb-microphone-note">Microphone use starts only with your action and permission. Your browser’s speech service may process audio remotely. A11yEase does not store recordings. {recognition.available?'':'This browser has no speech recognition API; the text example remains available.'}</p>
    <p className="wb-local-status" role="status">{recognition.status}</p>
    <form onSubmit={event=>{event.preventDefault();if(mode==='commands')applyCommand(draft);else{setText(draft);announce('Manual text example updated. This is not microphone transcription.');}}}>
      <label htmlFor={id}>{mode==='commands'?'Text command example':'Manual caption text example'}</label>
      <input id={id} value={draft} onChange={event=>setDraft(event.target.value)} placeholder={mode==='commands'?'Try “larger text”':'Type a sentence to preview captions'} required/>
      <button className="button button-outline" type="submit">{mode==='commands'?'Apply text command':'Update text example'}</button>
    </form>
    {mode==='commands'?<p className="wb-command-list">Supported commands: dark mode · light mode · larger text · smaller text · reset</p>:null}
    <div className="wb-recognized-text" aria-label={mode==='commands'?'Recognized or typed command':'Live or manually supplied captions'} aria-live={mode==='commands'?'polite':'off'}>{text||'Your text will appear here.'}</div>
  </div>;
}
