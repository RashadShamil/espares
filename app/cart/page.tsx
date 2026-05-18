'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { TrashIcon, MinusIcon, PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@heroicons/react/24/solid';

export default function CartPage() {
  // 1. Get the cart data and functions from our "PA System" (Context)
  const { cart, addToCart, removeFromCart, cartTotal } = useCart();

  // 2. Handle Quantity Updates
  // To decrease, we add -1. To increase, we add +1.
  const updateQty = (item: any, change: number) => {
    // If quantity is 1 and user clicks minus, remove it? 
    // Or just stop at 1? Let's stop at 1 for safety here.
    if (item.quantity === 1 && change === -1) {
       removeFromCart(item.id);
       return;
    }
    
    addToCart({ 
        ...item, 
        quantity: change // Context handles the math logic
    });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🛒</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
        <p className="text-gray-500 mb-8">Looks like you haven't added any spare parts yet.</p>
        <Link href="/" className="bg-brand-green text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition shadow-lg">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center">
                
                {/* Product Image */}
                <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-contain p-2"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{item.title}</h3>
                  <p className="text-brand-green font-bold text-sm">LKR {item.price.toLocaleString()}</p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => addToCart({ ...item, quantity: -1 })}
                    className="p-1 hover:text-brand-green"
                    disabled={item.quantity <= 1}
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-sm w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart({ ...item, quantity: 1 })}
                    className="p-1 hover:text-brand-green"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            <Link href="/search" className="inline-flex items-center text-sm text-gray-500 hover:text-brand-green mt-4">
               <ArrowLeftIcon className="h-4 w-4 mr-2" /> Continue Shopping
            </Link>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 text-sm text-gray-600 pb-4 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>LKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-brand-green">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="font-bold text-gray-900 text-lg">Total</span>
                <span className="font-bold text-brand-green text-2xl">LKR {cartTotal.toLocaleString()}</span>
              </div>

              <Link href="/checkout" className="w-full">
                <button 
                  className="w-full bg-brand-yellow text-brand-green font-bold py-4 rounded-xl hover:bg-yellow-400 transition-colors shadow-md text-lg flex items-center justify-center gap-2"
                >
                  <LockClosedIcon className="h-3 w-3" />
                  Proceed to Checkout
                </button>
              </Link>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                We accept Visa, MasterCard, and KOKO.
              </p>
              
              <p className="text-xs text-center text-gray-400 mt-4">
                Secure Checkout powered by WhatsApp or PayHere
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}