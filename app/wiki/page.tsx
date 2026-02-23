import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/PageHeader';
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
            <PageHeader
                title="바이브 코딩 위키"
                description="AI 코딩에서 자주 쓰이는 용어를 쉽게 설명합니다."
            />
            <WikiClient terms={terms as IWikiTerm[] || []} />
        </div>
    );
}
