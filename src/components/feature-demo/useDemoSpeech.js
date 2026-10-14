import { useEffect, useRef, useState } from 'react';
import { sampleParagraphs, simpleParagraphs } from '../../data/workbenchSettings';
export function useDemoSpeech(settings,announce) {
  const [speaking,setSpeaking]=useState(false); const utterance=useRef(null);
  const available='speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const cancel=()=>{if(utterance.current){utterance.current.onend=null;utterance.current.onerror=null;window.speechSynthesis.cancel();utterance.current=null;}setSpeaking(false);};
  const read=()=>{if(!available)return;cancel();const speech=new SpeechSynthesisUtterance((settings.simpleText?simpleParagraphs:sampleParagraphs).join(' '));speech.lang='en-US';speech.rate=settings.rate;speech.onend=()=>{utterance.current=null;setSpeaking(false);announce('Preview reading finished.');};speech.onerror=()=>{utterance.current=null;setSpeaking(false);announce('Browser speech playback is unavailable. Try another voice or browser.');};utterance.current=speech;setSpeaking(true);announce('Reading the preview aloud.');window.speechSynthesis.speak(speech);};
  useEffect(()=>()=>{if(utterance.current){utterance.current.onend=null;utterance.current.onerror=null;window.speechSynthesis.cancel();}},[]);
  return {available,speaking,read,stop:()=>{cancel();announce('Preview reading stopped.');}};
}
export function useRecognition(onResult,{continuous=false}={}) {
  const [listening,setListening]=useState(false); const [status,setStatus]=useState(''); const recognition=useRef(null); const resultHandler=useRef(onResult);resultHandler.current=onResult;
  const Constructor=window.SpeechRecognition || window.webkitSpeechRecognition;
  const stop=()=>recognition.current?.stop();
  const start=()=>{
    if(!Constructor){setStatus('Speech recognition is unavailable. Use the text example instead.');return;}
    const speech=new Constructor();let failed=false;speech.lang='en-US';speech.continuous=continuous;speech.interimResults=continuous;
    speech.onstart=()=>{setListening(true);setStatus('Microphone active. Choose Stop to end listening.');};
    speech.onresult=event=>{let text='';for(let i=0;i<event.results.length;i++)text+=`${event.results[i][0].transcript} `;resultHandler.current(text.trim());};
    speech.onerror=event=>{failed=true;setListening(false);setStatus(event.error==='not-allowed'?'Microphone permission was declined. Use the text example.':`Speech recognition could not continue (${event.error}). Use the text example.`);};
    speech.onend=()=>{setListening(false);recognition.current=null;if(!failed)setStatus('Microphone stopped. Start again when you’re ready.');};recognition.current=speech;
    setListening(true);setStatus('Requesting microphone access through your browser.');
    try{speech.start();}catch{recognition.current=null;setListening(false);setStatus('Microphone could not start. Use the text example.');}
  };
  useEffect(()=>()=>{if(recognition.current){recognition.current.onstart=null;recognition.current.onresult=null;recognition.current.onerror=null;recognition.current.onend=null;recognition.current.abort();}},[]);
  return {available:!!Constructor,listening,status,start,stop};
}
