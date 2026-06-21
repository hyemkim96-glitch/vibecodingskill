'use client';

import { useState } from 'react';
import { BrandToken } from '@/types/token';
import { Copy, Check, Download } from 'lucide-react';
import styles from './TokenPage.module.css';

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#111111' : '#ffffff';
}

function getPrimaryColor(colors: BrandToken['colors']) {
  return colors.find(c => /primary/i.test(c.role))?.value
    ?? colors.find(c => !/gray|white|black|grey/i.test(c.name))?.value
    ?? '#888';
}

function getColor(colors: BrandToken['colors'], role: RegExp, fallback: string) {
  return colors.find(c => role.test(c.role))?.value ?? fallback;
}

/** 카테고리/플랫폼별 대표 UI 패턴 */
function BrandUIPreview({ token, platform }: { token: BrandToken; platform: 'mobile' | 'web' }) {
  const c = token.colors;
  const primary = getPrimaryColor(c);
  const onPrimary = getContrastColor(primary);
  const bg = getColor(c, /기본 배경/, '#ffffff');
  const cardBg = getColor(c, /카드 배경|보조 배경/, '#f5f5f5');
  const textMain = getColor(c, /본문 텍스트|주요 컨텐츠/, '#111111');
  const textSub = getColor(c, /보조 텍스트/, '#666666');
  const textMuted = getColor(c, /비활성|힌트|플레이스홀더/, '#aaaaaa');
  const border = getColor(c, /구분선|보더/, '#e0e0e0');
  const accent = c.find(col => !/gray|white|black|grey/i.test(col.name) && col.value !== primary)?.value ?? primary;

  const p = token.platforms[platform];
  const btnRadius = p.shapes.find(s => s.element === 'button')?.value ?? '8px';
  const cardRadius = p.shapes.find(s => s.element === 'card')?.value ?? '12px';
  const inputRadius = p.shapes.find(s => s.element === 'input')?.value ?? '6px';
  const spacing = p.spacing.scale;
  const pad = parseInt(spacing[3]?.value ?? '16px');
  const gap = parseInt(spacing[1]?.value ?? '8px');
  const isCompact = p.spacing.density === 'compact';
  const isMobile = platform === 'mobile';

  const category = token.category;

  /* ── 핀테크/금융 ── */
  if (category === '핀테크/금융') {
    if (isMobile) {
      return (
        <div className={styles.uiPreview} style={{ background: bg, gap: `${gap}px` }}>
          {/* 잔액 카드 */}
          <div style={{ background: cardBg, borderRadius: cardRadius, padding: `${pad}px`, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: textSub }}>현재 잔액</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: textMain, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              1,234,567<span style={{ fontSize: '13px', fontWeight: 400, marginLeft: '3px' }}>원</span>
            </span>
            <span style={{ fontSize: '11px', color: textMuted }}>전월 대비 ▲ 12% 증가</span>
          </div>
          {/* 빠른 액션 */}
          <div style={{ display: 'flex', gap: `${gap}px` }}>
            {['이체', '충전', '조회'].map((label, i) => (
              <div key={label} style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: i === 0 ? primary : cardBg,
                color: i === 0 ? onPrimary : textMain,
                borderRadius: btnRadius, padding: '10px 0',
                fontSize: '12px', fontWeight: 600,
                border: i !== 0 ? `1px solid ${border}` : 'none',
              }}>{label}</div>
            ))}
          </div>
          {/* 거래 내역 */}
          {[{ name: '스타벅스', sub: '카드결제', amount: '-6,500원', color: textMain }, { name: '급여', sub: '입금', amount: '+3,200,000원', color: accent }].map((item, i) => (
            <div key={item.name} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: `${gap}px 0`,
              borderBottom: i === 0 ? `1px solid ${border}` : 'none',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '13px', color: textMain, fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontSize: '11px', color: textSub }}>{item.sub}</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: item.color }}>{item.amount}</span>
            </div>
          ))}
        </div>
      );
    }
    /* web — 대시보드 2열 */
    return (
      <div className={styles.uiPreview} style={{ background: bg, flexDirection: 'row', alignItems: 'stretch', gap: `${gap * 2}px`, padding: `${pad}px` }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
          <div style={{ background: cardBg, borderRadius: cardRadius, padding: `${pad}px` }}>
            <span style={{ fontSize: '11px', color: textSub, display: 'block', marginBottom: '6px' }}>총 자산</span>
            <span style={{ fontSize: '22px', fontWeight: 700, color: textMain, letterSpacing: '-0.02em' }}>₩ 12,345,678</span>
          </div>
          <div style={{ background: primary, borderRadius: cardRadius, padding: `${pad}px` }}>
            <span style={{ fontSize: '11px', color: onPrimary, opacity: 0.8, display: 'block', marginBottom: '6px' }}>이번 달 지출</span>
            <span style={{ fontSize: '20px', fontWeight: 700, color: onPrimary }}>₩ 456,789</span>
          </div>
        </div>
        <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: `${gap}px` }}>
          {[{ name: '스타벅스', cat: '카페', amount: '-6,500' }, { name: '급여', cat: '입금', amount: '+3,200,000' }, { name: '넷플릭스', cat: '구독', amount: '-17,000' }].map((item, i) => (
            <div key={item.name} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: `${gap}px ${pad}px`, background: cardBg, borderRadius: inputRadius,
            }}>
              <div>
                <span style={{ fontSize: '13px', color: textMain, fontWeight: 500 }}>{item.name}</span>
                <span style={{ fontSize: '11px', color: textSub, marginLeft: '8px' }}>{item.cat}</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: i === 1 ? accent : textMain }}>{item.amount}원</span>
            </div>
          ))}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: primary, color: onPrimary, borderRadius: btnRadius,
            padding: '10px', fontSize: '13px', fontWeight: 600,
          }}>이체하기</div>
        </div>
      </div>
    );
  }

  /* ── 플랫폼/배달 ── */
  if (category === '플랫폼') {
    if (isMobile) {
      const chipRadius = p.shapes.find(s => s.element === 'chip')?.value ?? '20px';
      return (
        <div className={styles.uiPreview} style={{ background: bg, gap: `${gap}px` }}>
          {/* 검색/필터 */}
          <div style={{ display: 'flex', gap: `${gap}px`, alignItems: 'center' }}>
            <div style={{ flex: 1, background: cardBg, borderRadius: inputRadius, padding: '8px 12px', fontSize: '12px', color: textMuted, border: `1px solid ${border}` }}>
              음식, 가게 검색
            </div>
          </div>
          {/* 카테고리 칩 */}
          <div style={{ display: 'flex', gap: `${gap}px`, overflowX: 'hidden' }}>
            {['치킨', '피자', '한식', '중식'].map((cat, i) => (
              <div key={cat} style={{
                padding: '6px 12px', borderRadius: chipRadius, fontSize: '12px', fontWeight: 500, whiteSpace: 'nowrap',
                background: i === 0 ? primary : cardBg,
                color: i === 0 ? onPrimary : textMain,
                border: i !== 0 ? `1px solid ${border}` : 'none',
              }}>{cat}</div>
            ))}
          </div>
          {/* 가게 카드 */}
          <div style={{ background: cardBg, borderRadius: cardRadius, overflow: 'hidden' }}>
            <div style={{ height: '80px', background: `linear-gradient(135deg, ${primary}33, ${accent}33)` }} />
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: textMain }}>맛있는 치킨집</span>
                <span style={{ fontSize: '11px', color: textSub }}>★ 4.8 (1.2k)</span>
              </div>
              <span style={{ fontSize: '11px', color: textSub }}>배달비 2,000원 · 최소 15,000원</span>
              <div style={{
                display: 'inline-flex', alignSelf: 'flex-start',
                background: primary, color: onPrimary, borderRadius: btnRadius,
                padding: '6px 14px', fontSize: '11px', fontWeight: 600, marginTop: '4px',
              }}>주문하기</div>
            </div>
          </div>
        </div>
      );
    }
    /* web */
    return (
      <div className={styles.uiPreview} style={{ background: bg, gap: `${gap}px`, padding: `${pad}px` }}>
        <div style={{ display: 'flex', gap: `${gap}px`, marginBottom: `${gap}px` }}>
          {['전체', '치킨', '피자', '한식', '중식', '분식'].map((cat, i) => (
            <div key={cat} style={{
              padding: '5px 12px', borderRadius: p.shapes.find(s => s.element === 'chip')?.value ?? '20px',
              fontSize: '12px', fontWeight: 500,
              background: i === 0 ? primary : 'transparent',
              color: i === 0 ? onPrimary : textSub,
              border: i !== 0 ? `1px solid ${border}` : 'none', cursor: 'pointer',
            }}>{cat}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${gap}px` }}>
          {['맛있는 치킨', '행복한 피자', '우리동네 한식'].map((name, i) => (
            <div key={name} style={{ background: cardBg, borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${border}` }}>
              <div style={{ height: '70px', background: `linear-gradient(135deg, ${primary}${20 + i * 10 < 50 ? '22' : '33'}, ${accent}22)` }} />
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: textMain, marginBottom: '3px' }}>{name}</div>
                <div style={{ fontSize: '11px', color: textSub }}>★ {(4.5 + i * 0.1).toFixed(1)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── 커머스 ── */
  if (category === '커머스') {
    if (isMobile) {
      const badgeRadius = p.shapes.find(s => s.element === 'badge')?.value ?? '4px';
      return (
        <div className={styles.uiPreview} style={{ background: bg, gap: `${gap}px` }}>
          {/* 상단 배너 */}
          <div style={{ background: primary, borderRadius: cardRadius, padding: `${gap * 2}px ${pad}px`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '10px', color: onPrimary, opacity: 0.85 }}>오늘만 이 가격</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: onPrimary }}>최대 70% OFF</div>
            </div>
            <div style={{ background: onPrimary === '#ffffff' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)', borderRadius: btnRadius, padding: '5px 10px', fontSize: '11px', color: onPrimary, fontWeight: 600 }}>보러가기</div>
          </div>
          {/* 상품 2열 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${gap}px` }}>
            {[{ name: '무선 이어폰', price: '89,000', discount: '35%' }, { name: '스마트워치', price: '249,000', discount: '22%' }].map((item) => (
              <div key={item.name} style={{ background: cardBg, borderRadius: cardRadius, overflow: 'hidden' }}>
                <div style={{ height: '80px', background: `${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ background: accent, borderRadius: badgeRadius, padding: '2px 6px', fontSize: '10px', fontWeight: 700, color: getContrastColor(accent) }}>{item.discount}</div>
                </div>
                <div style={{ padding: '8px' }}>
                  <div style={{ fontSize: '11px', color: textMain, fontWeight: 500, marginBottom: '3px' }}>{item.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: primary }}>{item.price}원</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* 장바구니 버튼 */}
          <div style={{ background: primary, color: onPrimary, borderRadius: btnRadius, padding: '11px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>
            장바구니 담기
          </div>
        </div>
      );
    }
    /* web */
    return (
      <div className={styles.uiPreview} style={{ background: bg, padding: `${pad}px`, gap: `${gap}px` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: `${gap}px` }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: textMain }}>인기 상품</span>
          <span style={{ fontSize: '11px', color: primary, fontWeight: 600 }}>전체보기 →</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: `${gap}px` }}>
          {['무선이어폰', '스마트워치', '노트북', '태블릿'].map((name, i) => (
            <div key={name} style={{ background: cardBg, borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${border}` }}>
              <div style={{ height: '60px', background: border, position: 'relative' }}>
                <div style={{ position: 'absolute', top: '4px', left: '4px', background: primary, color: onPrimary, borderRadius: p.shapes.find(s => s.element === 'badge')?.value ?? '2px', padding: '2px 5px', fontSize: '9px', fontWeight: 700 }}>
                  {[35, 22, 18, 40][i]}%
                </div>
              </div>
              <div style={{ padding: '8px' }}>
                <div style={{ fontSize: '11px', color: textMain, fontWeight: 500, marginBottom: '2px' }}>{name}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: primary }}>{['89,000', '249,000', '1,190,000', '489,000'][i]}원</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── 지역/커뮤니티 (당근 등) ── */
  if (token.serviceTypes?.some(s => /지역|커뮤니티|중고/.test(s))) {
    if (isMobile) {
      return (
        <div className={styles.uiPreview} style={{ background: bg, gap: `${gap}px` }}>
          <div style={{ display: 'flex', gap: `${gap}px`, alignItems: 'center' }}>
            <div style={{ flex: 1, background: cardBg, borderRadius: inputRadius, padding: '8px 12px', fontSize: '12px', color: textMuted, border: `1px solid ${border}` }}>우리 동네 검색</div>
            <div style={{ background: primary, color: onPrimary, borderRadius: btnRadius, padding: '8px 12px', fontSize: '12px', fontWeight: 600 }}>글쓰기</div>
          </div>
          {[{ title: '아이폰 15 팔아요', loc: '서초구 · 10분 전', price: '900,000원' }, { title: '자전거 삽니다', loc: '강남구 · 1시간 전', price: '50,000원' }].map((item, i) => (
            <div key={item.title} style={{
              display: 'flex', gap: '12px', padding: `${gap}px 0`,
              borderBottom: i === 0 ? `1px solid ${border}` : 'none', alignItems: 'flex-start',
            }}>
              <div style={{ width: '60px', height: '60px', background: cardBg, borderRadius: cardRadius, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <span style={{ fontSize: '13px', color: textMain, fontWeight: 500 }}>{item.title}</span>
                <span style={{ fontSize: '11px', color: textSub }}>{item.loc}</span>
                <span style={{ fontSize: '13px', color: textMain, fontWeight: 700 }}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className={styles.uiPreview} style={{ background: bg, padding: `${pad}px`, gap: `${gap}px` }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${gap}px` }}>
          {['아이폰 15', '자전거', '소파'].map((name, i) => (
            <div key={name} style={{ background: cardBg, borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${border}` }}>
              <div style={{ height: '80px', background: border }} />
              <div style={{ padding: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: textMain, marginBottom: '3px' }}>{name}</div>
                <div style={{ fontSize: '11px', color: textSub }}>서초구 · {['10분', '1시간', '3시간'][i]} 전</div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: textMain, marginTop: '4px' }}>{['900,000', '80,000', '120,000'][i]}원</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── 패션/라이프스타일 (무신사, 29CM, 오늘의집 등) ── */
  if (isMobile) {
    return (
      <div className={styles.uiPreview} style={{ background: bg, gap: `${gap}px` }}>
        {/* 에디토리얼 배너 */}
        <div style={{
          background: isCompact ? cardBg : `linear-gradient(160deg, ${cardBg}, ${bg})`,
          borderRadius: cardRadius, padding: `${pad}px`, border: `1px solid ${border}`,
          display: 'flex', flexDirection: 'column', gap: '6px',
        }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.08em', color: textSub, textTransform: 'uppercase' }}>New Arrivals</span>
          <span style={{ fontSize: '18px', fontWeight: 700, color: textMain, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
            {token.tagline}
          </span>
          <div style={{ display: 'inline-flex', alignSelf: 'flex-start', background: primary, color: onPrimary, borderRadius: btnRadius, padding: '7px 16px', fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>
            지금 보기
          </div>
        </div>
        {/* 상품 2열 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: `${gap}px` }}>
          {['오버핏 셔츠', '와이드 팬츠'].map((name, i) => (
            <div key={name} style={{ background: cardBg, borderRadius: cardRadius, overflow: 'hidden' }}>
              <div style={{ height: '80px', background: `${border}` }} />
              <div style={{ padding: '8px' }}>
                <div style={{ fontSize: '11px', color: textSub, marginBottom: '2px' }}>{['BRAND A', 'BRAND B'][i]}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: textMain }}>{name}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: primary, marginTop: '3px' }}>{['89,000', '129,000'][i]}원</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  /* 패션 web */
  return (
    <div className={styles.uiPreview} style={{ background: bg, padding: `${pad}px`, gap: `${gap}px` }}>
      <div style={{ display: 'flex', gap: `${gap * 2}px`, marginBottom: `${gap}px` }}>
        <div style={{ flex: 2, background: cardBg, borderRadius: cardRadius, padding: `${pad}px`, border: `1px solid ${border}` }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.08em', color: textSub, textTransform: 'uppercase', marginBottom: '6px' }}>Featured</div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: textMain, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: '12px' }}>{token.tagline}</div>
          <div style={{ display: 'inline-flex', background: primary, color: onPrimary, borderRadius: btnRadius, padding: '8px 20px', fontSize: '12px', fontWeight: 600 }}>쇼핑하기</div>
        </div>
        <div style={{ flex: 3, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: `${gap}px` }}>
          {['셔츠', '팬츠', '자켓'].map((name) => (
            <div key={name} style={{ background: cardBg, borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${border}` }}>
              <div style={{ height: '70px', background: border }} />
              <div style={{ padding: '8px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: textMain }}>{name}</div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: primary, marginTop: '2px' }}>89,000원</div>
              </div>
            </div>
          ))}
        </div>
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
