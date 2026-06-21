'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandToken } from '@/types/token';
import styles from './TokensIndex.module.css';

const CATEGORIES = ['전체', '핀테크/금융', '플랫폼', '커머스', '개발자 도구', '디자인 강자'];

export default function TokensIndexClient({ tokens }: { tokens: BrandToken[] }) {
    const [activeFilter, setActiveFilter] = useState('전체');

    const filtered = activeFilter === '전체'
        ? tokens
        : tokens.filter((t) => t.category === activeFilter);

    return (
        <div className={styles.page}>
            {/* 필터 바 */}
            <div className={styles.filterBar}>
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        className={`${styles.chip} ${activeFilter === cat ? styles.chipActive : ''}`}
                        onClick={() => setActiveFilter(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {filtered.length > 0 && (
                <section className={styles.section}>
                    <div className={styles.grid}>
                        {filtered.map((token, i) => (
                            <Link key={token.slug} href={`/tokens/${token.slug}`} className={styles.card}>
                                <div className={styles.colorPreview}>
                                    {token.colors.slice(0, 6).map((c) => (
                                        <div
                                            key={c.variable}
                                            className={styles.colorStripe}
                                            style={{ background: c.value }}
                                        />
                                    ))}
                                </div>
                                <div className={styles.cardFooter}>
                                    <span className={styles.cardIndex}>
                                        {String(i + 1).padStart(3, '0')}
                                    </span>
                                    <span className={styles.cardName}>
                                        {token.nameKo ?? token.name}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {filtered.length === 0 && (
                <div className={styles.empty}>준비 중</div>
            )}
        </div>
    );
}
