'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Sparkles, Send } from 'lucide-react';
import { Category } from '@/lib/types';

interface FooterProps {
  categories?: Category[];
  onSelectCategory?: (slug: string) => void;
}

export default function Footer({ categories = [], onSelectCategory }: FooterProps) {
  const [currentYear, setCurrentYear] = React.useState<number>(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-16 text-xs">
      {/* Top Banner: Journalistic Integrity & Ethics */}
      <div className="bg-slate-900 border-b border-slate-800 py-6 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 border border-red-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">
                Journalistic Verification & Governance Charter
              </h4>
              <p className="text-slate-400 text-xs">
                Every news dispatch undergoes mandatory human editorial review before broadcast. Adheres to Press Council of India norms.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0 text-slate-400 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>PCI Verified Editorial Standards</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Col 1: Brand & Bio */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <img
              src="/logo.png"
              alt="News Target Logo"
              className="h-9 w-auto object-contain"
            />
            <span className="text-lg font-black text-white tracking-tight">
              NEWS <span className="text-red-500">TARGET</span>
            </span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            India&apos;s pioneering digital news platform providing 24×7 authenticated coverage of Madhya Pradesh, Bhopal, National Policy, and World events.
          </p>
          <div className="flex items-center space-x-2 text-slate-300 text-xs">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-emerald-400">Authentic, Government-Verified</span>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div className="space-y-3">
          <h5 className="text-white font-bold text-xs uppercase tracking-wider">News Desks</h5>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            {categories.filter(c => c.slug !== 'ai' && c.slug !== 'technology').slice(0, 10).map((cat) => (
              <li key={cat.id}>
                <button
                  onClick={() => onSelectCategory && onSelectCategory(cat.slug)}
                  className="hover:text-red-400 transition text-left"
                >
                  {cat.name}
                </button>
              </li>
            ))}
            <li key="rashifal-footer">
              <a
                href="#rashifal"
                onClick={(e) => {
                  const el = document.getElementById('rashifal');
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="text-amber-400 hover:text-amber-300 font-semibold transition text-left flex items-center gap-1"
              >
                <span>🔮 दैनिक राशिफल</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Editorial Bureaus */}
        <div className="space-y-3">
          <h5 className="text-white font-bold text-xs uppercase tracking-wider">Editorial Bureaus</h5>
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span className="font-medium text-slate-300">Bhopal State Bureau</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <span className="font-medium text-slate-300">National Bureau (New Delhi)</span>
            </div>
          </div>
        </div>

        {/* Col 4: Feeds & Subscription */}
        <div className="space-y-3">
          <h5 className="text-white font-bold text-xs uppercase tracking-wider">Updates &amp; Alerts</h5>
          <p className="text-xs text-slate-400">
            Join our official WhatsApp channel for 24×7 breaking news alerts.
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp Channel</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-900 py-4 px-4 sm:px-6 text-center text-slate-500 text-[11px]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {currentYear} News Target Digital Media Network Ltd. All rights reserved.
          </span>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-300 cursor-pointer">Editorial Policy</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Fact-Check Guidelines</span>
            <span>•</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy & Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
