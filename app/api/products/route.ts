import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

export async function POST(request: Request) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    let brandId = data.brandId || null;
    if (data.customBrand && data.customBrand.trim()) {
      const brand = await prisma.brand.upsert({
        where: { name: data.customBrand.trim() },
        update: {},
        create: { name: data.customBrand.trim() },
      });
      brandId = brand.id;
    }

    const product = await prisma.product.create({
      data: {
        name: data.name || 'Untitled Product',
        sku: data.sku || `SKU-${Date.now()}`,
        serialNumber: data.serialNumber || null,
        description: data.description || null,
        retailPrice: data.retailPrice || null,
        wholesalePrice: data.wholesalePrice || null,
        stockLevel: data.stockLevel ?? 0,
        imageUrls: data.imageUrls || [],
        specifications: data.specifications || {},
        ...(brandId && { brand: { connect: { id: brandId } } }),
        ...(data.categoryId && { category: { connect: { id: data.categoryId } } }),
        ...(data.subCategoryId && { subCategory: { connect: { id: data.subCategoryId } } }),
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}