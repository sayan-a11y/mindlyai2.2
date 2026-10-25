'use client';

import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, X, Eye, EyeOff, Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import AppLogo from '@/components/AppLogo';
import { signInWithEmail, signUpWithEmail } from '@/lib/supabaseAuth';
import { User } from '@supabase/supabase-js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess?: (user: User) => void;
  initialMode?: 'login' | 'signup';
}

export default function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        const { user, error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMsg(error.message || 'Login failed. Please check your credentials.');
          setLoading(false);
          return;
        }

        if (user) {
          setSuccessMsg('Welcome back! Logging you in...');
          if (onAuthSuccess) onAuthSuccess(user);
          setTimeout(() => {
            onClose();
          }, 800);
        }
      } else {
        // Sign up
        const { user, session, error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMsg(error.message || 'Could not create account. Please try again.');
          setLoading(false);
          return;
        }

        if (user) {
          if (session) {
            setSuccessMsg('Account created successfully! Welcome to MINDLY.');
            if (onAuthSuccess) onAuthSuccess(user);
            setTimeout(() => {
              onClose();
            }, 900);
          } else {
            setSuccessMsg('Account created! Please check your email to verify and log in.');
            setMode('login');
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
      {/* Blurred Ambient Backdrop mimicking reference mockup */}
      <div
        className="fixed inset-0 bg-[#000000]/30 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Ambient background soft glowing orbs (like in reference image) */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] -top-20 -left-20 animate-pulse" />
        <div className="absolute w-[450px] h-[450px] bg-sky-300/20 rounded-full blur-[100px] -bottom-20 -right-20" />
      </div>

      {/* Floating Modal Card matching Image 2 */}
      <div className="relative w-full max-w-[420px] rounded-[32px] bg-white dark:bg-[#18181b] border border-neutral-100 dark:border-neutral-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X size={18} />
        </button>

        {/* Top Header with Brain Logo & Wordmark */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-3 transform transition-transform hover:scale-105 duration-200">
            <AppLogo size="xl" showWordmark={false} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#0D0D0D] dark:text-[#F5F5F5] flex items-center gap-1.5">
            <span>Mindly AI</span>
            <span className="text-[#1d68f6] font-extrabold">2.2</span>
          </h1>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            Your Smart AI Assistant
          </p>
        </div>

        {/* Notification alerts */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-500" />
            <span className="leading-snug">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
            <span className="leading-snug">{successMsg}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div className="relative flex items-center rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-900/60 px-4 py-3.5 focus-within:border-[#1d68f6] focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/40 transition-all">
              <UserIcon size={18} className="text-neutral-400 shrink-0 mr-3" />
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-hidden font-normal"
              />
            </div>
          )}

          {/* Email Input */}
          <div className="relative flex items-center rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-900/60 px-4 py-3.5 focus-within:border-[#1d68f6] focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/40 transition-all">
            <Mail size={18} className="text-neutral-400 shrink-0 mr-3" />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-hidden font-normal"
            />
          </div>

          {/* Password Input */}
          <div className="relative flex items-center rounded-2xl border border-neutral-200 dark:border-neutral-700/80 bg-white dark:bg-neutral-900/60 px-4 py-3.5 focus-within:border-[#1d68f6] focus-within:ring-2 focus-within:ring-blue-100 dark:focus-within:ring-blue-950/40 transition-all">
            <Lock size={18} className="text-neutral-400 shrink-0 mr-3" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 outline-hidden font-normal"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 ml-2"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Primary Action Button (Log In or Create Account) */}
          <div className="pt-1.5">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#1d68f6] hover:bg-[#1557d4] active:scale-[0.99] text-white font-semibold text-sm shadow-md shadow-blue-500/20 disabled:opacity-60 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Processing...</span>
                </>
              ) : mode === 'login' ? (
                'Log In'
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Divider: "or" */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
          <span className="text-xs text-neutral-400 font-medium lowercase">or</span>
          <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* Secondary Button: toggles between Log In and Create Account */}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className="w-full py-3.5 px-4 rounded-2xl border border-[#1d68f6] hover:bg-blue-50/70 dark:hover:bg-blue-950/25 active:scale-[0.99] text-[#1d68f6] font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {mode === 'login' ? 'Create Account' : 'Log In'}
        </button>

        {/* Footer info */}
        <p className="mt-5 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
          By continuing, you agree to MINDLY's Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
