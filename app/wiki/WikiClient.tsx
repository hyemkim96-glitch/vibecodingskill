'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { IWikiTerm } from '@/types/wiki';
import styles from './Wiki.module.css';

type SortOrder = 'default' | 'abc' | 'korean';

export default function WikiClient({ terms }: { terms: IWikiTerm[] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<SortOrder>('default');

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

    const sorted = [...filtered].sort((a, b) => {
        if (sortOrder === 'abc') return a.term.localeCompare(b.term, 'en', { sensitivity: 'base' });
        if (sortOrder === 'korean') return a.term.localeCompare(b.term, 'ko', { sensitivity: 'base' });
        return 0;
    });

    const sortOptions: { label: string; value: SortOrder }[] = [
        { label: '기본', value: 'default' },
        { label: 'ABC', value: 'abc' },
        { label: '가나다', value: 'korean' },
    ];

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
                <div className={styles.sortGroup}>
                    {sortOptions.map(opt => (
                        <button
                            key={opt.value}
                            className={`${styles.sortBtn} ${sortOrder === opt.value ? styles.sortBtnActive : ''}`}
                            onClick={() => setSortOrder(opt.value)}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
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

            {sorted.length > 0 ? (
                <div className={styles.termList}>
                    {sorted.map(term => (
                        <div key={term.id} className={styles.termCard}>
                            {term.category && (
                                <span className={styles.categoryBadge}>{term.category}</span>
                            )}
                            <div className={styles.termHeader}>
                                <h2 className={styles.termName}>{term.term}</h2>
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
