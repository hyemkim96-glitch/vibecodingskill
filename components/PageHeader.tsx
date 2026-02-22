import styles from './PageHeader.module.css';

interface PageHeaderProps {
    title: string;
    description: string;
    badge?: string;
}

export default function PageHeader({ title, description, badge }: PageHeaderProps) {
    return (
        <section className={styles.header}>
            <div className={styles.titleRow}>
                <h1 className={styles.title}>{title}</h1>
                {badge && <span className={styles.badge}>{badge}</span>}
            </div>
            <p className={styles.description}>{description}</p>
        </section>
    );
}
