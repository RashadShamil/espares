import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  return user;
}

// PUT /api/products/[id] — Update a product
export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
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

    const product = await prisma.product.update({
      where: { id },
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
        brandId: brandId,
        categoryId: data.categoryId || null,
        subCategoryId: data.subCategoryId || null,
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Failed to update product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// DELETE /api/products/[id] — Delete a product
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireAdmin();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
