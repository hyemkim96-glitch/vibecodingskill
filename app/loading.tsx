import { SkillCardSkeleton } from '@/components/ui/CardSkeletons';
import PageHeader from '@/components/PageHeader';

export default function Loading() {
    return (
        <div>
            <PageHeader
                title="스킬셋 라이브러리"
                description="비개발자도 바로 사용할 수 있는 AI 코딩 스킬셋을 탐색하세요."
            />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--spacing-6)' }}>
                {[...Array(6)].map((_, i) => (
                    <SkillCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
