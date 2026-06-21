'use client';

import { useState } from 'react';
import { BrandToken } from '@/types/token';
import { Copy, Check, Download } from 'lucide-react';
import styles from './TokenPage.module.css';

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.55 ? '#111111' : '#ffffff';
}

function getPrimaryColor(colors: BrandToken['colors']) {
  return colors.find(c => /primary/i.test(c.role))?.value
    ?? colors.find(c => !/gray|white|black|grey/i.test(c.name))?.value
    ?? '#888';
}

function getColor(colors: BrandToken['colors'], role: RegExp, fallback: string) {
  return colors.find(c => role.test(c.role))?.value ?? fallback;
}

function BrandUIPreview({ token, platform }: { token: BrandToken; platform: 'mobile' | 'web' }) {
  const primary = getPrimaryColor(token.colors);
  const onPrimary = getContrastColor(primary);
  const bg = getColor(token.colors, /기본 배경/, '#ffffff');
  const cardBg = getColor(token.colors, /카드 배경|보조 배경/, '#f5f5f5');
  const textMain = getColor(token.colors, /본문 텍스트|주요 컨텐츠/, '#111111');
  const textSub = getColor(token.colors, /보조 텍스트/, '#666666');
  const border = getColor(token.colors, /구분선|보더/, '#e0e0e0');
  const p = token.platforms[platform];
  const btnRadius = p.shapes.find(s => s.element === 'button')?.value ?? '8px';
  const cardRadius = p.shapes.find(s => s.element === 'card')?.value ?? '12px';

  const isMobile = platform === 'mobile';

  return (
    <div className={styles.uiPreview} style={{ background: bg }}>
      {/* Nav bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '10px 16px' : '12px 24px',
        borderBottom: `1px solid ${border}`,
        background: bg,
      }}>
        <span style={{ fontSize: isMobile ? '15px' : '16px', fontWeight: 700, color: textMain, letterSpacing: '-0.01em' }}>
          {token.nameKo ?? token.name}
        </span>
        <div style={{
          width: isMobile ? '28px' : '32px',
          height: isMobile ? '28px' : '32px',
          borderRadius: '50%',
          background: primary,
        }} />
      </div>

      {/* Main card */}
      <div style={{ padding: isMobile ? '16px' : '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{
          background: cardBg,
          borderRadius: cardRadius,
          padding: isMobile ? '16px' : '20px',
          display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
          <span style={{ fontSize: '11px', color: textSub, letterSpacing: '0.02em' }}>{token.tagline}</span>
          <span style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color: textMain, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            1,234,567<span style={{ fontSize: '13px', fontWeight: 400, marginLeft: '3px' }}>원</span>
          </span>
          <span style={{ fontSize: '11px', color: textSub }}>최근 업데이트 방금 전</span>
        </div>

        {/* Action row */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['이체', '충전', '내역'].map((label, i) => (
            <div key={label} style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i === 0 ? primary : cardBg,
              color: i === 0 ? onPrimary : textMain,
              borderRadius: btnRadius,
              padding: '9px 0',
              fontSize: '12px', fontWeight: 600,
              border: i === 0 ? 'none' : `1px solid ${border}`,
            }}>{label}</div>
          ))}
        </div>

        {/* List items */}
        {['어제', '2일 전'].map((day, i) => (
          <div key={day} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: i === 0 ? `1px solid ${border}` : 'none',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontSize: '13px', color: textMain, fontWeight: 500 }}>
                {i === 0 ? '스타벅스' : '편의점'}
              </span>
              <span style={{ fontSize: '11px', color: textSub }}>{day}</span>
            </div>
            <span style={{ fontSize: '13px', fontWeight: 600, color: textMain }}>
              -{i === 0 ? '6,500' : '3,200'}원
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

type TabKey = 'designMd' | 'css' | 'tailwind' | 'json' | 'figma';
type Platform = 'mobile' | 'web';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'designMd', label: 'Design.md' },
  { key: 'css', label: 'CSS' },
  { key: 'tailwind', label: 'Tailwind' },
  { key: 'json', label: '디자인 토큰' },
  { key: 'figma', label: 'Figma 변수' },
];

const FILE_EXTENSIONS: Record<TabKey, string> = {
  designMd: 'DESIGN.md',
  css: 'tokens.css',
  tailwind: 'tailwind.config.js',
  json: 'tokens.json',
  figma: 'figma-variables.md',
};

interface Props {
  token: BrandToken;
  mobileCodes: Record<TabKey, string>;
  webCodes: Record<TabKey, string>;
}

export default function TokenPageClient({ token, mobileCodes, webCodes }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('designMd');
  const [platform, setPlatform] = useState<Platform>('mobile');
  const [copied, setCopied] = useState(false);

  const codes = platform === 'mobile' ? mobileCodes : webCodes;
  const p = token.platforms[platform];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codes[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([codes[activeTab]], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${token.slug}-${platform}-${FILE_EXTENSIONS[activeTab]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      {/* Left — Visual token info */}
      <div className={styles.left}>
        {/* Header */}
        <div className={styles.brandHeader}>
          <div className={styles.brandMeta}>
            <span className={styles.metaChip}>{token.category}</span>
            <span className={styles.metaChip}>{token.country}</span>
            <span className={styles.metaChip}>{token.theme === 'light' ? '라이트' : '다크'}</span>
          </div>
          <h1 className={styles.brandName}>{token.tagline}</h1>
          <p className={styles.brandDesc}>{token.description}</p>
          <p className={styles.updatedAt}>업데이트: {token.updatedAt}</p>
        </div>

        <div className={styles.divider} />

        {/* Platform Toggle */}
        <div className={styles.platformToggle}>
          <button
            className={`${styles.platformBtn} ${platform === 'mobile' ? styles.platformBtnActive : ''}`}
            onClick={() => setPlatform('mobile')}
          >
            모바일
          </button>
          <button
            className={`${styles.platformBtn} ${platform === 'web' ? styles.platformBtnActive : ''}`}
            onClick={() => setPlatform('web')}
          >
            웹
          </button>
        </div>

        {/* Brand UI Preview */}
        <div className={styles.uiPreviewWrapper}>
          <BrandUIPreview token={token} platform={platform} />
        </div>

        <div className={styles.divider} />

        {/* Color Palette */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>컬러 팔레트</h2>
          <div className={styles.colorGrid}>
            {token.colors.map((color) => (
              <div key={color.variable} className={styles.colorItem}>
                <div
                  className={styles.colorSwatch}
                  style={{ background: color.value }}
                />
                <div className={styles.colorInfo}>
                  <span className={styles.colorName}>{color.name}</span>
                  <span className={styles.colorValue}>{color.value}</span>
                  <span className={styles.colorRole}>{color.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        {/* Typography */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>타이포그래피</h2>
          <div className={styles.typeMeta}>
            <span className={styles.typeFamily}>{p.typography.family}</span>
            <span className={styles.typeSubstitute}>대체: {p.typography.substitute}</span>
            <span className={styles.typeWeights}>굵기: {p.typography.weights.join(', ')}</span>
          </div>
          <div className={styles.typeScaleTable}>
            <div className={styles.tableHeader}>
              <span>역할</span>
              <span>크기</span>
              <span>행간</span>
              <span>자간</span>
            </div>
            {p.typography.sizes.map((s) => (
              <div key={s.role} className={styles.tableRow}>
                <span className={styles.typeRole}>{s.role}</span>
                <span>{s.size}</span>
                <span>{s.lineHeight}</span>
                <span>{s.letterSpacing}</span>
              </div>
            ))}
          </div>
          <div className={styles.typePreview}>
            <p style={{ fontSize: '32px', lineHeight: 1.2 }}>Aa</p>
            <p style={{ fontSize: '16px', lineHeight: 1.6, color: 'var(--color-ash)' }}>
              The quick brown fox jumps over the lazy dog
            </p>
          </div>
        </section>

        <div className={styles.divider} />

        {/* Spacing */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>여백 & 모양</h2>
          <div className={styles.spacingMeta}>
            <span className={styles.metaChip}>기준: {p.spacing.baseUnit}</span>
            <span className={styles.metaChip}>{p.spacing.density === 'comfortable' ? '여유' : p.spacing.density === 'compact' ? '촘촘' : '넉넉'}</span>
            <span className={styles.metaChip}>최대폭: {p.layout.maxWidth}</span>
          </div>
          <div className={styles.spacingTable}>
            <div className={styles.tableHeader}>
              <span>이름</span>
              <span>값</span>
              <span>미리보기</span>
            </div>
            {p.spacing.scale.map((s) => (
              <div key={s.token} className={styles.tableRow}>
                <span>{s.name}</span>
                <span>{s.value}</span>
                <div
                  className={styles.spacingBar}
                  style={{ width: s.value, maxWidth: '100%' }}
                />
              </div>
            ))}
          </div>

          <h3 className={styles.subTitle}>모서리 둥글기</h3>
          <div className={styles.shapeTable}>
            <div className={styles.tableHeader}>
              <span>요소</span>
              <span>값</span>
              <span>미리보기</span>
            </div>
            {p.shapes.map((s) => (
              <div key={s.element} className={styles.tableRow}>
                <span>{s.element}</span>
                <span>{s.value}</span>
                <div
                  className={styles.shapePreview}
                  style={{ borderRadius: s.value }}
                />
              </div>
            ))}
          </div>
        </section>

        <div className={styles.divider} />

        {/* Guidelines */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>디자인 가이드라인</h2>
          <div className={styles.guidelinesGrid}>
            <div className={styles.guideCol}>
              <h3 className={styles.guideTitle}>이렇게 해요</h3>
              <ul className={styles.guideList}>
                {token.guidelines.dos.map((d, i) => (
                  <li key={i} className={styles.guideItemDo}>{d}</li>
                ))}
              </ul>
            </div>
            <div className={styles.guideCol}>
              <h3 className={styles.guideTitle}>이렇게 하지 마세요</h3>
              <ul className={styles.guideList}>
                {token.guidelines.donts.map((d, i) => (
                  <li key={i} className={styles.guideItemDont}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Right — Sticky code panel */}
      <div className={styles.rightWrapper}>
        <div className={styles.codePanel}>
          {/* Tabs */}
          <div className={styles.tabs}>
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`${styles.tab} ${activeTab === tab.key ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className={styles.codeActions}>
            <span className={styles.fileName}>{platform.toUpperCase()} · {FILE_EXTENSIONS[activeTab]}</span>
            <div className={styles.actionBtns}>
              <button
                className={`${styles.actionBtn} ${copied ? styles.actionBtnCopied : ''}`}
                onClick={handleCopy}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? '복사됨' : '복사'}
              </button>
              <button className={styles.actionBtn} onClick={handleDownload}>
                <Download size={14} />
                다운로드
              </button>
            </div>
          </div>

          {/* Code */}
          <pre className={styles.codeBlock}>
            <code>{codes[activeTab]}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
