'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, cartTotal } = useCart();
  
  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: ''
  });

  const [isProcessing, setIsProcessing] = useState(false);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Payment Submission
  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // TODO: Connect PayHere payment gateway
    setTimeout(() => {
      alert('Payment Gateway Integration Coming Next!');
      setIsProcessing(false);
    }, 1500);
  };

  if (cart.length === 0) {
    return <div className="p-20 text-center">Your cart is empty. <Link href="/" className="text-blue-500">Go back</Link></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Secure Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Shipping Form */}
          <div className="lg:col-span-8">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-brand-green text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                Shipping Details
              </h2>

              <form id="checkout-form" onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">First Name</label>
                  <input required name="firstName" onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" placeholder="Rashad" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Last Name</label>
                  <input required name="lastName" onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" placeholder="Khan" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Address</label>
                  <input required name="address" onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" placeholder="123, Main Street" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">City</label>
                  <input required name="city" onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" placeholder="Colombo" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Postal Code</label>
                  <input required name="postalCode" onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" placeholder="10000" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <input required name="phone" type="tel" onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" placeholder="077 123 4567" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Email Address</label>
                  <input required name="email" type="email" onChange={handleChange} className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-brand-green outline-none" placeholder="rashad@example.com" />
                </div>

              </form>
            </div>
          </div>

          {/* RIGHT: Order Summary & Pay Button */}
          <div className="lg:col-span-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Order</h2>
              
              {/* Mini Cart List */}
              <div className="max-h-60 overflow-y-auto space-y-3 mb-4 pr-2 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <div className="relative w-12 h-12 bg-gray-50 rounded border border-gray-200 shrink-0">
                      <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                      <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                        {item.quantity}
                      </span>.
                    </div>
                    <div className="flex-grow">
                       <p className="text-gray-700 font-medium line-clamp-2">{item.title}</p>
                    </div>
                    <p className="font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-t border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>LKR {cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-brand-green font-bold">Free</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-4">
                <span className="font-bold text-lg">Total to Pay</span>
                <span className="font-bold text-2xl text-brand-green">LKR {cartTotal.toLocaleString()}</span>
              </div>

              {/* PAY BUTTON */}
              <button 
                // We connect this button to the form ID above
                type="submit" 
                form="checkout-form"
                disabled={isProcessing}
                className="w-full bg-brand-yellow text-brand-green font-bold py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-md text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Processing..." : "Pay Now (LKR " + cartTotal.toLocaleString() + ")"}
              </button>

              <div className="flex justify-center gap-3 mt-4 opacity-50 grayscale">
                 {/* Visual Trust Badges */}
                 <div className="h-6 w-10 bg-blue-900 rounded"></div>
                 <div className="h-6 w-10 bg-red-600 rounded"></div>
                 <div className="h-6 w-10 bg-blue-500 rounded"></div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}