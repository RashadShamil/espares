'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/lib/types';


interface AuthContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        let isMounted = true;

        const fetchUserAndProfile = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            const currentUser = session?.user || null;
            
            if (isMounted) setUser(currentUser);

            if (currentUser) {
                const { data } = await supabase
                    .from('User')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();
                if (isMounted && data) setProfile(data as unknown as UserProfile);
            } else {
                if (isMounted) setProfile(null);
            }

            if (isMounted) setLoading(false);
        };

        fetchUserAndProfile();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            const currentUser = session?.user || null;
            if (isMounted) setUser(currentUser);

            if (currentUser) {
                const { data } = await supabase
                    .from('User')
                    .select('*')
                    .eq('id', currentUser.id)
                    .single();
                if (isMounted && data) setProfile(data as unknown as UserProfile);
            } else {
                if (isMounted) setProfile(null);
            }
        });

        return () => {
            isMounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
