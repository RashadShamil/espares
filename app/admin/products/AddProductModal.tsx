'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XMarkIcon, PhotoIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

type Mode = 'create' | 'edit' | 'duplicate';

interface ProductData {
  id?: string;
  name?: string;
  sku?: string;
  serialNumber?: string;
  description?: string;
  brandId?: string;
  categoryId?: string;
  subCategoryId?: string;
  retailPrice?: number | null;
  wholesalePrice?: number | null;
  stockLevel?: number;
  imageUrls?: string[];
  specifications?: Record<string, string>;
}

export default function AddProductModal({ 
  brands, 
  categories, 
  subCategories,
  onClose,
  initialData,
  mode = 'create',
}: { 
  brands: any[], 
  categories: any[], 
  subCategories: any[],
  onClose: () => void,
  initialData?: ProductData,
  mode?: Mode,
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>(initialData?.imageUrls || []);

  // Parse initial specs from JSON object
  const initialSpecs = initialData?.specifications
    ? Object.entries(initialData.specifications).map(([key, value]) => ({ key, value: String(value) }))
    : [{ key: '', value: '' }];
  const [specs, setSpecs] = useState(initialSpecs.length > 0 ? initialSpecs : [{ key: '', value: '' }]);

  // Custom brand state
  const [isCustomBrand, setIsCustomBrand] = useState(false);
  const [customBrand, setCustomBrand] = useState('');

  // Filter subcategories based on selected category
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialData?.categoryId || '');
  const filteredSubCategories = subCategories.filter(sc => sc.categoryId === selectedCategoryId);

  const isEditMode = mode === 'edit';
  const title = isEditMode ? 'Edit Product' : mode === 'duplicate' ? 'Duplicate Product' : 'Add New Product';
  const submitLabel = isEditMode ? 'Save Changes' : 'Create Product';

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeNewImage = (idx: number) => setImages(images.filter((_, i) => i !== idx));
  const removeExistingImage = (url: string) => setExistingImageUrls(existingImageUrls.filter(u => u !== url));

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

      // 1. Upload any NEW images via server-side API (bypasses Supabase RLS)
      let newImageUrls: string[] = [];
      if (images.length > 0) {
        const uploadForm = new FormData();
        images.forEach(file => uploadForm.append('files', file));

        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: uploadForm,
        });
        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.error || 'Image upload failed');
        }
        const uploadData = await uploadRes.json();
        newImageUrls = uploadData.imageUrls;
      }

      // Combine kept existing URLs + newly uploaded URLs
      const allImageUrls = [...existingImageUrls, ...newImageUrls];

      // 2. Format Specifications into a JSON object
      const formattedSpecs = specs.reduce((acc, curr) => {
        if (curr.key && curr.value) acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);

      const payload = {
        name: formData.get('name'),
        sku: formData.get('sku'),
        serialNumber: formData.get('serialNumber'),
        description: formData.get('description'),
        brandId: isCustomBrand ? null : formData.get('brandId'),
        customBrand: isCustomBrand ? customBrand : null,
        categoryId: formData.get('categoryId') || null,
        subCategoryId: formData.get('subCategoryId') || null,
        retailPrice: Number(formData.get('retailPrice')) || null,
        wholesalePrice: Number(formData.get('wholesalePrice')) || null,
        stockLevel: Number(formData.get('stockLevel')) || 0,
        imageUrls: allImageUrls,
        specifications: formattedSpecs,
      };

      // 3. POST or PUT depending on mode
      const url = isEditMode ? `/api/products/${initialData?.id}` : '/api/products';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to save product');
      }

      router.refresh();
      onClose();
    } catch (error: any) {
      console.error('Error saving product:', error);
      alert(error.message || 'Failed to save product. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#0A1F14] border border-brand-green/30 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl max-h-[95vh] overflow-y-auto shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-[#0A1F14]/95 backdrop-blur-md border-b border-white/10 p-4 sm:p-6 flex justify-between items-center z-10">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white">{title}</h2>
            {mode === 'duplicate' && <p className="text-xs text-brand-gold font-mono mt-0.5">Duplicated — update the SKU before saving</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-1">
            <XMarkIcon className="w-7 h-7" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
          
          {/* SECTION 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Product Name</label>
              <input name="name" defaultValue={initialData?.name} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none transition-colors" placeholder="e.g., Singer Drain Motor (XPQ-6)" />
            </div>
            <div>
              <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">
                SKU {mode === 'duplicate' && <span className="text-red-400 normal-case tracking-normal font-normal ml-1">(must be unique)</span>}
              </label>
              <input name="sku" defaultValue={mode === 'duplicate' ? '' : initialData?.sku} className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors ${mode === 'duplicate' ? 'border-red-400/50 focus:border-red-400' : 'border-white/10 focus:border-brand-green'}`} placeholder="e.g., WM-SNG-001" />
            </div>
            <div>
              <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Serial Number (Part No.)</label>
              <input name="serialNumber" defaultValue={initialData?.serialNumber || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none transition-colors" placeholder="e.g., XPQ-6" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest">Brand</label>
                <button type="button" onClick={() => setIsCustomBrand(!isCustomBrand)} className="text-[10px] font-bold text-brand-green uppercase tracking-wider hover:text-white transition-colors">
                  {isCustomBrand ? 'Select Existing' : '+ Add Custom Brand'}
                </button>
              </div>
              {isCustomBrand ? (
                <input type="text" value={customBrand} onChange={(e) => setCustomBrand(e.target.value)} className="w-full bg-white/5 border border-brand-green/50 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none" placeholder="Enter new brand name..." />
              ) : (
                <select name="brandId" defaultValue={initialData?.brandId || ''} className="w-full bg-[#112A1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none">
                  <option value="">Select a Brand</option>
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              )}
            </div>
          </div>

          <div>
            <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Description</label>
            <textarea name="description" rows={3} defaultValue={initialData?.description || ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none transition-colors" placeholder="Detailed description of the part..." />
          </div>

          {/* SECTION 2: Categorization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Category</label>
              <select name="categoryId" value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} className="w-full bg-[#112A1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none">
                <option value="">Select Category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Sub-Category</label>
              <select name="subCategoryId" defaultValue={initialData?.subCategoryId || ''} disabled={!selectedCategoryId} className="w-full bg-[#112A1F] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none disabled:opacity-50">
                <option value="">Select Sub-Category</option>
                {filteredSubCategories.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
              </select>
            </div>
          </div>

          {/* SECTION 3: Pricing & Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Retail Price</label>
              <input type="number" name="retailPrice" defaultValue={initialData?.retailPrice ?? ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none" placeholder="Rs." />
            </div>
            <div>
              <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Wholesale Price</label>
              <input type="number" name="wholesalePrice" defaultValue={initialData?.wholesalePrice ?? ''} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none" placeholder="Rs." />
            </div>
            <div>
              <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest mb-2">Stock</label>
              <input type="number" name="stockLevel" defaultValue={initialData?.stockLevel ?? 0} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-green focus:outline-none" />
            </div>
          </div>

          {/* SECTION 4: Specifications */}
          <div className="p-4 sm:p-6 bg-brand-green/10 rounded-2xl border border-brand-green/20">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-brand-gold text-xs font-bold uppercase tracking-widest">Technical Specs</label>
              <button type="button" onClick={addSpecField} className="text-xs font-bold text-brand-green bg-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-brand-green hover:text-white transition-colors">
                <PlusIcon className="w-4 h-4" /> Add Spec
              </button>
            </div>
            <div className="space-y-3">
              {specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2 sm:gap-4">
                  <input placeholder="Key" value={spec.key} onChange={(e) => updateSpec(idx, 'key', e.target.value)} className="w-1/3 bg-[#112A1F] border border-white/10 rounded-xl px-3 py-2 text-white text-sm" />
                  <input placeholder="Value" value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} className="bg-[#112A1F] border border-white/10 rounded-xl px-3 py-2 text-white text-sm flex-grow" />
                  <button type="button" onClick={() => removeSpec(idx)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 5: Images */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-white/20 rounded-2xl p-6 text-center hover:border-brand-green/50 transition-colors bg-white/5 relative">
              <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
              <PhotoIcon className="w-10 h-10 text-brand-gold mx-auto mb-3" />
              <p className="text-white font-bold text-sm">Click or drag images to upload</p>
              <p className="text-white/40 text-xs mt-1">JPG, PNG, WEBP — Multiple allowed</p>
            </div>

            {/* All images grid */}
            {(existingImageUrls.length > 0 || images.length > 0) && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {existingImageUrls.map((url, idx) => (
                  <div key={`existing-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-white/10">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeExistingImage(url)} className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {images.map((file, idx) => (
                  <div key={`new-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden border border-brand-green/40">
                    <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-brand-green/80 text-white text-[8px] font-bold text-center py-0.5">NEW</div>
                    <button type="button" onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 bg-red-500/80 text-white p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-white hover:bg-white/10 transition-colors order-2 sm:order-1">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-brand-green text-white px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-green-light hover:shadow-[0_0_20px_rgba(45,106,79,0.4)] transition-all disabled:opacity-50 order-1 sm:order-2">
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}