'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Client for Image Uploads
// Note: Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are in your .env file
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function AddProductModal({
    brands,
    categories,
    subCategories,
    onClose
}: {
    brands: any[],
    categories: any[],
    subCategories: any[],
    onClose: () => void
}) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [specs, setSpecs] = useState([{ key: '', value: '' }]);

    // Filter subcategories based on selected category
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const filteredSubCategories = subCategories.filter(sc => sc.categoryId === selectedCategoryId);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const addSpecField = () => setSpecs([...specs, { key: '', value: '' }]);
    const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
        const newSpecs = [...specs];
        newSpecs[index][field] = val;
        setSpecs(newSpecs);
    };
    const removeSpec = (index: number) => setSpecs(specs.filter((_, i) => i !== index));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formData = new FormData(e.currentTarget);

            // 1. Upload Images to Supabase Storage
            const imageUrls: string[] = [];
            for (const file of images) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
                const { data, error } = await supabase.storage
                    .from('products') // IMPORTANT: Create a storage bucket named 'products' in Supabase!
                    .upload(`public/${fileName}`, file);

                if (error) throw error;

                const { data: { publicUrl } } = supabase.storage.from('products').getPublicUrl(`public/${fileName}`);
                imageUrls.push(publicUrl);
            }

            // 2. Format Specifications into a JSON object
            const formattedSpecs = specs.reduce((acc, curr) => {
                if (curr.key && curr.value) acc[curr.key] = curr.value;
                return acc;
            }, {} as Record<string, string>);

            // 3. Send all data to our Next.js API route to save in PostgreSQL
            const response = await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.get('name'),
                    sku: formData.get('sku'),
                    serialNumber: formData.get('serialNumber'),
                    description: formData.get('description'),
                    brandId: formData.get('brandId'),
                    categoryId: formData.get('categoryId'),
                    subCategoryId: formData.get('subCategoryId'),
                    retailPrice: Number(formData.get('retailPrice')),
                    wholesalePrice: Number(formData.get('wholesalePrice')),
                    stockLevel: Number(formData.get('stockLevel')),
                    imageUrls,
                    specifications: formattedSpecs
                })
            });

            if (!response.ok) throw new Error('Failed to save product');

            router.refresh(); // Refresh the page to show the new product
            onClose(); // Close modal
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product. Check console for details.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#0A1F14] border border-brand-green/30 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">

                <div className="sticky top-0 bg-[#0A1F14]/90 backdrop-blur-md border-b border-white/10 p-6 flex justify-between items-center z-10">
                    <h2 className="text-2xl font-black text-white">Add New Product</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <XMarkIcon className="w-8 h-8" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-8">

                    {/* SECTION 1: Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Product Name</label>
                            <input name="name" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none transition-colors" placeholder="e.g., Singer Drain Motor (XPQ-6)" />
                        </div>
                        <div>
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">SKU (Internal ID)</label>
                            <input name="sku" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none transition-colors" placeholder="e.g., WM-SNG-001" />
                        </div>
                        <div>
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Serial Number (Part No.)</label>
                            <input name="serialNumber" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none transition-colors" placeholder="e.g., XPQ-6" />
                        </div>
                        <div>
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Brand</label>
                            <select name="brandId" required className="w-full bg-[#112A1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none">
                                <option value="">Select a Brand</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Description</label>
                        <textarea name="description" rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none transition-colors" placeholder="Detailed description of the part..." />
                    </div>

                    {/* SECTION 2: Categorization */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/5">
                        <div>
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Category</label>
                            <select
                                name="categoryId"
                                required
                                onChange={(e) => setSelectedCategoryId(e.target.value)}
                                className="w-full bg-[#112A1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none"
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Sub-Category</label>
                            <select name="subCategoryId" required disabled={!selectedCategoryId} className="w-full bg-[#112A1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none disabled:opacity-50">
                                <option value="">Select Sub-Category</option>
                                {filteredSubCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* SECTION 3: Pricing & Stock */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Retail Price (Rs.)</label>
                            <input type="number" name="retailPrice" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Wholesale Price (Rs.)</label>
                            <input type="number" name="wholesalePrice" required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Stock Level</label>
                            <input type="number" name="stockLevel" required defaultValue="10" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none" />
                        </div>
                    </div>

                    {/* SECTION 4: JSON Specifications (Dynamic) */}
                    <div className="p-6 bg-brand-green/10 rounded-2xl border border-brand-green/20">
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest">Technical Specifications</label>
                            <button type="button" onClick={addSpecField} className="text-xs font-bold text-brand-green bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-green hover:text-white transition-colors">
                                <PlusIcon className="w-4 h-4" /> Add Spec
                            </button>
                        </div>
                        <div className="space-y-3">
                            {specs.map((spec, idx) => (
                                <div key={idx} className="flex gap-4">
                                    <input placeholder="Key (e.g. Traction)" value={spec.key} onChange={(e) => updateSpec(idx, 'key', e.target.value)} className="w-1/3 bg-[#112A1F] border border-white/10 rounded-xl px-4 py-2 text-white text-sm" />
                                    <input placeholder="Value (e.g. 100N)" value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} className="w-flex-1 bg-[#112A1F] border border-white/10 rounded-xl px-4 py-2 text-white text-sm flex-grow" />
                                    <button type="button" onClick={() => removeSpec(idx)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SECTION 5: Image Upload */}
                    <div className="border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-brand-green/50 transition-colors bg-white/5 relative">
                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                        <PhotoIcon className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                        <p className="text-white font-bold mb-1">Click or drag images to upload</p>
                        <p className="text-white/50 text-sm">{images.length > 0 ? `${images.length} files selected` : 'Supports JPG, PNG, WEBP (Multiple allowed)'}</p>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-white/10 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-white hover:bg-white/10 transition-colors">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="bg-brand-green text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-green-light hover:shadow-[0_0_20px_rgba(45,106,79,0.4)] transition-all disabled:opacity-50">
                            {isSubmitting ? 'Saving Product...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}