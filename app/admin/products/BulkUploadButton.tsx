'use client';
import { useState } from 'react';
import { DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import BulkUploadModal from './BulkUploadModal';

export default function BulkUploadButton() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button onClick={() => setIsOpen(true)} className="bg-white/10 text-white px-5 py-2 h-[42px] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/20 transition-all border border-white/10">
                <DocumentArrowUpIcon className="w-5 h-5" /> CSV Upload
            </button>
            {isOpen && <BulkUploadModal onClose={() => setIsOpen(false)} />}
        </>
    );
}