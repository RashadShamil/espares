import prisma from '@/lib/prisma';
import SidebarMenu from '@/components/home/SidebarMenu';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturesStrip from '@/components/home/FeaturesStrip';
import CategoryBento from '@/components/home/CategoryBento';
import ParallaxBackground from '@/components/ParallaxBackground';

import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { category: true }
    });
    return products;
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  return (
    <main className="relative min-h-screen z-0 bg-transparent">

      {/* --- GLOBAL PARALLAX BACKGROUND --- */}
      <ParallaxBackground />

      {/* ── Hero + Sidebar ── */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-[480px]">
          <div className="hidden lg:block lg:col-span-3 h-full">
            <SidebarMenu />
          </div>
          <div className="col-span-1 lg:col-span-9 h-full">
            <HeroBanner />
          </div>
        </div>
      </div>

      {/* ── Features strip ── */}
      <div className="mt-6">
        <FeaturesStrip />
      </div>

      {/* ── Category Bento ── */}
      <CategoryBento />

      {/* ── Latest Arrivals ── */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-xs font-mono-tech text-brand-green font-semibold uppercase tracking-[0.2em] mb-1.5">
              Fresh Stock
            </p>
            <h2 className="text-2xl font-bold text-brand-ink tracking-tight">Latest Arrivals</h2>
          </div>
          <Link
            href="/search"
            className="group flex items-center gap-1.5 text-sm font-semibold text-brand-green hover:text-brand-ink transition-colors"
          >
            View All
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.name}
                price={product.retailPrice}
                wholesalePrice={product.wholesalePrice}
                sku={product.sku}
                image={product.imageUrls?.[0] || '/images/placeholder.jpg'}
                category={product.category?.name || 'Spare Part'}
                stockLevel={product.stockLevel}
              />
            ))}
          </div>
        ) : (
          /* Empty state — shown before data is seeded */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="aspect-[4/3] skeleton" />
                <div className="p-4 space-y-2">
                  <div className="skeleton h-3 w-2/3 rounded" />
                  <div className="skeleton h-4 w-full rounded" />
                  <div className="skeleton h-4 w-3/4 rounded" />
                  <div className="skeleton h-5 w-1/2 rounded mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </main>
  );
}