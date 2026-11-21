'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Article, Category } from '@/lib/types';
import { speakSoftFemaleVoice, stopSpeaking } from '@/lib/speech';
import { 
  ArrowLeft, 
  Clock, 
  Share2, 
  Check, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Send, 
  Eye, 
  Tag 
} from 'lucide-react';

function ArticleContent() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      try {
        setLoading(true);
        const [artRes, catRes, allRes] = await Promise.all([
          fetch(`/api/articles/${slug}`),
          fetch('/api/categories'),
          fetch('/api/articles?status=PUBLISHED')
        ]);

        const artData = await artRes.json();
        const catData = await catRes.json();
        const allData = await allRes.json();

        if (artData.success) {
          setArticle(artData.article);
          if (allData.success) {
            setRelated(
              allData.articles.filter((a: Article) => a.id !== artData.article.id && a.categoryName === artData.article.categoryName).slice(0, 3)
            );
          }
        }
        if (catData.success) setCategories(catData.categories);
      } catch (err) {
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();

    return () => {
      stopSpeaking();
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-semibold text-sm">
        Loading verified news report...
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h2 className="text-2xl font-black text-slate-900">Story Not Found</h2>
        <p className="text-slate-500 text-sm">This article might have been moved or archived.</p>
        <Link href="/" className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-xs">
          Return to Front Page
        </Link>
      </div>
    );
  }

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `📰 *${article.title}*\n\nRead on News Target:\n${window.location.href}`
    );
    const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
    const waUrl = isMobile
      ? `https://api.whatsapp.com/send?text=${text}`
      : `https://web.whatsapp.com/send?text=${text}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(`${article.title} via @NewsTarget`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
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

  const fontClass = 
    fontSize === 'xlarge' ? 'text-xl leading-relaxed' :
    fontSize === 'large' ? 'text-lg leading-relaxed' : 
    'text-base leading-relaxed';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Header categories={categories} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <Link href="/" className="flex items-center hover:text-red-600 font-bold transition">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Headlines
          </Link>

          <div className="flex items-center space-x-2">
            <span className="font-bold text-red-600 uppercase">{article.categoryName}</span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {article.readingTimeMinutes} min read
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          {article.title}
        </h1>

        {/* Author Byline & Social Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 text-xs sm:text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-sm shadow-xs">
              {article.authorName.charAt(0)}
            </div>
            <div>
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>{article.authorName}</span>
              </p>
              <p className="text-xs text-slate-500">
                Published on {new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleToggleAudio}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                isPlayingAudio ? 'bg-red-600 text-white border-red-700' : 'bg-pink-50 text-pink-800 border-pink-200 hover:bg-pink-100'
              }`}
            >
              {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-pink-600" />}
              <span>{isPlayingAudio ? 'रोकें (Stop)' : 'सॉफ्ट आवाज़ में सुनें'}</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center space-x-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Cover Image */}
        {article.coverImage && (
          <figure className="space-y-2">
            <div className="w-full h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
            </div>
            {article.caption && (
              <figcaption className="text-xs text-slate-500 italic px-1">
                📸 {article.caption}
              </figcaption>
            )}
          </figure>
        )}

        {/* Video Player if attached */}
        {article.videoUrl && (!article.videos || article.videos.length <= 1) && (
          <div className="w-full rounded-2xl overflow-hidden bg-black shadow-md aspect-video border border-slate-200">
            <video
              src={article.videoUrl}
              controls
              className="w-full h-full object-cover"
              poster={article.coverImage}
            />
          </div>
        )}

        {/* Summary Callout */}
        {article.summary && (
          <div className="bg-amber-50/70 border-l-4 border-amber-500 p-4 rounded-r-xl">
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-1">
              Quick Highlights
            </h3>
            <p className="text-sm font-medium text-amber-950 leading-relaxed">
              {article.summary}
            </p>
          </div>
        )}

        {/* Body Paragraphs */}
        <div className={`text-slate-800 space-y-4 font-serif ${fontClass}`}>
          {article.content.split('\n\n').map((para, i) => (
            <p key={i} className="leading-relaxed">
              {para}
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

        {/* Source Attribution */}
        {article.sourceUrl && (article.sourceUrl.startsWith('http://') || article.sourceUrl.startsWith('https://')) && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Primary Attribution
              </span>
              <span className="font-bold text-slate-800 text-sm">
                {article.sourceName || article.sourceUrl}
              </span>
            </div>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 font-bold hover:underline flex items-center bg-red-50 px-3 py-1.5 rounded-lg border border-red-200"
            >
              <span>View Source</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        )}

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs font-bold text-slate-400">Tags:</span>
            {article.tags.map((t, i) => (
              <span key={i} className="text-xs bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full font-medium">
                #{t}
              </span>
            ))}
          </div>
        )}

        {/* Related Stories */}
        {related.length > 0 && (
          <div className="pt-8 border-t border-slate-200 space-y-4">
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              Related News in {article.categoryName}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/article/${item.slug}`}
                  className="bg-white p-3 rounded-xl border border-slate-200 hover:border-red-300 transition group space-y-2 block"
                >
                  <div className="w-full h-28 rounded-lg overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition line-clamp-2">
                    {item.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer categories={categories} />
    </div>
  );
}

export default function ArticleDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-semibold text-sm">
          Loading verified news report...
        </div>
      }
    >
      <ArticleContent />
    </Suspense>
  );
}
