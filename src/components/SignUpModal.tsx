'use client';

import React, { useState } from 'react';
import { X, UserPlus, LogIn, CheckCircle, User, Lock, Mail, Phone, ArrowRight } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [userRole, setUserRole] = useState<'reader' | 'citizen_reporter'>('reader');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent browser autofill when modal opens or mode changes
  React.useEffect(() => {
    if (isOpen) {
      setFullName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setErrorMsg('');
      setIsSuccess(false);
    }
  }, [isOpen, mode]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password || (mode === 'signup' && !fullName)) {
      setErrorMsg('कृपया सभी ज़रूरी फ़ील्ड भरें (Please fill all required fields).');
      return;
    }

    // Secret Admin Bypass for Avinash@123
    const isAvinashAdmin = 
      (email.trim().toLowerCase() === 'avinash@123' || email.trim().toLowerCase() === 'avinash') &&
      (password.trim() === 'Avinash@123' || password.trim().toLowerCase() === 'avinash@123');

    if (isAvinashAdmin) {
      setIsSubmitting(true);
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'Avinash@123', password: 'Avinash@123' })
        });
        const data = await res.json();
        if (data.success && data.user) {
          localStorage.setItem('nt_user', JSON.stringify(data.user));
          if (data.token) localStorage.setItem('nt_session_token', data.token);
        }
      } catch (err) {
        // ignore
      }
      window.location.href = '/admin';
      return;
    }

    // Both Sign Up and Sign In directly open the Reporter Dashboard!
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          name: fullName.trim() || email.split('@')[0],
          phone: phone.trim()
        })
      });
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('nt_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('nt_session_token', data.token);
        // Direct redirect to Reporter Dashboard!
        window.location.href = data.redirectUrl || '/reporter';
        return;
      } else {
        setIsSubmitting(false);
        setErrorMsg(data.error || 'लॉगिन / साइन-अप विफल। कृपया विवरण जांचें।');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'सेवा अनुपलब्ध है। कृपया पुनः प्रयास करें।');
    }
  };

  const resetModal = () => {
    setIsSuccess(false);
    setErrorMsg('');
    setFullName('');
    setEmail('');
    setPhone('');
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex justify-center items-center p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-white/10 rounded-lg">
              {mode === 'signup' ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">
                {mode === 'signup' ? 'नया खाता बनाएं (Sign Up)' : 'लॉगिन करें (Sign In)'}
              </h3>
              <p className="text-[11px] text-red-100">न्यूज़ टारगेट डिजिटल न्यूज़ नेटवर्क</p>
            </div>
          </div>
          <button 
            onClick={resetModal}
            className="p-1.5 rounded-lg hover:bg-white/20 text-white/90 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            onClick={() => { setMode('signup'); setIsSuccess(false); setErrorMsg(''); setFullName(''); setEmail(''); setPhone(''); setPassword(''); }}
            className={`flex-1 py-2.5 text-center transition cursor-pointer ${
              mode === 'signup'
                ? 'bg-white text-red-600 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign Up (रजिस्ट्रेशन)
          </button>
          <button
            onClick={() => { setMode('login'); setIsSuccess(false); setErrorMsg(''); setFullName(''); setEmail(''); setPhone(''); setPassword(''); }}
            className={`flex-1 py-2.5 text-center transition cursor-pointer ${
              mode === 'login'
                ? 'bg-white text-red-600 border-b-2 border-red-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In (लॉगिन)
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-slate-800 text-lg">
                {mode === 'signup' ? 'सफलतापूर्वक खाता बन गया!' : 'लॉगिन सफल!'}
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                स्वागत है! आपका खाता सक्रिय हो चुका है। आप ताज़ा ख़बरें और विशेष बुलेटिन प्राप्त कर सकते हैं।
              </p>
              <button
                onClick={resetModal}
                className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-lg transition"
              >
                पोर्टल पर जारी रखें
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5 text-xs">
              {/* Chrome/Edge autofill prevention traps */}
              <input type="text" name="prevent_autofill_user" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} />
              <input type="password" name="prevent_autofill_pwd" tabIndex={-1} autoComplete="new-password" style={{ display: 'none' }} />

              {errorMsg && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs">
                  {errorMsg}
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">पूरा नाम (Full Name) *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ईमेल पता या यूज़रनेम (Email / Username) *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    autoComplete="off"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com या Avinash@123"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">मोबाइल नंबर / शहर (Optional)</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      autoComplete="off"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210 / Bhopal"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden text-xs"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">पासवर्ड (Password) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition shadow-xs flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                <span>{isSubmitting ? 'प्रक्रिया जारी है...' : mode === 'signup' ? 'नया खाता बनाएं (Create Account)' : 'लॉगिन करें (Sign In)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
