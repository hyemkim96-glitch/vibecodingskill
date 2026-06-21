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

/** 브랜드 배경색 — '메인 배경' 또는 '보조 배경'에서 찾기 */
function getBgColor(colors: BrandToken['colors']) {
    const warm = colors.find(c => /메인 배경/.test(c.role));
    if (warm) return warm.value;
    const sub = colors.find(c => /카드 배경|보조 배경/.test(c.role));
    return sub?.value ?? '#f5f5f5';
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
    const bg = getBgColor(token.colors);
    const mobileShapes = token.platforms.mobile.shapes;
    const btnRadius = mobileShapes.find(s => s.element === 'button')?.value ?? '8px';
    const subColors = getBrandColors(token.colors).slice(0, 6);

    return (
        <div className={styles.miniUI} style={{ background: bg, flexDirection: 'column', gap: '10px' }}>
            <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: primary,
                color: onPrimary,
                borderRadius: btnRadius,
                padding: '8px 18px',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                maxWidth: '90%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
            }}>
                {token.tagline}
            </div>
            <div style={{ display: 'flex', gap: '4px' }}>
                {subColors.map((c) => (
                    <div
                        key={c.variable}
                        title={`${c.name} ${c.value}`}
                        style={{
                            width: '14px',
                            height: '14px',
                            borderRadius: '3px',
                            background: c.value,
                            border: '1px solid rgba(0,0,0,0.08)',
                        }}
                    />
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
