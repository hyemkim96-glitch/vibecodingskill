'use client';

import { useState } from 'react';
import React from 'react';
import { BrandToken } from '@/types/token';
import { cn } from '@/lib/utils';
import { resolveTheme, ResolvedTheme, ResolvedType } from '@/lib/tokens/resolveTheme';

type ComponentView = 'buttons' | 'cards' | 'inputs' | 'badges';

const VIEWS: { key: ComponentView; label: string }[] = [
  { key: 'buttons', label: '버튼' },
  { key: 'cards', label: '카드' },
  { key: 'inputs', label: '입력' },
  { key: 'badges', label: '배지 & 칩' },
];

function typeStyle(t: ResolvedType): React.CSSProperties {
  return { fontSize: t.size, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing, fontWeight: t.weight };
}

function TokenComponentSet({ t, view }: { t: ResolvedTheme; view: ComponentView }) {
  const { space } = t;
  const base: React.CSSProperties = {
    fontFamily: t.font,
    background: t.bg,
    padding: t.containerPad,
    borderRadius: t.radius.card,
  };

  if (view === 'buttons') {
    return (
      <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: space.sm }}>
        <button
          className="w-full transition-all duration-150 hover:brightness-105 active:scale-[0.97] cursor-pointer"
          style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, background: t.primary, color: t.onPrimary, borderRadius: t.radius.button, padding: `${space.sm}px ${space.lg}px`, border: 'none' }}
        >
          Primary
        </button>
        <button
          className="w-full transition-all duration-150 hover:brightness-[0.97] active:scale-[0.97] cursor-pointer"
          style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightMedium, background: t.surface, color: t.textMain, borderRadius: t.radius.button, padding: `${space.sm}px ${space.lg}px`, border: `1px solid ${t.border}` }}
        >
          Secondary
        </button>
        <button
          className="w-full transition-all duration-150 hover:bg-black/5 active:scale-[0.97] cursor-pointer"
          style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightMedium, background: 'transparent', color: t.primary, borderRadius: t.radius.button, padding: `${space.sm}px ${space.lg}px`, border: `1px solid ${t.primary}` }}
        >
          Outline
        </button>
        <button
          disabled
          style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, background: t.primary, color: t.onPrimary, borderRadius: t.radius.button, padding: `${space.sm}px ${space.lg}px`, border: 'none', opacity: 0.4, cursor: 'not-allowed', width: '100%' }}
        >
          Disabled
        </button>
        <div className="flex" style={{ gap: space.sm }}>
          <button
            className="flex-1 transition-all duration-150 hover:brightness-105 active:scale-95 cursor-pointer"
            style={{ ...typeStyle(t.type.caption), fontWeight: t.weightBold, background: t.primary, color: t.onPrimary, borderRadius: t.radius.button, padding: `${space.xs}px ${space.md}px`, border: 'none' }}
          >
            Small
          </button>
          <button
            className="flex-1 transition-all duration-150 active:scale-95 cursor-pointer"
            style={{ ...typeStyle(t.type.caption), fontWeight: t.weightMedium, background: t.surface, color: t.textMain, borderRadius: t.radius.button, padding: `${space.xs}px ${space.md}px`, border: `1px solid ${t.border}` }}
          >
            Small Ghost
          </button>
        </div>
      </div>
    );
  }

  if (view === 'cards') {
    return (
      <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: space.sm }}>
        <div
          className="cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]"
          style={{ background: t.surface, borderRadius: t.radius.card, padding: t.cardPad, border: `1px solid ${t.border}` }}
        >
          <p style={{ ...typeStyle(t.type.caption), color: t.textSub, marginBottom: space.xs, fontWeight: t.weightMedium }}>카드 서브타이틀</p>
          <p style={{ ...typeStyle(t.type.h2), color: t.textMain, fontWeight: t.weightBold }}>기본 카드</p>
          <p style={{ ...typeStyle(t.type.caption), color: t.textSub, marginTop: space.xs }}>카드 설명 텍스트가 여기 들어갑니다.</p>
        </div>
        <div
          className="cursor-pointer transition-all duration-200 hover:opacity-95 active:scale-[0.99]"
          style={{ background: t.primary, borderRadius: t.radius.card, padding: t.cardPad }}
        >
          <p style={{ ...typeStyle(t.type.caption), color: t.onPrimary, opacity: 0.8, marginBottom: space.xs, fontWeight: t.weightMedium }}>Primary 카드</p>
          <p style={{ ...typeStyle(t.type.h2), color: t.onPrimary, fontWeight: t.weightBold }}>강조 카드</p>
        </div>
        <div style={{ background: t.surface, borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
          {['항목 A', '항목 B', '항목 C'].map((item, i) => (
            <div
              key={item}
              className="flex items-center justify-between cursor-pointer transition-colors hover:bg-black/[0.04]"
              style={{ padding: `${space.sm}px ${space.md}px`, borderBottom: i < 2 ? `1px solid ${t.border}` : 'none' }}
            >
              <span style={{ ...typeStyle(t.type.bodySm), color: t.textMain, fontWeight: t.weightMedium }}>{item}</span>
              <span style={{ ...typeStyle(t.type.caption), color: t.textSub }}>→</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'inputs') {
    return (
      <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: space.md }}>
        <div className="flex flex-col" style={{ gap: space.xs }}>
          <label style={{ ...typeStyle(t.type.caption), color: t.textMain, fontWeight: t.weightMedium }}>레이블</label>
          <div
            className="w-full transition-all hover:border-gray-400"
            style={{ border: `1px solid ${t.border}`, borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`, ...typeStyle(t.type.bodySm), color: t.textMuted, background: t.bg }}
          >
            플레이스홀더 텍스트
          </div>
        </div>
        <div className="flex flex-col" style={{ gap: space.xs }}>
          <label style={{ ...typeStyle(t.type.caption), color: t.textMain, fontWeight: t.weightMedium }}>포커스 상태</label>
          <div
            style={{ border: `2px solid ${t.primary}`, borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`, ...typeStyle(t.type.bodySm), color: t.textMain, background: t.bg, boxShadow: `0 0 0 3px ${t.primary}26` }}
          >
            입력 중인 텍스트
          </div>
        </div>
        <div className="flex flex-col" style={{ gap: space.xs }}>
          <label style={{ ...typeStyle(t.type.caption), color: t.danger, fontWeight: t.weightMedium }}>에러 상태</label>
          <div
            style={{ border: `1px solid ${t.danger}`, borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`, ...typeStyle(t.type.bodySm), color: t.textMain, background: t.bg }}
          >
            잘못된 입력값
          </div>
          <p style={{ ...typeStyle(t.type.caption), color: t.danger }}>올바른 형식으로 입력해주세요.</p>
        </div>
        <div className="flex flex-col" style={{ gap: space.xs }}>
          <label style={{ ...typeStyle(t.type.caption), color: t.textMain, opacity: 0.5, fontWeight: t.weightMedium }}>비활성</label>
          <div
            style={{ border: `1px solid ${t.border}`, borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`, ...typeStyle(t.type.bodySm), color: t.textMuted, background: t.surface, opacity: 0.5 }}
          >
            비활성 상태
          </div>
        </div>
      </div>
    );
  }

  /* badges & chips */
  return (
    <div style={{ ...base, display: 'flex', flexDirection: 'column', gap: space.md }}>
      <div className="flex flex-col" style={{ gap: space.sm }}>
        <p style={{ ...typeStyle(t.type.caption), color: t.textSub, fontWeight: t.weightBold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Badges</p>
        <div className="flex flex-wrap" style={{ gap: space.sm }}>
          {[
            { label: 'Primary', bg: t.primary, fg: t.onPrimary, border: 'none' },
            { label: 'Accent', bg: t.accent, fg: t.onPrimary, border: 'none' },
            { label: 'Error', bg: `${t.danger}22`, fg: t.danger, border: 'none' },
            { label: 'Success', bg: `${t.success}22`, fg: t.success, border: 'none' },
            { label: 'Neutral', bg: t.surface, fg: t.textSub, border: `1px solid ${t.border}` },
          ].map((b) => (
            <span key={b.label} style={{ fontSize: Math.max(9, t.type.caption.size - 2), fontWeight: t.weightBold, padding: `2px ${space.xs + 2}px`, background: b.bg, color: b.fg, borderRadius: t.radius.badge, border: b.border }}>{b.label}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col" style={{ gap: space.sm }}>
        <p style={{ ...typeStyle(t.type.caption), color: t.textSub, fontWeight: t.weightBold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Chips / Tags</p>
        <div className="flex flex-wrap" style={{ gap: space.sm }}>
          {['선택됨', '미선택', '비활성'].map((label, i) => (
            <span
              key={label}
              className={cn('cursor-pointer transition-all hover:opacity-80 active:scale-95', i === 2 && 'opacity-40 pointer-events-none')}
              style={{
                ...typeStyle(t.type.caption),
                fontWeight: t.weightMedium,
                padding: `${space.xs}px ${space.md}px`,
                borderRadius: t.radius.chip,
                background: i === 0 ? t.primary : t.surface,
                color: i === 0 ? t.onPrimary : t.textSub,
                border: i !== 0 ? `1px solid ${t.border}` : 'none',
              }}
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col" style={{ gap: space.sm }}>
        <p style={{ ...typeStyle(t.type.caption), color: t.textSub, fontWeight: t.weightBold, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</p>
        <div className="flex flex-col" style={{ gap: space.xs }}>
          {[
            { dot: t.textMain, label: '활성', sub: '정상 작동 중' },
            { dot: t.textSub, label: '대기', sub: '처리 중' },
            { dot: t.textMuted, label: '오류', sub: '확인 필요' },
          ].map(({ dot, label, sub }) => (
            <div key={label} className="flex items-center cursor-pointer hover:bg-black/[0.03] rounded-md transition-colors" style={{ gap: space.sm, padding: `${space.xs}px ${space.sm}px` }}>
              <span className="rounded-full shrink-0" style={{ width: 8, height: 8, background: dot }} />
              <span style={{ ...typeStyle(t.type.bodySm), color: t.textMain, fontWeight: t.weightMedium }}>{label}</span>
              <span style={{ ...typeStyle(t.type.caption), color: t.textSub }}>{sub}</span>
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
          각 브랜드 토큰(여백·타입·radii·밀도)을 적용한 공통 컴포넌트 — 와이어프레임 · hover / active / disabled 포함
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
              <TokenComponentSet t={resolveTheme(token, 'mobile', 'wireframe')} view={activeView} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
