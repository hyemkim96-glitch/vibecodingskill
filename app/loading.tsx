import { SkillCardSkeleton } from '@/components/ui/CardSkeletons';

export default function Loading() {
    return (
        <div>
            <div style={{ marginBottom: 'var(--spacing-8)' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700 }}>스킬셋 라이브러리</h1>
                <p style={{ color: 'var(--color-ash)', marginTop: 'var(--spacing-2)' }}>
                    비개발자도 바로 사용할 수 있는 AI 코딩 스킬셋을 탐색하세요.
                </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--spacing-6)' }}>
                {[...Array(6)].map((_, i) => (
                    <SkillCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
