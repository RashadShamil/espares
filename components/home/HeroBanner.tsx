'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const SLIDES = [
  { label: 'Washing Machine Parts', tag: '380+ SKUs available', image: '/washrep2.jpg' },
  { label: 'Air Conditioner Parts', tag: 'Inverter & Standard', image: '/acrep.jpg' },
  { label: 'Refrigerator Parts', tag: 'All major brands', image: '/refrep.jpg' },
];

const STATS = [
  { value: '1,000+', label: 'Genuine Parts' },
  { value: '50+', label: 'Brands Stocked' },
  { value: '24h', label: 'Island Delivery' },
];

export default function HeroBanner() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden flex flex-col justify-end"
      style={{ background: 'linear-gradient(135deg, #0D2B1A 0%, #122B1C 50%, #1A3020 100%)' }}>

      {/* ── Background slideshow — brighter, more present ── */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          allowTouchMove={false}
          className="w-full h-full"
        >
          {SLIDES.map((s, i) => (
            <SwiperSlide key={i} className="relative w-full h-full">
              {/* Image is brighter — opacity 0.65 instead of 0.45 */}
              <Image
                src={s.image}
                alt={s.label}
                fill
                priority={i === 0}
                className="object-cover object-center"
                style={{ opacity: 0.65 }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── Overlays — lighter, just enough to read text ── */}
      {/* Left gradient — keeps text legible */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(100deg, rgba(10,28,18,0.88) 0%, rgba(10,28,18,0.6) 45%, rgba(10,28,18,0.15) 100%)' }} />
      {/* Bottom fade — subtle */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(10,28,18,0.75) 0%, transparent 50%)' }} />

      {/* ── Brand colour glows — complementary, not heavy ── */}
      {/* Green glow top-right — brand accent */}
      <div className="absolute top-0 right-0 w-72 h-72 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(45,106,79,0.4) 0%, transparent 65%)' }} />
      {/* Gold glow bottom-left — warm accent */}
      <div className="absolute bottom-0 left-0 w-80 h-60 pointer-events-none z-10"
        style={{ background: 'radial-gradient(ellipse at bottom left, rgba(200,150,62,0.25) 0%, transparent 65%)' }} />

      {/* ── Slide label — top right ── */}
      <div className="absolute top-5 right-5 z-30 text-right hidden sm:block">
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          loop={true}
          allowTouchMove={false}
          className="w-48"
        >
          {SLIDES.map((s, i) => (
            <SwiperSlide key={i}>
              <p className="text-white/50 font-mono text-[9px] uppercase tracking-widest mb-0.5">{s.tag}</p>
              <p className="text-white/80 text-xs font-semibold">{s.label}</p>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ── Main content ── */}
      <div className="relative z-20 p-7 md:p-10 pt-14">

        {/* Gold eyebrow — clearly visible */}
        <div className="flex items-center gap-2 mb-4">
          <span className="h-px w-6" style={{ background: '#C8963E' }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] font-semibold"
            style={{ color: '#C8963E' }}>
            Sri Lanka&apos;s Largest
          </span>
        </div>

        <h1 className="text-3xl md:text-[2.6rem] font-bold text-white tracking-tight leading-[1.08] mb-3 drop-shadow-lg">
          Online Spare<br />Parts Store
        </h1>

        <p className="text-white/65 text-sm mb-5 max-w-xs leading-relaxed">
          Genuine parts for ACs, washing machines, refrigerators &amp; more. Island-wide delivery.
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex items-center mb-6 max-w-sm">
          <div className="flex flex-1 items-center border rounded-l-xl overflow-hidden focus-within:border-white/40 transition-colors"
            style={{ background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }}>
            <svg className="w-4 h-4 text-white/40 ml-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Part name, model or serial no…"
              className="flex-1 bg-transparent text-white text-sm px-3 py-2.5 placeholder-white/35 focus:outline-none"
            />
          </div>
          <button type="submit"
            className="px-4 py-2.5 text-sm font-bold text-white rounded-r-xl shrink-0 hover:brightness-110 transition-all"
            style={{ background: '#C8963E' }}>
            Search
          </button>
        </form>

        {/* Portal cards */}
        <div className="grid grid-cols-2 gap-3 max-w-sm mb-6">
          <Link href="/search"
            className="group flex flex-col gap-1 rounded-xl p-3.5 transition-all duration-300"
            style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.55)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.35)')}>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
              </div>
              <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">Consumer</span>
            </div>
            <p className="text-white text-xs font-semibold leading-tight">Repairing my appliance</p>
            <span className="text-[11px] group-hover:translate-x-0.5 transition-transform inline-block mt-1"
              style={{ color: '#C8963E' }}>Shop now →</span>
          </Link>

          <Link href="/signup"
            className="group flex flex-col gap-1 rounded-xl p-3.5 transition-all duration-300"
            style={{ background: 'rgba(200,150,62,0.12)', border: '1px solid rgba(200,150,62,0.28)', backdropFilter: 'blur(8px)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,150,62,0.22)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,150,62,0.12)')}>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ background: '#C8963E' }}>
                <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-[9px] font-mono text-white/50 uppercase tracking-widest">Wholesale</span>
            </div>
            <p className="text-white text-xs font-semibold leading-tight">Professional / Trade</p>
            <span className="text-[11px] group-hover:translate-x-0.5 transition-transform inline-block mt-1"
              style={{ color: '#C8963E' }}>Apply now →</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-bold text-base leading-none" style={{ color: '#C8963E' }}>{s.value}</span>
              <span className="text-white/40 text-[9px] font-mono uppercase tracking-wider mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}