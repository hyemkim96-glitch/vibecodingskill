import { createClient } from '@/lib/supabase/server';
import WikiClient from './WikiClient';
import { IWikiTerm } from '@/types/wiki';

export default async function WikiPage() {
    const supabase = await createClient();
    const { data: terms, error } = await supabase
        .from('wiki_terms')
        .select('*')
        .eq('published', true)
        .order('term', { ascending: true });

    if (error) {
        console.error('Error fetching wiki terms:', error);
    }

    return (
        <div>
            <WikiClient terms={terms as IWikiTerm[] || []} />
        </div>
    );
}
