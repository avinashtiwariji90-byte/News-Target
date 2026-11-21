'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Share2, 
  Check, 
  ExternalLink, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Eye, 
  Calendar, 
  User, 
  Tag, 
  ZoomIn, 
  ZoomOut,
  Send
} from 'lucide-react';
import { Article } from '@/lib/types';
import { speakSoftFemaleVoice, stopSpeaking } from '@/lib/speech';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onSelectRelated?: (slug: string) => void;
  relatedArticles?: Article[];
}

export default function ArticleModal({
  article,
  onClose,
  onSelectRelated,
  relatedArticles = []
}: ArticleModalProps) {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    // Stop any ongoing speech when modal unmounts or changes
    return () => {
      stopSpeaking();
    };
  }, [article]);

  if (!article) return null;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📰 *${article.title}*\n\nRead full coverage on News Target:\n${window.location.origin}/article/${article.slug}`
    );
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const waUrl = isMobile
      ? `https://api.whatsapp.com/send?text=${text}`
      : `https://web.whatsapp.com/send?text=${text}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${article.title} via @NewsTarget`);
    const url = encodeURIComponent(`${window.location.origin}/article/${article.slug}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}/article/${article.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      const textToRead = `${article.title}. ${article.summary}. ${article.content}`;
      speakSoftFemaleVoice(textToRead, {
        onStart: () => setIsPlayingAudio(true),
        onEnd: () => setIsPlayingAudio(false),
        onError: () => setIsPlayingAudio(false)
      });
      setIsPlayingAudio(true);
    }
  };

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const fontClass = 
    fontSize === 'xlarge' ? 'text-xl leading-relaxed' :
    fontSize === 'large' ? 'text-lg leading-relaxed' : 
    'text-base leading-relaxed';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto border border-slate-200 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL TOP ACTIONS BAR */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2.5 py-1 rounded-md border border-red-200">
              {article.categoryName}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-500 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
              {article.readingTimeMinutes} min read
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Soft Female Voice Listen Button */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                isPlayingAudio 
                  ? 'bg-red-600 text-white border-red-700 shadow-sm' 
                  : 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100'
              }`}
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4 animate-pulse" />
                  <span>आवाज़ रोकें (Stop)</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-pink-600" />
                  <span className="hidden sm:inline">सॉफ्ट आवाज़ में सुनें</span>
                </>
              )}
            </button>

            {/* Font Zoom Controls */}
            <div className="hidden sm:flex items-center space-x-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 text-xs font-bold rounded ${fontSize === 'normal' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                title="Normal text size"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 text-xs font-bold rounded ${fontSize === 'large' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                title="Large text size"
              >
                A+
              </button>
              <button
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 text-xs font-bold rounded ${fontSize === 'xlarge' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-500'}`}
                title="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* SCROLLABLE ARTICLE BODY */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug">
            {article.title}
          </h1>

          {/* Byline, Date & Views */}
          <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-y border-slate-100 text-xs sm:text-sm text-slate-600">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                {article.authorName.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <span>{article.authorName}</span>
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  <span>{article.authorRole === 'ADMIN' ? 'Editor-in-Chief' : article.authorRole === 'AI_SYSTEM' ? 'Automated Ingestion Desk' : 'Bhopal Bureau Staff'}</span>
                  <span>•</span>
                  <span>{formattedDate}</span>
                </p>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShareWhatsApp}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-xs"
                title="Share on WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleShareTwitter}
                className="flex items-center space-x-1.5 bg-slate-900 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition shadow-xs"
                title="Share on X (Twitter)"
              >
                <span>𝕏 Post</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 transition"
                title="Copy Link"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Link'}</span>
              </button>
            </div>
          </div>

          {/* AI INTEGRITY & FACT-CHECK CARD */}
          {article.isAiGenerated && (
            <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 font-bold text-indigo-900">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI-Assisted Story Verification</span>
                </div>
                {article.aiConfidenceScore && (
                  <span className="font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-200">
                    Confidence: {article.aiConfidenceScore}%
                  </span>
                )}
              </div>

              {article.factCheckNotes && (
                <p className="text-indigo-950 font-medium leading-relaxed">
                  <strong>Verification Note:</strong> {article.factCheckNotes}
                </p>
              )}

              {article.conflictingFlags && article.conflictingFlags.length > 0 && (
                <div className="bg-amber-100/80 border border-amber-300 text-amber-900 p-2.5 rounded-lg flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Editorial Conflict Flag:</span>
                    <ul className="list-disc list-inside mt-0.5">
                      {article.conflictingFlags.map((flag, idx) => (
                        <li key={idx}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex items-center text-[11px] text-indigo-700 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                <span>
                  {article.status === 'PUBLISHED' 
                    ? `Verified and approved by Senior Editorial Desk (${article.reviewedBy || 'Editor'}).` 
                    : 'Awaiting mandatory human editorial sign-off.'}
                </span>
              </div>
            </div>
          )}

          {/* Video Player if attached */}
          {article.videoUrl && (!article.videos || article.videos.length <= 1) && (
            <div className="w-full rounded-xl overflow-hidden bg-black shadow-md aspect-video mb-3">
              <video
                src={article.videoUrl}
                controls
                className="w-full h-full object-cover"
                poster={article.coverImage}
              />
            </div>
          )}

          {/* Hero Cover Image */}
          {article.coverImage && (
            <figure className="space-y-2">
              <div className="w-full h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={article.coverImage} 
                  alt={article.title}
                  className="w-full h-full object-cover" 
                />
              </div>
              {article.caption && (
                <figcaption className="text-xs text-slate-500 italic px-1">
                  📸 {article.caption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Quick Summary Highlights Box */}
          {article.summary && (
            <div className="bg-amber-50/60 border-l-4 border-amber-500 p-4 rounded-r-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">
                Key Story Highlights
              </h3>
              <p className="text-sm font-medium text-amber-950 leading-relaxed">
                {article.summary}
              </p>
            </div>
          )}

          {/* Main Article Body Text */}
          <div className={`text-slate-800 space-y-4 font-serif ${fontClass}`}>
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Multi-Photo Gallery if multiple photos attached */}
          {article.gallery && article.gallery.length > 1 && (
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <span>📸 फोटो गैलरी ({article.gallery.length} तस्वीरें)</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {article.gallery.map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video shadow-xs hover:shadow-md transition">
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Multi-Video Section if multiple videos attached */}
          {article.videos && article.videos.length > 0 && (
            <div className="space-y-3 pt-6 border-t border-slate-200">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center space-x-1.5">
                <span>🎥 वीडियो कवरेज ({article.videos.length} वीडियो)</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {article.videos.map((vid, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden bg-black aspect-video shadow-sm border border-slate-200">
                    <video src={vid} controls className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Attribution Card */}
          {(article.sourceUrl || article.sourceName) && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
                  Original Source & Reference
                </span>
                <span className="font-semibold text-slate-900 text-sm">
                  {article.sourceName || 'Authorized News Wire / Government Gazette'}
                </span>
              </div>

              {article.sourceUrl && (
                <a
                  href={article.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 font-bold text-red-600 hover:text-red-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 hover:border-red-300 transition shadow-2xs"
                >
                  <span>Verify Primary Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Story Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 flex items-center">
                <Tag className="w-3.5 h-3.5 mr-1" /> Tags:
              </span>
              {article.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full border border-slate-200 font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Related Articles Recommendations */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-slate-200 space-y-3">
              <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center space-x-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
                <span>Recommended Stories in {article.categoryName}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {relatedArticles.slice(0, 3).map((rel) => (
                  <button
                    key={rel.id}
                    onClick={() => onSelectRelated && onSelectRelated(rel.slug)}
                    className="text-left bg-slate-50 hover:bg-slate-100 p-3 rounded-xl border border-slate-200 transition group space-y-2 flex flex-col justify-between"
                  >
                    <div className="w-full h-28 rounded-lg overflow-hidden bg-slate-200">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={rel.coverImage} 
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-red-600 uppercase">
                        {rel.categoryName}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-2 group-hover:text-red-600 transition">
                        {rel.title}
                      </h4>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
