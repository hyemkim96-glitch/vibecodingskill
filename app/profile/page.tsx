import { createClient } from '@/lib/supabase/server';
import Profile from '@/components/Profile';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    // Fetch profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    // Fetch PRD history
    const { data: prds } = await supabase
        .from('prds')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    return <Profile user={user} profile={profile} prds={prds || []} />;
}
