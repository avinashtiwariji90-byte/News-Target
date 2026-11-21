'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Radio, 
  Search, 
  TrendingUp, 
  CloudSun, 
  Clock, 
  Menu, 
  X, 
  Sparkles,
  Volume2,
  VolumeX,
  ChevronDown,
  MapPin
} from 'lucide-react';
import { speakSoftFemaleVoice, stopSpeaking } from '@/lib/speech';
import { Category } from '@/lib/types';
import { LanguageCode } from '@/lib/translation';
import { Languages } from 'lucide-react';
import { ALL_STATES_AND_DISTRICTS, StateOption } from '@/components/StateDropdownList';

interface HeaderProps {
  categories?: Category[];
  selectedCategory?: string;
  onSelectCategory?: (slug: string) => void;
  onOpenSearch?: () => void;
  isStateDropdownOpen?: boolean;
  onToggleStateDropdown?: () => void;
  onCloseStateDropdown?: () => void;
  selectedStateId?: string;
  onSelectState?: (state: StateOption) => void;
  articleCounts?: Record<string, number>;
  currentLang?: LanguageCode;
  onChangeLang?: (lang: LanguageCode) => void;
}

export default function Header({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  onOpenSearch,
  isStateDropdownOpen = false,
  onToggleStateDropdown,
  onCloseStateDropdown,
  selectedStateId = 'all-mp',
  onSelectState,
  articleCounts = {},
  currentLang = 'hi',
  onChangeLang
}: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isPlayingHeaderAudio, setIsPlayingHeaderAudio] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
      setCurrentDate(
        now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. TOP UTILITY BAR (Date, Markets, Weather, Portals) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Date, Time & City Bureau */}
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="flex items-center text-slate-300 font-medium">
              <Clock className="w-3.5 h-3.5 mr-1 text-red-500" />
              {currentDate || 'Loading...'} | <span className="text-amber-400 ml-1">{currentTime} IST</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center text-slate-400">
              <CloudSun className="w-3.5 h-3.5 mr-1 text-amber-400" />
              Bhopal 28°C • Delhi 26°C
            </span>
          </div>

          {/* Center: Live Financial Indices Ticker */}
          <div className="hidden lg:flex items-center space-x-4 text-[11px]">
            <span className="flex items-center space-x-1">
              <span className="text-slate-400 font-bold">SENSEX:</span>
              <span className="font-semibold text-emerald-400">84,210.45</span>
              <span className="text-emerald-400 flex items-center text-[10px]">▲ +0.42%</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center space-x-1">
              <span className="text-slate-400 font-bold">NIFTY:</span>
              <span className="font-semibold text-emerald-400">25,825.10</span>
              <span className="text-emerald-400 flex items-center text-[10px]">▲ +0.38%</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center space-x-1">
              <span className="text-slate-400 font-bold">USD/INR:</span>
              <span className="font-semibold text-slate-200">83.92</span>
            </span>
          </div>

          {/* Right: Live Network Status & Rashifal Quick Link */}
          <div className="flex items-center space-x-3 text-xs">
            <a
              href="#rashifal"
              onClick={(e) => {
                const el = document.getElementById('rashifal');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition text-[11px] bg-amber-950/60 border border-amber-700/50 px-2 py-0.5 rounded"
            >
              <span>🔮 आज का राशिफल</span>
            </a>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="flex items-center text-slate-300 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1.5" />
              Live 24×7 Network
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Editorial Identity */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative flex items-center">
            <img
              src="/logo.png"
              alt="News Target Logo"
              className="h-12 sm:h-14 w-auto object-contain group-hover:scale-105 transition transform drop-shadow-sm"
            />
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white live-beacon" />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 group-hover:text-red-600 transition">
                NEWS <span className="text-red-600">TARGET</span>
              </h1>
              <span className="hidden sm:inline-flex items-center text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-200">
                LIVE 24×7
              </span>
            </div>
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 tracking-wide flex items-center gap-1.5">
              <span>न्यूज़ टारगेट</span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-600 font-semibold flex items-center">
                <Sparkles className="w-3 h-3 mr-0.5" /> Government Verified
              </span>
            </p>
          </div>
        </Link>

        {/* Action Controls (Audio, Search, Mobile Menu) */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Soft Natural Female Audio News Broadcast Button */}
          <button
            onClick={() => {
              if (isPlayingHeaderAudio) {
                stopSpeaking();
                setIsPlayingHeaderAudio(false);
              } else {
                speakSoftFemaleVoice(
                  "नमस्ते। न्यूज़ टारगेट डिजिटल न्यूज़ नेटवर्क में आपका स्वागत है। मध्य प्रदेश, भोपाल और देश-विदेश की सभी प्रमाणित, ताज़ा और मुख्य ख़बरें।",
                  {
                    onStart: () => setIsPlayingHeaderAudio(true),
                    onEnd: () => setIsPlayingHeaderAudio(false),
                    onError: () => setIsPlayingHeaderAudio(false)
                  }
                );
              }
            }}
            title={isPlayingHeaderAudio ? "ऑडियो बंद करें (Stop Audio)" : "सॉफ्ट न्यूज़ एंकर आवाज़ सुनें"}
            className={`hidden md:flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition shadow-xs cursor-pointer ${
              isPlayingHeaderAudio
                ? 'bg-red-600 text-white border border-red-700 animate-pulse'
                : 'bg-pink-50 text-pink-900 border border-pink-200 hover:bg-pink-100'
            }`}
          >
            {isPlayingHeaderAudio ? (
              <>
                <VolumeX className="w-4 h-4 text-white" />
                <span>ऑडियो रोकें (Stop)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-pink-600" />
                <span>न्यूज़ बुलेटिन सुनें</span>
              </>
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="flex items-center space-x-2 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs px-3 sm:px-4 py-2 rounded-lg border border-slate-200 transition"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Search stories, Bhopal, AI...</span>
            <kbd className="hidden lg:inline-block text-[10px] font-mono bg-white border border-slate-300 px-1.5 rounded text-slate-500">⌘K</kbd>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 3. CATEGORY NAVIGATION BAR */}
      <nav className="bg-slate-900 border-t border-slate-800 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <ul className="flex items-center space-x-1 text-xs font-semibold text-slate-300 py-1">
            <li key="home">
              <Link
                href="/"
                onClick={() => onSelectCategory && onSelectCategory('all')}
                className={`px-3 py-2 rounded-md block transition ${
                  selectedCategory === 'all' && pathname === '/'
                    ? 'bg-red-600 text-white font-bold'
                    : 'hover:text-white hover:bg-slate-800'
                }`}
              >
                Top Stories
              </Link>
            </li>

            {categories
              .filter(c => c.slug !== 'all' && c.slug !== 'ai' && c.slug !== 'technology' && c.name.toLowerCase() !== 'ai' && c.name.toLowerCase() !== 'technology')
              .map((cat) => {
                if (cat.slug === 'madhya-pradesh') {
                  return (
                    <li key={cat.id}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleStateDropdown) onToggleStateDropdown();
                        }}
                        className={`px-3 py-2 rounded-md flex items-center space-x-1.5 transition whitespace-nowrap cursor-pointer ${
                          selectedCategory === 'madhya-pradesh' || isStateDropdownOpen
                            ? 'bg-red-600 text-white font-bold shadow-xs'
                            : 'hover:text-white hover:bg-slate-800 text-slate-200'
                        }`}
                      >
                        <span>🗺️ MP Special</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isStateDropdownOpen ? 'rotate-180 text-white' : 'text-slate-400'}`} />
                      </button>
                    </li>
                  );
                }

                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => {
                        if (onSelectCategory) onSelectCategory(cat.slug);
                      }}
                      className={`px-3 py-2 rounded-md block transition whitespace-nowrap ${
                        selectedCategory === cat.slug
                          ? 'bg-red-600 text-white font-bold'
                          : 'hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                );
              })}

            {/* Dedicated Rashifal Tab in Main Navigation */}
            <li key="rashifal-tab">
              <a
                href="#rashifal"
                onClick={(e) => {
                  const el = document.getElementById('rashifal');
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-3 py-2 rounded-md transition whitespace-nowrap bg-amber-500/20 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-bold flex items-center space-x-1 border border-amber-500/40 cursor-pointer"
              >
                <span>🔮 दैनिक राशिफल</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* 3.1 DEDICATED FULL STATE LIST (OPENS ON MP SPECIAL CLICK) */}
      {isStateDropdownOpen && (
        <div className="bg-slate-950 border-b border-red-900/60 text-white shadow-2xl py-3 px-4 sm:px-6 animate-in slide-in-from-top-1">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span>सभी राज्य व जिले — किसी भी राज्य/जिले पर क्लिक करें:</span>
              </span>
              <button
                type="button"
                onClick={onCloseStateDropdown}
                className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded hover:bg-slate-800 transition cursor-pointer font-semibold"
              >
                ✕ बंद करें (Close)
              </button>
            </div>

            {/* MP Districts */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
                📍 मध्य प्रदेश (ज़िले व शहर):
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {ALL_STATES_AND_DISTRICTS.filter(s => s.category === 'mp').map((state) => {
                  const isSelected = selectedStateId === state.id;
                  const count = articleCounts[state.id] || 0;
                  return (
                    <button
                      key={state.id}
                      type="button"
                      onClick={() => {
                        if (onSelectState) onSelectState(state);
                        if (onCloseStateDropdown) onCloseStateDropdown();
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 border ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-500 font-bold shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-800'
                      }`}
                    >
                      <span>{state.nameHi}</span>
                      {count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-white text-red-600' : 'bg-slate-800 text-amber-300'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Other States */}
            <div className="pt-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                🇮🇳 देश के अन्य प्रमुख राज्य (All States of India):
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {ALL_STATES_AND_DISTRICTS.filter(s => s.category === 'all-india').map((state) => {
                  const isSelected = selectedStateId === state.id;
                  const count = articleCounts[state.id] || 0;
                  return (
                    <button
                      key={state.id}
                      type="button"
                      onClick={() => {
                        if (onSelectState) onSelectState(state);
                        if (onCloseStateDropdown) onCloseStateDropdown();
                      }}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 border ${
                        isSelected
                          ? 'bg-red-600 text-white border-red-500 font-bold shadow-xs'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border-slate-800'
                      }`}
                    >
                      <span>{state.nameHi}</span>
                      {count > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSelected ? 'bg-white text-red-600' : 'bg-slate-800 text-amber-300'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. MOBILE DRAWER NAVIGATION */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-t border-slate-800 px-4 py-4 space-y-3">
          <div className="font-bold text-xs uppercase tracking-wider text-slate-400 px-2">News Desks</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Link
              href="/"
              onClick={() => {
                if (onSelectCategory) onSelectCategory('all');
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 bg-slate-800 rounded font-semibold text-red-400"
            >
              🔥 Top Stories
            </Link>
            <a
              href="#rashifal"
              onClick={(e) => {
                const el = document.getElementById('rashifal');
                if (el) {
                  e.preventDefault();
                  el.scrollIntoView({ behavior: 'smooth' });
                }
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 bg-amber-500/20 border border-amber-500/40 rounded font-bold text-amber-300 flex items-center gap-1.5"
            >
              <span>🔮 दैनिक राशिफल</span>
            </a>
            {categories
              .filter(c => c.slug !== 'all' && c.slug !== 'ai' && c.slug !== 'technology' && c.name.toLowerCase() !== 'ai' && c.name.toLowerCase() !== 'technology')
              .map(cat => {
                if (cat.slug === 'madhya-pradesh') {
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        if (onToggleStateDropdown) onToggleStateDropdown();
                        setMobileMenuOpen(false);
                      }}
                      className={`text-left px-3 py-2 rounded flex items-center justify-between ${
                        selectedCategory === cat.slug ? 'bg-red-600 font-bold' : 'bg-slate-800/60 hover:bg-slate-800'
                      }`}
                    >
                      <span>🗺️ MP Special (राज्य सूची)</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  );
                }
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat.slug);
                      setMobileMenuOpen(false);
                    }}
                    className={`text-left px-3 py-2 rounded ${
                      selectedCategory === cat.slug ? 'bg-red-600 font-bold' : 'bg-slate-800/60 hover:bg-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
          </div>
        </div>
      )}
    </header>
  );
}
