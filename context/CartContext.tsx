'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define what a Cart Item looks like
export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

// 2. Define the "Remote Control" buttons our Context will provide
interface CartContextType {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  cartCount: number; 
  cartTotal: number; 
}

// Create the Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// 3. The Provider
export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load from LocalStorage on startup
  useEffect(() => {
    const savedCart = localStorage.getItem('espares-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem('espares-cart', JSON.stringify(cart));
  }, [cart]);

  // --- ACTIONS ---

  const addToCart = (product: CartItem) => {
    setCart((prevCart) => {
      // Check if item already exists
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // [FIXED LOGIC STARTS HERE] -------------------------
        // Calculate the proposed new quantity
        const newQuantity = existingItem.quantity + product.quantity;
        
        return prevCart.map((item) =>
          item.id === product.id
            // Safety Check: If result is 0 or negative, force it to stay at 1.
            // (Removal should be handled by removeFromCart instead)
            ? { ...item, quantity: newQuantity > 0 ? newQuantity : 1 }
            : item
        );
        // [FIXED LOGIC ENDS HERE] ---------------------------
      } else {
        // If it's a new item, just add it to the list
        return [...prevCart, product];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate totals automatically
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// 4. Custom Hook
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}