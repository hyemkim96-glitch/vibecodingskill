import { ExternalLink, Clock, BookOpen } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/PageHeader';
import styles from './Tips.module.css';
import { IArticle } from '@/types/article';
import Link from 'next/link';

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

            <div className={styles.contentLayout}>
                <main className={styles.articleList}>
                    <div className={styles.sectionHeader}>
                        <h2>핵심 가이드</h2>
                        <span className={styles.count}>{guides.length} Articles</span>
                    </div>
                    {guides.map((guide: IArticle) => (
                        <Link key={guide.id} href={`/tips/${guide.id}`} className={styles.articleCard}>
                            <div
                                className={styles.thumbnail}
                                style={{ background: guide.color || 'var(--color-bg-secondary)' }}
                            >
                                <BookOpen size={32} color="white" />
                            </div>
                            <div className={styles.articleInfo}>
                                <div className={styles.meta}>
                                    <span className={styles.category}>{guide.category}</span>
                                    <span className={styles.dot}>•</span>
                                    <span className={styles.readTime}>
                                        <Clock size={12} /> {guide.read_time} min
                                    </span>
                                </div>
                                <h3 className={styles.articleTitle}>{guide.title}</h3>
                                <p className={styles.articleDesc}>{guide.description}</p>
                            </div>
                        </Link>
                    ))}
                </main>

                <aside className={styles.sidebar}>
                    <div className={styles.sidebarSection}>
                        <h3>AI Coding Tools</h3>
                        <div className={styles.toolList}>
                            {tools.map((tool: IArticle) => (
                                <a
                                    key={tool.id}
                                    href={tool.url || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.toolLink}
                                >
                                    <div className={styles.toolTitle}>
                                        <strong>{tool.title}</strong>
                                        <ExternalLink size={14} />
                                    </div>
                                    <p>{tool.description}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
