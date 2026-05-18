import prisma from '@/lib/prisma';
import ProductCard from '@/components/product/ProductCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q = '', category = '' } = await searchParams;

  const products = await prisma.product.findMany({
    where: {
      AND: [
        q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { sku: { contains: q, mode: 'insensitive' } },
                { description: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {},
        category ? { category: { id: category } } : {},
      ],
    },
    include: { category: true, brand: true },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Search header bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900 text-lg">
              {q ? `Results for "${q}"` : 'All Products'}
            </h1>
            <p className="text-gray-500 text-sm">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
          </div>

          {/* Search form */}
          <form method="GET" action="/search" className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                name="q"
                defaultValue={q}
                placeholder="Search parts, SKU, model…"
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/30 focus:border-brand-green"
              />
              {category && <input type="hidden" name="category" value={category} />}
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-brand-green text-white text-sm font-bold rounded-xl hover:bg-brand-green-light transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Sidebar — category filters */}
        <aside className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">Categories</h3>
            <div className="space-y-1">
              <Link
                href={q ? `/search?q=${q}` : '/search'}
                className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  !category ? 'bg-brand-green/10 text-brand-green font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Categories
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/search?${q ? `q=${q}&` : ''}category=${cat.id}`}
                  className={`block px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    category === cat.id
                      ? 'bg-brand-green/10 text-brand-green font-bold'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </aside>

        {/* Product grid */}
        <div className="lg:col-span-9">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <MagnifyingGlassIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-6">
                {q ? `No results for "${q}". Try a different search term or browse all products.` : 'No products available yet.'}
              </p>
              <Link href="/search" className="text-brand-green font-bold hover:underline text-sm">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  title={product.name}
                  price={product.retailPrice ?? 0}
                  wholesalePrice={product.wholesalePrice}
                  sku={product.sku}
                  image={product.imageUrls?.[0] || '/images/placeholder.jpg'}
                  category={product.category?.name || 'Spare Part'}
                  stockLevel={product.stockLevel}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}