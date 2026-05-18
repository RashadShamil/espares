'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    HomeIcon,
    UsersIcon,
    ArchiveBoxIcon,
    ClipboardDocumentListIcon,
    ArrowLeftStartOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: HomeIcon },
    { name: 'Inventory & Products', href: '/admin/products', icon: ArchiveBoxIcon },
    { name: 'Customers & B2B', href: '/admin/users', icon: UsersIcon },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    const NavContent = () => (
        <>
            {/* Header */}
            <div className="p-6 border-b border-white/5 bg-black/20 flex items-center justify-between">
                <div>
                    <Image
                        src="/logo.png"
                        alt="eSpares"
                        width={140}
                        height={52}
                        className="object-contain"
                    />
                    <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-[0.2em] font-bold">Command Center</p>
                </div>
                {/* Close button on mobile */}
                <button onClick={() => setMobileOpen(false)} className="md:hidden text-gray-400 hover:text-white p-1">
                    <XMarkIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1.5 mt-2">
                {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                                isActive
                                    ? 'bg-brand-green/10 text-brand-yellow border border-brand-yellow/20 shadow-[0_0_15px_rgba(200,150,62,0.1)]'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                            }`}
                        >
                            <Icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-brand-yellow' : 'text-gray-500'}`} />
                            <span className="truncate">{link.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-white/5 bg-black/20">
                <Link href="/" className="flex items-center gap-3 px-4 py-3 hover:bg-red-500/10 text-red-400/70 hover:text-red-400 rounded-xl font-medium transition-colors border border-transparent hover:border-red-500/20">
                    <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
                    Exit Admin
                </Link>
            </div>
        </>
    );

    return (
        <>
            {/* ── Desktop sidebar ── */}
            <aside className="w-64 bg-black/60 backdrop-blur-3xl border-r border-white/10 text-gray-300 flex-col hidden md:flex fixed h-full shadow-2xl z-20">
                <NavContent />
            </aside>

            {/* ── Mobile top bar ── */}
            <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="eSpares"
                        width={110}
                        height={36}
                        className="object-contain"
                    />
                </div>
                <button onClick={() => setMobileOpen(true)} className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <Bars3Icon className="w-6 h-6" />
                </button>
            </div>

            {/* ── Mobile drawer overlay ── */}
            {mobileOpen && (
                <div className="md:hidden fixed inset-0 z-40 flex">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    {/* Drawer */}
                    <aside className="relative w-72 max-w-[85vw] bg-black/90 backdrop-blur-3xl border-r border-white/10 text-gray-300 flex flex-col h-full shadow-2xl z-50">
                        <NavContent />
                    </aside>
                </div>
            )}
        </>
    );
}
