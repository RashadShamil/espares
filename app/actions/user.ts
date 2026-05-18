'use server';

import prisma from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

// Gets the profile of the currently authenticated user only.
// The userId is never accepted from the caller — it always comes from the session.
export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: user.id },
    });
    return profile;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}
