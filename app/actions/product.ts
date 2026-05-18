'use server';

import prisma from '@/lib/prisma';

export async function fetchProductsForSearch() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      }
    });
    
    // Map data to match the expected Product interface in the frontend
    return products.map(p => ({
      id: p.id,
      title: p.name,
      price: p.retailPrice,
      originalPrice: p.retailPrice, // Or calculate if you have discounts
      category: p.category?.name ?? 'Uncategorised',
      rating: 5, // Default placeholder
      images: p.imageUrls,
      stock: p.stockLevel,
      compatibleModels: p.specifications && typeof p.specifications === 'object' && 'compatibleModels' in p.specifications 
        ? (p.specifications as any).compatibleModels 
        : []
    }));
  } catch (error) {
    console.error("Error fetching search products:", error);
    return [];
  }
}
