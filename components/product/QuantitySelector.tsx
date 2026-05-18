'use client';

import { useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function QuantitySelector() {
  const [quantity, setQuantity] = useState(1);

  const decrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increase = () => {
    setQuantity(quantity + 1);
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md w-min">
      <button
        onClick={decrease}
        className="p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none disabled:opacity-30 transition-colors"
        disabled={quantity <= 1}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <input
        type="number"
        value={quantity}
        readOnly
        className="w-12 text-center text-gray-900 font-semibold focus:outline-none bg-transparent"
      />
      <button
        onClick={increase}
        className="p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none transition-colors"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}