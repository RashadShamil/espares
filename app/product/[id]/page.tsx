import Link from 'next/link';
import prisma from '@/lib/prisma';
import AddToCartButtons from '@/components/product/AddToCartButtons';
import TechSpecHud from '@/components/product/TechSpecHud';
import Image from 'next/image';

import {
  CheckBadgeIcon,
  ShieldCheckIcon,
  TruckIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  TagIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';

import CompatibilityChecker from '@/components/product/CompatibilityChecker';
import ProductTabs from '@/components/product/ProductTabs';
import ImageMagnifier from '@/components/product/ImageMagnifier';

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      brand: true,
      category: true,
      subCategory: true,
    },
  });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <CubeIcon className="w-10 h-10 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Product Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-sm">
          We couldn't find this part. It may have been removed or the link is incorrect.
        </p>
        <Link href="/" className="bg-brand-green text-white px-6 py-3 rounded-xl font-bold hover:bg-brand-green-light transition">
          Back to Home
        </Link>
      </div>
    );
  }

  // Parse specs: stored as flat JSON { "Motor Power": "450W" } → [{ key, value }]
  const specsArray: { key: string; value: string }[] =
    product.specifications && typeof product.specifications === 'object'
      ? Object.entries(product.specifications as Record<string, string>).map(([key, value]) => ({ key, value: String(value) }))
      : [];

  const inStock = product.stockLevel > 0;
  const hasImages = product.imageUrls && product.imageUrls.length > 0;
  const mainImage = hasImages ? product.imageUrls[0] : '/images/placeholder.jpg';

  return (
    <main className="bg-[#F8F9FA] min-h-screen pb-24 lg:pb-16 font-sans text-gray-800">

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/search?category=${product.category.id}`} className="hover:text-brand-green transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-gray-900 font-medium truncate max-w-[300px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 lg:mt-8">

        {/* Mobile title & price */}
        <div className="lg:hidden mb-6">
          {product.brand && (
            <span className="text-xs font-semibold text-brand-green uppercase tracking-widest mb-1 block">{product.brand.name}</span>
          )}
          <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
          <div className="flex items-baseline gap-3">
            {product.retailPrice != null ? (
              <span className="text-2xl font-bold text-brand-green">LKR {product.retailPrice.toLocaleString()}</span>
            ) : (
              <span className="text-base text-gray-400 italic">Price on request</span>
            )}
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">

          {/* LEFT — Images + Specs */}
          <div className="lg:col-span-8 space-y-6">

            {/* Main image */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
              <div className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden">
                <ImageMagnifier
                  src={mainImage}
                  alt={product.name}
                />
              </div>
              <p className="text-center text-xs text-gray-400 mt-2">Hover or tap to zoom</p>

              {/* Thumbnail strip if multiple images */}
              {product.imageUrls.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                  {product.imageUrls.map((url, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg border border-gray-100 overflow-hidden shrink-0 bg-gray-50">
                      <Image src={url} alt={`${product.name} view ${i + 1}`} fill className="object-contain p-1" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Specs HUD — only if specs exist */}
            {specsArray.length > 0 && (
              <TechSpecHud
                sku={product.sku}
                serialNumber={product.serialNumber || undefined}
                specs={specsArray}
              />
            )}

            {/* Description / Tabs */}
            <ProductTabs
              description={product.description || ''}
              specifications={specsArray}
              features={[]}
            />
          </div>

          {/* RIGHT — Buy box */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100 p-6 sticky top-28">

              {/* Desktop header */}
              <div className="mb-4 border-b border-gray-100 pb-4 hidden lg:block">
                {product.brand && (
                  <span className="text-xs font-semibold text-brand-green uppercase tracking-widest mb-1 block">{product.brand.name}</span>
                )}
                <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-mono">
                    SKU: {product.sku}
                  </span>
                  {product.serialNumber && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-mono">
                      Part No: {product.serialNumber}
                    </span>
                  )}
                  <span className="flex items-center text-brand-green text-xs font-bold">
                    <CheckBadgeIcon className="h-4 w-4 mr-1" /> Genuine Part
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4 hidden lg:block">
                {product.retailPrice != null ? (
                  <span className="text-3xl font-bold text-brand-green">
                    LKR {product.retailPrice.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-base text-gray-400 italic">Price on request</span>
                )}
                {product.wholesalePrice != null && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <TagIcon className="w-3 h-3" />
                    Wholesale: LKR {product.wholesalePrice.toLocaleString()}
                  </p>
                )}
              </div>

              {/* Stock status */}
              <div className="mb-4">
                {inStock ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    In Stock ({product.stockLevel} available)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-200">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Add to cart */}
              {inStock && product.retailPrice != null ? (
                <AddToCartButtons
                  product={{
                    id: product.id,
                    title: product.name,
                    price: product.retailPrice,
                    image: mainImage,
                    stock: product.stockLevel,
                  }}
                />
              ) : (
                <div className="w-full text-center text-sm text-gray-400 py-3 border border-dashed border-gray-200 rounded-xl">
                  {!inStock ? 'Currently out of stock' : 'Price not set — contact us'}
                </div>
              )}

              {/* WhatsApp enquiry */}
              <a
                href="https://wa.me/94771234567"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-brand-green py-2.5 transition-colors border border-dashed border-gray-200 rounded-xl hover:border-brand-green hover:bg-green-50"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Not sure if this fits? Ask an Expert
              </a>

              {/* Trust icons */}
              <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between px-2">
                <div className="flex flex-col items-center gap-1">
                  <ShieldCheckIcon className="h-5 w-5 text-brand-green" />
                  <span className="text-[10px] text-gray-500">Genuine</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <TruckIcon className="h-5 w-5 text-brand-green" />
                  <span className="text-[10px] text-gray-500">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <ArrowPathIcon className="h-5 w-5 text-brand-green" />
                  <span className="text-[10px] text-gray-500">Returns</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Mobile sticky buy bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden z-50 flex gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
        <div className="flex flex-col justify-center">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Price</span>
          {product.retailPrice != null ? (
            <span className="font-bold text-brand-green">LKR {product.retailPrice.toLocaleString()}</span>
          ) : (
            <span className="text-sm text-gray-400 italic">On request</span>
          )}
        </div>
        {inStock && product.retailPrice != null ? (
          <AddToCartButtons
            product={{
              id: product.id,
              title: product.name,
              price: product.retailPrice,
              image: mainImage,
              stock: product.stockLevel,
            }}
          />
        ) : (
          <div className="flex-grow bg-gray-100 text-gray-400 font-bold py-3 rounded-xl text-center text-sm">
            {!inStock ? 'Out of Stock' : 'Price on Request'}
          </div>
        )}
      </div>

    </main>
  );
}