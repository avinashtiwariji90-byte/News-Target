'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Flame, ChevronRight, ChevronLeft, AlertCircle } from 'lucide-react';
import { BreakingNews } from '@/lib/types';

interface BreakingTickerProps {
  items: BreakingNews[];
  onSelectArticle?: (slugOrTitle: string) => void;
}

export default function BreakingTicker({ items = [], onSelectArticle }: BreakingTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!items || items.length === 0) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const currentItem = items[currentIndex];

  return (
    <div className="bg-red-600 text-white border-b border-red-700 shadow-sm relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-10 sm:h-11">
        {/* FLASH BADGE */}
        <div className="flex items-center shrink-0 pr-3 sm:pr-4 border-r border-red-500/60 font-black text-xs sm:text-sm uppercase tracking-wider space-x-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white live-beacon" />
          <Flame className="w-4 h-4 text-amber-300 animate-bounce" />
          <span>BREAKING</span>
          <span className="hidden md:inline text-red-200 font-normal text-xs">| ताज़ा ख़बर</span>
        </div>

        {/* TICKER DISPLAY (Cycling / scrolling) */}
        <div className="flex-1 overflow-hidden px-3 sm:px-4 flex items-center">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/30 text-amber-300 px-2 py-0.5 rounded shrink-0">
                {currentItem.category || 'National'}
              </span>

              <button
                onClick={() => {
                  if (onSelectArticle) {
                    onSelectArticle(currentItem.url || currentItem.title);
                  }
                }}
                className="text-xs sm:text-sm font-semibold truncate hover:underline text-left cursor-pointer"
              >
                {currentItem.title}
              </button>
            </div>
          </div>
        </div>

        {/* STEP CONTROLS & ITEM COUNTER */}
        <div className="flex items-center space-x-1 shrink-0 pl-2 border-l border-red-500/60 text-xs">
          <span className="text-[10px] font-mono text-red-100 hidden sm:inline mr-1">
            {currentIndex + 1}/{items.length}
          </span>
          <button
            onClick={handlePrev}
            aria-label="Previous breaking news"
            className="p-1 hover:bg-red-700 rounded transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next breaking news"
            className="p-1 hover:bg-red-700 rounded transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
