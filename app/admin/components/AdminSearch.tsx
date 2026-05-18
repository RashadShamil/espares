'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AdminSearch({ placeholder = 'Search...' }: { placeholder?: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [term, setTerm] = useState(searchParams?.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams?.toString() || '');
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative group flex items-center">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-4 w-4 text-white/40 group-focus-within:text-brand-gold transition-colors" />
      </div>
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="block w-full pl-10 pr-4 py-2 border border-white/10 rounded-xl leading-5 bg-black/40 text-white placeholder-white/30 focus:outline-none focus:bg-black/60 focus:ring-1 focus:ring-brand-gold focus:border-brand-gold sm:text-sm transition-all"
      />
      <button type="submit" className="hidden">Search</button>
    </form>
  );
}
