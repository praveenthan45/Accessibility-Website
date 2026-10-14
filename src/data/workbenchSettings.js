export const workbenchKey = 'a11yease-feature-demo-v1';
export const workbenchDefaults = {
  textSize:100, theme:'light', spacing:false, grayscale:false, colorCues:false,
  links:false, font:false, zoom:false, guide:false, mask:false, position:45,
  alignment:'left', simpleText:false, paragraphs:false, rate:1,
  keyboardTips:false, strongFocus:true, largeTargets:false, switchScan:false, stickyMode:false,
  captions:true, quiet:false, simpleNav:false, summary:false, progress:false,
  paused:true, reduced:true, stopAutoplay:true, mediaGuard:true, brightness:100, saturation:100,
  structure:false, showAlt:false, showLabels:true, email:'', password:'', showPassword:false,
};
export function sanitizeWorkbench(raw) {
  const result = {...workbenchDefaults};
  if (!raw || typeof raw !== 'object') return result;
  for (const [key,value] of Object.entries(result)) if (typeof value === 'boolean' && typeof raw[key] === 'boolean') result[key] = raw[key];
  for (const [key,min,max,step] of [['textSize',80,150,10],['position',10,90,1],['rate',.5,2,.25],['brightness',80,120,1],['saturation',0,100,1]]) {
    if (Number.isFinite(raw[key]) && raw[key]>=min && raw[key]<=max && Number.isInteger((raw[key]-min)/step)) result[key]=raw[key];
  }
  if (['light','dark','contrast'].includes(raw.theme)) result.theme=raw.theme;
  if (['left','center'].includes(raw.alignment)) result.alignment=raw.alignment;
  // Never restore form entries or microphone state from storage.
  return result;
}
export function readWorkbench() {
  try { return sanitizeWorkbench(JSON.parse(localStorage.getItem(workbenchKey))); }
  catch { return {...workbenchDefaults}; }
}
export function capabilityFor(id) {
  if (['text-to-speech','reading-speed','voice-commands','live-captions'].includes(id)) return 'Browser dependent';
  if (['switch-device','sticky-keys','screen-reader-compatibility'].includes(id)) return 'Device testing example';
  if (id === 'accessible-authentication') return 'Local sign-in example';
  if (id === 'flashing-protection') return 'Contained media guard';
  return 'Working demo';
}
export const sampleParagraphs = [
  'A comfortable digital space gives you room to choose. A few small changes to text, spacing or contrast can help you explore a presentation that suits your preferences.',
  'Reading does not have to follow one fixed rhythm. Pause, return to an earlier paragraph or follow a guide at your own pace. The useful combination is the one you prefer.',
  'Clear links and familiar controls make the next step easier to find. Try a setting, compare the result and return to the original view whenever you want a fresh start.',
];
export const simpleParagraphs = ['Choose a comfortable view. Try a text size, some extra spacing or a different theme.','Read at your own pace. Pause when you want. A guide can mark your place.','Look for clear links. Change your settings or reset to the original view.'];
