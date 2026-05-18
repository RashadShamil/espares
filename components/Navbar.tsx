'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/client';

const APPLIANCE_TYPES = ['All Parts', 'Washing Machine', 'Air Conditioner', 'Refrigerator', 'Microwave'];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [applianceType, setApplianceType] = useState('All Parts');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsLoggedIn(true);
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
        setUserName(name.split(' ')[0]);
      }
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        const name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User';
        setUserName(name.split(' ')[0]);
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    const query = searchParams?.get('q');
    if (query) setSearchTerm(query);
  }, [searchParams]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (applianceType !== 'All Parts') params.set('category', applianceType.toLowerCase().replace(' ', '-'));
    router.push(`/search?${params.toString()}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleMobileSearchToggle = () => {
    setMobileSearchOpen(prev => !prev);
    // Focus input after state update
    setTimeout(() => mobileInputRef.current?.focus(), 50);
  };

  if (pathname?.startsWith('/admin')) return null;

  return (
    <header className="sticky top-0 z-50 w-full">

      {/* ── Main nav shell ── */}
      <div className={`w-full transition-all duration-400 ${scrolled ? 'px-4 pt-3 pb-3' : 'px-0 py-0'}`}>
        <nav className={`mx-auto flex items-center gap-4 lg:gap-6 transition-all duration-400 ${
          scrolled
            ? 'max-w-7xl bg-white/90 backdrop-blur-xl shadow-nav border border-gray-200/60 rounded-2xl px-5 py-3'
            : 'w-full bg-white border-b border-gray-100 px-6 py-3.5 md:px-10'
        }`}>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative w-[160px] h-[42px] md:w-[190px] md:h-[48px]">
              <Image src="/logo.png" alt="eSpares.lk" fill className="object-contain object-left" priority />
            </div>
          </Link>

          {/* ── HUD Search ── */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-2xl relative group/search"
          >
            <div className="flex w-full rounded-xl border border-gray-200 bg-gray-50 overflow-hidden transition-all duration-300 focus-within:border-brand-green/50 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,92,58,0.08)]">

              {/* Appliance dropdown */}
              <div ref={dropdownRef} className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-full flex items-center gap-1.5 px-4 text-sm font-semibold text-gray-700 border-r border-gray-200 hover:bg-gray-100/80 transition-colors whitespace-nowrap"
                >
                  {applianceType}
                  <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[180px] py-1 overflow-hidden">
                    {APPLIANCE_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => { setApplianceType(type); setDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          applianceType === type
                            ? 'bg-brand-green text-white font-semibold'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Text input */}
              <input
                type="text"
                placeholder="Search by part name, model or serial number…"
                className="flex-1 px-4 py-3 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {/* Barcode icon */}
              <div className="flex items-center px-3 border-l border-gray-200 text-gray-400 cursor-pointer hover:text-brand-green transition-colors" title="Search by serial number">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" d="M4 6h1M4 10h1M4 14h1M4 18h1M8 6v12M11 6v12M14 6h1M14 10h1M14 14h1M14 18h1M18 6v12M21 6h-1M21 10h-1M21 14h-1M21 18h-1"/>
                </svg>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="bg-brand-green text-white px-5 font-semibold text-sm flex items-center gap-2 hover:bg-brand-green-light transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
                <span className="hidden xl:inline">Search</span>
              </button>
            </div>
          </form>

          {/* ── Right actions ── */}
          <div className="flex items-center gap-1.5 ml-auto">

            {/* Mobile search toggle */}
            <button
              onClick={handleMobileSearchToggle}
              className={`lg:hidden p-2.5 rounded-xl transition-colors ${
                mobileSearchOpen ? 'bg-brand-green text-white' : 'hover:bg-gray-100 text-gray-600'
              }`}
              aria-label="Toggle search"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Wishlist — visible on all sizes when logged in */}
            {isLoggedIn && (
              <Link href="/wishlist" className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-red-500 transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </Link>
            )}

            {/* Cart — only when logged in, visible on all sizes */}
            {isLoggedIn && (
              <Link href="/cart" className="relative p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 hover:text-brand-green transition-colors">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-brand-green text-white text-[10px] font-bold min-w-[17px] h-[17px] px-0.5 rounded-full flex items-center justify-center border border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            {/* Divider — desktop only */}
            <div className="hidden md:block w-px h-6 bg-gray-200 mx-1" />

            {isLoggedIn ? (
              <div className="flex items-center gap-1.5">
                {/* Account pill — shown on all sizes */}
                <Link href="/account" className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-gray-200 hover:border-brand-green/30 hover:bg-brand-green/5 transition-all">
                  <div className="w-6 h-6 bg-gradient-to-br from-brand-green to-brand-green-light rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0">
                    {userName ? userName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  {/* Name — hidden on very small screens */}
                  <div className="leading-tight hidden sm:block">
                    <span className="block text-[9px] text-gray-400 uppercase tracking-wider font-semibold">Hi,</span>
                    <span className="block text-xs font-bold text-gray-900 max-w-[80px] truncate">{userName || 'User'}</span>
                  </div>
                </Link>
                {/* Logout — always visible */}
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                  </svg>
                </button>
              </div>
            ) : (
              // Sign In — visible on ALL screen sizes when logged out
              <Link href="/login" className="bg-brand-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-brand-green-light transition-colors shadow-sm hover:shadow-[0_4px_14px_rgba(45,106,79,0.25)]">
                Sign In
              </Link>
            )}

          </div>
        </nav>
      </div>

      {/* ── Mobile expanding search bar ── */}
      {mobileSearchOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 shadow-md px-4 py-3 animate-in slide-in-from-top duration-200">
          <form onSubmit={(e) => { handleSearch(e); setMobileSearchOpen(false); }} className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-brand-green/50 focus-within:bg-white focus-within:shadow-[0_0_0_3px_rgba(30,92,58,0.08)] transition-all">
              <svg className="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
              </svg>
              <input
                ref={mobileInputRef}
                type="text"
                placeholder="Search parts, models, serial numbers…"
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button type="button" onClick={() => setSearchTerm('')} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                  </svg>
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-brand-green text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-brand-green-light transition-colors shrink-0"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="p-2.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors shrink-0"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </form>
        </div>
      )}
    </header>
  );
}