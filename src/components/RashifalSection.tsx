'use client';

import React, { useState } from 'react';
import { RASHIFAL_LIST, RashiItem, getFormattedTodayHindi } from '@/lib/rashifalData';
import { speakSoftFemaleVoice, stopSpeaking } from '@/lib/speech';
import { 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Share2, 
  Send, 
  Briefcase, 
  Coins, 
  Heart, 
  Activity, 
  Flame, 
  Check, 
  Star,
  ChevronRight,
  SunMedium
} from 'lucide-react';

export default function RashifalSection() {
  const [selectedRashi, setSelectedRashi] = useState<RashiItem>(RASHIFAL_LIST[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);
  const [todayHindi, setTodayHindi] = useState('आज का पंचांग व भविष्यफल');

  React.useEffect(() => {
    setTodayHindi(getFormattedTodayHindi());
  }, []);

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `आज का ${selectedRashi.nameHi} राशिफल. ${todayHindi}. स्वामी ग्रह: ${selectedRashi.rulingPlanet}. ${selectedRashi.overview}. कार्यक्षेत्र: ${selectedRashi.career}. आर्थिक स्थिति: ${selectedRashi.finance}. स्वास्थ्य: ${selectedRashi.health}. पारिवारिक संबंध: ${selectedRashi.love}. आज का शुभ अंक: ${selectedRashi.luckyNumber}. शुभ रंग: ${selectedRashi.luckyColor}. आज का उपाय: ${selectedRashi.luckyRemedy}`;
      
      speakSoftFemaleVoice(textToRead, {
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
      setIsPlayingAudio(true);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `🔮 *आज का ${selectedRashi.nameHi} (${selectedRashi.nameEn}) राशिफल* 🔮\n📅 ${todayHindi}\n\n✨ *भविष्यफल:* ${selectedRashi.overview}\n💼 *करियर:* ${selectedRashi.career}\n💰 *धन:* ${selectedRashi.finance}\n🧘 *स्वास्थ्य:* ${selectedRashi.health}\n❤️ *प्रेम:* ${selectedRashi.love}\n\n🍀 *शुभ अंक:* ${selectedRashi.luckyNumber}\n🎨 *शुभ रंग:* ${selectedRashi.luckyColor}\n🪔 *आज का उपाय:* ${selectedRashi.luckyRemedy}\n\n📰 *News Target दैनिक राशिफल पर पढ़ें:* ${typeof window !== 'undefined' ? window.location.origin + '#rashifal' : 'https://newstarget.in'}`
    );
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const waUrl = isMobile
      ? `https://api.whatsapp.com/send?text=${text}`
      : `https://web.whatsapp.com/send?text=${text}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCopy = () => {
    const text = `🔮 आज का ${selectedRashi.nameHi} राशिफल - ${todayHindi}\n${selectedRashi.overview}\nशुभ अंक: ${selectedRashi.luckyNumber} | शुभ रंग: ${selectedRashi.luckyColor}\nउपाय: ${selectedRashi.luckyRemedy}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="rashifal" className="w-full bg-gradient-to-b from-amber-50/70 via-white to-orange-50/40 rounded-3xl p-5 sm:p-8 border border-amber-200/80 shadow-md space-y-6 scroll-mt-24">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-amber-200">
        <div>
          <div className="flex items-center space-x-2">
            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs">
              <SunMedium className="w-5 h-5 animate-spin" style={{ animationDuration: '16s' }} />
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>दैनिक राशिफल</span>
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-500 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                आज का भविष्यफल
              </span>
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            📅 <strong className="text-amber-900">{todayHindi}</strong> • ग्रह-नक्षत्रों की चाल के अनुसार सभी 12 राशियों का सटीक दैनिक विश्लेषण
          </p>
        </div>

        {/* Audio Voice Broadcast & Quick Share */}
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleToggleAudio}
            className={`flex items-center space-x-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition shadow-xs cursor-pointer ${
              isPlayingAudio 
                ? 'bg-red-600 text-white border-red-700 animate-pulse' 
                : 'bg-white hover:bg-amber-100/70 text-amber-900 border-amber-300'
            }`}
            title="दैनिक राशिफल की आवाज़ सुनें"
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-amber-600" />}
            <span>{isPlayingAudio ? 'ऑडियो रोकें (Stop)' : `${selectedRashi.nameHi} राशिफल सुनें`}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl transition shadow-xs cursor-pointer"
            title="WhatsApp पर शेयर करें"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-2 rounded-xl border border-slate-300 cursor-pointer"
            title="कॉपी करें"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-slate-600" />}
          </button>
        </div>
      </div>

      {/* 2. Horizontal Rashi Selector Chips (All 12 Rashis) */}
      <div>
        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>अपनी राशि चुनें (Select Your Zodiac Sign):</span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
          {RASHIFAL_LIST.map((rashi) => {
            const isSelected = selectedRashi.id === rashi.id;
            return (
              <button
                key={rashi.id}
                type="button"
                onClick={() => {
                  if (isPlayingAudio) stopSpeaking();
                  setIsPlayingAudio(false);
                  setSelectedRashi(rashi);
                }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-center transition cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500 to-orange-600 text-white border-amber-600 shadow-md transform scale-105'
                    : 'bg-white hover:bg-amber-50 text-slate-700 border-amber-200/80 hover:border-amber-400'
                }`}
              >
                <span className="text-xl sm:text-2xl leading-none">{rashi.symbol}</span>
                <span className={`text-xs font-black mt-1 ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {rashi.nameHi}
                </span>
                <span className={`text-[10px] leading-tight ${isSelected ? 'text-amber-100 font-medium' : 'text-slate-400'}`}>
                  {rashi.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Detailed Card for Selected Rashi */}
      <div className="bg-white rounded-2xl border-2 border-amber-300/80 p-5 sm:p-6 shadow-sm space-y-5 animate-in fade-in-50 duration-200">
        {/* Rashi Title & Astro Details */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3.5">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl text-white shadow-inner"
              style={{ backgroundColor: selectedRashi.luckyColorCode }}
            >
              {selectedRashi.symbol}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {selectedRashi.nameHi} राशि ({selectedRashi.nameEn})
                </h4>
                <div className="flex items-center text-amber-500 text-xs">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < selectedRashi.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                नाम अक्षर: <strong className="text-slate-700">{selectedRashi.letters}</strong> • तत्व: <strong className="text-slate-700">{selectedRashi.element}</strong> • स्वामी ग्रह: <strong className="text-slate-700">{selectedRashi.rulingPlanet}</strong>
              </p>
            </div>
          </div>

          {/* Lucky Strip Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-lg flex items-center space-x-1">
              <span>🍀 शुभ अंक:</span>
              <strong className="text-base text-amber-700">{selectedRashi.luckyNumber}</strong>
            </span>
            <span className="text-xs font-bold bg-orange-50 text-orange-900 border border-orange-200 px-3 py-1 rounded-lg flex items-center space-x-1">
              <span>🎨 शुभ रंग:</span>
              <strong className="text-orange-700">{selectedRashi.luckyColor}</strong>
            </span>
          </div>
        </div>

        {/* Overview Highlight Box */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50/50 p-4 rounded-xl border border-amber-200">
          <div className="text-[11px] font-black uppercase tracking-wider text-amber-900 mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>आज का मुख्य भविष्यफल (Today&apos;s Highlights)</span>
          </div>
          <p className="text-sm font-semibold text-amber-950 leading-relaxed font-serif">
            {selectedRashi.overview}
          </p>
        </div>

        {/* 4 Pillars Grid (Career, Finance, Health, Love) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Career & Business */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 hover:border-amber-300 transition">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
              <span className="p-1 rounded bg-blue-100 text-blue-700">
                <Briefcase className="w-4 h-4" />
              </span>
              <span>💼 कार्यक्षेत्र व व्यापार (Career &amp; Business)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-serif">
              {selectedRashi.career}
            </p>
          </div>

          {/* Finance & Wealth */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 hover:border-amber-300 transition">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
              <span className="p-1 rounded bg-emerald-100 text-emerald-700">
                <Coins className="w-4 h-4" />
              </span>
              <span>💰 धन व आर्थिक स्थिति (Finance &amp; Wealth)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-serif">
              {selectedRashi.finance}
            </p>
          </div>

          {/* Health & Wellness */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 hover:border-amber-300 transition">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
              <span className="p-1 rounded bg-red-100 text-red-700">
                <Activity className="w-4 h-4" />
              </span>
              <span>🧘 स्वास्थ्य व जीवनशैली (Health &amp; Wellness)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-serif">
              {selectedRashi.health}
            </p>
          </div>

          {/* Love & Family */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1.5 hover:border-amber-300 transition">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-900">
              <span className="p-1 rounded bg-pink-100 text-pink-700">
                <Heart className="w-4 h-4" />
              </span>
              <span>🏡 पारिवारिक व प्रेम संबंध (Love &amp; Family)</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-serif">
              {selectedRashi.love}
            </p>
          </div>
        </div>

        {/* 4. Astrological Remedy (आज का अचूक उपाय) */}
        <div className="bg-amber-100/50 border border-amber-300/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start sm:items-center space-x-2">
            <span className="text-base shrink-0">🪔</span>
            <div>
              <strong className="text-amber-950 font-bold block sm:inline mr-1">आज का अचूक उपाय:</strong>
              <span className="text-amber-900 font-medium">{selectedRashi.luckyRemedy}</span>
            </div>
          </div>

          <button
            onClick={handleShareWhatsApp}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-lg border border-emerald-300 transition shrink-0 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-emerald-700" />
            <span>परिवार को भेजें</span>
          </button>
        </div>
      </div>
    </section>
  );
}
