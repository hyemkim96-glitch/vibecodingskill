import { PRDCardSkeleton } from '@/components/ui/CardSkeletons';
import Skeleton from '@/components/ui/Skeleton';

export default function Loading() {
    return (
        <div style={{ padding: 'var(--spacing-8)', maxWidth: '800px', margin: '0 auto' }}>
            <header style={{ marginBottom: 'var(--spacing-12)' }}>
                <div style={{ display: 'flex', gap: 'var(--spacing-6)', alignItems: 'center' }}>
                    <Skeleton width="80px" height="80px" />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="200px" height="32px" />
                        <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <Skeleton width="60px" height="24px" />
                            <Skeleton width="100px" height="24px" />
                        </div>
                    </div>
                </div>
            </header>

            <section>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px' }}>
                    <Skeleton width="24px" height="24px" />
                    <Skeleton width="150px" height="24px" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    {[...Array(3)].map((_, i) => (
                        <PRDCardSkeleton key={i} />
                    ))}
                </div>
            </section>
        </div>
    );
}
