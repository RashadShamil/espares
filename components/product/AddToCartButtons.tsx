'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

interface Props {
  product: {
    id: string;
    title: string;
    price: number;
    image: string;
    stock: number;
  };
  compact?: boolean;
}

export default function AddToCartButtons({ product, compact = false }: Props) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: qty,
    });
    setTimeout(() => setIsAdding(false), 1500);
  };

  if (compact) {
    return (
      <button
        onClick={handleAdd}
        disabled={isAdding || product.stock === 0}
        className={`flex-grow font-bold py-3 rounded-xl transition-all shadow-sm text-sm ${
          isAdding ? 'bg-brand-green text-white' : 'bg-brand-yellow text-brand-green hover:bg-yellow-400'
        }`}
      >
        {isAdding ? 'Added ✓' : 'Add to Cart'}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 mb-4">
      {/* Quantity selector */}
      <div className="shrink-0 flex items-center border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => setQty(q => Math.max(1, q - 1))}
          className="p-3 hover:bg-gray-50 text-gray-600 transition-colors"
        >
          <MinusIcon className="h-4 w-4" />
        </button>
        <span className="w-10 text-center font-bold text-gray-900">{qty}</span>
        <button
          onClick={() => setQty(q => Math.min(product.stock, q + 1))}
          className="p-3 hover:bg-gray-50 text-gray-600 transition-colors"
        >
          <PlusIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={isAdding || product.stock === 0}
        className={`flex-grow font-bold text-base py-3 rounded-xl transition-all shadow-sm ${
          isAdding
            ? 'bg-brand-green text-white'
            : 'bg-brand-yellow text-brand-green hover:bg-yellow-400 hover:shadow-md'
        }`}
      >
        {isAdding ? 'Added to Cart ✓' : 'Add to Cart'}
      </button>
    </div>
  );
}