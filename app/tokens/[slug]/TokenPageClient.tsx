'use client';

import { useState } from 'react';
import { BrandToken } from '@/types/token';
import { Copy, Check, Download } from 'lucide-react';
import BrandUIPreview from '@/components/BrandUIPreview';
import styles from './TokenPage.module.css';

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

const KOREAN_SAMPLE = '한글은 아름다운 언어입니다. 디자인 시스템이 이를 담아냅니다.';
const LATIN_SAMPLE = 'The quick brown fox jumps over the lazy dog';

export default function TokenPageClient({ token, mobileCodes, webCodes }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>('designMd');
  const [platform, setPlatform] = useState<Platform>('mobile');
  const [copied, setCopied] = useState(false);
  const [selectedTypeRole, setSelectedTypeRole] = useState<string | null>(null);

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

        {/* UI Preview — base components/patterns rendered with this brand's tokens */}
        <div
          className={styles.uiPreviewWrapper}
          style={{ maxWidth: platform === 'mobile' ? 390 : '100%' }}
        >
          <BrandUIPreview token={token} platform={platform} mode="brand" />
        </div>

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
            {p.typography.sizes.map((s) => {
              const isSelected = selectedTypeRole === s.role;
              return (
                <div
                  key={s.role}
                  className={styles.tableRow}
                  onClick={() => setSelectedTypeRole(isSelected ? null : s.role)}
                  style={{ cursor: 'pointer', background: isSelected ? 'var(--color-fill-neutral)' : undefined }}
                >
                  <span className={styles.typeRole}>{s.role}</span>
                  <span>{s.size}</span>
                  <span>{s.lineHeight}</span>
                  <span>{s.letterSpacing}</span>
                </div>
              );
            })}
          </div>
          {/* Interactive type preview */}
          {selectedTypeRole && (() => {
            const s = p.typography.sizes.find((x) => x.role === selectedTypeRole)!;
            const fontSize = s.size;
            const lineHeight = parseFloat(s.lineHeight) || 1.5;
            const letterSpacing = s.letterSpacing || '0em';
            const isDisplay = /display|h1|heading/i.test(s.role);
            return (
              <div style={{
                marginTop: 'var(--spacing-3)',
                padding: 'var(--spacing-6) var(--spacing-6)',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--color-graphite)',
                background: 'var(--color-carbon)',
              }}>
                <div style={{ fontSize: 'var(--font-size-caption)', fontFamily: 'var(--font-ui)', letterSpacing: '0.04em', color: 'var(--color-ash)', marginBottom: 'var(--spacing-4)', display: 'flex', gap: 'var(--spacing-3)' }}>
                  <span>{s.role}</span>
                  <span>·</span>
                  <span>{fontSize}</span>
                  <span>·</span>
                  <span>lh {s.lineHeight}</span>
                  <span>·</span>
                  <span>ls {letterSpacing}</span>
                </div>
                <p style={{ fontSize, lineHeight, letterSpacing, fontFamily: p.typography.family, margin: 0, color: 'var(--color-bone)' }}>
                  {isDisplay ? 'Aa — ' : ''}{KOREAN_SAMPLE}
                </p>
                <p style={{ fontSize, lineHeight, letterSpacing, fontFamily: p.typography.family, margin: 'var(--spacing-2) 0 0', color: 'var(--color-ash)' }}>
                  {LATIN_SAMPLE}
                </p>
              </div>
            );
          })()}
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
