'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BrandToken } from '@/types/token';
import PillTabs from '@/components/PillTabs';
import styles from './TokensIndex.module.css';
import { serviceDS } from '@/lib/tokens/serviceTheme';
import { contrastOn } from '@/lib/tokens/resolveTheme';
import { lightTokens } from '@/lib/tokens/semanticTokens';

const { Text, t: st } = serviceDS;

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
    return explicit?.value ?? getBrandColors(colors)[0]?.value ?? lightTokens['--color-fill-brand'];
}

/** 브랜드 배경색 — '메인 배경' 또는 '보조 배경'에서 찾기 */
function getBgColor(colors: BrandToken['colors']) {
    const warm = colors.find(c => /메인 배경/.test(c.role));
    if (warm) return warm.value;
    const sub = colors.find(c => /카드 배경|보조 배경/.test(c.role));
    return sub?.value ?? lightTokens['--color-fill-neutral'];
}

/** primary 위에 올라갈 텍스트 색상 (명도 판단) */
function getContrastColor(hex: string): string {
    return contrastOn(hex);
}

/** 브랜드 카드 — 컬러 팔레트 형식 썸네일 */
function BrandMiniUI({ token }: { token: BrandToken }) {
    const primary = getPrimaryColor(token.colors);
    const onPrimary = getContrastColor(primary);
    const allColors = getBrandColors(token.colors);
    const secondaries = allColors.filter(c => c.value !== primary);

    return (
        <div className={styles.miniUI} style={{
            padding: 0,
            gap: 0,
            flexDirection: 'column',
            alignItems: 'stretch',
            justifyContent: 'flex-start',
        }}>
            {/* 프라이머리 블록 — 지배적 영역 */}
            <div style={{
                flex: '0 0 62%',
                background: primary,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '8px 10px 7px',
            }}>
                <span style={{
                    fontFamily: '"SF Mono", "Fira Mono", "Consolas", monospace',
                    fontSize: 9,
                    letterSpacing: '0.06em',
                    fontWeight: 500,
                    color: onPrimary,
                    opacity: 0.55,
                }}>
                    {primary.toUpperCase()}
                </span>
            </div>
            {/* 보조 컬러 스트라이프 */}
            <div style={{ flex: 1, display: 'flex' }}>
                {secondaries.length > 0
                    ? secondaries.slice(0, 5).map((c) => (
                        <div
                            key={c.variable ?? c.value}
                            title={`${c.name} · ${c.value}`}
                            style={{ flex: 1, background: c.value }}
                        />
                    ))
                    : <div style={{ flex: 1, background: getBgColor(token.colors) }} />
                }
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
            {/* 페이지 헤더 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: st.space.sm }}>
                <Text role="caption" weight={st.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: st.textSub }}>
                    Templates
                </Text>
                <Text role="caption" color={st.textMuted}>
                    브랜드 디자인 시스템 템플릿 — 컬러·타이포·여백·모양을 한번에 정의합니다.
                </Text>
            </div>

            {/* 필터 바 — shared PillTabs */}
            <div className={styles.filterBar}>
                <PillTabs
                    tabs={CATEGORIES.map((c) => ({ key: c, label: c }))}
                    active={activeFilter}
                    onChange={setActiveFilter}
                />
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
