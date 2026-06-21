'use client';

import { useState } from 'react';
import { BrandToken } from '@/types/token';
import { Copy, Check, Download } from 'lucide-react';
import styles from './TokenPage.module.css';

type TabKey = 'designMd' | 'css' | 'tailwind' | 'json' | 'figma';
type Platform = 'mobile' | 'web';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'designMd', label: 'Design.md' },
  { key: 'css', label: 'CSS' },
  { key: 'tailwind', label: 'Tailwind' },
  { key: 'json', label: 'Design Tokens' },
  { key: 'figma', label: 'Figma Variables' },
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
            <span className={styles.metaChip}>{token.theme}</span>
          </div>
          <h1 className={styles.brandName}>{token.name}</h1>
          <p className={styles.brandDesc}>{token.description}</p>
          <p className={styles.updatedAt}>Updated: {token.updatedAt}</p>
        </div>

        <div className={styles.divider} />

        {/* Platform Toggle */}
        <div className={styles.platformToggle}>
          <button
            className={`${styles.platformBtn} ${platform === 'mobile' ? styles.platformBtnActive : ''}`}
            onClick={() => setPlatform('mobile')}
          >
            Mobile
          </button>
          <button
            className={`${styles.platformBtn} ${platform === 'web' ? styles.platformBtnActive : ''}`}
            onClick={() => setPlatform('web')}
          >
            Web
          </button>
        </div>

        {/* Color Palette */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Color Palette</h2>
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
          <h2 className={styles.sectionTitle}>Typography</h2>
          <div className={styles.typeMeta}>
            <span className={styles.typeFamily}>{p.typography.family}</span>
            <span className={styles.typeSubstitute}>Substitute: {p.typography.substitute}</span>
            <span className={styles.typeWeights}>Weights: {p.typography.weights.join(', ')}</span>
          </div>
          <div className={styles.typeScaleTable}>
            <div className={styles.tableHeader}>
              <span>Role</span>
              <span>Size</span>
              <span>Line Height</span>
              <span>Letter Spacing</span>
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
          <h2 className={styles.sectionTitle}>Spacing & Shape</h2>
          <div className={styles.spacingMeta}>
            <span className={styles.metaChip}>Base: {p.spacing.baseUnit}</span>
            <span className={styles.metaChip}>{p.spacing.density}</span>
            <span className={styles.metaChip}>Max: {p.layout.maxWidth}</span>
          </div>
          <div className={styles.spacingTable}>
            <div className={styles.tableHeader}>
              <span>Name</span>
              <span>Value</span>
              <span>Preview</span>
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

          <h3 className={styles.subTitle}>Border Radius</h3>
          <div className={styles.shapeTable}>
            <div className={styles.tableHeader}>
              <span>Element</span>
              <span>Value</span>
              <span>Preview</span>
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
          <h2 className={styles.sectionTitle}>Guidelines</h2>
          <div className={styles.guidelinesGrid}>
            <div className={styles.guideCol}>
              <h3 className={styles.guideTitle}>Do</h3>
              <ul className={styles.guideList}>
                {token.guidelines.dos.map((d, i) => (
                  <li key={i} className={styles.guideItemDo}>{d}</li>
                ))}
              </ul>
            </div>
            <div className={styles.guideCol}>
              <h3 className={styles.guideTitle}>Don&apos;t</h3>
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
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button className={styles.actionBtn} onClick={handleDownload}>
                <Download size={14} />
                Download
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
