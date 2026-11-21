'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BreakingTicker from '@/components/BreakingTicker';
import ArticleModal from '@/components/ArticleModal';
import SearchModal from '@/components/SearchModal';
import Footer from '@/components/Footer';
import RashifalSection from '@/components/RashifalSection';
import { StateOption, ALL_STATES_AND_DISTRICTS } from '@/components/StateDropdownList';
import { speakSoftFemaleVoice, stopSpeaking } from '@/lib/speech';
import { Article, BreakingNews, Category } from '@/lib/types';
import { 
  Sparkles, 
  Flame, 
  Clock, 
  Eye, 
  ArrowRight, 
  Share2, 
  Send, 
  ShieldCheck, 
  TrendingUp, 
  Layers,
  ChevronRight,
  RefreshCw,
  MapPin
} from 'lucide-react';

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [selectedState, setSelectedState] = useState<StateOption | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isPlayingLeadAudio, setIsPlayingLeadAudio] = useState(false);

  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [catRes, artRes, breakRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/articles?status=PUBLISHED'),
        fetch('/api/breaking')
      ]);

      const catData = await catRes.json();
      const artData = await artRes.json();
      const breakData = await breakRes.json();

      if (catData.success) setCategories(catData.categories);
      if (artData.success) setArticles(artData.articles);
      if (breakData.success) setBreakingNews(breakData.items);
    } catch (err) {
      console.error('Error fetching homepage data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Keyboard shortcut for search (⌘K or Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Pre-calculate story counts for states and cities
  const articleCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    ALL_STATES_AND_DISTRICTS.forEach(opt => {
      if (opt.id === 'all-mp') {
        counts[opt.id] = articles.filter(a => a.categoryName === 'Madhya Pradesh' || a.categoryName === 'Bhopal').length;
      } else {
        counts[opt.id] = articles.filter(a => {
          const haystack = `${a.title} ${a.summary} ${a.content} ${a.tags?.join(' ')} ${a.categoryName}`.toLowerCase();
          return opt.keywords.some(k => haystack.includes(k.toLowerCase()));
        }).length;
      }
    });
    return counts;
  }, [articles]);

  // Filter published articles based on selected state/city or category
  const filteredArticles = selectedState
    ? (selectedState.id === 'all-mp'
        ? articles.filter(a => a.categoryName === 'Madhya Pradesh' || a.categoryName === 'Bhopal')
        : (() => {
            const matched = articles.filter(a => {
              const haystack = `${a.title} ${a.summary} ${a.content} ${a.tags?.join(' ')} ${a.categoryName}`.toLowerCase();
              return selectedState.keywords.some(k => haystack.includes(k.toLowerCase()));
            });
            return matched.length > 0 ? matched : articles.filter(a => a.categoryName === 'Madhya Pradesh' || a.categoryName === 'India');
          })()
      )
    : (selectedCategory === 'all'
        ? articles
        : articles.filter(a => 
            a.categoryId === selectedCategory || 
            a.categoryName.toLowerCase().replace(/\s+/g, '-') === selectedCategory.toLowerCase() ||
            (selectedCategory === 'madhya-pradesh' && (a.categoryName === 'Madhya Pradesh' || a.categoryName === 'Bhopal'))
          )
      );

  // Featured Lead Story
  const leadArticle = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];

  // Secondary Spotlight stories
  const spotlightArticles = filteredArticles
    .filter(a => a.id !== leadArticle?.id)
    .slice(0, 3);

  // Remaining articles for the feed
  const feedArticles = filteredArticles
    .filter(a => a.id !== leadArticle?.id && !spotlightArticles.some(s => s.id === a.id));

  // Trending articles
  const trendingArticles = [...articles].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0)).slice(0, 5);

  // MP & Bhopal Dedicated Section
  const mpBhopalArticles = articles.filter(
    a => a.categoryName === 'Madhya Pradesh' || a.categoryName === 'Bhopal'
  ).slice(0, 4);

  const handleOpenArticle = (slugOrTitle: string) => {
    const found = articles.find(a => a.slug === slugOrTitle || a.id === slugOrTitle || a.title === slugOrTitle);
    if (found) {
      setActiveArticle(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* 1. CHANNEL HEADER */}
      <Header
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          if (slug !== 'madhya-pradesh') {
            setSelectedState(null);
          }
          setIsStateDropdownOpen(false);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
        isStateDropdownOpen={isStateDropdownOpen}
        onToggleStateDropdown={() => setIsStateDropdownOpen(!isStateDropdownOpen)}
        onCloseStateDropdown={() => setIsStateDropdownOpen(false)}
        selectedStateId={selectedState?.id || 'all-mp'}
        onSelectState={(state) => {
          setSelectedState(state);
          setSelectedCategory('madhya-pradesh');
          setIsStateDropdownOpen(false);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
        articleCounts={articleCounts}
      />

      {/* 2. BREAKING NEWS TICKER */}
      <BreakingTicker 
        items={breakingNews} 
        onSelectArticle={handleOpenArticle}
      />

      {/* 3. MAIN HOMEPAGE CONTENT WRAPPER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1 w-full space-y-10">

        {/* LOADING SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
            <div className="lg:col-span-8 h-96 bg-slate-200 rounded-2xl" />
            <div className="lg:col-span-4 space-y-4">
              <div className="h-28 bg-slate-200 rounded-xl" />
              <div className="h-28 bg-slate-200 rounded-xl" />
              <div className="h-28 bg-slate-200 rounded-xl" />
            </div>
          </div>
        )}

        {/* HERO EDITORIAL SPOTLIGHT (Lead Article + 3 Side Stories) */}
        {!loading && leadArticle && (
          <section className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 bg-red-600 rounded-full live-beacon" />
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  {selectedState ? `📍 ${selectedState.nameHi} विशेष बुलेटिन` : (selectedCategory === 'all' ? 'Top Headlines' : `${leadArticle.categoryName} Lead Story`)}
                </h2>
              </div>
              <div className="flex items-center space-x-3">
                {selectedState && (
                  <button
                    onClick={() => {
                      setSelectedState(null);
                      setSelectedCategory('all');
                      setIsStateDropdownOpen(false);
                    }}
                    className="text-xs font-bold text-red-600 hover:underline"
                  >
                    ← All Top Stories
                  </button>
                )}
                <span className="text-xs text-slate-500 font-medium">
                  {selectedState ? `${filteredArticles.length} ख़बरें उपलब्ध` : 'Updated in Real-Time'}
                </span>
              </div>
            </div>

            {/* Quick Switch Chips when in State Mode */}
            {selectedState && (
              <div className="bg-red-50/70 border border-red-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="font-bold text-xs text-red-950">
                    {selectedState.nameHi} विशेष कवरेज:
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {ALL_STATES_AND_DISTRICTS.slice(0, 8).map(item => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedState(item)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                        selectedState.id === item.id
                          ? 'bg-red-600 text-white shadow-xs font-bold'
                          : 'bg-white text-slate-700 hover:bg-red-100 border border-slate-200'
                      }`}
                    >
                      {item.nameHi}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      setIsStateDropdownOpen(true);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-2.5 py-1 rounded-md text-[11px] font-bold text-red-700 bg-red-100/80 hover:bg-red-200 border border-red-300 transition"
                  >
                    + पूरी राज्य सूची खोलें ▾
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* PRIMARY LEAD STORY CARD (8 Cols) */}
              <div 
                onClick={() => setActiveArticle(leadArticle)}
                className="lg:col-span-8 bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative w-full h-72 sm:h-96 overflow-hidden bg-slate-900">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={leadArticle.coverImage} 
                    alt={leadArticle.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider bg-red-600 text-white px-3 py-1 rounded-md shadow-md">
                      {leadArticle.categoryName}
                    </span>
                  </div>

                  {/* Title Overlay in Lead Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-black leading-tight drop-shadow-md group-hover:text-amber-300 transition">
                      {leadArticle.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                      <span className="font-semibold text-white">{leadArticle.authorName}</span>
                      <span>•</span>
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1" />
                        {leadArticle.readingTimeMinutes} min read
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(leadArticle.publishedAt || leadArticle.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-6 bg-white space-y-3">
                  <p className="text-sm sm:text-base text-slate-700 font-serif leading-relaxed line-clamp-3">
                    {leadArticle.summary}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span className="flex items-center text-red-600 font-bold group-hover:translate-x-1 transition">
                      Read Complete Verified Report <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </span>
                    <span className="flex items-center text-slate-400">
                      <Eye className="w-3.5 h-3.5 mr-1" /> {leadArticle.viewsCount.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>

              {/* 3 SIDE SPOTLIGHT STORIES (4 Cols) */}
              <div className="lg:col-span-4 flex flex-col space-y-4">
                {spotlightArticles.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveArticle(item)}
                    className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-xs transition cursor-pointer group flex space-x-3 items-start"
                  >
                    <div className="w-24 h-20 sm:w-28 sm:h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.coverImage} 
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center space-x-1.5 text-[10px] font-bold">
                        <span className="text-red-600 uppercase">{item.categoryName}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-red-600 transition leading-snug">
                        {item.title}
                      </h4>
                      <div className="flex items-center text-[11px] text-slate-400 space-x-2 pt-0.5">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-0.5" />
                          {item.readingTimeMinutes}m
                        </span>
                        <span>•</span>
                        <span>{item.authorName.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Live News Audio Banner */}
                <div className="bg-gradient-to-r from-red-700 to-amber-600 rounded-xl p-4 text-white shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded">
                      Audio Broadcast
                    </span>
                    <h5 className="font-bold text-sm mt-1">2-Minute News Bulletin</h5>
                    <p className="text-xs text-red-100">सॉफ्ट व स्पष्ट न्यूज़ एंकर की आवाज़ में सुनें</p>
                  </div>
                  <button
                    onClick={() => {
                      if (isPlayingLeadAudio) {
                        stopSpeaking();
                        setIsPlayingLeadAudio(false);
                      } else if (leadArticle) {
                        speakSoftFemaleVoice(`${leadArticle.title}. ${leadArticle.summary}`, {
                          onStart: () => setIsPlayingLeadAudio(true),
                          onEnd: () => setIsPlayingLeadAudio(false),
                          onError: () => setIsPlayingLeadAudio(false)
                        });
                      }
                    }}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition transform hover:scale-105 shrink-0 flex items-center space-x-1.5 cursor-pointer ${
                      isPlayingLeadAudio
                        ? 'bg-red-950 text-white border border-red-400 animate-pulse'
                        : 'bg-white text-red-700 hover:bg-red-50'
                    }`}
                    title={isPlayingLeadAudio ? "ऑडियो बंद करें" : "सॉफ्ट एंकर की आवाज़ में सुनें"}
                  >
                    <span>{isPlayingLeadAudio ? '■ रोकें (Stop)' : '▶ सुनें (Listen)'}</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MADHYA PRADESH & BHOPAL SPECIAL SECTION */}
        {selectedCategory === 'all' && mpBhopalArticles.length > 0 && (
          <section className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-red-600" />
                <h3 className="text-lg font-black tracking-tight text-slate-900">
                  Madhya Pradesh Special Bureau
                </h3>
              </div>
              <div className="flex items-center space-x-2">
                {/* State/District Explorer Button */}
                <button
                  onClick={() => {
                    setSelectedCategory('madhya-pradesh');
                    setSelectedState(ALL_STATES_AND_DISTRICTS[0]);
                    setIsStateDropdownOpen(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center space-x-1.5 text-xs font-bold bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition shadow-sm"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>राज्य सूची खोलें ▾</span>
                </button>
                <button
                  onClick={() => setSelectedCategory('madhya-pradesh')}
                  className="text-xs font-bold text-red-600 hover:underline flex items-center"
                >
                  View All <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mpBhopalArticles.map((art) => (
                <div
                  key={art.id}
                  onClick={() => setActiveArticle(art)}
                  className="group cursor-pointer space-y-2 flex flex-col justify-between"
                >
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={art.coverImage} 
                      alt={art.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">
                      {art.categoryName}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {art.summary}
                    </p>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                    <span>{art.authorName}</span>
                    <span>{art.readingTimeMinutes} min read</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 3.2 DAINIK RASHIFAL (DAILY HOROSCOPE SECTION) */}
        <RashifalSection />

        {/* LATEST STORIES FEED + TRENDING COLUMN */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          {/* LATEST ARTICLES LIST (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
                <span>Latest Dispatches</span>
              </h3>
              <span className="text-xs text-slate-500">
                Showing {Math.min(visibleCount, feedArticles.length)} of {feedArticles.length} stories
              </span>
            </div>

            <div className="space-y-4">
              {feedArticles.slice(0, visibleCount).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveArticle(item)}
                  className="bg-white p-4 rounded-xl border border-slate-200 hover:border-red-300 hover:shadow-xs transition cursor-pointer group flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 items-start"
                >
                  <div className="w-full sm:w-44 h-32 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={item.coverImage} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2 text-[10px] font-bold">
                      <span className="text-red-600 uppercase bg-red-50 px-2 py-0.5 rounded border border-red-100">
                        {item.categoryName}
                      </span>
                      <span className="text-slate-400 font-normal">
                        {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-red-600 transition leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 font-serif leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <span className="font-medium text-slate-600">By {item.authorName}</span>
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {item.readingTimeMinutes} min read
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {feedArticles.length === 0 && (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
                  <p className="text-sm font-semibold">No published articles in this category yet.</p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="mt-2 text-xs text-red-600 font-bold hover:underline"
                  >
                    View All News
                  </button>
                </div>
              )}
            </div>

            {/* Load More Button */}
            {visibleCount < feedArticles.length && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-6 py-2.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 shadow-2xs transition"
                >
                  Load More Stories
                </button>
              </div>
            )}
          </div>

          {/* TRENDING STORIES & DESK ACTIONS (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Numbered Trending Box */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                <Flame className="w-5 h-5 text-red-600" />
                <h3 className="text-base font-black text-slate-900 tracking-tight">
                  Trending Across India
                </h3>
              </div>

              <div className="space-y-4">
                {trendingArticles.map((trend, index) => (
                  <div
                    key={trend.id}
                    onClick={() => setActiveArticle(trend)}
                    className="flex items-start space-x-3 cursor-pointer group pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <span className="text-2xl font-black text-slate-300 group-hover:text-red-600 transition font-mono shrink-0 w-6">
                      0{index + 1}
                    </span>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-bold text-red-600 uppercase">
                        {trend.categoryName}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition leading-snug line-clamp-2">
                        {trend.title}
                      </h4>
                      <div className="flex items-center text-[10px] text-slate-400 space-x-2">
                        <span className="flex items-center">
                          <Eye className="w-3 h-3 mr-0.5" />
                          {trend.viewsCount.toLocaleString()} reads
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Citizen News Desk / Tip-Line */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-800 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-400/20 px-2 py-0.5 rounded">
                News Tip-Line
              </span>
              <h4 className="font-bold text-sm text-white">
                Have a Lead or Ground Story?
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Citizens and eyewitnesses can share verified ground tips directly with our 24×7 editorial desk.
              </p>
              <a
                href="mailto:tips@newstarget.in"
                className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-lg transition"
              >
                <span>Send Ground Tip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* 4. FOOTER */}
      <Footer 
        categories={categories} 
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }}
      />

      {/* 5. INTERACTIVE ARTICLE DETAIL MODAL */}
      <ArticleModal
        article={activeArticle}
        onClose={() => setActiveArticle(null)}
        onSelectRelated={(slug) => handleOpenArticle(slug)}
        relatedArticles={articles.filter(a => a.categoryName === activeArticle?.categoryName && a.id !== activeArticle?.id)}
      />

      {/* 6. SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        articles={articles}
        onSelectArticle={(slug) => handleOpenArticle(slug)}
      />
    </div>
  );
}
