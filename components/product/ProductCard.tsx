'use client';

import Link from 'next/link';
import Image from 'next/image';

interface ProductCardProps {
  id: string;
  title: string;
  price: number | null;
  wholesalePrice?: number | null;
  sku?: string;
  image: string;
  category: string;
  stockLevel?: number;
  isWholesaleUser?: boolean;
}

export default function ProductCard({
  id, title, price, wholesalePrice, sku, image, category, stockLevel = 0, isWholesaleUser = false
}: ProductCardProps) {
  const inStock = stockLevel > 0;

  return (
    <Link
      href={`/product/${id}`}
      className="group block bg-white rounded-2xl border border-gray-100 hover:border-brand-green/30 hover:shadow-card-hover transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain p-4 group-hover:scale-[1.04] transition-transform duration-500 ease-out"
        />

        {/* Stock badge */}
        {!inStock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg tracking-wider">Out of Stock</span>
          </div>
        )}

        {/* Category pill */}
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-brand-green text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-lg border border-brand-green/10">
          {category}
        </div>
      </div>

      {/* Body */}
      <div className="p-4 pt-3.5">
        {/* SKU */}
        {sku && (
          <p className="text-[10px] font-mono text-gray-400 mb-1.5 uppercase tracking-wider">{sku}</p>
        )}

        {/* Title */}
        <h3 className="font-semibold text-brand-ink text-sm leading-snug mb-3 line-clamp-2 min-h-[2.5rem] group-hover:text-brand-green transition-colors duration-200">
          {title}
        </h3>

        {/* Price block */}
        <div className="flex items-end justify-between gap-2">
          <div>
            {price != null ? (
              <span className="text-base font-bold text-brand-ink">
                LKR {price.toLocaleString()}
              </span>
            ) : (
              <span className="text-sm text-gray-400 italic">Price on request</span>
            )}

            {/* Wholesale price (real value from DB, only for wholesale users) */}
            {isWholesaleUser && wholesalePrice != null && (
              <div className="mt-0.5">
                <span className="text-[11px] font-mono text-brand-green font-semibold">
                  Wholesale: LKR {wholesalePrice.toLocaleString()}
                </span>
              </div>
            )}

            {/* Wholesale lock teaser for regular users */}
            {!isWholesaleUser && wholesalePrice != null && (
              <div className="flex items-center gap-1.5 mt-0.5">
                <svg className="w-3 h-3 text-brand-yellow flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                <span className="text-[11px] font-mono text-brand-yellow font-semibold price-locked select-none">Wholesale price available</span>
              </div>
            )}
          </div>

          {/* Add icon */}
          <div className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-brand-green group-hover:border-brand-green group-hover:text-white transition-all duration-200 flex-shrink-0">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}