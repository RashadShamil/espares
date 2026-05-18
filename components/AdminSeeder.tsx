'use client';

import { seedDatabase } from "@/lib/seed";
import { useState } from "react";

export default function AdminSeeder() {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    await seedDatabase();
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button 
        onClick={handleSeed}
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded-full shadow-xl font-bold text-xs hover:bg-red-700 transition-colors"
      >
        {loading ? "Uploading..." : "⚠️ ADMIN: Seed DB"}
      </button>
    </div>
  );
}