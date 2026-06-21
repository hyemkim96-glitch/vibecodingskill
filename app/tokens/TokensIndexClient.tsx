'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandToken } from '@/types/token';
import styles from './TokensIndex.module.css';

const CATEGORIES = ['전체', '핀테크/금융', '플랫폼', '커머스', '개발자 도구', '디자인 강자'];

/** 브랜드 컬러에서 Gray/White/Black 계열 제외 후 유채색만 반환 */
function getBrandColors(colors: BrandToken['colors']) {
    const neutral = /gray|white|black|grey/i;
    const vivid = colors.filter(c => !neutral.test(c.name));
    return vivid.length > 0 ? vivid : colors;
}

/** 브랜드 primary 컬러 — role에 Primary 명시된 색 우선 */
function getPrimaryColor(colors: BrandToken['colors']) {
    const explicit = colors.find(c => /primary/i.test(c.role));
    return explicit?.value ?? getBrandColors(colors)[0]?.value ?? '#888';
}

/** primary 위에 올라갈 텍스트 색상 (명도 판단) */
function getContrastColor(hex: string): string {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.55 ? '#111111' : '#ffffff';
}

/** 브랜드 카드 미니 UI 미리보기 */
function BrandMiniUI({ token }: { token: BrandToken }) {
    const primary = getPrimaryColor(token.colors);
    const onPrimary = getContrastColor(primary);
    const brandColors = getBrandColors(token.colors);
    const mobileShapes = token.platforms.mobile.shapes;
    const btnRadius = mobileShapes.find(s => s.element === 'button')?.value ?? '8px';

    return (
        <div className={styles.miniUI}>
            {/* 상단: 브랜드 primary 컬러 + 버튼 모양 */}
            <div style={{
                flex: 3,
                background: primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                <div style={{
                    width: '52px',
                    height: '22px',
                    background: onPrimary,
                    borderRadius: btnRadius,
                    opacity: 0.85,
                }} />
            </div>
            {/* 하단: 팔레트 스트라이프 */}
            <div style={{ flex: 1, display: 'flex' }}>
                {brandColors.slice(0, 5).map((c, i) => (
                    <div key={i} style={{ flex: 1, background: c.value }} />
                ))}
            </div>
        </div>
    );
}

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
                                <BrandMiniUI token={token} />
                                <div className={styles.cardFooter}>
                                    <span className={styles.cardIndex}>
                                        {String(i + 1).padStart(3, '0')}
                                    </span>
                                    <span className={styles.cardName}>
                                        {token.tagline}
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
