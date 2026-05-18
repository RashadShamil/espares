'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ParallaxBackground from '@/components/ParallaxBackground';

export default function LoginPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [tab,       setTab]       = useState<'login' | 'signup'>('login');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const reset = () => { setError(''); setEmail(''); setPassword(''); };

  // ── Email / password login ──────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/');
    } catch {
      setError('Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── Google OAuth ────────────────────────────────────────────────
  const handleGoogle = async () => {
    setError(''); setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch {
      setError('Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-transparent overflow-hidden z-0">
      
      {/* --- GLOBAL PARALLAX BACKGROUND --- */}
      <ParallaxBackground />
      
      {/* ── Soft glowing background elements ── */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-green opacity-10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-brand-gold opacity-15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-hud opacity-[0.03] pointer-events-none mix-blend-multiply" />

      {/* ── Main card container ── */}
      <div 
        className="relative z-10 w-full max-w-[440px] transition-all duration-700 ease-out"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}
      >
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block relative w-[160px] h-[45px] mb-6">
            <Image src="/logo.png" alt="eSpares.lk" fill className="object-contain" priority />
          </Link>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Welcome back
          </h1>
          <p className="text-slate-500 mt-2 text-[15px]">
            Sign in to access your dashboard and orders.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white p-8 sm:p-10">

          {/* Tab toggle */}
          <div className="flex bg-slate-100/80 rounded-xl p-1.5 mb-8">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); reset(); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  tab === t
                    ? 'bg-white text-brand-green shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <LoginForm
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              showPass={showPass} setShowPass={setShowPass}
              error={error} loading={loading}
              onSubmit={handleLogin}
              onGoogle={handleGoogle}
            />
          ) : (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 bg-brand-green-pale rounded-full flex items-center justify-center mx-auto mb-2">
                <svg className="w-8 h-8 text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                </svg>
              </div>
              <p className="text-slate-600 text-[15px] leading-relaxed">
                Join Sri Lanka's largest spare parts network.
              </p>
              <Link
                href="/signup"
                className="block w-full bg-brand-green text-white font-semibold py-3.5 rounded-xl hover:bg-brand-green-light transition-colors text-sm shadow-sm"
              >
                Continue to Sign Up →
              </Link>
            </div>
          )}

        </div>

        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-slate-600 transition-colors">Terms</Link>
          {' & '}
          <Link href="/privacy" className="underline hover:text-slate-600 transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

/* ── Extracted login sub-form ── */
function LoginForm({
  email, setEmail, password, setPassword,
  showPass, setShowPass,
  error, loading, onSubmit, onGoogle,
}: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPass: boolean; setShowPass: (v: boolean) => void;
  error: string; loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogle: () => void;
}) {
  return (
    <div className="space-y-5">

      {/* Google */}
      <button
        onClick={onGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 rounded-xl transition-all text-sm disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
        <div className="relative flex justify-center">
          <span className="px-4 bg-white/80 text-slate-400 text-xs font-medium">or sign in with email</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-semibold text-slate-700">Password</label>
            <a href="#" className="text-xs text-brand-gold hover:text-brand-gold-light transition-colors font-semibold">Forgot password?</a>
          </div>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'} required value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all pr-12"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-green transition-colors"
            >
              {showPass ? (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl animate-fade-up">
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-brand-green text-white font-semibold py-3.5 rounded-xl hover:bg-brand-green-light transition-all shadow-[0_4px_14px_rgba(45,106,79,0.25)] hover:shadow-[0_6px_20px_rgba(45,106,79,0.35)] disabled:opacity-60 text-sm mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Signing in...
            </span>
          ) : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 pt-2">
        New to eSpares?{' '}
        <Link href="/signup" className="font-semibold text-brand-green hover:underline">Create an account</Link>
      </p>
    </div>
  );
}