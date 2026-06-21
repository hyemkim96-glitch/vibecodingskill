'use client';

import { useState } from 'react';
import { BrandToken } from '@/types/token';
import { cn } from '@/lib/utils';

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

type ComponentView = 'buttons' | 'cards' | 'inputs' | 'badges';

const VIEWS: { key: ComponentView; label: string }[] = [
  { key: 'buttons', label: '버튼' },
  { key: 'cards', label: '카드' },
  { key: 'inputs', label: '입력' },
  { key: 'badges', label: '배지 & 칩' },
];

function TokenComponentSet({ token, view }: { token: BrandToken; view: ComponentView }) {
  const c = token.colors;
  const primary = getPrimaryColor(c);
  const onPrimary = getContrastColor(primary);
  const bg = getColor(c, /기본 배경/, '#ffffff');
  const cardBg = getColor(c, /카드 배경|보조 배경/, '#f5f5f5');
  const textMain = getColor(c, /본문 텍스트|주요 컨텐츠/, '#111111');
  const textSub = getColor(c, /보조 텍스트/, '#666666');
  const textMuted = getColor(c, /비활성|힌트|플레이스홀더/, '#aaaaaa');
  const border = getColor(c, /구분선|보더/, '#e5e7eb');
  const accent = c.find(col => !/gray|white|black|grey/i.test(col.name) && col.value !== primary)?.value ?? primary;

  const p = token.platforms.mobile;
  const btnRadius = p.shapes.find(s => s.element === 'button')?.value ?? '8px';
  const cardRadius = p.shapes.find(s => s.element === 'card')?.value ?? '12px';
  const inputRadius = p.shapes.find(s => s.element === 'input')?.value ?? '6px';
  const chipRadius = p.shapes.find(s => s.element === 'chip')?.value ?? '9999px';
  const badgeRadius = p.shapes.find(s => s.element === 'badge')?.value ?? '4px';

  const boldWeight = p.typography.weights.slice(-1)[0] ?? 700;
  const bodyFont = p.typography.family;

  const base = { fontFamily: bodyFont, background: bg, padding: '16px', borderRadius: cardRadius };

  if (view === 'buttons') {
    return (
      <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Primary */}
        <button
          className="w-full transition-all duration-150 hover:brightness-105 active:scale-[0.97] cursor-pointer"
          style={{ background: primary, color: onPrimary, borderRadius: btnRadius, padding: '12px 24px', fontWeight: boldWeight, fontSize: '14px', border: 'none' }}
        >
          Primary Button
        </button>
        {/* Secondary */}
        <button
          className="w-full transition-all duration-150 hover:brightness-[0.97] active:scale-[0.97] cursor-pointer"
          style={{ background: cardBg, color: textMain, borderRadius: btnRadius, padding: '12px 24px', fontWeight: 500, fontSize: '14px', border: `1px solid ${border}` }}
        >
          Secondary Button
        </button>
        {/* Ghost */}
        <button
          className="w-full transition-all duration-150 hover:bg-black/5 active:scale-[0.97] cursor-pointer"
          style={{ background: 'transparent', color: primary, borderRadius: btnRadius, padding: '12px 24px', fontWeight: 500, fontSize: '14px', border: `1px solid ${primary}` }}
        >
          Outline Button
        </button>
        {/* Disabled */}
        <button
          disabled
          style={{ background: primary, color: onPrimary, borderRadius: btnRadius, padding: '12px 24px', fontWeight: boldWeight, fontSize: '14px', border: 'none', opacity: 0.35, cursor: 'not-allowed', width: '100%' }}
        >
          Disabled
        </button>
        {/* Small */}
        <div className="flex gap-2">
          <button
            className="flex-1 transition-all duration-150 hover:brightness-105 active:scale-95 cursor-pointer"
            style={{ background: primary, color: onPrimary, borderRadius: btnRadius, padding: '7px 16px', fontWeight: boldWeight, fontSize: '12px', border: 'none' }}
          >
            Small
          </button>
          <button
            className="flex-1 transition-all duration-150 active:scale-95 cursor-pointer"
            style={{ background: cardBg, color: textMain, borderRadius: btnRadius, padding: '7px 16px', fontWeight: 500, fontSize: '12px', border: `1px solid ${border}` }}
          >
            Small Ghost
          </button>
        </div>
      </div>
    );
  }

  if (view === 'cards') {
    return (
      <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* Basic card */}
        <div
          className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
          style={{ background: cardBg, borderRadius: cardRadius, padding: '16px', border: `1px solid ${border}` }}
        >
          <p className="text-[11px] font-medium mb-1" style={{ color: textSub }}>카드 서브타이틀</p>
          <p className="text-[15px] font-semibold" style={{ color: textMain }}>기본 카드 컴포넌트</p>
          <p className="text-[12px] mt-1" style={{ color: textSub }}>카드 설명 텍스트가 여기 들어갑니다.</p>
        </div>
        {/* Accent card */}
        <div
          className="cursor-pointer transition-all duration-200 hover:opacity-95 active:scale-[0.99]"
          style={{ background: primary, borderRadius: cardRadius, padding: '16px' }}
        >
          <p className="text-[11px] font-medium mb-1 opacity-80" style={{ color: onPrimary }}>Primary 카드</p>
          <p className="text-[15px] font-semibold" style={{ color: onPrimary }}>강조 카드 컴포넌트</p>
        </div>
        {/* List card */}
        <div style={{ background: cardBg, borderRadius: cardRadius, overflow: 'hidden', border: `1px solid ${border}` }}>
          {['항목 A', '항목 B', '항목 C'].map((item, i) => (
            <div
              key={item}
              className="flex items-center justify-between cursor-pointer transition-colors hover:bg-black/[0.04]"
              style={{ padding: '12px 16px', borderBottom: i < 2 ? `1px solid ${border}` : 'none' }}
            >
              <span className="text-[13px] font-medium" style={{ color: textMain }}>{item}</span>
              <span className="text-[11px]" style={{ color: textSub }}>→</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'inputs') {
    return (
      <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Default */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium" style={{ color: textMain }}>레이블</label>
          <div
            className="w-full transition-all hover:border-gray-400 focus-within:!border-current focus-within:ring-2 focus-within:ring-offset-0"
            style={{
              border: `1px solid ${border}`,
              borderRadius: inputRadius,
              padding: '10px 14px',
              fontSize: '13px',
              color: textMuted,
              background: bg,
            }}
          >
            플레이스홀더 텍스트
          </div>
        </div>
        {/* Focused state */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium" style={{ color: textMain }}>포커스 상태</label>
          <div
            style={{
              border: `2px solid ${primary}`,
              borderRadius: inputRadius,
              padding: '10px 14px',
              fontSize: '13px',
              color: textMain,
              background: bg,
              boxShadow: `0 0 0 3px ${primary}26`,
            }}
          >
            입력 중인 텍스트
          </div>
        </div>
        {/* Error */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium" style={{ color: '#ef4444' }}>에러 상태</label>
          <div
            style={{ border: `1px solid #ef4444`, borderRadius: inputRadius, padding: '10px 14px', fontSize: '13px', color: textMain, background: bg }}
          >
            잘못된 입력값
          </div>
          <p className="text-[11px]" style={{ color: '#ef4444' }}>올바른 형식으로 입력해주세요.</p>
        </div>
        {/* Disabled */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium opacity-50" style={{ color: textMain }}>비활성</label>
          <div
            style={{ border: `1px solid ${border}`, borderRadius: inputRadius, padding: '10px 14px', fontSize: '13px', color: textMuted, background: cardBg, opacity: 0.5 }}
          >
            비활성 상태
          </div>
        </div>
      </div>
    );
  }

  /* badges & chips */
  return (
    <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Badges */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: textSub }}>Badges</p>
        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] font-bold px-2 py-1" style={{ background: primary, color: onPrimary, borderRadius: badgeRadius }}>Primary</span>
          <span className="text-[10px] font-bold px-2 py-1" style={{ background: accent, color: getContrastColor(accent), borderRadius: badgeRadius }}>Accent</span>
          <span className="text-[10px] font-bold px-2 py-1" style={{ background: '#ef444422', color: '#ef4444', borderRadius: badgeRadius }}>Error</span>
          <span className="text-[10px] font-bold px-2 py-1" style={{ background: '#22c55e22', color: '#16a34a', borderRadius: badgeRadius }}>Success</span>
          <span className="text-[10px] font-bold px-2 py-1" style={{ background: cardBg, color: textSub, border: `1px solid ${border}`, borderRadius: badgeRadius }}>Neutral</span>
        </div>
      </div>
      {/* Chips */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: textSub }}>Chips / Tags</p>
        <div className="flex flex-wrap gap-2">
          {['선택됨', '미선택', '비활성'].map((label, i) => (
            <span
              key={label}
              className={cn('text-[12px] font-medium cursor-pointer transition-all hover:opacity-80 active:scale-95', i === 2 && 'opacity-40 pointer-events-none')}
              style={{
                padding: '5px 14px',
                borderRadius: chipRadius,
                background: i === 0 ? primary : cardBg,
                color: i === 0 ? onPrimary : textSub,
                border: i !== 0 ? `1px solid ${border}` : 'none',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      {/* Status dots */}
      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: textSub }}>Status</p>
        <div className="flex flex-col gap-2">
          {[
            { dot: primary, label: '활성', sub: '정상 작동 중' },
            { dot: '#f59e0b', label: '대기', sub: '처리 중' },
            { dot: '#ef4444', label: '오류', sub: '확인 필요' },
          ].map(({ dot, label, sub }) => (
            <div key={label} className="flex items-center gap-3 cursor-pointer hover:bg-black/[0.03] rounded-md transition-colors px-2 py-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: dot }} />
              <span className="text-[13px] font-medium" style={{ color: textMain }}>{label}</span>
              <span className="text-[11px]" style={{ color: textSub }}>{sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ComponentsClient({ tokens }: { tokens: BrandToken[] }) {
  const [activeView, setActiveView] = useState<ComponentView>('buttons');
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const displayTokens = activeBrand ? tokens.filter(t => t.slug === activeBrand) : tokens;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--color-ash)' }}>
          Components
        </h1>
        <p className="text-xs" style={{ color: 'var(--color-ash)' }}>
          각 브랜드 토큰을 적용한 공통 컴포넌트 — hover / active / disabled 인터랙션 포함
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1">
          {VIEWS.map(v => (
            <button
              key={v.key}
              onClick={() => setActiveView(v.key)}
              className="text-xs px-3 py-1.5 rounded-md transition-all cursor-pointer"
              style={{
                background: activeView === v.key ? 'var(--color-bone)' : 'transparent',
                color: activeView === v.key ? 'var(--color-void)' : 'var(--color-ash)',
                border: '1px solid var(--color-graphite)',
              }}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="w-px h-4 self-center" style={{ background: 'var(--color-graphite)' }} />
        <select
          className="text-xs px-3 py-1.5 rounded-md cursor-pointer"
          style={{ background: 'transparent', color: 'var(--color-ash)', border: '1px solid var(--color-graphite)' }}
          value={activeBrand ?? ''}
          onChange={e => setActiveBrand(e.target.value || null)}
        >
          <option value="">전체 브랜드</option>
          {tokens.map(t => <option key={t.slug} value={t.slug}>{t.tagline}</option>)}
        </select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {displayTokens.map((token) => (
          <div key={token.slug} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--color-bone)' }}>
                {token.tagline}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-ash)' }}>
                {token.category}
              </span>
            </div>
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-graphite)' }}>
              <TokenComponentSet token={token} view={activeView} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
