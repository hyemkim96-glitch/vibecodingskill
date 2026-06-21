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

/** 브랜드 primary 컬러 (유채색 첫 번째) */
function getPrimaryColor(colors: BrandToken['colors']) {
    return getBrandColors(colors)[0]?.value ?? '#888';
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
    const accent = brandColors[1]?.value ?? primary;
    const mobileShapes = token.platforms.mobile.shapes;
    const btnRadius = mobileShapes.find(s => s.element === 'button')?.value ?? '8px';
    const cardRadius = mobileShapes.find(s => s.element === 'card')?.value ?? '12px';

    return (
        <div className={styles.miniUI} style={{ background: '#f5f5f5' }}>
            {/* 미니 앱 카드 */}
            <div
                className={styles.miniCard}
                style={{ borderRadius: cardRadius, background: '#ffffff', border: '1px solid #e5e5e5' }}
            >
                {/* 상단 컬러 바 */}
                <div style={{ background: primary, height: '6px', borderRadius: `${cardRadius} ${cardRadius} 0 0` }} />

                {/* 콘텐츠 영역 */}
                <div className={styles.miniContent}>
                    {/* 타이틀 라인 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: primary, flexShrink: 0 }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ height: '5px', background: '#222', borderRadius: '2px', marginBottom: '3px', width: '60%' }} />
                            <div style={{ height: '4px', background: '#ccc', borderRadius: '2px', width: '40%' }} />
                        </div>
                    </div>

                    {/* 본문 라인들 */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                        <div style={{ height: '4px', background: '#e5e5e5', borderRadius: '2px', width: '100%' }} />
                        <div style={{ height: '4px', background: '#e5e5e5', borderRadius: '2px', width: '80%' }} />
                    </div>

                    {/* 하단 버튼 + 뱃지 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <div
                            style={{
                                flex: 1,
                                height: '22px',
                                background: primary,
                                borderRadius: btnRadius,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <div style={{ width: '30px', height: '3px', background: onPrimary, borderRadius: '2px', opacity: 0.8 }} />
                        </div>
                        <div
                            style={{
                                width: '22px',
                                height: '22px',
                                borderRadius: btnRadius,
                                border: `1.5px solid ${primary}`,
                                flexShrink: 0,
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* 하단 유채색 스트라이프 (브랜드 팔레트) */}
            <div className={styles.miniStripe}>
                {brandColors.slice(0, 4).map((c, i) => (
                    <div
                        key={i}
                        style={{
                            flex: i === 0 ? 3 : 1,
                            background: c.value,
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
