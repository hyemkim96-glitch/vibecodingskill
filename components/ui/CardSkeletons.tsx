import Skeleton from './Skeleton'
import styles from './Skeleton.module.css'

export function SkillCardSkeleton() {
    return (
        <div style={{ border: 'var(--border-style)', padding: 'var(--spacing-6)' }}>
            <Skeleton height="24px" width="60%" className={styles.margin} />
            <Skeleton height="16px" width="40%" className={styles.margin} />
            <div style={{ margin: 'var(--spacing-6) 0' }}>
                <Skeleton height="80px" />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <Skeleton height="24px" width="60px" />
                <Skeleton height="24px" width="60px" />
            </div>
        </div>
    )
}

export function PRDCardSkeleton() {
    return (
        <div style={{ border: 'var(--border-style)', padding: 'var(--spacing-4)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
                <Skeleton height="18px" width="50%" className={styles.margin} />
                <Skeleton height="12px" width="30%" />
            </div>
            <Skeleton height="36px" width="64px" />
        </div>
    )
}
