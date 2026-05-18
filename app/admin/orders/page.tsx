import prisma from '@/lib/prisma';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import AdminSearch from '../components/AdminSearch';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  
  const orders = await prisma.order.findMany({
    where: q ? {
      id: { contains: q, mode: 'insensitive' }
    } : undefined,
    include: { user: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 backdrop-blur-xl bg-black/40 p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tight">Orders</h1>
          <p className="text-white/60 mt-1 font-medium font-mono tracking-wide text-sm uppercase">Track and manage customer and wholesale orders.</p>
        </div>
        <div className="relative z-10 w-full sm:w-64">
          <AdminSearch placeholder="Search by Order ID..." />
        </div>
      </header>

      <div className="bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#112A1F]/30 border-b border-white/10">
                <th className="p-5 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Order ID</th>
                <th className="p-5 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Customer</th>
                <th className="p-5 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Date</th>
                <th className="p-5 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-16 text-center">
                    <div className="w-16 h-16 bg-[#112A1F] rounded-full flex items-center justify-center text-white/20 mx-auto mb-4 border border-white/10 shadow-inner">
                      <ShoppingBagIcon className="w-8 h-8" />
                    </div>
                    <p className="text-white/40 font-mono tracking-widest text-sm uppercase">
                      {q ? 'No orders matched your search.' : 'No orders found.'}
                    </p>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-brand-green/10 transition-colors bg-white/[0.02]">
                    <td className="p-5 font-mono text-sm font-bold text-white tracking-wider">{order.id}</td>
                    <td className="p-5 font-medium text-white/60 font-mono text-sm">{order.user?.email || 'Guest'}</td>
                    <td className="p-5 text-sm text-brand-gold font-mono">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="p-5 text-right">
                      <button className="text-brand-green font-bold text-sm hover:text-brand-gold transition-colors font-mono tracking-widest uppercase">View Details</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
