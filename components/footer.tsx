'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  PaperAirplaneIcon,
  PhoneIcon,
  MapPinIcon,
  EnvelopeIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  TruckIcon,
  CogIcon
} from '@heroicons/react/24/outline';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const pathname = usePathname();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  if (pathname?.startsWith('/admin')) return null;

  return (
    <footer className="relative z-10 pt-32 pb-8 mt-24 border-t border-[#E0AE5A]/30">

      {/* --- BACKGROUND LAYERS (Wrapped to clip watermark without cutting the top card) --- */}
      <div className="absolute inset-0 overflow-hidden -z-20 pointer-events-none bg-[#0A2016]">

        {/* Parallax Image Layer */}
        <div
          className="absolute inset-0 bg-[url('/parallax.png')] bg-cover bg-center bg-fixed opacity-80 mix-blend-luminosity"
        ></div>

        {/* 1. Base Gradient Vignette (Acts as a dark wash over the parallax image) */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2D6A4F]/80 via-[#1E4D38]/90 to-[#0A2016]/95"></div>

        {/* 2. Technical Blueprint Grid Overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.2) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        ></div>

        {/* 3. Large Mechanical Watermark */}
        <div className="absolute -bottom-32 -right-32 text-white/5 rotate-12">
          <CogIcon className="w-[500px] h-[500px]" />
        </div>
      </div>

      {/* 4. Top-Left Micro UI Crosshair */}
      <div className="absolute top-24 left-8 text-white/20 font-mono-tech text-xs tracking-[0.3em] pointer-events-none hidden lg:block">
        [ + ] SEC.04 // FOOTER_INDEX
      </div>

      {/* --- THE FLOATING OVERLAP CARD --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl px-4 z-20">
        <div className="relative group bg-[#112A1F] border border-[#E0AE5A]/20 rounded-3xl p-6 md:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">

          {/* Subtle noise/texture overlay inside card */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("/noise.png")' }}></div>

          {/* Subtle Gold light leak in the card */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#E0AE5A]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10 w-full">
            <div className="hidden md:flex items-center justify-center w-14 h-14 rounded-full border border-white/20 bg-white/5 shrink-0 shadow-inner">
              <WrenchScrewdriverIcon className="h-6 w-6 text-[#E0AE5A]" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5 tracking-tight">Can't identify your faulty part?</h3>
              <p className="text-white/80 text-sm max-w-xl leading-relaxed">Send us a photo of your old part or model number. Our technicians will find the exact match and source it for you.</p>
            </div>
            <a
              href="https://wa.me/9477xxxxxxx"
              target="_blank"
              className="shrink-0 flex items-center gap-2.5 bg-white/10 border border-[#E0AE5A]/40 text-[#E0AE5A] font-semibold text-sm py-3.5 px-6 rounded-xl hover:bg-[#E0AE5A] hover:text-[#112A1F] transition-all duration-300 backdrop-blur-sm w-full md:w-auto justify-center shadow-[0_0_15px_rgba(224,174,90,0.15)] hover:shadow-[0_0_25px_rgba(224,174,90,0.4)]"
            >
              <PhoneIcon className="h-4 w-4" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 mt-4">

        {/* --- TRUST SIGNALS ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-white/10 mb-16 relative">
          {/* Micro-UI detail on divider line */}
          <div className="absolute -bottom-[1px] left-0 w-16 h-[2px] bg-[#E0AE5A]"></div>

          <div className="flex items-start gap-4 group cursor-default">
            <ShieldCheckIcon className="h-7 w-7 text-[#E0AE5A] shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-500" />
            <div>
              <p className="font-bold text-white text-sm mb-1 tracking-wide">100% Genuine Parts</p>
              <p className="text-xs text-white/70 leading-relaxed">Sourced directly from certified manufacturers</p>
            </div>
          </div>
          <div className="flex items-start gap-4 group cursor-default">
            <TruckIcon className="h-7 w-7 text-[#E0AE5A] shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-500" />
            <div>
              <p className="font-bold text-white text-sm mb-1 tracking-wide">Island-wide Delivery</p>
              <p className="text-xs text-white/70 leading-relaxed">Fast dispatch across Sri Lanka within 48h</p>
            </div>
          </div>
          <div className="flex items-start gap-4 group cursor-default">
            <WrenchScrewdriverIcon className="h-7 w-7 text-[#E0AE5A] shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-500" />
            <div>
              <p className="font-bold text-white text-sm mb-1 tracking-wide">Expert Support</p>
              <p className="text-xs text-white/70 leading-relaxed">Free technical guidance from professionals</p>
            </div>
          </div>
        </div>

        {/* --- MAIN LINKS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">

          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col pr-0 lg:pr-10 relative">
            <Link href="/" className="mb-6 inline-block w-fit">
              <div className="relative w-36 h-10">
                <Image
                  src="/logo.png"
                  alt="eSpares.lk"
                  fill
                  className="object-contain object-left brightness-0 invert opacity-100 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                />
              </div>
            </Link>
            <p className="text-sm text-white/80 leading-relaxed mb-8 max-w-sm">
              Sri Lanka's premier destination for genuine home appliance spare parts. Supplying high-quality components to homeowners and professional mechanics alike.
            </p>
            <div className="flex gap-3">
              {['FB', 'IG', 'YT'].map((platform) => (
                <a key={platform} href="#" className="relative w-9 h-9 rounded-lg border border-white/20 text-white/80 flex items-center justify-center hover:bg-[#E0AE5A] hover:text-[#112A1F] hover:border-[#E0AE5A] transition-all duration-300 text-[10px] font-mono-tech tracking-wider font-bold overflow-hidden group">
                  <span className="relative z-10">{platform}</span>
                  <div className="absolute inset-0 bg-[#E0AE5A]/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300 z-0"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-mono-tech uppercase tracking-[0.2em] text-[#E0AE5A] mb-6 flex items-center gap-2">
              <span className="text-white/30">//</span> Explore
            </h4>
            <ul className="space-y-3.5">
              {['All Parts', 'Washing Machine', 'Air Conditioner', 'Refrigerator', 'Wholesale Portal'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-px bg-[#E0AE5A] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div className="lg:col-span-2">
            <h4 className="text-[10px] font-mono-tech uppercase tracking-[0.2em] text-[#E0AE5A] mb-6 flex items-center gap-2">
              <span className="text-white/30">//</span> Support
            </h4>
            <ul className="space-y-3.5">
              {['Track My Order', 'Return Policy', 'Shipping Info', 'FAQs', 'Contact Us'].map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-2 group">
                    <span className="w-1 h-px bg-[#E0AE5A] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-4">
            <h4 className="text-[10px] font-mono-tech uppercase tracking-[0.2em] text-[#E0AE5A] mb-6 flex items-center gap-2">
              <span className="text-white/30">//</span> Connect
            </h4>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3 group">
                <MapPinIcon className="h-4 w-4 text-[#E0AE5A]/70 shrink-0 mt-0.5 group-hover:text-[#E0AE5A] transition-colors" />
                <span className="text-sm text-white/80 leading-relaxed group-hover:text-white transition-colors">No. 123, Tech City Road,<br />Colombo 03, Sri Lanka</span>
              </li>
              <li className="flex items-center gap-3 group">
                <EnvelopeIcon className="h-4 w-4 text-[#E0AE5A]/70 shrink-0 group-hover:text-[#E0AE5A] transition-colors" />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">support@espares.lk</span>
              </li>
            </ul>

            {/* Newsletter */}
            <form onSubmit={handleSubscribe} className="relative group">
              <div className="relative flex items-center bg-black/20 border border-white/20 rounded-xl overflow-hidden focus-within:border-[#E0AE5A] transition-all duration-300 shadow-inner">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email for mechanic tips..."
                  className="w-full bg-transparent py-3 pl-4 pr-12 text-sm focus:outline-none text-white placeholder-white/50"
                  required
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[#E0AE5A]/50 hover:text-[#112A1F] hover:bg-[#E0AE5A] p-1.5 rounded-lg transition-all duration-300">
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
              {submitted && <p className="text-[#E0AE5A] text-xs mt-2.5 font-mono-tech">✓ SYS.UPDATED: Subscribed</p>}
            </form>
          </div>
        </div>

        {/* --- BOTTOM BAR --- */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative">
          {/* Micro-UI corners on bottom bar */}
          <div className="absolute top-0 right-0 w-[1px] h-2 bg-white/30"></div>
          <div className="absolute top-0 right-0 w-2 h-[1px] bg-white/30"></div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/20">
              <span className="h-1 w-1 bg-[#E0AE5A] animate-pulse rounded-full"></span>
              <span className="text-[10px] font-mono-tech tracking-widest">SYSTEM ONLINE</span>
            </div>
            <p className="text-[10px] font-mono-tech uppercase tracking-widest text-white/50 hidden md:block border-l border-white/10 pl-4">
              © {new Date().getFullYear()} eSpares.lk. All rights reserved.
            </p>
          </div>

          <div className="flex gap-2">
            {['VISA', 'MASTERCARD', 'AMEX', 'COD'].map((method) => (
              <div key={method} className="bg-black/20 border border-white/10 px-2.5 py-1 rounded flex items-center justify-center">
                <span className="text-[9px] font-bold tracking-wider text-white/60">{method}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}