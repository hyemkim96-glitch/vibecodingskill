'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { IWikiTerm } from '@/types/wiki';
import styles from './Wiki.module.css';

export default function WikiClient({ terms }: { terms: IWikiTerm[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const allCategories = Array.from(
        new Set(terms.map(t => t.category).filter(Boolean))
    ).sort() as string[];

    const filtered = terms.filter(t => {
        const matchesSearch =
            t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.definition.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? t.category === selectedCategory : true;
        return matchesSearch && matchesCategory;
    });

    return (
        <div>
            <div className={styles.toolbar}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="용어 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {allCategories.length > 0 && (
                <div className={styles.categoryFilter}>
                    <button
                        className={`${styles.chip} ${selectedCategory === null ? styles.chipActive : ''}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        전체
                    </button>
                    {allCategories.map(cat => (
                        <button
                            key={cat}
                            className={`${styles.chip} ${selectedCategory === cat ? styles.chipActive : ''}`}
                            onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            )}

            {filtered.length > 0 ? (
                <div className={styles.termList}>
                    {filtered.map(term => (
                        <div key={term.id} className={styles.termCard}>
                            <div className={styles.termHeader}>
                                <h2 className={styles.termName}>{term.term}</h2>
                                <div className={styles.termMeta}>
                                    {term.category && (
                                        <span className={styles.categoryBadge}>{term.category}</span>
                                    )}
                                    {term.url && (
                                        <a
                                            href={term.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={styles.termUrl}
                                        >
                                            <ExternalLink size={14} />
                                            바로가기
                                        </a>
                                    )}
                                </div>
                            </div>
                            <p className={styles.definition}>{term.definition}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.empty}>
                    {searchTerm ? '검색 결과가 없습니다.' : '등록된 용어가 없습니다.'}
                </div>
            )}
        </div>
    );
}
