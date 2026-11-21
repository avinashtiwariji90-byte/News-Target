'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { Article } from '@/lib/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (slug: string) => void;
}

export default function SearchModal({
  isOpen,
  onClose,
  articles = [],
  onSelectArticle
}: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = query.trim() === ''
    ? []
    : articles.filter(a => {
        const q = query.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.categoryName.toLowerCase().includes(q) ||
          a.tags.some(t => t.toLowerCase().includes(q))
        );
      }).slice(0, 8);

  const quickPills = ['Bhopal', 'Madhya Pradesh', 'AI', 'ISRO', 'Metro', 'Business', 'Politics'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex justify-center p-4 pt-16 sm:pt-24 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[75vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="p-4 border-b border-slate-200 flex items-center space-x-3 bg-slate-50">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news, Bhopal local affairs, AI breakthroughs, politics..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 bg-slate-200 rounded"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-slate-100/60 border-b border-slate-200 flex items-center space-x-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 font-semibold text-[11px] shrink-0">Popular:</span>
          {quickPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setQuery(pill)}
              className="px-2.5 py-0.5 rounded-full bg-white text-slate-700 hover:bg-red-50 hover:text-red-700 border border-slate-200 text-xs font-medium shrink-0 transition"
            >
              {pill}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-4 space-y-2 flex-1">
          {query.trim() === '' ? (
            <div className="text-center py-10 text-slate-400 text-xs sm:text-sm">
              <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <span>Type keywords to search published and verified stories across Indian bureaus.</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs sm:text-sm">
              <span>No articles found matching &ldquo;{query}&rdquo;. Try another term.</span>
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectArticle(item.slug);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition border border-transparent hover:border-slate-200 flex items-start space-x-3 group"
              >
                <div className="w-16 h-14 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 text-[10px] font-bold">
                    <span className="text-red-600 uppercase">{item.categoryName}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-400 font-normal">{item.readingTimeMinutes} min read</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 transition truncate mt-0.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                    {item.summary}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-red-600 group-hover:translate-x-1 transition shrink-0 mt-3" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
