'use client';

import Link from 'next/link';
import Image from 'next/image';

const categories = [
  {
    id: 'washing-machine',
    name: 'Washing Machines',
    count: '380+ Parts',
    link: '/search?category=washing-machine',
    color: '#2D6A4F',
    accent: '#E0AE5A',
    colSpan: 'col-span-1 row-span-1',
    image: '/washing-machine.jpg',
  },
  {
    id: 'ac',
    name: 'Air Conditioners',
    count: '210+ Parts',
    link: '/search?category=ac',
    color: '#1F4D38',
    accent: '#E0AE5A',
    colSpan: 'col-span-1 row-span-1',
    image: '/ac3.jpg',
  },
  {
    id: 'fridge',
    name: 'Refrigerators',
    count: '175+ Parts',
    link: '/search?category=fridge',
    color: '#3A8263',
    accent: '#E0AE5A',
    colSpan: 'col-span-1 row-span-1',
    image: '/ref.jpg',
  },
];

export default function CategoryBento() {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Section header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-xs font-mono-tech text-brand-green font-semibold uppercase tracking-[0.2em] mb-1.5">Browse by Category</p>
          <h2 className="text-3xl font-bold text-brand-ink tracking-tight">Parts by Appliance</h2>
        </div>
        <Link href="/search" className="group flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-ink transition-colors">
          View All
          <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[280px] md:auto-rows-[340px]">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={cat.link}
            className={`group relative rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-end p-6 ${cat.colSpan}`}
            style={{ backgroundColor: cat.color }}
          >
            {/* Image Background */}
            {cat.image && (
              <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Simple dark gradient from bottom for text readability */}
                <div
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"
                />
              </div>
            )}

            {/* Subtle mesh texture over everything */}
            <div className="absolute inset-0 bg-hud opacity-20 pointer-events-none z-0" />

            {/* Bottom-left text */}
            <div className="relative z-10">
              <span
                className="text-[10px] font-mono-tech font-semibold uppercase tracking-[0.18em] mb-1.5 block drop-shadow-md"
                style={{ color: cat.accent }}
              >
                {cat.count}
              </span>
              <h3 className="text-white font-bold text-xl leading-tight tracking-tight drop-shadow-md">
                {cat.name}
              </h3>
            </div>

            {/* Hover arrow */}
            <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-1 group-hover:translate-x-0 z-10 shadow-lg"
              style={{ backgroundColor: cat.accent }}>
              <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
              </svg>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-[0.05] transition-opacity duration-300 z-10" />
          </Link>
        ))}
      </div>
    </section>
  );
}