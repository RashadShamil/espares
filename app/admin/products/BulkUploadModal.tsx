'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { XMarkIcon, DocumentArrowUpIcon, ArrowDownTrayIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Papa from 'papaparse';

export default function BulkUploadModal({ onClose }: { onClose: () => void }) {
    const router = useRouter();
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);

    // Required for createPortal — only runs on client
    useEffect(() => {
        setMounted(true);
        // Lock background scroll
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError(null);
        setSuccess(null);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    const response = await fetch('/api/admin/products/bulk', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ products: results.data }),
                    });

                    const json = await response.json();

                    if (!response.ok) throw new Error(json.error || 'Upload failed on server.');

                    if (json.errors && json.errors.length > 0) {
                        // Partial success
                        setSuccess(json.message);
                        setError(`Some rows were skipped:\n${json.errors.join('\n')}`);
                    } else {
                        setSuccess(json.message);
                        router.refresh();
                        // Auto-close after 1.5s on full success
                        setTimeout(onClose, 1500);
                    }
                } catch (err: any) {
                    setError(err.message || 'An error occurred during upload.');
                } finally {
                    setIsUploading(false);
                }
            },
            error: (err) => {
                setError(err.message);
                setIsUploading(false);
            }
        });
    };

    const modal = (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget && !isUploading) onClose(); }}
        >
            <div className="bg-[#0A1F14] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="border-b border-white/10 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white">Bulk CSV Upload</h2>
                        <p className="text-white/50 text-xs mt-0.5 font-mono uppercase tracking-wider">Import multiple products at once</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isUploading}
                        className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-40"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-5">

                    {/* Template download */}
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-amber-400 font-bold text-sm mb-0.5">Need the correct format?</h3>
                            <p className="text-white/50 text-xs">Download the CSV template — fill it in and upload.</p>
                        </div>
                        <a
                            href="/template.csv"
                            download
                            className="shrink-0 bg-amber-500 text-black px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-amber-400 transition-colors"
                        >
                            <ArrowDownTrayIcon className="w-4 h-4" /> Template
                        </a>
                    </div>

                    {/* Success message */}
                    {success && (
                        <div className="bg-brand-green/10 border border-brand-green/30 text-brand-green p-4 rounded-xl text-sm font-semibold flex items-center gap-3">
                            <CheckCircleIcon className="w-5 h-5 shrink-0" />
                            {success}
                        </div>
                    )}

                    {/* Error message */}
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl text-sm font-medium whitespace-pre-line">
                            {error}
                        </div>
                    )}

                    {/* Upload dropzone */}
                    <div className="border-2 border-dashed border-brand-green/40 rounded-2xl p-10 text-center hover:bg-brand-green/5 hover:border-brand-green/70 transition-all relative group">
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            disabled={isUploading}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                        />

                        {isUploading ? (
                            <div>
                                <DocumentArrowUpIcon className="w-14 h-14 text-brand-green mx-auto mb-4 animate-bounce" />
                                <p className="text-brand-green font-bold text-lg">Processing…</p>
                                <p className="text-brand-green/60 text-sm mt-1">Do not close this window.</p>
                            </div>
                        ) : (
                            <>
                                <DocumentArrowUpIcon className="w-14 h-14 text-white/20 mx-auto mb-4 group-hover:text-brand-green transition-colors" />
                                <p className="text-white font-bold text-base mb-1">Drop your CSV here</p>
                                <p className="text-white/40 text-sm">or click to browse</p>
                                <p className="text-white/20 text-xs mt-3 font-mono">Only .csv files · Max ~1,000 rows recommended</p>
                            </>
                        )}
                    </div>

                    {/* Image URL note */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white/50 leading-relaxed space-y-1">
                        <p><span className="text-amber-400 font-semibold">📷 Images via CSV:</span> Add an <span className="font-mono text-white/70">Image URLs</span> column to your CSV.</p>
                        <p>Separate multiple images with a pipe: <span className="font-mono text-brand-green">url1|url2|url3</span></p>
                        <p className="text-white/30">Leave the column empty to skip — existing images won't be overwritten on update.</p>
                    </div>

                </div>
            </div>
        </div>
    );

    // Render into document.body so the admin layout's overflow:hidden doesn't clip it
    return mounted ? createPortal(modal, document.body) : null;
}