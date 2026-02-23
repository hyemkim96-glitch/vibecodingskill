'use client';

import { useState } from 'react';
import { ExternalLink, Clock, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { IArticle } from '@/types/article';
import styles from './Tips.module.css';

export default function TipsClient({ guides, tools }: { guides: IArticle[]; tools: IArticle[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = guides.filter(g =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (g.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className={styles.contentLayout}>
            <main className={styles.articleList}>
                <div className={styles.searchBar}>
                    <input
                        type="text"
                        className={styles.searchInput}
                        placeholder="가이드 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className={styles.count}>{filtered.length} Articles</span>
                </div>

                {filtered.length > 0 ? filtered.map((guide) => (
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
                )) : (
                    <div className={styles.empty}>검색 결과가 없습니다.</div>
                )}
            </main>

            <aside className={styles.sidebar}>
                <div className={styles.sidebarSection}>
                    <h3>AI Coding Tools</h3>
                    <div className={styles.toolList}>
                        {tools.map((tool) => (
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
    );
}
