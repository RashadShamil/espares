import prisma from '@/lib/prisma';
import { ShieldExclamationIcon, CheckCircleIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic'; 

export default async function AdminDashboard() {
  const [productCount, totalUsers, pendingWholesalers] = await Promise.all([
    prisma.product.count(),
    prisma.user.count(),
    prisma.user.findMany({
      where: { 
        role: 'CUSTOMER',
        businessRegistrationUrl: { not: null }
      },
      orderBy: { createdAt: 'desc' }
    })
  ]);

  return (
    <div className="space-y-8 animate-fade-up">
      
      {/* HEADER */}
      <header className="flex justify-between items-end backdrop-blur-xl bg-black/40 p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-white tracking-tight">Overview</h1>
          <p className="text-white/60 mt-1 font-medium font-mono tracking-wide text-sm uppercase">Welcome to the Command Center. System parameters are nominal.</p>
        </div>
        <div className="relative z-10 text-xs font-black tracking-widest text-brand-green bg-brand-green/10 px-4 py-2.5 rounded-xl border border-brand-green/30 flex items-center gap-2.5 shadow-[0_0_15px_rgba(45,106,79,0.2)]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-green shadow-green-glow"></span>
          </span>
          SYSTEM ONLINE
        </div>
      </header>

      {/* STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#112A1F]/60 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10 flex flex-col justify-between h-36 hover:border-brand-green/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand-green/10 rounded-full blur-2xl group-hover:bg-brand-green/20 transition-colors" />
          <p className="text-white/50 font-bold text-xs uppercase tracking-[0.2em] font-mono">Total Products</p>
          <p className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{productCount}</p>
        </div>
        
        <div className="bg-[#112A1F]/60 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/10 flex flex-col justify-between h-36 hover:border-brand-green/50 transition-all duration-300 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand-green/10 rounded-full blur-2xl group-hover:bg-brand-green/20 transition-colors" />
          <p className="text-white/50 font-bold text-xs uppercase tracking-[0.2em] font-mono">Active Users</p>
          <p className="text-5xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{totalUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-[#2a2211] to-[#1a1408] p-6 rounded-3xl shadow-[0_0_30px_rgba(200,150,62,0.15)] border border-brand-gold/30 flex flex-col justify-between h-36 relative overflow-hidden group hover:border-brand-gold/60 transition-all">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-brand-gold/10 rounded-full blur-2xl group-hover:bg-brand-gold/20 transition-colors" />
          <div className="relative z-10 flex justify-between items-start">
            <p className="text-brand-gold font-bold text-xs uppercase tracking-[0.2em] font-mono">Pending B2B</p>
            {pendingWholesalers.length > 0 && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-brand-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-gold shadow-[0_0_10px_#C8963E]"></span>
              </span>
            )}
          </div>
          <p className="text-5xl font-black text-white relative z-10">{pendingWholesalers.length}</p>
        </div>
      </div>

      {/* ACTION REQUIRED: WHOLESALE VERIFICATION VAULT */}
      <div className="bg-black/40 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden relative">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent opacity-80" />
        
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#112A1F]/30">
          <h2 className="text-lg font-black text-white flex items-center gap-3">
            <ShieldExclamationIcon className="h-6 w-6 text-brand-gold drop-shadow-[0_0_8px_rgba(200,150,62,0.5)]" />
            Wholesale Verification Vault
          </h2>
        </div>

        <div className="p-6 min-h-[300px]">
          {pendingWholesalers.length === 0 ? (
            <div className="text-center h-full flex flex-col items-center justify-center pt-8">
              <div className="w-20 h-20 bg-brand-green/10 rounded-full flex items-center justify-center mb-6 border border-brand-green/20 shadow-[0_0_30px_rgba(45,106,79,0.15)] relative">
                <div className="absolute inset-0 rounded-full animate-ping bg-brand-green/10" style={{ animationDuration: '3s' }} />
                <CheckCircleIcon className="h-10 w-10 text-brand-green drop-shadow-sm" />
              </div>
              <p className="text-white/60 font-mono tracking-widest text-sm uppercase">All caught up! No pending verifications.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingWholesalers.map((user) => (
                <div key={user.id} className="group flex flex-col md:flex-row md:items-center justify-between p-5 border border-white/10 rounded-2xl hover:border-brand-gold/40 hover:shadow-[0_4px_20px_rgba(200,150,62,0.1)] hover:bg-brand-gold/5 transition-all bg-black/20">
                  <div className="flex items-center gap-5 mb-4 md:mb-0">
                    <div className="w-14 h-14 bg-[#112A1F] rounded-xl border border-white/10 flex items-center justify-center text-white/50 group-hover:text-brand-gold group-hover:border-brand-gold/30 transition-colors shadow-inner">
                      <DocumentTextIcon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="font-black text-white text-lg tracking-wide">{user.businessName || 'Unnamed Business'}</p>
                      <p className="text-sm font-medium text-white/50 font-mono">{user.email}</p>
                    </div>
                  </div>
                  <button className="bg-brand-gold/10 text-brand-gold px-8 py-3 rounded-xl font-bold text-sm hover:bg-brand-gold hover:text-black transition-all hover:shadow-[0_0_15px_rgba(200,150,62,0.4)] border border-brand-gold/30 w-full md:w-auto text-center tracking-wider">
                    REVIEW DOCUMENTS
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}