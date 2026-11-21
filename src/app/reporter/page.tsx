// Protected Reporter Portal with Strict Authentication, Role Enforcement, and File Size Validation
"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Category, Article } from "@/lib/types";
import { 
  Upload, 
  Camera, 
  Send, 
  Video, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  LogOut,
  User as UserIcon,
  FileText
} from "lucide-react";

export default function ReporterPage() {
  const router = useRouter();

  // Authentication State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("reporter@bharatbulletin.in");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginSubmitting, setLoginSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<string>("");
  const [coverImage, setCoverImage] = useState<string>("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [caption, setCaption] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [myArticles, setMyArticles] = useState<Article[]>([]);

  // Check authentication session on mount
  const checkAuth = async () => {
    try {
      setAuthLoading(true);
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success && data.authenticated) {
        setCurrentUser(data.user);
        fetchReporterData(data.user.userId);
      } else {
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchReporterData = async (userId: string) => {
    try {
      const [catRes, artRes] = await Promise.all([
        fetch("/api/categories"),
        fetch(`/api/articles?authorId=${userId}&status=ALL`)
      ]);
      const catData = await catRes.json();
      const artData = await artRes.json();
      if (catData.success) setCategories(catData.categories);
      if (artData.success) setMyArticles(artData.articles);
    } catch (e) {
      console.error("Error loading reporter data:", e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleReporterLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginSubmitting(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (data.success) {
        setCurrentUser(data.user);
        fetchReporterData(data.user.id);
      } else {
        setLoginError(data.error || "Authentication failed. Please check credentials.");
      }
    } catch (err: any) {
      setLoginError(err.message || "Login service unavailable");
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleReporterLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    setCurrentUser(null);
  };

  // --- Handlers for file uploads with strict size limits ---
  const handleCoverUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security size limit check: max 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert(`कवर फ़ोटो '${file.name}' बहुत बड़ी है (अधिकतम सीमा: 5MB)। कृपया छोटी फोटो चुनें।`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => setCoverImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGalleryUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Security size limit check: max 5MB per photo
      if (file.size > 5 * 1024 * 1024) {
        alert(`गैलरी फ़ोटो '${file.name}' बहुत बड़ी है (अधिकतम सीमा: 5MB)।`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        setGallery((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Security size limit check: max 20MB per video
      if (file.size > 20 * 1024 * 1024) {
        alert(`वीडियो फ़ाइल '${file.name}' बहुत बड़ी है (अधिकतम सीमा: 20MB)।`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        setVideos((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!title.trim() || !summary.trim() || !content.trim() || !category) {
      alert("कृपया शीर्षक, सारांश, मुख्य सामग्री और श्रेणी भरें।");
      return;
    }

    setSubmitting(true);
    setSubmitSuccess(false);

    const payload = {
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      categoryName: category,
      coverImage,
      caption: caption.trim(),
      gallery,
      videos,
      authorName: currentUser?.name || "News Target Reporter",
      status: "PENDING_REVIEW",
    };

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setTitle("");
        setSummary("");
        setContent("");
        setCoverImage("");
        setGallery([]);
        setVideos([]);
        setCaption("");
        if (currentUser?.userId) {
          fetchReporterData(currentUser.userId);
        }
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        alert("त्रुटि: " + (data.error || "समाचार सबमिट नहीं हो सका।"));
      }
    } catch (e: any) {
      alert("सेवा त्रुटि: " + (e.message || "सर्वर से संपर्क नहीं हो सका।"));
    } finally {
      setSubmitting(false);
    }
  };

  // 1. Loading State
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300 font-sans space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold tracking-wider uppercase text-slate-400">
          रिपोर्टर क्रेडेंशियल जांच जारी है...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated Reporter Login Gate
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 font-sans">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-1">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              न्यूज़ टारगेट — रिपोर्टर डेस्क
            </h2>
            <p className="text-xs text-slate-400">
              समाचार सबमिट करने के लिए अपने अधिकृत रिपोर्टर खाते से लॉगिन करें।
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-300 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleReporterLogin} className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">
                रिपोर्टर ईमेल (Reporter Email)
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="reporter@bharatbulletin.in"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-300 font-bold block">
                पासवर्ड (Password)
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <span className="font-bold text-amber-400 block">🔐 रिपोर्टर डेमो क्रेडेंशियल:</span>
              <p>ईमेल: <code className="text-slate-200 font-mono">reporter@bharatbulletin.in</code></p>
              <p>पासवर्ड: <code className="text-slate-200 font-mono">Reporter@NewsTarget2026!</code></p>
            </div>

            <button
              type="submit"
              disabled={loginSubmitting}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center space-x-2 cursor-pointer text-sm"
            >
              {loginSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>प्रमाणित हो रहा है...</span>
                </>
              ) : (
                <span>रिपोर्टर डेस्क में प्रवेश करें (Sign In)</span>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-white transition font-medium inline-flex items-center space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>मुख्य वेबसाइट पर जाएं</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Reporter Workspace
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3.5 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>होमपेज</span>
            </Link>
            <span className="text-slate-800">|</span>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h1 className="text-sm sm:text-base font-black tracking-tight text-white">
                NEWS TARGET — रिपोर्टर ब्यूरो डेस्क
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white leading-none">{currentUser.name}</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-0.5">{currentUser.bureau || "Bhopal Bureau"}</p>
            </div>
            <button
              onClick={handleReporterLogout}
              className="flex items-center space-x-1 text-xs bg-slate-800 hover:bg-red-950 hover:text-red-300 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition font-semibold cursor-pointer"
              title="लॉगआउट"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">लॉगआउट</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Submit New Story (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-lg font-black text-white flex items-center space-x-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <span>नया ग्राउंड समाचार दर्ज करें (File News Dispatch)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                सबमिट किया गया समाचार सीधे एडिटोरियल डेस्क (Admin) के पास समीक्षा और फैक्ट-चेक के लिए जाएगा।
              </p>
            </div>

            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-700 text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                <span>
                  <strong>सफलतापूर्वक सबमिट हुआ!</strong> आपका समाचार एडिटोरियल टीम को भेज दिया गया है। अनुमोदन होते ही होमपेज पर प्रकाशित होगा।
                </span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                समाचार शीर्षक / हेडलाइन (Headline) *
              </label>
              <input
                type="text"
                placeholder="स्पष्ट और सटीक शीर्षक दर्ज करें..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                संक्षिप्त सारांश (Highlights / Excerpt) *
              </label>
              <textarea
                placeholder="2-3 पंक्तियों में मुख्य बिंदु..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                पूरा समाचार विवरण (Full Article Content) *
              </label>
              <textarea
                placeholder="विस्तार से पूरी ख़बर लिखें... तथ्यों और आधिकारिक बयानों के साथ..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 leading-relaxed font-serif"
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 block">
                समाचार श्रेणी (Category) *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
              >
                <option value="">-- श्रेणी चुनें --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Media Upload Box (Strict 5MB / 20MB validation) */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  <span>फोटो और वीडियो अटैच करें (Max 5MB Photo, 20MB Video)</span>
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
                  सुरक्षित अपलोड
                </span>
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  मुख्य कवर फोटो (Lead Photo):
                </label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer border border-slate-700 transition">
                    <Upload className="w-3.5 h-3.5 text-cyan-400" />
                    <span>कवर फोटो चुनें (Max 5MB)</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                  </label>
                  {coverImage && (
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-emerald-500">
                      <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* Multi-Photo Gallery Upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  अतिरिक्त फोटो गैलरी (Multiple Gallery Photos):
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer border border-slate-700 transition">
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>+ गैलरी फोटो जोड़ें</span>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryUpload} />
                  </label>
                  {gallery.map((src, i) => (
                    <div key={i} className="relative w-12 h-10 rounded overflow-hidden border border-slate-700">
                      <img src={src} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Multi-Video Upload */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  ग्राउंड वीडियो क्लिप (Video Clips - Max 20MB):
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <label className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer border border-slate-700 transition">
                    <Video className="w-3.5 h-3.5 text-red-400" />
                    <span>+ वीडियो फाइल अपलोड करें</span>
                    <input type="file" accept="video/*" multiple className="hidden" onChange={handleVideoUpload} />
                  </label>
                  {videos.map((src, i) => (
                    <div key={i} className="w-16 h-10 rounded overflow-hidden bg-black border border-slate-700 flex items-center justify-center">
                      <video src={src} className="w-full h-full object-cover" muted />
                    </div>
                  ))}
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400 block">
                  फोटो विवरण (Photo Caption / Source Attribution):
                </label>
                <input
                  type="text"
                  placeholder="उदा. AIIMS भोपाल कैंपस से विशेष ग्राउंड रिपोर्ट..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg cursor-pointer text-sm"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "एडिटोरियल डेस्क को भेजा जा रहा है..." : "समीक्षा हेतु भेजें (Submit for Editorial Review)"}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Reporter Profile & My Submissions (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Bureau Identity Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-emerald-600 text-white font-black flex items-center justify-center text-base shadow-sm">
                {currentUser.name?.charAt(0) || "R"}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{currentUser.name}</h3>
                <p className="text-xs text-emerald-400 font-medium">{currentUser.bureau || "Field Reporter"}</p>
                <p className="text-[11px] text-slate-400">{currentUser.email}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>अधिकार स्थिति:</span>
              <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                सत्यापित ग्राउंड रिपोर्टर
              </span>
            </div>
          </div>

          {/* My Submitted Dispatches List */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>मेरे द्वारा भेजी गई ख़बरें ({myArticles.length})</span>
              </h3>
              <span className="text-[10px] text-slate-500">लाइव स्थिति</span>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {myArticles.map((art) => {
                const isPublished = art.status === "PUBLISHED";
                const isRejected = art.status === "REJECTED";
                return (
                  <div
                    key={art.id}
                    className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {art.categoryName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                          isPublished
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : isRejected
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {isPublished ? "✓ प्रकाशित" : isRejected ? "✕ अस्वीकृत" : "⏳ समीक्षाधीन"}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-100 line-clamp-2">
                      {art.title}
                    </h4>

                    {isRejected && art.rejectionReason && (
                      <p className="text-[11px] text-red-300 bg-red-950/40 p-2 rounded border border-red-900/60 mt-1">
                        <strong>एडिटर नोट:</strong> {art.rejectionReason}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span>{new Date(art.createdAt).toLocaleDateString("hi-IN")}</span>
                      {isPublished && (
                        <Link
                          href={`/article/${art.slug}`}
                          className="text-emerald-400 hover:underline font-bold"
                          target="_blank"
                        >
                          वेबसाइट पर देखें ↗
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}

              {myArticles.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  आपने अभी तक कोई समाचार सबमिट नहीं किया है।
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
