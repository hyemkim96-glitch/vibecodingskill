'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandToken } from '@/types/token';
import styles from './TokensIndex.module.css';

const CATEGORIES = ['ALL', '핀테크/금융', '플랫폼', '커머스', '개발자 도구', '디자인 강자'];

export default function TokensIndexClient({ tokens }: { tokens: BrandToken[] }) {
    const [activeFilter, setActiveFilter] = useState('ALL');

    const filtered = activeFilter === 'ALL'
        ? tokens
        : tokens.filter((t) => t.category === activeFilter);

    const korean = filtered.filter((t) => t.country === 'KR');
    const global = filtered.filter((t) => t.country === 'GLOBAL');

    return (
        <div className={styles.page}>
            {/* Filter bar */}
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

            {korean.length > 0 && (
                <section className={styles.section}>
                    <p className={styles.sectionLabel}>KOREAN BRANDS</p>
                    <div className={styles.grid}>
                        {korean.map((token, i) => (
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
                                        K {String(i + 1).padStart(3, '0')}
                                    </span>
                                    <span className={styles.cardName}>
                                        {token.name.toUpperCase()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {global.length > 0 && (
                <section className={styles.section}>
                    <p className={styles.sectionLabel}>GLOBAL BRANDS</p>
                    <div className={styles.grid}>
                        {global.map((token, i) => (
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
                                        G {String(i + 1).padStart(3, '0')}
                                    </span>
                                    <span className={styles.cardName}>
                                        {token.name.toUpperCase()}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {filtered.length === 0 && (
                <div className={styles.empty}>COMING SOON</div>
            )}
        </div>
    );
}
