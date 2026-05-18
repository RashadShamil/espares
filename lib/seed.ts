import prisma from "./prisma";

// The data we want to upload
const PRODUCTS = [
  {
    id: "samsung-drain-pump-wa",
    title: "Original Drain Pump for Samsung WA Series Top Loaders",
    sku: "DC96-01703A",
    price: 3500,
    originalPrice: 4200,
    discountPercentage: 17,
    stock: 12,
    rating: 4.8,
    reviews: 124,
    description: "Genuine Samsung replacement drain pump designed for WA series top-load washing machines.",
    compatibleModels: ["WA80H4000SG", "WA85J5710SG", "WA90H4200SW"],
    images: ["/images/pump-placeholder.jpg"], // Ensure you have this image in public/images
    specifications: [
      { key: "Voltage", value: "220-240V AC" },
      { key: "Warranty", value: "6 Months" }
    ],
    features: ["100% Genuine Samsung OEM Part", "Silent Operation"],
    category: "washing-machine"
  },
  {
    id: "lg-inverter-pcb-main",
    title: "LG Inverter Direct Drive Main PCB Assembly",
    sku: "EBR-7823-LG",
    price: 18500,
    stock: 3,
    description: "Main control board for LG Inverter Direct Drive washing machines.",
    compatibleModels: ["F1409NVR", "F10B8NDP5"],
    images: ["/images/pcb.jpg"], 
    category: "washing-machine"
  },
  {
    id: "universal-v-belt-m20",
    title: "Universal Washing Machine V-Belt (M-20.5)",
    sku: "BLT-M20.5",
    price: 850,
    stock: 150,
    description: "High-quality rubber V-belt suitable for various semi-automatic machines.",
    compatibleModels: ["Singer Semi-Auto", "Damro 7kg"],
    images: ["/images/belt.jpg"],
    category: "universal"
  }
];

export async function seedDatabase() {
  try {
    // 1. Ensure basic brands and categories exist first
    const brand = await prisma.brand.upsert({
      where: { name: 'Default Brand' },
      update: {},
      create: { name: 'Default Brand' }
    });

    const categoryWashingMachine = await prisma.category.upsert({
      where: { name: 'washing-machine' },
      update: {},
      create: { name: 'washing-machine' }
    });

    const categoryUniversal = await prisma.category.upsert({
      where: { name: 'universal' },
      update: {},
      create: { name: 'universal' }
    });

    const subCategory = await prisma.subCategory.upsert({
      where: { name_categoryId: { name: 'Parts', categoryId: categoryWashingMachine.id } },
      update: {},
      create: { name: 'Parts', categoryId: categoryWashingMachine.id }
    });

    // 2. Insert Products
    for (const p of PRODUCTS) {
      const categoryId = p.category === 'washing-machine' ? categoryWashingMachine.id : categoryUniversal.id;

      await prisma.product.upsert({
        where: { sku: p.sku },
        update: {
          name: p.title,
          retailPrice: p.price,
          wholesalePrice: p.price * 0.8,
          stockLevel: p.stock,
          description: p.description,
          imageUrls: p.images,
          specifications: {
            features: p.features || [],
            details: p.specifications || [],
            compatibleModels: p.compatibleModels || []
          }
        },
        create: {
          name: p.title,
          sku: p.sku,
          retailPrice: p.price,
          wholesalePrice: p.price * 0.8,
          stockLevel: p.stock,
          description: p.description,
          brandId: brand.id,
          categoryId: categoryId,
          subCategoryId: subCategory.id,
          imageUrls: p.images,
          specifications: {
            features: p.features || [],
            details: p.specifications || [],
            compatibleModels: p.compatibleModels || []
          }
        }
      });
    }

    console.log("Success! Products seeded to PostgreSQL.");
    alert("Success! 3 Products uploaded to PostgreSQL.");
  } catch (error) {
    console.error("Error seeding database:", error);
    alert("Error uploading data. Check console.");
  }
}