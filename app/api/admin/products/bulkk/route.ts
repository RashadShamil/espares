import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { products } = await request.json();

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }

    let successCount = 0;

    // We use a transaction to ensure if something breaks, it rolls back
    await prisma.$transaction(async (tx) => {
      for (const row of products) {
        // 1. Skip empty rows or rows without a Name/SKU
        if (!row['Product Name'] || !row['SKU']) continue;

        // 2. Find or Create the Brand
        const brandName = row['Brand'] || 'Generic/Universal';
        const brand = await tx.brand.upsert({
          where: { name: brandName },
          update: {},
          create: { name: brandName }
        });

        // 3. Find or Create the Category
        const categoryName = row['Category'] || 'Other';
        const category = await tx.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName }
        });

        // 4. Find or Create the SubCategory
        const subCategoryName = row['SubCategory'] || 'Other';
        // SubCategories are tricky because they belong to a Category.
        // We look for a subcategory with this name inside this specific category.
        let subCategory = await tx.subCategory.findFirst({
          where: { name: subCategoryName, categoryId: category.id }
        });

        if (!subCategory) {
          subCategory = await tx.subCategory.create({
            data: { name: subCategoryName, categoryId: category.id }
          });
        }

        // 5. Upsert the Product (If SKU exists, update it. If not, create it)
        await tx.product.upsert({
          where: { sku: row['SKU'].toString() },
          update: {
            name: row['Product Name'],
            serialNumber: row['Serial Number']?.toString() || null,
            description: row['Description'] || null,
            retailPrice: Number(row['Retail Price']) || 0,
            wholesalePrice: Number(row['Wholesale Price']) || 0,
            stockLevel: Number(row['Stock Level']) || 0,
            brandId: brand.id,
            categoryId: category.id,
            subCategoryId: subCategory.id,
          },
          create: {
            name: row['Product Name'],
            sku: row['SKU'].toString(),
            serialNumber: row['Serial Number']?.toString() || null,
            description: row['Description'] || null,
            retailPrice: Number(row['Retail Price']) || 0,
            wholesalePrice: Number(row['Wholesale Price']) || 0,
            stockLevel: Number(row['Stock Level']) || 0,
            brandId: brand.id,
            categoryId: category.id,
            subCategoryId: subCategory.id,
            imageUrls: [], // Images are added manually later
          }
        });

        successCount++;
      }
    });

    return NextResponse.json({ message: `Successfully uploaded ${successCount} products!` });

  } catch (error) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ error: 'Failed to process bulk upload.' }, { status: 500 });
  }
}