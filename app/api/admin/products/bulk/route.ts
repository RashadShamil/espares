import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  // Auth guard
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { products } = await request.json();

    if (!products || !Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty data' }, { status: 400 });
    }

    let successCount = 0;
    const errors: string[] = [];

    await prisma.$transaction(async (tx) => {
      for (const row of products) {
        // Skip rows missing required fields
        if (!row['Product Name'] || !row['SKU']) continue;

        try {
          // Find or create Brand
          const brandName = (row['Brand'] || 'Generic/Universal').trim();
          const brand = await tx.brand.upsert({
            where: { name: brandName },
            update: {},
            create: { name: brandName },
          });

          // Find or create Category
          const categoryName = (row['Category'] || 'Other').trim();
          const category = await tx.category.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName },
          });

          // Find or create SubCategory under this Category
          const subCategoryName = (row['SubCategory'] || 'Other').trim();
          let subCategory = await tx.subCategory.findFirst({
            where: { name: subCategoryName, categoryId: category.id },
          });
          if (!subCategory) {
            subCategory = await tx.subCategory.create({
              data: { name: subCategoryName, categoryId: category.id },
            });
          }

          // Upsert product by SKU
          await tx.product.upsert({
            where: { sku: row['SKU'].toString().trim() },
            update: {
              name: row['Product Name'].trim(),
              serialNumber: row['Serial Number']?.toString().trim() || undefined,
              description: row['Description']?.trim() || undefined,
              retailPrice: row['Retail Price'] ? Number(row['Retail Price']) : undefined,
              wholesalePrice: row['Wholesale Price'] ? Number(row['Wholesale Price']) : undefined,
              stockLevel: Number(row['Stock Level']) || 0,
              brandId: brand.id,
              categoryId: category.id,
              subCategoryId: subCategory.id,
            },
            create: {
              name: row['Product Name'].trim(),
              sku: row['SKU'].toString().trim(),
              serialNumber: row['Serial Number']?.toString().trim() || undefined,
              description: row['Description']?.trim() || undefined,
              retailPrice: row['Retail Price'] ? Number(row['Retail Price']) : 0,
              wholesalePrice: row['Wholesale Price'] ? Number(row['Wholesale Price']) : 0,
              stockLevel: Number(row['Stock Level']) || 0,
              brandId: brand.id,
              categoryId: category.id,
              subCategoryId: subCategory.id,
              imageUrls: [],
            },
          });

          successCount++;
        } catch (rowError) {
          errors.push(`Row SKU "${row['SKU']}": ${(rowError as Error).message}`);
        }
      }
    }, { timeout: 30000 }); // 30s timeout for large uploads

    return NextResponse.json({
      message: `Successfully processed ${successCount} product(s).`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: 'Failed to process bulk upload.' }, { status: 500 });
  }
}
