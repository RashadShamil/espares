import prisma from '@/lib/prisma';
import { TagIcon } from '@heroicons/react/24/outline';
import AdminSearch from '../components/AdminSearch';
import AddProductButton from './AddProductButton';
import BulkUploadButton from './BulkUploadButton';
import ProductActions from './ProductActions';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;

  const [products, brands, categories, subCategories] = await Promise.all([
    prisma.product.findMany({
      where: q ? {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { sku: { contains: q, mode: 'insensitive' } }
        ]
      } : undefined,
      include: { brand: true, category: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.subCategory.findMany({ orderBy: { name: 'asc' } }),
  ]);

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 backdrop-blur-xl bg-black/40 p-5 sm:p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Inventory & Products</h1>
          <p className="text-white/60 mt-1 font-mono tracking-wide text-xs uppercase">{products.length} products {q && `matching "${q}"`}</p>
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-56">
            <AdminSearch placeholder="Search by name or SKU..." />
          </div>
          <BulkUploadButton />
          <AddProductButton brands={brands} categories={categories} subCategories={subCategories} />
        </div>
      </header>

      {/* Desktop Table */}
      <div className="hidden md:block bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#112A1F]/30 border-b border-white/10">
                <th className="p-4 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Product</th>
                <th className="p-4 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Brand</th>
                <th className="p-4 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">SKU</th>
                <th className="p-4 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Stock</th>
                <th className="p-4 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Price</th>
                <th className="p-4 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-white/40 font-mono tracking-widest text-sm uppercase">
                    {q ? 'No products matched your search.' : 'No products yet. Add your first product!'}
                  </td>
                </tr>
              ) : products.map((product) => (
                <tr key={product.id} className="hover:bg-brand-green/5 transition-colors bg-white/[0.02]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {product.imageUrls.length > 0 ? (
                        <div className="relative shrink-0">
                          <img src={product.imageUrls[0]} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
                          {product.imageUrls.length > 1 && (
                            <span className="absolute -bottom-1 -right-1 bg-brand-green text-white text-[9px] font-bold px-1 rounded-full">
                              +{product.imageUrls.length - 1}
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/30 shrink-0 relative">
                          <span className="text-amber-400 text-lg">📷</span>
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-pulse" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-white text-sm block truncate">{product.name}</span>
                        {product.imageUrls.length === 0 && (
                          <span className="text-amber-400 text-[10px] font-mono">No photos yet</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-white/60 font-mono text-sm">{product.brand?.name ?? '—'}</td>
                  <td className="p-4 font-mono text-sm text-brand-gold">{product.sku}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                      product.stockLevel > 10 ? 'bg-brand-green/20 text-brand-green border border-brand-green/30' :
                      product.stockLevel > 0 ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30' :
                      'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {product.stockLevel}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-white text-sm">
                    {product.retailPrice ? `Rs. ${product.retailPrice.toLocaleString()}` : '—'}
                  </td>
                  <td className="p-4">
                    <ProductActions product={product} brands={brands} categories={categories} subCategories={subCategories} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {products.length === 0 ? (
          <div className="text-center py-12 text-white/40 font-mono tracking-widest text-sm uppercase bg-black/40 rounded-3xl border border-white/10">
            {q ? 'No products matched your search.' : 'No products yet.'}
          </div>
        ) : products.map((product) => (
          <div key={product.id} className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-4 flex gap-4">
            {/* Thumbnail */}
            {product.imageUrls.length > 0 ? (
              <img src={product.imageUrls[0]} alt={product.name} className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0" />
            ) : (
              <div className="w-16 h-16 bg-[#112A1F] rounded-xl flex items-center justify-center text-brand-green border border-white/10 shrink-0">
                <TagIcon className="w-7 h-7" />
              </div>
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{product.name}</p>
              <p className="text-brand-gold font-mono text-xs mt-0.5">{product.sku}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  product.stockLevel > 10 ? 'bg-brand-green/20 text-brand-green' :
                  product.stockLevel > 0 ? 'bg-brand-gold/20 text-brand-gold' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {product.stockLevel} in stock
                </span>
                <span className="text-white/60 text-xs font-bold">
                  {product.retailPrice ? `Rs. ${product.retailPrice.toLocaleString()}` : '—'}
                </span>
              </div>
            </div>

            {/* Actions (vertical) */}
            <div className="shrink-0">
              <ProductActions product={product} brands={brands} categories={categories} subCategories={subCategories} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}