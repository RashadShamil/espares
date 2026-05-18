'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ParallaxBackground from '@/components/ParallaxBackground';

type AccountType = 'customer' | 'wholesaler' | null;

export default function SignupPage() {
  const router   = useRouter();
  const supabase = createClient();

  const [step,        setStep]        = useState<1 | 2>(1);
  const [accountType, setAccountType] = useState<AccountType>(null);

  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [name,      setName]      = useState('');

  const [bizName,   setBizName]   = useState('');
  const [bizReg,    setBizReg]    = useState('');
  const [phone,     setPhone]     = useState('');
  const [bizAddress, setBizAddress] = useState('');
  const [bankStatement, setBankStatement] = useState<File | null>(null);
  const [bankRecon, setBankRecon] = useState<File | null>(null);

  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [success,   setSuccess]   = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handlePick = (type: AccountType) => {
    setAccountType(type);
    setError('');
    setStep(2);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);

    try {
      let bankStatementUrl = null;
      let bankReconUrl = null;

      if (accountType === 'wholesaler') {
        if (!bankStatement || !bankRecon || !bizAddress) {
          throw new Error('Please provide your business address and both required documents.');
        }

        // Upload Bank Statement
        const stmtPath = `bank-statements/${Date.now()}_${bankStatement.name}`;
        const { data: stmtData, error: stmtErr } = await supabase.storage
          .from('wholesaler-documents')
          .upload(stmtPath, bankStatement);
        
        if (stmtErr) throw new Error('Storage bucket "wholesaler-documents" missing or upload failed.');
        bankStatementUrl = supabase.storage.from('wholesaler-documents').getPublicUrl(stmtPath).data.publicUrl;

        // Upload Bank Reconciliation
        const reconPath = `bank-reconciliations/${Date.now()}_${bankRecon.name}`;
        const { data: reconData, error: reconErr } = await supabase.storage
          .from('wholesaler-documents')
          .upload(reconPath, bankRecon);

        if (reconErr) throw new Error('Storage bucket "wholesaler-documents" missing or upload failed.');
        bankReconUrl = supabase.storage.from('wholesaler-documents').getPublicUrl(reconPath).data.publicUrl;
      }

      const { data, error: signupErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name:        name,
            role:             accountType === 'wholesaler' ? 'WHOLESALER' : 'CUSTOMER',
            business_name:    accountType === 'wholesaler' ? bizName  : null,
            business_reg_no:  accountType === 'wholesaler' ? bizReg   : null,
            phone:            accountType === 'wholesaler' ? phone    : null,
            business_address: accountType === 'wholesaler' ? bizAddress : null,
            bank_statement_url: bankStatementUrl,
            bank_reconciliation_url: bankReconUrl,
            wholesaler_status: accountType === 'wholesaler' ? 'PENDING' : null,
          },
        },
      });

      if (signupErr) throw signupErr;
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative overflow-hidden z-0">
        {/* --- GLOBAL PARALLAX BACKGROUND (Success State) --- */}
        <ParallaxBackground />
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-brand-green opacity-10 rounded-full blur-[100px] pointer-events-none" />
        <div className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white p-10 max-w-md w-full text-center space-y-5 animate-fade-up relative z-10">
          <div className="w-20 h-20 bg-brand-green-pale rounded-full flex items-center justify-center mx-auto mb-2">
            <svg className="w-10 h-10 text-brand-green" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            {accountType === 'wholesaler' ? 'Application Submitted!' : 'Account Created!'}
          </h2>
          <p className="text-slate-500 text-[15px] leading-relaxed">
            {accountType === 'wholesaler'
              ? 'Your wholesaler application is under review. We\'ll verify your business details and notify you within 24–48 hours. Please also check your email to confirm your address.'
              : 'We\'ve sent a verification link to your email. Please confirm it to activate your account.'}
          </p>
          <Link
            href="/login"
            className="inline-block mt-4 bg-brand-green text-white font-semibold text-sm px-8 py-3.5 rounded-xl hover:bg-brand-green-light transition-colors shadow-sm"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

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
        className="relative z-10 w-full max-w-[480px] transition-all duration-700 ease-out"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'translateY(0)' : 'translateY(20px)' }}
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-block relative w-[160px] h-[45px] mb-6">
            <Image src="/logo.png" alt="eSpares.lk" fill className="object-contain" priority />
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-white p-8 sm:p-10">
          
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Create an account</h2>
                <p className="text-slate-500 text-sm mt-2">Choose the account type that suits you.</p>
              </div>

              <div className="grid gap-4">
                <button
                  onClick={() => handlePick('customer')}
                  className="group flex items-start gap-4 text-left p-5 rounded-2xl border-2 border-slate-100/80 bg-white hover:border-brand-green hover:shadow-[0_4px_20px_rgba(45,106,79,0.08)] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-brand-green-pale flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-brand-green transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-base">Personal Account</p>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed">For individuals buying parts for home repairs.</p>
                    <p className="text-brand-green text-xs font-bold mt-2 group-hover:translate-x-1 transition-transform inline-block">Get started →</p>
                  </div>
                </button>

                <button
                  onClick={() => handlePick('wholesaler')}
                  className="group flex items-start gap-4 text-left p-5 rounded-2xl border-2 border-slate-100/80 bg-white hover:border-brand-gold hover:shadow-[0_4px_20px_rgba(200,150,62,0.12)] transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-brand-gold-pale flex items-center justify-center flex-shrink-0 transition-colors">
                    <svg className="w-6 h-6 text-slate-400 group-hover:text-brand-gold transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-800 text-base">Wholesaler / Business</p>
                      <span className="text-[9px] font-black tracking-wider uppercase bg-brand-gold/15 text-brand-gold px-2 py-0.5 rounded-full">Pro</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">For repair shops — bulk pricing & tax invoices.</p>
                    <p className="text-brand-gold text-xs font-bold mt-2 group-hover:translate-x-1 transition-transform inline-block">Apply now →</p>
                  </div>
                </button>
              </div>

              <p className="text-center text-sm text-slate-500 pt-2">
                Already have an account?{' '}
                <Link href="/login" className="font-semibold text-brand-green hover:underline">Sign in</Link>
              </p>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSignup} className="space-y-5">
              <div className="flex items-center gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(''); }}
                  className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center transition-colors text-slate-500"
                >
                  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                    {accountType === 'wholesaler' ? 'Wholesale Application' : 'Create your account'}
                  </h2>
                  <p className="text-slate-400 text-xs mt-0.5 font-medium">
                    {accountType === 'wholesaler' ? 'Fill in your business details for verification.' : 'It only takes a minute.'}
                  </p>
                </div>
              </div>

              {accountType === 'wholesaler' && (
                <div className="flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/20 text-brand-gold-light text-xs font-medium px-4 py-3 rounded-xl mb-6">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  Your business details will be verified by our team before approval.
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {accountType === 'wholesaler' ? 'Contact Person Name' : 'Full Name'}
                </label>
                <input
                  type="text" required value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  placeholder="e.g. Kamal Perera"
                />
              </div>

              {accountType === 'wholesaler' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business / Shop Name</label>
                    <input
                      type="text" required value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                      placeholder="e.g. Kamal Electronics"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Reg. No.</label>
                      <input
                        type="text" value={bizReg}
                        onChange={(e) => setBizReg(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone Number</label>
                      <input
                        type="tel" required value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                        placeholder="+94 7X XXX XXXX"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Business Address</label>
                    <textarea required value={bizAddress}
                      onChange={(e) => setBizAddress(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                      placeholder="Full business address" rows={2}
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bank Statement <span className="text-red-500">*</span></label>
                      <input
                        type="file" required accept=".pdf,image/*"
                        onChange={(e) => setBankStatement(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-brand-green-pale file:text-brand-green hover:file:bg-brand-green/20 transition-all cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bank Reconciliation <span className="text-red-500">*</span></label>
                      <input
                        type="file" required accept=".pdf,image/*"
                        onChange={(e) => setBankRecon(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-brand-green-pale file:text-brand-green hover:file:bg-brand-green/20 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all pr-12"
                    placeholder="Min. 8 characters"
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
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
                className={`w-full font-semibold py-3.5 rounded-xl transition-all disabled:opacity-60 text-sm text-white mt-2 ${
                  accountType === 'wholesaler'
                    ? 'bg-brand-gold hover:bg-brand-gold-light shadow-[0_4px_14px_rgba(200,150,62,0.25)] hover:shadow-[0_6px_20px_rgba(200,150,62,0.35)]'
                    : 'bg-brand-green hover:bg-brand-green-light shadow-[0_4px_14px_rgba(45,106,79,0.25)] hover:shadow-[0_6px_20px_rgba(45,106,79,0.35)]'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creating account...
                  </span>
                ) : accountType === 'wholesaler' ? 'Submit Application' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-8 font-medium">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="underline hover:text-slate-600 transition-colors">Terms</Link>
          {' & '}
          <Link href="/privacy" className="underline hover:text-slate-600 transition-colors">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
