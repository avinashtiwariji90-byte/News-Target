// Professional Human-Grade News Anchor Voice Engine (Ultra-Soft, Clear & Natural)

export type SupportedLanguage = 'hi' | 'en';

export interface VoiceOptions {
  lang?: SupportedLanguage;
  rate?: number;    // default: 0.94 (natural, clear, dignified news anchor pace)
  pitch?: number;   // default: 1.0 (pure natural human tone without synthetic pitch shift)
  volume?: number;  // default: 1.0 (clear, crisp enunciation)
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
  onPause?: () => void;
  onResume?: () => void;
}

let activeUtterance: SpeechSynthesisUtterance | null = null;
let isCurrentlySpeaking = false;

// Text Preprocessing & Cleaning to remove robotic artifacts and ensure natural Hindi broadcast cadence
export function cleanTextForNaturalSpeech(text: string): string {
  if (!text) return '';

  return text
    // Remove web links, markdown, and bracketed editorial codes
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/[#*_~`]/g, '')
    // Expand common news symbols into natural Hindi speech words
    .replace(/24×7/gi, 'चौबीसों घंटे')
    .replace(/24x7/gi, 'चौबीसों घंटे')
    .replace(/IST\b/g, 'भारतीय समयानुसार')
    .replace(/(\d+)\s*°\s*C/g, '$1 डिग्री सेल्सियस')
    .replace(/(\d+)\s*km\/?h/gi, '$1 किलोमीटर प्रति घंटा')
    .replace(/(\d+)\s*cr\b/gi, '$1 करोड़')
    .replace(/(\d+)\s*lakh\b/gi, '$1 लाख')
    .replace(/\//g, ' या ')
    .replace(/&/g, ' और ')
    .replace(/[•|►▶]/g, '। ')
    .replace(/\s*-\s*/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Select the most natural human-sounding neural voice available in the browser/OS
export function getBestFemaleVoice(lang: SupportedLanguage = 'hi'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Rank voices based on neural/natural quality and Indian regional relevance
  const ranked = [...voices].map(v => {
    const name = v.name.toLowerCase();
    const vLang = v.lang.toLowerCase();
    let score = 0;

    // 1. Language preference
    if (lang === 'hi') {
      if (vLang.startsWith('hi')) score += 150;
      if (name.includes('hindi') || name.includes('हिन्दी')) score += 100;
    } else {
      if (vLang.startsWith('en-in')) score += 150;
      if (vLang.startsWith('en')) score += 80;
    }

    // 2. High-quality Neural / Natural Voice Boost (Edge / Chrome / Windows 11)
    // Microsoft Swara Online (Natural) is currently the highest quality Hindi news voice in existence
    if (name.includes('natural')) score += 120;
    if (name.includes('neural')) score += 110;
    if (name.includes('swara')) score += 100; // Best Microsoft Hindi female anchor
    if (name.includes('madhur')) score += 60;
    if (name.includes('online')) score += 50;
    if (name.includes('google')) score += 40; // Google Hindi Neural is also very clear
    if (name.includes('neerja')) score += 80;
    if (name.includes('lekha')) score += 70; // Apple Hindi
    if (name.includes('veena')) score += 50;

    // 3. Female voice preference
    if (name.includes('female') || name.includes('woman') || name.includes('girl')) score += 40;

    // 4. Penalize male voices or known robotic desktop synthesizers
    if (name.includes('male') || name.includes('david') || name.includes('ravi') || name.includes('george') || name.includes('mark')) {
      score -= 200;
    }

    return { voice: v, score };
  });

  ranked.sort((a, b) => b.score - a.score);

  if (ranked.length > 0 && ranked[0].score > 0) {
    return ranked[0].voice;
  }

  // Fallback to any Hindi or Indian English voice
  const fallback = voices.find(v => v.lang.startsWith('hi')) || voices.find(v => v.lang.startsWith('en-IN')) || voices[0];
  return fallback || null;
}

export function speakSoftFemaleVoice(
  text: string, 
  options?: VoiceOptions
): SpeechSynthesisUtterance | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return null;
  }

  // Stop any previously playing audio immediately
  window.speechSynthesis.cancel();
  isCurrentlySpeaking = false;

  const lang = options?.lang || 'hi';
  const clean = cleanTextForNaturalSpeech(text);
  if (!clean) return null;

  const utterance = new SpeechSynthesisUtterance(clean);

  // NATURAL HUMAN NEWS ANCHOR TIMBRE:
  // - rate: 0.94 (composed, calm, clear professional news anchor speed)
  // - pitch: 1.0 (pure organic pitch, avoids robotic synthetic shift)
  // - volume: 1.0 (full, warm acoustic presence)
  utterance.rate = options?.rate ?? 0.94;
  utterance.pitch = options?.pitch ?? 1.0;
  utterance.volume = options?.volume ?? 1.0;
  utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';

  utterance.onstart = () => {
    isCurrentlySpeaking = true;
    activeUtterance = utterance;
    if (options?.onStart) options.onStart();
  };

  utterance.onend = () => {
    isCurrentlySpeaking = false;
    activeUtterance = null;
    if (options?.onEnd) options.onEnd();
  };

  utterance.onerror = (e) => {
    isCurrentlySpeaking = false;
    activeUtterance = null;
    if (options?.onError) options.onError();
  };

  const dispatchSpeak = () => {
    const bestVoice = getBestFemaleVoice(lang);
    if (bestVoice) {
      utterance.voice = bestVoice;
    }
    window.speechSynthesis.speak(utterance);
  };

  if (window.speechSynthesis.getVoices().length > 0) {
    dispatchSpeak();
  } else {
    // Voices might be loading asynchronously in Chrome/Edge
    window.speechSynthesis.onvoiceschanged = () => {
      dispatchSpeak();
    };
  }

  return utterance;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    isCurrentlySpeaking = false;
    activeUtterance = null;
  }
}

export function pauseSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.resume();
  }
}

export function getIsSpeaking(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
  return window.speechSynthesis.speaking;
}
