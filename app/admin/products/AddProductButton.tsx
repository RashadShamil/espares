'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { PlusIcon } from '@heroicons/react/24/outline';
import AddProductModal from './AddProductModal';

export default function AddProductButton({ brands, categories, subCategories }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-brand-green text-white px-5 py-2 h-[42px] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-green-light hover:shadow-[0_0_15px_rgba(45,106,79,0.5)] transition-all w-full sm:w-auto whitespace-nowrap border border-brand-green/50"
            >
                <PlusIcon className="w-5 h-5" />
                Add Product
            </button>

            {isOpen && mounted && createPortal(
                <AddProductModal
                    brands={brands}
                    categories={categories}
                    subCategories={subCategories}
                    onClose={() => setIsOpen(false)}
                />,
                document.body
            )}
        </>
    );
}