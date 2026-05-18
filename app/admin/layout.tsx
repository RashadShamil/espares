import AdminSidebar from './components/AdminSidebar';
import ParallaxBackground from '@/components/ParallaxBackground';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Redirect unauthenticated users to login
    if (!user) {
        redirect('/login');
    }

    // Optional: restrict to admin email/role — uncomment and customise as needed
    // const ADMIN_EMAILS = ['admin@espares.lk'];
    // if (!ADMIN_EMAILS.includes(user.email ?? '')) redirect('/');

    return (
        <div className="min-h-screen bg-[#0A1A12] flex selection:bg-brand-green/30 text-white overflow-hidden relative">
            
            {/* The Background */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ParallaxBackground />
                {/* Dark Vignette / Overlay to make it suitable for a tech dashboard */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0A1A12]/95 via-[#112A1F]/80 to-[#0A1A12]/95 mix-blend-multiply" />
                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay" />
            </div>

            {/* Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen relative z-10 overflow-y-auto pt-16 md:pt-0">
                {/* Content Container */}
                <div className="relative p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}