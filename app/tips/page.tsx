import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/PageHeader';
import TipsClient from './TipsClient';
import { IArticle } from '@/types/article';

export default async function TipsPage() {
    const supabase = await createClient();
    const { data: articles, error } = await supabase
        .from('articles')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching articles:', error);
    }

    const guides = articles?.filter((a: IArticle) => a.category === 'guide') ?? [];
    const tools = articles?.filter((a: IArticle) => a.category === 'tool') ?? [];

    return (
        <div>
            <PageHeader
                title="바이브 코딩 꿀팁"
                description="AI와 함께 더 똑똑하게 빌드하는 방법. 비개발자를 위한 실전 가이드와 도구를 만나보세요."
            />
            <TipsClient guides={guides} tools={tools} />
        </div>
    );
}
