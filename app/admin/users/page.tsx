import prisma from '@/lib/prisma';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import AdminSearch from '../components/AdminSearch';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  
  const users = await prisma.user.findMany({
    where: q ? {
      OR: [
        { email: { contains: q, mode: 'insensitive' } },
        { businessName: { contains: q, mode: 'insensitive' } }
      ]
    } : undefined,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-fade-up">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 backdrop-blur-xl bg-black/40 p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tight">Customers & B2B</h1>
          <p className="text-white/60 mt-1 font-medium font-mono tracking-wide text-sm uppercase">Manage user accounts, wholesale approvals, and permissions.</p>
        </div>
        <div className="relative z-10 w-full sm:w-64">
          <AdminSearch placeholder="Search by email or business..." />
        </div>
      </header>

      <div className="bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#112A1F]/30 border-b border-white/10">
                <th className="p-5 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">User</th>
                <th className="p-5 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Contact Info</th>
                <th className="p-5 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">Role</th>
                <th className="p-5 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono">B2B Status</th>
                <th className="p-5 text-xs font-bold text-brand-gold uppercase tracking-widest font-mono text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-white/40 font-mono tracking-widest text-sm uppercase">
                    {q ? 'No users matched your search.' : 'No users found.'}
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const isPendingWholesale = user.role === 'CUSTOMER' && user.businessRegistrationUrl;
                  
                  return (
                    <tr key={user.id} className="hover:bg-brand-green/10 transition-colors bg-white/[0.02]">
                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#112A1F] rounded-full flex items-center justify-center text-white/40 border border-white/10 shadow-inner">
                            <UserCircleIcon className="w-6 h-6" />
                          </div>
                          <div>
                            <span className="font-bold text-white tracking-wide block">{user.businessName || 'Individual Customer'}</span>
                            <span className="text-xs text-white/40 font-mono">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-5">
                        <div className="text-sm font-medium text-white/80 font-mono">{user.email}</div>
                        <div className="text-xs text-white/40 font-mono">{user.phone || 'No phone provided'}</div>
                      </td>
                      <td className="p-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                          user.role === 'WHOLESALER' ? 'bg-brand-gold/20 text-brand-gold border border-brand-gold/30' : 
                          'bg-white/5 text-white/60 border border-white/10'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-5">
                        {isPendingWholesale ? (
                          <span className="flex items-center gap-2 text-brand-gold font-bold text-xs font-mono tracking-widest uppercase">
                            <span className="w-2 h-2 rounded-full bg-brand-gold shadow-[0_0_10px_#C8963E] animate-pulse" />
                            Review
                          </span>
                        ) : user.role === 'WHOLESALER' ? (
                          <span className="text-brand-green font-bold text-xs font-mono tracking-widest uppercase">Approved</span>
                        ) : (
                          <span className="text-white/20 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-5 text-right">
                        <button className="text-brand-green font-bold text-sm hover:text-brand-gold transition-colors font-mono tracking-widest uppercase">Manage</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
