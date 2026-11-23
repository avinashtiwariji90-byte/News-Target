'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Eye,
  Flame,
  Users,
  Settings,
  History,
  ArrowLeft,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  AlertTriangle,
  Edit3,
  Trash2,
  Plus,
  Send,
  Check,
  TrendingUp,
  Rss,
  Star,
  Upload,
  Video,
  Image as ImageIcon,
  RotateCcw,
  Camera
} from 'lucide-react';
import { Article, ArticleStatus, AuditLog, BreakingNews, Category, ScheduledFeed, User } from '@/lib/types';
import { getAiSuggestedMediaList, AiSuggestedMedia } from '@/lib/aiMedia';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'pending' | 'published' | 'top-stories' | 'breaking' | 'reporters' | 'audit' | 'analytics'>('pending');
  const [pendingSubTab, setPendingSubTab] = useState<'ai' | 'human'>('ai');
  const [reporterSubFilter, setReporterSubFilter] = useState<'all' | 'pending' | 'published' | 'rejected'>('all');

  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [breakingNews, setBreakingNews] = useState<BreakingNews[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [feeds, setFeeds] = useState<ScheduledFeed[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAiRunning, setIsAiRunning] = useState(false);

  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Review Modal State
  const [selectedReviewArticle, setSelectedReviewArticle] = useState<Article | null>(null);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewSummary, setReviewSummary] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviewAuthorName, setReviewAuthorName] = useState('');
  const [reviewGallery, setReviewGallery] = useState<string[]>([]);
  const [reviewCoverImage, setReviewCoverImage] = useState('');
  const [reviewCaption, setReviewCaption] = useState('');
  const [reviewVideos, setReviewVideos] = useState<string[]>([]);
  const [newReviewVideoInput, setNewReviewVideoInput] = useState('');
  const [reviewMediaSourceType, setReviewMediaSourceType] = useState<'AI' | 'UPLOADED' | 'EXISTING'>('EXISTING');
  const [reviewAiIndex, setReviewAiIndex] = useState(0);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Breaking News Form
  const [newBreakingTitle, setNewBreakingTitle] = useState('');
  const [newBreakingCategory, setNewBreakingCategory] = useState('National');
  const [newBreakingPriority, setNewBreakingPriority] = useState<'FLASH' | 'URGENT' | 'HIGH'>('HIGH');

  // Top Story Form State
  const [isTopStoryFormOpen, setIsTopStoryFormOpen] = useState(false);
  const [topStoryTitle, setTopStoryTitle] = useState('');
  const [topStorySummary, setTopStorySummary] = useState('');
  const [topStoryContent, setTopStoryContent] = useState('');
  const [topStoryCategory, setTopStoryCategory] = useState('Madhya Pradesh');
  const [topStoryGallery, setTopStoryGallery] = useState<string[]>([
    'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80'
  ]);
  const [topStoryCoverImage, setTopStoryCoverImage] = useState('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80');
  const [topStoryCaption, setTopStoryCaption] = useState('News Target Verified Photo Dispatch');
  const [topStoryVideos, setTopStoryVideos] = useState<string[]>([]);
  const [newTopStoryVideoInput, setNewTopStoryVideoInput] = useState('');
  const [mediaSourceType, setMediaSourceType] = useState<'AI' | 'UPLOADED' | 'PRESET'>('PRESET');
  const [aiImageIndex, setAiImageIndex] = useState(0);
  const [topStoryAuthor, setTopStoryAuthor] = useState('News Target Special Bureau');
  const [topStorySubmitting, setTopStorySubmitting] = useState(false);
  const [selectedPromoteId, setSelectedPromoteId] = useState('');

  // Media Handlers (Upload Multiple Photos, Upload Multiple Videos, AI Auto-Select)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`फ़ाइल '${file.name}' बहुत बड़ी है (अधिकतम 5MB)।`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setTopStoryGallery(prev => {
          const updated = [...prev, dataUrl];
          if (!topStoryCoverImage) setTopStoryCoverImage(dataUrl);
          return updated;
        });
        setMediaSourceType('UPLOADED');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (file.size > 20 * 1024 * 1024) {
        alert(`वीडियो '${file.name}' बहुत बड़ा है (अधिकतम 20MB)।`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setTopStoryVideos(prev => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddTopStoryVideoUrl = () => {
    if (!newTopStoryVideoInput.trim()) return;
    setTopStoryVideos(prev => [...prev, newTopStoryVideoInput.trim()]);
    setNewTopStoryVideoInput('');
  };

  const handleAiSuggestPhoto = () => {
    const list = getAiSuggestedMediaList(topStoryTitle || topStoryCategory, topStoryCategory);
    const nextIdx = (aiImageIndex + 1) % list.length;
    setAiImageIndex(nextIdx);
    const chosen = list[nextIdx];
    setTopStoryGallery(prev => [...prev, chosen.url]);
    setTopStoryCoverImage(chosen.url);
    setTopStoryCaption(chosen.caption);
    setMediaSourceType('AI');
  };

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [artRes, statsRes, breakRes, logRes, catRes] = await Promise.all([
        fetch('/api/articles?status=ALL'),
        fetch('/api/stats'),
        fetch('/api/breaking'),
        fetch('/api/audit-logs'),
        fetch('/api/categories')
      ]);

      const artData = await artRes.json();
      const statsData = await statsRes.json();
      const breakData = await breakRes.json();
      const logData = await logRes.json();
      const catData = await catRes.json();

      if (artData.success) setArticles(artData.articles);
      if (statsData.success) setStats(statsData.stats);
      if (breakData.success) setBreakingNews(breakData.items);
      if (logData.success) setAuditLogs(logData.logs);
      if (catData.success) setCategories(catData.categories);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success && data.authenticated && (data.user.role === 'ADMIN' || data.user.role === 'EDITOR')) {
        setCurrentUser(data.user);
        fetchAdminData();
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    } catch {
      setCurrentUser(null);
      setLoading(false);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        if (data.user.role !== 'ADMIN' && data.user.role !== 'EDITOR') {
          setLoginError('Access denied: You do not have Editorial Administrator privileges.');
          return;
        }
        setCurrentUser(data.user);
        fetchAdminData();
      } else {
        setLoginError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login service unavailable');
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setCurrentUser(null);
  };

  const openReviewModal = (article: Article) => {
    setSelectedReviewArticle(article);
    setReviewTitle(article.title);
    setReviewSummary(article.summary);
    setReviewContent(article.content);
    setReviewAuthorName(article.authorName || 'News Target Reporter');
    const initialPhotos = article.gallery && article.gallery.length > 0
      ? [...article.gallery]
      : (article.coverImage ? [article.coverImage] : []);
    setReviewGallery(initialPhotos);
    setReviewCoverImage(initialPhotos[0] || article.coverImage || '');
    setReviewCaption(article.caption || '');
    const initialVideos = article.videos && article.videos.length > 0
      ? [...article.videos]
      : (article.videoUrl ? [article.videoUrl] : []);
    setReviewVideos(initialVideos);
    setNewReviewVideoInput('');
    setReviewMediaSourceType('EXISTING');
    setRejectionReason('');
    setIsRejecting(false);
  };

  // Review Modal Media Handlers (Multiple Photos, Multiple Videos, AI Suggest)
  const handleReviewPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`फ़ाइल '${file.name}' बहुत बड़ी है (अधिकतम 5MB)।`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setReviewGallery(prev => {
          const updated = [...prev, dataUrl];
          if (!reviewCoverImage) setReviewCoverImage(dataUrl);
          return updated;
        });
        setReviewMediaSourceType('UPLOADED');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleReviewVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      if (file.size > 20 * 1024 * 1024) {
        alert(`वीडियो '${file.name}' बहुत बड़ा है (अधिकतम 20MB)।`);
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setReviewVideos(prev => [...prev, dataUrl]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddReviewVideoUrl = () => {
    if (!newReviewVideoInput.trim()) return;
    setReviewVideos(prev => [...prev, newReviewVideoInput.trim()]);
    setNewReviewVideoInput('');
  };

  const handleReviewAiSuggestPhoto = () => {
    if (!selectedReviewArticle) return;
    const list = getAiSuggestedMediaList(reviewTitle || selectedReviewArticle.categoryName, selectedReviewArticle.categoryName);
    const nextIdx = (reviewAiIndex + 1) % list.length;
    setReviewAiIndex(nextIdx);
    const chosen = list[nextIdx];
    setReviewGallery(prev => [...prev, chosen.url]);
    if (!reviewCoverImage) {
      setReviewCoverImage(chosen.url);
      setReviewCaption(chosen.caption);
    }
    setReviewMediaSourceType('AI');
  };

  // Review Actions
  const handleApproveAndPublish = async () => {
    if (!selectedReviewArticle) return;
    try {
      setActionLoading(true);
      const finalCoverImage = reviewCoverImage || reviewGallery[0] || selectedReviewArticle.coverImage || '';
      const res = await fetch(`/api/articles/${selectedReviewArticle.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: reviewTitle,
          summary: reviewSummary,
          content: reviewContent,
          authorName: reviewAuthorName.trim() || selectedReviewArticle.authorName,
          coverImage: finalCoverImage,
          caption: reviewCaption,
          videoUrl: reviewVideos[0] || undefined,
          gallery: reviewGallery,
          videos: reviewVideos,
          status: 'PUBLISHED',
          reviewedBy: 'Rajesh Sharma (Editor-in-Chief)',
          actor: { name: 'Rajesh Sharma', role: 'ADMIN' }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedReviewArticle(null);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to publish');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleQuickApprove = async (articleId: string) => {
    try {
      setActionLoading(true);
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'PUBLISHED',
          reviewedBy: currentUser?.name || 'Administrator',
          actor: { name: currentUser?.name || 'Administrator', role: 'ADMIN' }
        })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to approve');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectStory = async () => {
    if (!selectedReviewArticle) return;
    if (!rejectionReason.trim()) {
      alert('Please specify an editorial feedback reason for rejecting this article.');
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetch(`/api/articles/${selectedReviewArticle.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'REJECTED',
          rejectionReason,
          reviewedBy: 'Rajesh Sharma (Editor-in-Chief)',
          actor: { name: 'Rajesh Sharma', role: 'ADMIN' }
        })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedReviewArticle(null);
        fetchAdminData();
      } else {
        alert(data.error || 'Failed to reject story');
      }
    } catch (err: any) {
      alert(err.message || 'Error occurred');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnpublishArticle = async (id: string) => {
    if (!confirm('Are you sure you want to unpublish this story? It will return to DRAFT.')) return;
    try {
      await fetch(`/api/articles/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'DRAFT',
          actor: { name: 'Rajesh Sharma', role: 'ADMIN' }
        })
      });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this article?')) return;
    try {
      await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // AI News Discovery Trigger
  const handleTriggerAiDiscovery = async () => {
    try {
      setIsAiRunning(true);
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        alert(`AI Ingestion Successful: ${data.count} new verified draft(s) added to PENDING_REVIEW queue. Remember: Human approval is mandatory before publishing.`);
        fetchAdminData();
      } else {
        alert(data.error || 'AI Discovery failed');
      }
    } catch (err: any) {
      alert(err.message || 'AI Ingestion failed');
    } finally {
      setIsAiRunning(false);
    }
  };

  // Breaking News Handler
  const handleAddBreakingNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBreakingTitle.trim()) return;

    try {
      const res = await fetch('/api/breaking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBreakingTitle,
          category: newBreakingCategory,
          priority: newBreakingPriority
        })
      });
      const data = await res.json();
      if (data.success) {
        setNewBreakingTitle('');
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBreaking = async (id: string) => {
    try {
      await fetch(`/api/breaking?id=${id}`, { method: 'DELETE' });
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // Top Story Handlers
  const handleToggleFeatured = async (articleId: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isFeatured: !currentFeatured,
          actor: { name: 'Editor-in-Chief', role: 'ADMIN' }
        })
      });
      const data = await res.json();
      if (data.success) {
        setArticles(prev => prev.map(a => a.id === articleId ? { ...a, isFeatured: !currentFeatured } : a));
      } else {
        alert(data.error || 'Failed to update Top Story status');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating Top Story');
    }
  };

  const handleCreateTopStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topStoryTitle.trim() || !topStoryContent.trim()) {
      alert('कृपया शीर्षक (Title) और समाचार विवरण (Content) दर्ज करें।');
      return;
    }
    setTopStorySubmitting(true);
    try {
      const matchedCat = categories.find(c => c.name.toLowerCase() === topStoryCategory.toLowerCase());
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topStoryTitle.trim(),
          summary: topStorySummary.trim() || topStoryTitle.trim(),
          content: topStoryContent.trim(),
          categoryId: matchedCat?.id || 'cat-mp',
          categoryName: topStoryCategory,
          coverImage: topStoryCoverImage.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80',
          caption: topStoryCaption.trim(),
          videoUrl: newTopStoryVideoInput.trim() || topStoryVideos[0] || undefined,
          authorId: 'admin-desk',
          authorName: topStoryAuthor.trim() || 'News Target Bureau',
          authorRole: 'ADMIN',
          status: 'PUBLISHED',
          isFeatured: true,
          isAiGenerated: mediaSourceType === 'AI',
          tags: ['Top Story', topStoryCategory, 'Headlines']
        })
      });
      const data = await res.json();
      if (data.success) {
        setArticles(prev => [data.article, ...prev]);
        setTopStoryTitle('');
        setTopStorySummary('');
        setTopStoryContent('');
        setIsTopStoryFormOpen(false);
        alert('शीर्ष समाचार (Top Story) सफलतापूर्वक प्रकाशित हो गया है और होमपेज के सबसे ऊपर दिखेगा!');
      } else {
        alert(data.error || 'Failed to publish Top Story');
      }
    } catch (err) {
      console.error(err);
      alert('Error creating Top Story');
    } finally {
      setTopStorySubmitting(false);
    }
  };

  // Filter pending queues
  const pendingArticles = articles.filter(a => a.status === 'PENDING_REVIEW' || a.status === 'UNDER_REVIEW');
  const aiPendingArticles = pendingArticles.filter(a => a.isAiGenerated);
  const humanPendingArticles = pendingArticles.filter(a => !a.isAiGenerated);
  const publishedArticles = articles.filter(a => a.status === 'PUBLISHED');
  const featuredArticles = articles.filter(a => a.status === 'PUBLISHED' && a.isFeatured);
  const nonFeaturedPublished = articles.filter(a => a.status === 'PUBLISHED' && !a.isFeatured);

  // Reporter Ground Dispatches Filter (रिपोर्टर पोर्टल की ख़बरें)
  const reporterDispatches = articles.filter(a => !a.isAiGenerated);
  const pendingReporterDispatches = reporterDispatches.filter(a => a.status === 'PENDING_REVIEW' || a.status === 'UNDER_REVIEW');
  const publishedReporterDispatches = reporterDispatches.filter(a => a.status === 'PUBLISHED');
  const rejectedReporterDispatches = reporterDispatches.filter(a => a.status === 'REJECTED');

  const filteredReporterList = reporterDispatches.filter(a => {
    if (reporterSubFilter === 'pending') return a.status === 'PENDING_REVIEW' || a.status === 'UNDER_REVIEW';
    if (reporterSubFilter === 'published') return a.status === 'PUBLISHED';
    if (reporterSubFilter === 'rejected') return a.status === 'REJECTED';
    return true;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 space-y-3 font-sans">
        <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-300">
          सत्यापन प्रक्रिया जारी है (Verifying Security Credentials)...
        </p>
      </div>
    );
  }

  // 1.1 ADMIN SECURITY AUTHENTICATION GATE
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in duration-300">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-red-600/10 border border-red-600/30 text-red-500 mb-1">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              न्यूज़ टारगेट — एडमिन लॉगिन
            </h2>
            <p className="text-xs text-slate-400">
              यह पोर्टल केवल अधिकृत संपादकों और एडमिनिस्ट्रेटर के लिए सुरक्षित है।
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} autoComplete="off" className="space-y-4 text-xs">
            <input type="text" name="fakeuser" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
            <input type="password" name="fakepass" tabIndex={-1} autoComplete="new-password" style={{ display: 'none' }} />
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">
                एडमिन ईमेल या यूज़रनेम (Admin Email / Username)
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@bharatbulletin.in या Avinash@123"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">
                पासवर्ड (Password)
              </label>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 font-medium"
              />
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-amber-400 block">🔐 अधिकृत एडिटोरियल क्रेडेंशियल:</span>
              <p>ईमेल: <code className="text-slate-200 font-mono">admin@bharatbulletin.in</code></p>
              <p>डिफ़ॉल्ट पासवर्ड: <code className="text-slate-200 font-mono">Admin@NewsTarget2026!</code></p>
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer text-sm"
            >
              {loginSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>प्रमाणित किया जा रहा है...</span>
                </>
              ) : (
                <span>एडिटोरियल डेस्क में प्रवेश करें (Sign In)</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition font-medium inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>मुख्य वेबसाइट पर वापस जाएं</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      {/* 1. ADMIN TOP NAVIGATION */}
      <nav className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Public Portal</span>
            </Link>

            <span className="text-slate-800">|</span>

            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="News Target"
                className="h-7 w-auto object-contain"
              />
              <span className="font-bold text-sm tracking-tight text-white">
                EDITORIAL DECISION DESK
              </span>
              <span className="text-[10px] bg-red-500/20 text-red-400 font-mono px-2 py-0.5 rounded border border-red-500/30 font-bold">
                NEWS TARGET ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* AI News Ingestion Trigger Button */}
            <button
              onClick={handleTriggerAiDiscovery}
              disabled={isAiRunning}
              className="flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition shadow-xs cursor-pointer"
              title="Poll configured RSS feeds and generate news drafts"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiRunning ? 'animate-spin' : ''}`} />
              <span>{isAiRunning ? 'Ingesting Feeds...' : 'Trigger AI News Discovery'}</span>
            </button>

            {/* Authenticated Admin Identity & Sign Out */}
            <div className="flex items-center space-x-2.5 pl-2 border-l border-slate-800 text-right">
              <div className="hidden sm:block">
                <p className="font-bold text-white text-xs leading-none">{currentUser?.name || 'Rajesh Sharma'}</p>
                <p className="text-[10px] text-emerald-400 font-mono">{currentUser?.role || 'ADMIN'}</p>
              </div>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="text-xs bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition font-semibold cursor-pointer"
                title="लॉगआउट करें (Sign Out)"
              >
                लॉगआउट
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* 2. ADMIN STATS CARDS */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Total Archive</span>
            <p className="text-2xl font-black text-white mt-1">{stats?.totalArticles || articles.length}</p>
            <span className="text-[10px] text-slate-500">Across all categories</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-emerald-400 uppercase flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Published
            </span>
            <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.publishedCount || publishedArticles.length}</p>
            <span className="text-[10px] text-slate-500">Live on homepage</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-indigo-400 uppercase flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" /> AI Drafts
            </span>
            <p className="text-2xl font-black text-indigo-400 mt-1">{aiPendingArticles.length}</p>
            <span className="text-[10px] text-slate-500">Awaiting human sign-off</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-amber-400 uppercase flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" /> Human Pending
            </span>
            <p className="text-2xl font-black text-amber-400 mt-1">{humanPendingArticles.length}</p>
            <span className="text-[10px] text-slate-500">Reporter submissions</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-red-400 uppercase flex items-center">
              <Flame className="w-3.5 h-3.5 mr-1" /> Breaking
            </span>
            <p className="text-2xl font-black text-red-400 mt-1">{breakingNews.length}</p>
            <span className="text-[10px] text-slate-500">Active ticker items</span>
          </div>

          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-cyan-400 uppercase flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1" /> Reader Views
            </span>
            <p className="text-2xl font-black text-cyan-400 mt-1">{(stats?.totalViews || 43000).toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Total engagement</span>
          </div>
        </section>

        {/* 3. STRICT AI SAFEGUARD BANNER */}
        <div className="bg-indigo-950/70 border border-indigo-800/80 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
          <div className="flex items-start space-x-3">
            <ShieldAlert className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-indigo-200">
                Ethical Safeguard Active: Automated Publication is Strictly Prohibited
              </p>
              <p className="text-indigo-300 text-[11px]">
                Every AI-generated draft is locked in <code>PENDING_REVIEW</code> status until a human editor reviews facts, quotes, and primary source links.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] bg-indigo-900 text-indigo-300 px-2.5 py-1 rounded border border-indigo-700 shrink-0">
            COMPLIANCE: 100% HUMAN OVERSIGHT
          </span>
        </div>

        {/* 3.1. REPORTER DISPATCH APPROVAL ALERT BANNER */}
        {pendingReporterDispatches.length > 0 && (
          <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/50 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-lg">
            <div className="flex items-start space-x-3">
              <span className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <p className="font-bold text-amber-200 flex items-center gap-2">
                  <span>ग्राउंड रिपोर्टर्स द्वारा {pendingReporterDispatches.length} नई ख़बरें सबमिट की गई हैं (Pending Approval)</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-extrabold animate-pulse">
                    कार्रवाई अपेक्षित
                  </span>
                </p>
                <p className="text-slate-300 text-[11px] mt-0.5">
                  ये समाचार जनता के लिए तब तक अप्रकाशित रहेंगे जब तक आप इन्हें अनुमोदित (Approve) नहीं कर देते।
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('reporters')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition shrink-0 cursor-pointer shadow flex items-center space-x-1.5"
            >
              <span>रिपोर्ट्स देखें व स्वीकृत करें ({pendingReporterDispatches.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 4. MAIN ADMIN SECTION TABS */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-md">
          {/* Main Navigation Tabs */}
          <div className="border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${activeTab === 'pending' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                <Clock className="w-4 h-4" />
                <span>Pending Approval Queue ({pendingArticles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('published')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${activeTab === 'published' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Published Stories ({publishedArticles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('top-stories')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${activeTab === 'top-stories' ? 'bg-amber-600 text-white shadow-lg shadow-amber-900/40' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                <Star className={`w-4 h-4 ${activeTab === 'top-stories' ? 'fill-white text-white' : 'text-amber-400'}`} />
                <span>Top Stories ({featuredArticles.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('breaking')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${activeTab === 'breaking' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                <Flame className="w-4 h-4" />
                <span>Breaking News Manager ({breakingNews.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('audit')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${activeTab === 'audit' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                <History className="w-4 h-4" />
                <span>Audit Logs ({auditLogs.length})</span>
              </button>

              {/* Reporter Reports / ग्राउंड रिपोर्ट्स Tab (Audit Logs ke bagal me) */}
              <button
                onClick={() => setActiveTab('reporters')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${activeTab === 'reporters' ? 'bg-red-600 text-white shadow-lg shadow-red-900/40' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
              >
                <FileText className="w-4 h-4" />
                <span>Reporter Reports ({reporterDispatches.length})</span>
                {pendingReporterDispatches.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-amber-400 text-slate-950 rounded-full font-extrabold animate-pulse">
                    {pendingReporterDispatches.length} New
                  </span>
                )}
              </button>
            </div>

            <button
              onClick={fetchAdminData}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* TAB 1: PENDING APPROVAL QUEUE */}
          {activeTab === 'pending' && (
            <div className="p-4 sm:p-6 space-y-4">
              {/* Sub-Tabs: AI Drafts vs Human Reporter Submissions */}
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setPendingSubTab('ai')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${pendingSubTab === 'ai'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Ingested Drafts ({aiPendingArticles.length})</span>
                </button>

                <button
                  onClick={() => setPendingSubTab('human')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${pendingSubTab === 'human'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Human Reporter Submissions ({humanPendingArticles.length})</span>
                </button>
              </div>

              {/* Stories List for Pending Tab */}
              <div className="space-y-3">
                {(pendingSubTab === 'ai' ? aiPendingArticles : humanPendingArticles).map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded border border-amber-500/30">
                          {item.categoryName}
                        </span>

                        {item.isAiGenerated ? (
                          <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30 flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI Draft (Confidence: {item.aiConfidenceScore}%)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                            Reporter: {item.authorName}
                          </span>
                        )}

                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-slate-500">
                          {new Date(item.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      {/* Primary Action Button: Open Editorial Review Interface */}
                      <button
                        onClick={() => openReviewModal(item)}
                        className="flex items-center space-x-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Open Decision Desk</span>
                      </button>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {item.summary}
                      </p>
                    </div>

                    {/* Fact Check Flag or Reporter Notes */}
                    {item.factCheckNotes && (
                      <div className="bg-indigo-950/40 border border-indigo-900 text-indigo-300 text-[11px] p-2.5 rounded-lg flex items-center space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span><strong>Verification Fact-Check:</strong> {item.factCheckNotes}</span>
                      </div>
                    )}

                    {item.conflictingFlags && item.conflictingFlags.length > 0 && (
                      <div className="bg-amber-950/40 border border-amber-900 text-amber-300 text-[11px] p-2 rounded-lg flex items-center space-x-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span><strong>Conflicting claims flagged:</strong> {item.conflictingFlags.join(', ')}</span>
                      </div>
                    )}

                    {item.editorialNotes && (
                      <div className="bg-slate-900 border border-slate-800 text-slate-300 text-[11px] p-2 rounded-lg">
                        <strong>Reporter Note:</strong> {item.editorialNotes}
                      </div>
                    )}

                    {/* Source Attribution */}
                    {item.sourceUrl && (
                      <div className="flex items-center space-x-1 text-[11px] text-slate-400">
                        <span>Source:</span>
                        <a
                          href={item.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-red-400 hover:underline flex items-center"
                        >
                          {item.sourceName || item.sourceUrl}
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                ))}

                {(pendingSubTab === 'ai' ? aiPendingArticles : humanPendingArticles).length === 0 && (
                  <div className="p-12 text-center text-slate-500">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                    <p className="text-sm font-semibold">Queue is clear! No pending stories in this category.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: PUBLISHED STORIES MANAGEMENT */}
          {activeTab === 'published' && (
            <div className="p-4 sm:p-6 space-y-3">
              {publishedArticles.map((art) => (
                <div
                  key={art.id}
                  className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center space-x-2 text-[10px] font-bold">
                      <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        LIVE
                      </span>
                      <span className="text-slate-400 uppercase">{art.categoryName}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500">By {art.authorName}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-500">{art.viewsCount.toLocaleString()} views</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-bold text-white truncate">
                      {art.title}
                    </h4>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleFeatured(art.id, art.isFeatured)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 border transition ${art.isFeatured
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                          : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                        }`}
                      title={art.isFeatured ? 'Remove from Top Stories' : 'Make Top Story'}
                    >
                      <Star className={`w-3.5 h-3.5 ${art.isFeatured ? 'fill-amber-400 text-amber-400' : ''}`} />
                      <span>{art.isFeatured ? 'Top Story' : 'Set as Top'}</span>
                    </button>

                    <Link
                      href={`/article/${art.slug}`}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <button
                      onClick={() => handleUnpublishArticle(art.id)}
                      className="px-3 py-1.5 bg-amber-900/40 hover:bg-amber-900/60 text-amber-300 rounded-lg text-xs font-semibold border border-amber-800"
                    >
                      Unpublish
                    </button>

                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded-lg text-xs"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: TOP STORIES / FEATURED HEADLINES MANAGER */}
          {activeTab === 'top-stories' && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header with Add Button */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Star className="w-4 h-4 fill-amber-400" />
                    </div>
                    <h3 className="text-base font-bold text-white">Top Stories &amp; Lead Headline Manager</h3>
                  </div>
                  <p className="text-xs text-slate-400">
                    यहाँ से आप नई टॉप स्टोरी बना सकते हैं या किसी भी प्रकाशित खबर को होमपेज की मुख्य लीड स्टोरी (Top Story) बना सकते हैं।
                  </p>
                </div>

                <button
                  onClick={() => setIsTopStoryFormOpen(!isTopStoryFormOpen)}
                  className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-2 shrink-0 shadow-lg shadow-amber-900/40"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isTopStoryFormOpen ? 'फॉर्म बंद करें' : '+ नया Top Story जोड़ें'}</span>
                </button>
              </div>

              {/* Form: Create New Top Story */}
              {isTopStoryFormOpen && (
                <form
                  onSubmit={handleCreateTopStory}
                  className="bg-slate-950 p-5 sm:p-6 rounded-2xl border-2 border-amber-500/40 space-y-4 shadow-xl"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h4 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>नया शीर्ष समाचार (Top Story) बनाएं व प्रकाशित करें</span>
                    </h4>
                    <span className="text-[11px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      सीधे होमपेज लीड पर लाइव होगा
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        शीर्षक / Headline <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={topStoryTitle}
                        onChange={(e) => setTopStoryTitle(e.target.value)}
                        placeholder="उदा. मध्य प्रदेश में 50,000 नई सरकारी भर्तियों को कैबिनेट की हरी झंडी..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Category / श्रेणी</label>
                      <select
                        value={topStoryCategory}
                        onChange={(e) => setTopStoryCategory(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                      >
                        <option value="Bhopal">Bhopal (भोपाल)</option>
                        <option value="Madhya Pradesh">Madhya Pradesh (मध्य प्रदेश)</option>
                        <option value="National">National (देश)</option>
                        <option value="Politics">Politics (राजनीति)</option>
                        <option value="Business">Business (व्यापार)</option>
                        <option value="Sports">Sports (खेल)</option>
                        <option value="Education">Education (शिक्षा)</option>
                        <option value="Entertainment">Entertainment (मनोरंजन)</option>
                        <option value="World">World (विदेश)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-300">Reporter / Bureau Byline</label>
                      <input
                        type="text"
                        value={topStoryAuthor}
                        onChange={(e) => setTopStoryAuthor(e.target.value)}
                        placeholder="News Target Special Bureau"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    {/* MEDIA MANAGER: Upload Photo, Upload Video, or AI Auto-Suggest with Live Preview */}
                    <div className="md:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div>
                          <h5 className="text-xs font-bold text-white flex items-center space-x-2">
                            <Camera className="w-4 h-4 text-amber-400" />
                            <span>न्यूज़ फोटो और वीडियो (Media Upload &amp; AI Generator)</span>
                          </h5>
                          <p className="text-[11px] text-slate-400">
                            अपनी फोटो/वीडियो अपलोड करें, या सीधे AI से फोटो ऑटो-सजेस्ट करवाएं।
                          </p>
                        </div>

                        {/* AI Auto-Suggest Button */}
                        <button
                          type="button"
                          onClick={handleAiSuggestPhoto}
                          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-indigo-900/40 shrink-0"
                          title="AI शीर्षक और श्रेणी के आधार पर सर्वश्रेष्ठ फोटो चुनता है"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>{mediaSourceType === 'AI' ? '🔄 दूसरा AI फोटो बदलें' : '✨ AI से फोटो चुनें'}</span>
                        </button>
                      </div>

                      {/* Upload Controls */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* 1. Photo Upload */}
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                              <Upload className="w-3.5 h-3.5 text-amber-400" />
                              <span>कंप्यूटर से अपनी फोटो अपलोड करें</span>
                            </span>
                            <span className="text-[10px] text-slate-500">JPG, PNG, WebP</span>
                          </div>
                          <label className="flex items-center justify-center w-full px-4 py-2.5 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl cursor-pointer text-xs font-medium text-slate-300 transition">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                            <ImageIcon className="w-4 h-4 mr-2 text-amber-400" />
                            <span>📁 फोटो फाइल चुनें (Upload)</span>
                          </label>
                        </div>

                        {/* 2. Video Upload / URL */}
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                              <Video className="w-3.5 h-3.5 text-cyan-400" />
                              <span>वीडियो अपलोड करें या लिंक दें</span>
                            </span>
                            <span className="text-[10px] text-slate-500">MP4, WebM, URL</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="flex items-center justify-center px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl cursor-pointer text-xs font-medium text-slate-300 transition shrink-0">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoUpload}
                                className="hidden"
                              />
                              <Upload className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                              <span>वीडियो फाइल</span>
                            </label>
                            <input
                              type="url"
                              value={newTopStoryVideoInput}
                              onChange={(e) => setNewTopStoryVideoInput(e.target.value)}
                              placeholder="या वीडियो लिंक (MP4/YouTube)..."
                              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 3. Live Media Preview: Admin sees the exact photo and video before uploading/publishing */}
                      <div className="bg-slate-950 border-2 border-slate-800 rounded-xl p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-850 pb-2.5">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-white">
                              📸 लाइव मीडिया प्रीव्यू (Upload से पहले यहाँ देखें)
                            </span>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${mediaSourceType === 'AI'
                              ? 'bg-indigo-950 text-indigo-300 border-indigo-700'
                              : mediaSourceType === 'UPLOADED'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                                : 'bg-slate-850 text-slate-400 border-slate-700'
                            }`}>
                            {mediaSourceType === 'AI' ? '✨ AI द्वारा चुनी गई फोटो' : mediaSourceType === 'UPLOADED' ? '📁 आपकी अपलोड की हुई फोटो' : '📌 एडिटोरियल इमेज'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                          {/* Photo Preview */}
                          <div className="space-y-2">
                            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                              फोटो प्रीव्यू:
                            </span>
                            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-800 aspect-video flex items-center justify-center">
                              {topStoryCoverImage ? (
                                <img
                                  src={topStoryCoverImage}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-center p-4 text-slate-500 text-xs">
                                  <ImageIcon className="w-8 h-8 mx-auto mb-1 opacity-50" />
                                  <span>कोई फोटो नहीं चुनी गई</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={handleAiSuggestPhoto}
                                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-amber-300 rounded-lg text-[11px] font-semibold flex items-center space-x-1 border border-slate-700"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>AI से अगली फोटो बदलें</span>
                              </button>
                              {topStoryCoverImage && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTopStoryCoverImage('');
                                    setMediaSourceType('PRESET');
                                  }}
                                  className="text-[11px] text-red-400 hover:text-red-300 underline"
                                >
                                  फोटो हटाएं
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Video Preview or Caption */}
                          <div className="space-y-2">
                            {newTopStoryVideoInput ? (
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                                    🎥 वीडियो प्रीव्यू:
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setNewTopStoryVideoInput('')}
                                    className="text-[11px] text-red-400 hover:text-red-300 underline"
                                  >
                                    वीडियो हटाएं
                                  </button>
                                </div>
                                <div className="rounded-xl overflow-hidden bg-black border border-slate-800 aspect-video flex items-center justify-center">
                                  <video
                                    src={newTopStoryVideoInput}
                                    controls
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2.5">
                                <label className="text-[11px] font-bold text-slate-300 block">
                                  फोटो विवरण / Photo Caption:
                                </label>
                                <input
                                  type="text"
                                  value={topStoryCaption}
                                  onChange={(e) => setTopStoryCaption(e.target.value)}
                                  placeholder="उदा. भोपाल विधानसभा में बजट सत्र के दौरान..."
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                                />
                                <p className="text-[11px] text-slate-500 leading-relaxed">
                                  💡 यह फोटो और कैप्शन खबर के मुख्य बैनर पर दिखेगा। आप सीधे अपनी गैलरी से फोटो चुन सकते हैं या AI बटन दबाकर संबंधित फोटो ऑटो-ऐड कर सकते हैं।
                                </p>
                              </div>
                            )}

                            {/* Preset shortcuts */}
                            <div className="pt-1">
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                                या पसंदीदा फोटो प्रीसेट चुनें:
                              </span>
                              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-400">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTopStoryCoverImage('https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80');
                                    setTopStoryCaption('Bhopal Metro Rail testing');
                                    setMediaSourceType('PRESET');
                                  }}
                                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 hover:text-amber-300"
                                >
                                  Metro
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTopStoryCoverImage('https://images.unsplash.com/photo-1596701062351-8c2c14d1fdd0?auto=format&fit=crop&w=1200&q=80');
                                    setTopStoryCaption('Vidhan Sabha Assembly Session');
                                    setMediaSourceType('PRESET');
                                  }}
                                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 hover:text-amber-300"
                                >
                                  Vidhan Sabha
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTopStoryCoverImage('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80');
                                    setTopStoryCaption('High Court Verdict');
                                    setMediaSourceType('PRESET');
                                  }}
                                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 hover:text-amber-300"
                                >
                                  Court / Legal
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setTopStoryCoverImage('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80');
                                    setTopStoryCaption('Breaking News Bureau');
                                    setMediaSourceType('PRESET');
                                  }}
                                  className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 hover:text-amber-300"
                                >
                                  Breaking News
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        मुख्य झलक / Highlights Summary (2-3 पंक्तियाँ)
                      </label>
                      <textarea
                        value={topStorySummary}
                        onChange={(e) => setTopStorySummary(e.target.value)}
                        rows={2}
                        placeholder="खबर के प्रमुख बिंदु जो होमपेज के लीड कार्ड पर दिखेंगे..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-300">
                        विस्तृत समाचार / Story Content <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={topStoryContent}
                        onChange={(e) => setTopStoryContent(e.target.value)}
                        rows={5}
                        placeholder="विस्तार से पूरी खबर लिखें (पैराग्राफ के बीच खाली लाइन छोड़ें)..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-serif leading-relaxed"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsTopStoryFormOpen(false)}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
                    >
                      रद्द करें
                    </button>
                    <button
                      type="submit"
                      disabled={topStorySubmitting}
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-lg shadow-amber-900/40"
                    >
                      <Star className="w-4 h-4 fill-white" />
                      <span>{topStorySubmitting ? 'प्रकाशित हो रहा है...' : '⭐ Top Story के रूप में प्रकाशित करें'}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Quick Promote Bar: Promote an already published story to Top Story */}
              {nonFeaturedPublished.length > 0 && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200">
                      मौजूदा खबर को Top Story बनाएं:
                    </span>
                  </div>
                  <div className="flex flex-1 sm:max-w-md items-center space-x-2">
                    <select
                      value={selectedPromoteId}
                      onChange={(e) => setSelectedPromoteId(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 truncate"
                    >
                      <option value="">-- किसी प्रकाशित खबर को चुनें --</option>
                      {nonFeaturedPublished.map(a => (
                        <option key={a.id} value={a.id}>
                          [{a.categoryName}] {a.title}
                        </option>
                      ))}
                    </select>
                    <button
                      disabled={!selectedPromoteId}
                      onClick={() => {
                        if (selectedPromoteId) {
                          handleToggleFeatured(selectedPromoteId, false);
                          setSelectedPromoteId('');
                        }
                      }}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold shrink-0 transition"
                    >
                      Make Top Story
                    </button>
                  </div>
                </div>
              )}

              {/* Current Active Top Stories List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>वर्तमान में एक्टिव Top Stories ({featuredArticles.length})</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">
                    होमपेज पर सबसे ऊपर दिखाई दे रही हैं
                  </span>
                </div>

                {featuredArticles.length === 0 ? (
                  <div className="bg-slate-950 p-8 rounded-2xl border border-dashed border-slate-800 text-center space-y-2">
                    <Star className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-sm font-semibold text-slate-400">
                      वर्तमान में कोई खबर Top Story के रूप में चिह्नित नहीं है।
                    </p>
                    <p className="text-xs text-slate-500">
                      ऊपर दिए गए फॉर्म से नई खबर जोड़ें या प्रकाशित खबरों में से किसी को Top Story बनाएं।
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {featuredArticles.map((art, idx) => (
                      <div
                        key={art.id}
                        className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          {art.coverImage && (
                            <img
                              src={art.coverImage}
                              alt={art.title}
                              className="w-16 h-14 sm:w-20 sm:h-16 rounded-lg object-cover shrink-0 bg-slate-900 border border-slate-800"
                            />
                          )}
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold">
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-300" />
                                {idx === 0 ? 'MAIN HERO LEAD' : 'SPOTLIGHT'}
                              </span>
                              <span className="text-slate-400 uppercase">{art.categoryName}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-500">By {art.authorName}</span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-500">{art.viewsCount.toLocaleString()} views</span>
                            </div>
                            <h4 className="text-sm font-bold text-white line-clamp-2">
                              {art.title}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {art.summary}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                          <Link
                            href={`/article/${art.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center space-x-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </Link>

                          <button
                            onClick={() => handleToggleFeatured(art.id, true)}
                            className="px-3 py-1.5 bg-amber-900/30 hover:bg-amber-900/60 text-amber-300 border border-amber-700/50 rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
                            title="Remove from Top Stories"
                          >
                            <Star className="w-3.5 h-3.5 text-amber-400" />
                            <span>Remove Top</span>
                          </button>

                          <button
                            onClick={() => handleDeleteArticle(art.id)}
                            className="p-1.5 bg-red-950/40 hover:bg-red-900 text-red-400 rounded-lg text-xs"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: BREAKING NEWS MANAGER */}
          {activeTab === 'breaking' && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Form to Add New Breaking Alert */}
              <form onSubmit={handleAddBreakingNews} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center">
                  <Flame className="w-4 h-4 text-red-500 mr-1.5" />
                  Broadcast New Breaking Flash Bulletin
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                  <input
                    type="text"
                    value={newBreakingTitle}
                    onChange={(e) => setNewBreakingTitle(e.target.value)}
                    placeholder="Enter urgent breaking headline to flash across ticker..."
                    className="sm:col-span-7 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-red-500 outline-none"
                  />

                  <select
                    value={newBreakingCategory}
                    onChange={(e) => setNewBreakingCategory(e.target.value)}
                    className="sm:col-span-3 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  >
                    <option value="National">National</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Bhopal">Bhopal</option>
                    <option value="Technology">Technology</option>
                    <option value="AI">AI</option>
                    <option value="Business">Business</option>
                  </select>

                  <button
                    type="submit"
                    className="sm:col-span-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Broadcast</span>
                  </button>
                </div>
              </form>

              {/* Active Breaking Bulletins */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Currently Active Ticker Bulletins
                </h5>

                {breakingNews.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate pr-4">
                      <span className="w-2 h-2 rounded-full bg-red-500 live-beacon shrink-0" />
                      <span className="text-[10px] font-bold uppercase bg-red-950 text-red-300 px-2 py-0.5 rounded shrink-0">
                        {item.category}
                      </span>
                      <span className="font-semibold text-white truncate">
                        {item.title}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDeleteBreaking(item.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                      title="Remove bulletin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="p-4 sm:p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Editorial &amp; AI Action Traceability Logs
              </h4>

              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-slate-500 text-[10px]">
                          {new Date(log.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                        <span className="font-bold text-white">{log.actorName}</span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded">
                          {log.actorRole}
                        </span>
                        <span className="text-red-400 font-mono font-bold">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs">
                        <strong>Target:</strong> {log.targetTitle}
                      </p>
                      <p className="text-slate-500 text-[11px]">{log.details}</p>
                    </div>

                    <span className="text-[10px] text-slate-500">
                      {new Date(log.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: REPORTER DISPATCHES / GROUND REPORTS (Audit Logs ke bagal me) */}
          {activeTab === 'reporters' && (
            <div className="p-4 sm:p-6 space-y-4">
              {/* Header & Sub-filter bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                    <span className="p-1.5 bg-red-600/20 text-red-400 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </span>
                    <span>ग्राउंड रिपोर्टर डिस्पैच (Reporter Field Dispatches)</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    रिपोर्टर पोर्टल (/reporter) से सबमिट किए गए सभी समाचार, तस्वीरें, वीडियो और ग्राउंड रिपोर्ट्स
                  </p>
                </div>

                <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setReporterSubFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      reporterSubFilter === 'all'
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    सभी ({reporterDispatches.length})
                  </button>
                  <button
                    onClick={() => setReporterSubFilter('pending')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer flex items-center space-x-1 ${
                      reporterSubFilter === 'pending'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>समीक्षा हेतु (Pending)</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/30 rounded-full font-bold">
                      {pendingReporterDispatches.length}
                    </span>
                  </button>
                  <button
                    onClick={() => setReporterSubFilter('published')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      reporterSubFilter === 'published'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    प्रकाशित ({publishedReporterDispatches.length})
                  </button>
                  <button
                    onClick={() => setReporterSubFilter('rejected')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                      reporterSubFilter === 'rejected'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    अस्वीकृत ({rejectedReporterDispatches.length})
                  </button>
                </div>
              </div>

              {/* Reports Grid / List */}
              {filteredReporterList.length === 0 ? (
                <div className="text-center py-12 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-3">
                  <div className="w-12 h-12 bg-slate-800/60 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h5 className="font-bold text-sm text-slate-300">
                    इस फ़िल्टर में कोई रिपोर्टर डिस्पैच नहीं है
                  </h5>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    रिपोर्टर डेस्क (/reporter) से सबमिट किए जाने वाले समाचार यहां सीधे दिखाई देंगे।
                  </p>
                  <Link
                    href="/reporter"
                    target="_blank"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    <span>नया ग्राउंड समाचार दर्ज करें (/reporter)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredReporterList.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition space-y-3"
                    >
                      {/* Top Meta Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                            {item.categoryName}
                          </span>
                          <span className="flex items-center space-x-1 text-slate-400 text-[11px]">
                            <Users className="w-3.5 h-3.5 text-indigo-400" />
                            <strong className="text-slate-200 font-semibold">{item.authorName || 'News Target Reporter'}</strong>
                            <span className="text-slate-500 text-[10px]">({item.authorRole || 'ग्राउंड रिपोर्टर'})</span>
                          </span>
                          <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(item.createdAt).toLocaleDateString('hi-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })} • {new Date(item.createdAt).toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {item.status === 'PENDING_REVIEW' && (
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center space-x-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>समीक्षा हेतु प्रतीक्षारत (Pending Review)</span>
                            </span>
                          )}
                          {item.status === 'PUBLISHED' && (
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>प्रकाशित (Live on Portal)</span>
                            </span>
                          )}
                          {item.status === 'REJECTED' && (
                            <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center space-x-1">
                              <XCircle className="w-3.5 h-3.5" />
                              <span>अस्वीकृत (Rejected)</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main Title & Media Preview */}
                      <div className="flex flex-col md:flex-row gap-4">
                        {(item.coverImage || (item.gallery && item.gallery.length > 0)) && (
                          <div className="w-full md:w-44 h-28 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-800 relative">
                            <img
                              src={item.coverImage || (item.gallery && item.gallery[0])}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                            {item.gallery && item.gallery.length > 1 && (
                              <span className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 bg-black/80 text-white rounded text-[10px] font-semibold flex items-center space-x-1">
                                <ImageIcon className="w-3 h-3" />
                                <span>+{item.gallery.length}</span>
                              </span>
                            )}
                            {((item.videos && item.videos.length > 0) || item.videoUrl) && (
                              <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-red-600/90 text-white rounded text-[10px] font-bold flex items-center space-x-1">
                                <Video className="w-3 h-3" />
                                <span>Video</span>
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex-1 space-y-1.5">
                          <h4 className="font-bold text-white text-sm sm:text-base leading-snug hover:text-red-400 transition">
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                            {item.summary}
                          </p>
                          {item.caption && (
                            <p className="text-[11px] text-slate-400 italic">
                              फ़ोटो विवरण: {item.caption}
                            </p>
                          )}
                          {item.rejectionReason && item.status === 'REJECTED' && (
                            <div className="p-2 bg-rose-950/40 border border-rose-800/60 rounded-lg text-[11px] text-rose-300">
                              <strong>अस्वीकृति कारण:</strong> {item.rejectionReason}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="pt-3 border-t border-slate-850 flex flex-wrap items-center justify-between gap-2">
                        <div className="text-[11px] text-slate-500 font-mono">
                          ID: <span className="text-slate-400">{item.id}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() => openReviewModal(item)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 cursor-pointer border border-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                            <span>समीक्षा व संपादन (Review &amp; Edit)</span>
                          </button>

                          {item.status === 'PENDING_REVIEW' && (
                            <button
                              onClick={() => handleQuickApprove(item.id)}
                              disabled={actionLoading}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition flex items-center space-x-1.5 disabled:opacity-50 cursor-pointer shadow-xs"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>त्वरित अनुमोदन (Quick Approve)</span>
                            </button>
                          )}

                          {item.status === 'PUBLISHED' && (
                            <Link
                              href={`/article/${item.slug}`}
                              target="_blank"
                              className="px-3 py-1.5 bg-blue-600/20 text-blue-300 hover:bg-blue-600 hover:text-white border border-blue-500/30 text-xs font-semibold rounded-lg transition flex items-center space-x-1.5 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>वेबसाइट पर देखें</span>
                              <ExternalLink className="w-3 h-3" />
                            </Link>
                          )}

                          <button
                            onClick={() => handleDeleteArticle(item.id)}
                            className="px-2.5 py-1.5 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-600/30 text-xs rounded-lg transition cursor-pointer"
                            title="डिलीट करें"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* 5. ARTICLE REVIEW & DECISION DESK MODAL */}
      {selectedReviewArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-xs flex justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div
            className="bg-slate-900 text-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col my-auto max-h-[92vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-5 h-5 text-red-500" />
                <h3 className="font-bold text-base">
                  Editorial Review &amp; Decision Desk
                </h3>
                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono">
                  {selectedReviewArticle.isAiGenerated ? 'AI DRAFT' : 'REPORTER SUBMISSION'}
                </span>
              </div>
              <button
                onClick={() => setSelectedReviewArticle(null)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1 bg-slate-800 rounded-lg"
              >
                Close
              </button>
            </div>

            {/* Modal Content / Editable Fields */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Filed By Editable Input (Source Link hidden) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <label className="text-slate-300 font-bold flex items-center space-x-1.5 shrink-0">
                    <span>Filed By / रिपोर्टर या ब्यूरो का नाम:</span>
                  </label>
                  <input
                    type="text"
                    value={reviewAuthorName}
                    onChange={(e) => setReviewAuthorName(e.target.value)}
                    placeholder="उदा. Priya Nair (Bhopal Bureau) या News Target Special Desk"
                    className="w-full sm:max-w-md bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500 font-semibold"
                  />
                </div>

                {selectedReviewArticle.factCheckNotes && (
                  <div className="pt-2 border-t border-slate-900 text-indigo-300">
                    <strong>AI Fact-Check Record:</strong> {selectedReviewArticle.factCheckNotes}
                  </div>
                )}

                {selectedReviewArticle.conflictingFlags && selectedReviewArticle.conflictingFlags.length > 0 && (
                  <div className="bg-red-950/60 border border-red-800 text-red-200 p-2 rounded-lg">
                    <strong>Editorial Warning:</strong> {selectedReviewArticle.conflictingFlags.join(', ')}
                  </div>
                )}
              </div>

              {/* Editable Headline */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Headline (Editor can revise directly before publishing)
                </label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:border-red-500 outline-none"
                />
              </div>

              {/* Editable Summary */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Summary Excerpt
                </label>
                <textarea
                  value={reviewSummary}
                  onChange={(e) => setReviewSummary(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:border-red-500 outline-none"
                />
              </div>

              {/* Media Studio: Upload Multiple Photos, Multiple Videos, or AI Auto-Suggest with Live Gallery */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <h5 className="text-xs font-bold text-white flex items-center space-x-1.5">
                      <Camera className="w-4 h-4 text-amber-400" />
                      <span>मल्टी-फोटो और मल्टी-वीडियो मैनेजर (Multiple Media Upload &amp; Gallery)</span>
                    </h5>
                    <p className="text-[11px] text-slate-400">
                      आप 1 से ज्यादा फोटो और 1 से ज्यादा वीडियो अपलोड कर सकते हैं, या AI से फोटो लगवा सकते हैं।
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleReviewAiSuggestPhoto}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-sm shadow-indigo-900/40 shrink-0"
                    title="AI से और संबंधित फोटो जोड़ें"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>+ AI से फोटो जोड़ें</span>
                  </button>
                </div>

                {/* Upload Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Multi-Photo Upload */}
                  <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>कंप्यूटर से फोटो चुनें (Multiple Photos)</span>
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                        {reviewGallery.length} फोटो जुड़ी हैं
                      </span>
                    </div>
                    <label className="flex items-center justify-center w-full px-3 py-2.5 bg-slate-950 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-amber-500/60 rounded-xl cursor-pointer text-xs font-medium text-slate-300 transition">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleReviewPhotoUpload}
                        className="hidden"
                      />
                      <ImageIcon className="w-4 h-4 mr-2 text-amber-400" />
                      <span>📁 1 या अधिक फोटो अपलोड करें</span>
                    </label>
                  </div>

                  {/* Multi-Video Upload & Link */}
                  <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200 flex items-center space-x-1.5">
                        <Video className="w-3.5 h-3.5 text-cyan-400" />
                        <span>वीडियो जोड़ें (Multiple Videos)</span>
                      </span>
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">
                        {reviewVideos.length} वीडियो जुड़े हैं
                      </span>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center justify-center w-full px-3 py-1.5 bg-slate-950 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-cyan-500/60 rounded-lg cursor-pointer text-xs font-medium text-slate-300 transition">
                        <input
                          type="file"
                          multiple
                          accept="video/*"
                          onChange={handleReviewVideoUpload}
                          className="hidden"
                        />
                        <Upload className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                        <span>कंप्यूटर से वीडियो फाइल चुनें</span>
                      </label>
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="url"
                          value={newReviewVideoInput}
                          onChange={(e) => setNewReviewVideoInput(e.target.value)}
                          placeholder="या वीडियो लिंक (MP4 / YouTube)..."
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                          type="button"
                          onClick={handleAddReviewVideoUrl}
                          className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded-lg text-xs font-bold shrink-0"
                        >
                          + लिंक जोड़ें
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 1. Multi-Photo Gallery Preview */}
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold text-white">
                        📸 जुड़ी हुई फोटो गैलरी ({reviewGallery.length})
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      क्लिक करके कवर फोटो (Main Photo) बदल सकते हैं
                    </span>
                  </div>

                  {reviewGallery.length === 0 ? (
                    <div className="text-center p-6 text-slate-500 text-xs">
                      कोई फोटो नहीं चुनी गई है। ऊपर से फोटो अपलोड करें या AI बटन दबाएं।
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {reviewGallery.map((photo, pIdx) => {
                        const isCover = photo === reviewCoverImage || (!reviewCoverImage && pIdx === 0);
                        return (
                          <div
                            key={pIdx}
                            className={`relative rounded-xl overflow-hidden bg-black border-2 transition group aspect-video ${isCover ? 'border-amber-500 shadow-md shadow-amber-900/30 ring-2 ring-amber-500/40' : 'border-slate-800 hover:border-slate-700'
                              }`}
                          >
                            <img
                              src={photo}
                              alt={`Photo ${pIdx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {/* Badges and actions */}
                            <div className="absolute top-1 left-1">
                              {isCover ? (
                                <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded shadow">
                                  ⭐ COVER
                                </span>
                              ) : (
                                <span className="bg-black/70 text-slate-300 text-[9px] px-1.5 py-0.5 rounded">
                                  #{pIdx + 1}
                                </span>
                              )}
                            </div>
                            <div className="absolute top-1 right-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = reviewGallery.filter((_, idx) => idx !== pIdx);
                                  setReviewGallery(updated);
                                  if (isCover && updated.length > 0) {
                                    setReviewCoverImage(updated[0]);
                                  } else if (updated.length === 0) {
                                    setReviewCoverImage('');
                                  }
                                }}
                                className="w-5 h-5 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow"
                                title="यह फोटो हटाएं"
                              >
                                ×
                              </button>
                            </div>
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => setReviewCoverImage(photo)}
                                className="absolute bottom-1 inset-x-1 bg-black/80 hover:bg-amber-600 text-white text-[10px] py-0.5 rounded font-bold transition text-center opacity-0 group-hover:opacity-100"
                              >
                                ⭐ Make Cover
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Caption input for main cover */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <label className="text-[11px] font-bold text-slate-300 block mb-1">
                      फोटो विवरण / Caption:
                    </label>
                    <input
                      type="text"
                      value={reviewCaption}
                      onChange={(e) => setReviewCaption(e.target.value)}
                      placeholder="फोटो का विवरण या क्रेडिट लिखें..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* 2. Multi-Video Gallery Preview */}
                {reviewVideos.length > 0 && (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white">
                          🎥 जुड़े हुए वीडियो ({reviewVideos.length})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {reviewVideos.map((vid, vIdx) => (
                        <div key={vIdx} className="bg-black rounded-xl overflow-hidden border border-slate-800 space-y-1">
                          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-[11px]">
                            <span className="font-bold text-cyan-400">वीडियो #{vIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => setReviewVideos(prev => prev.filter((_, idx) => idx !== vIdx))}
                              className="text-red-400 hover:text-red-300 underline text-[11px]"
                            >
                              हटाएं
                            </button>
                          </div>
                          <div className="aspect-video flex items-center justify-center">
                            <video
                              src={vid}
                              controls
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Editable Content */}
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Article Body Text
                </label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-serif leading-relaxed focus:border-red-500 outline-none"
                />
              </div>

              {/* Rejection Feedback Input Box (If Editor selects Reject) */}
              {isRejecting && (
                <div className="bg-red-950/70 border border-red-800 rounded-xl p-4 space-y-2 animate-in fade-in">
                  <label className="text-xs font-bold uppercase tracking-wider text-red-300 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1 text-red-400" />
                    Editorial Rejection Reason &amp; Improvement Feedback *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Specify why this draft is rejected (e.g. Unverified claim, conflicting dates, lack of second source quote)..."
                    rows={3}
                    className="w-full bg-slate-950 border border-red-700 rounded-lg p-2.5 text-xs text-white outline-none focus:ring-1 focus:ring-red-500"
                  />
                  <div className="flex justify-end space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsRejecting(false)}
                      className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleRejectStory}
                      className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold"
                    >
                      Confirm Rejection &amp; Notify Reporter
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedReviewArticle(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition"
              >
                Cancel
              </button>

              <div className="flex items-center space-x-3">
                {!isRejecting && (
                  <button
                    type="button"
                    onClick={() => setIsRejecting(true)}
                    className="px-4 py-2 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject with Feedback</span>
                  </button>
                )}

                <button
                  type="button"
                  disabled={actionLoading}
                  onClick={handleApproveAndPublish}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
                >
                  <Check className="w-4 h-4" />
                  <span>Approve &amp; Publish to Front Page</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
