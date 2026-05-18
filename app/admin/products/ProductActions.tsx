'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { PencilSquareIcon, DocumentDuplicateIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import AddProductModal from './AddProductModal';

export default function ProductActions({ product, brands, categories, subCategories }: {
  product: any;
  brands: any[];
  categories: any[];
  subCategories: any[];
}) {
  const router = useRouter();
  const [modalMode, setModalMode] = useState<'edit' | 'duplicate' | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${product.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      router.refresh();
    } catch (e) {
      alert('Failed to delete product.');
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">

        {/* Add Photos — only shown when product has no images */}
        {product.imageUrls?.length === 0 && (
          <button
            onClick={() => setModalMode('edit')}
            title="Add Photos"
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all text-xs font-bold"
          >
            <PhotoIcon className="w-3.5 h-3.5" /> Add Photos
          </button>
        )}

        {/* Edit */}
        <button
          onClick={() => setModalMode('edit')}
          title="Edit"
          className="p-2 rounded-lg text-white/40 hover:text-brand-green hover:bg-brand-green/10 transition-all"
        >
          <PencilSquareIcon className="w-4 h-4" />
        </button>

        {/* Duplicate */}
        <button
          onClick={() => setModalMode('duplicate')}
          title="Duplicate"
          className="p-2 rounded-lg text-white/40 hover:text-brand-gold hover:bg-brand-gold/10 transition-all"
        >
          <DocumentDuplicateIcon className="w-4 h-4" />
        </button>

        {/* Delete */}
        {confirmDelete ? (
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 rounded-lg px-2 py-1">
            <span className="text-red-400 text-xs font-bold font-mono whitespace-nowrap">Sure?</span>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-400 text-xs font-black hover:text-white transition-colors"
            >
              {isDeleting ? '...' : 'YES'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-white/40 text-xs font-bold hover:text-white transition-colors"
            >
              NO
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            title="Delete"
            className="p-2 rounded-lg text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Portaled Modal */}
      {modalMode && createPortal(
        <AddProductModal
          brands={brands}
          categories={categories}
          subCategories={subCategories}
          mode={modalMode}
          initialData={product}
          onClose={() => setModalMode(null)}
        />,
        document.body
      )}
    </>
  );
}
