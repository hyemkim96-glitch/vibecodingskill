import { createClient } from '@/lib/supabase/server';
import SkillLibrary from '@/components/SkillLibrary';
import PageHeader from '@/components/PageHeader';

export default async function SkillsPage() {
  const supabase = await createClient();

  const [{ data: skills, error }, { data: tipArticles }] = await Promise.all([
    supabase
      .from('skills')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false }),
    supabase
      .from('articles')
      .select('id, title, description, color, read_time')
      .eq('published', true)
      .eq('featured', true)
      .order('created_at', { ascending: true })
      .limit(4),
  ]);

  if (error) {
    console.error('Error fetching skills:', error);
  }

  return (
    <div>
      <PageHeader
        title="스킬셋 라이브러리"
        description="비개발자도 바로 사용할 수 있는 AI 코딩 스킬셋을 탐색하세요."
      />
      <SkillLibrary initialSkills={skills || []} tipArticles={tipArticles || []} />
    </div>
  );
}
