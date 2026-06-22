'use client';

import { useState } from 'react';
import { allTokens } from '@/lib/tokens';
import { resolveTheme } from '@/lib/tokens/resolveTheme';
import { typeStyle } from '@/components/ds';
import PillTabs from '@/components/PillTabs';
import { serviceDS } from '@/lib/tokens/serviceTheme';

/**
 * Foundation — the design tokens that every component is built from.
 *
 * Foundation = tokens. It sits one level below 컴포넌트 in the dependency chain:
 *
 *     파운데이션(tokens) → 컴포넌트(DS) → 패턴(patterns) → 브랜드 디자인
 *
 * Components must derive their text color, typography and spacing from these
 * tokens — this page is the canonical reference for what those tokens are.
 * The values shown here are the exact ResolvedTheme (wireframe) the component
 * library consumes, so Foundation and Components can never drift apart.
 */

type FoundationCategory = 'color' | 'type' | 'space' | 'radius' | 'motion';

const CATEGORIES: { key: FoundationCategory; label: string }[] = [
  { key: 'color',  label: '컬러' },
  { key: 'type',   label: '타이포그래피' },
  { key: 'space',  label: '여백' },
  { key: 'radius', label: '모서리' },
  { key: 'motion', label: '모션' },
];

const representative = allTokens[0];
const { Text: ServiceText, t: st } = serviceDS;

export default function FoundationClient() {
  const [active, setActive] = useState<FoundationCategory>('color');
  const t = resolveTheme(representative, 'mobile', 'wireframe');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col" style={{ gap: st.space.xs }}>
        <ServiceText role="caption" weight={st.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: st.textSub }}>
          Foundation
        </ServiceText>
        <ServiceText role="caption" color={st.textMuted}>
          토큰 = 파운데이션 — 컴포넌트보다 작은 구성 요소. 모든 컴포넌트의 컬러·타이포·여백은 이 토큰을 따릅니다.
        </ServiceText>
      </div>

      {/* Tab bar — shared PillTabs */}
      <PillTabs tabs={CATEGORIES} active={active} onChange={setActive} />

      {/* 패널 배경은 off-white(void) — 흰색 스와치 카드가 거터로 또렷이 분리되도록 */}
      <div style={{ borderRadius: t.radius.card, overflow: 'hidden', padding: t.containerPad, border: `1px solid ${t.border}`, background: t.surfaceAlt }}>
        {active === 'color' && <ColorPanel t={t} />}
        {active === 'type' && <TypePanel t={t} />}
        {active === 'space' && <SpacePanel t={t} />}
        {active === 'radius' && <RadiusPanel t={t} />}
        {active === 'motion' && <MotionPanel t={t} />}
      </div>
    </div>
  );
}

type Theme = ReturnType<typeof resolveTheme>;

function GroupTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--color-ash)', fontWeight: 600 }}>
      {children}
    </p>
  );
}

/* ── 컬러 ── */
function ColorPanel({ t }: { t: Theme }) {
  const groups: { title: string; tokens: { name: string; value: string }[] }[] = [
    {
      title: '배경 / 표면',
      tokens: [
        { name: 'bg', value: t.bg },
        { name: 'surface', value: t.surface },
        { name: 'surfaceAlt', value: t.surfaceAlt },
        { name: 'border', value: t.border },
      ],
    },
    {
      title: '브랜드 / 강조',
      tokens: [
        { name: 'primary', value: t.primary },
        { name: 'onPrimary', value: t.onPrimary },
        { name: 'primaryTint', value: t.primaryTint },
        { name: 'accent', value: t.accent },
      ],
    },
    {
      title: '텍스트',
      tokens: [
        { name: 'textMain', value: t.textMain },
        { name: 'textSub', value: t.textSub },
        { name: 'textMuted', value: t.textMuted },
        { name: 'textOnImage', value: t.textOnImage },
      ],
    },
    {
      title: '상태',
      tokens: [
        { name: 'success', value: t.success },
        { name: 'danger', value: t.danger },
      ],
    },
  ];
  return (
    <div className="flex flex-col gap-6">
      {groups.map((g) => (
        <div key={g.title}>
          <GroupTitle>{g.title}</GroupTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.space.sm }}>
            {g.tokens.map((tok) => (
              <div key={tok.name} style={{ borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
                <div style={{ height: 56, background: tok.value }} />
                <div style={{ padding: `${t.space.sm}px ${t.space.md}px`, background: t.surface, display: 'flex', flexDirection: 'column', gap: t.space.xxs }}>
                  <span style={{ fontSize: 11, fontWeight: t.weightBold, color: t.textMain, lineHeight: 1.4 }}>{tok.name}</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted, lineHeight: 1.4 }}>{tok.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── 타이포그래피 ── */
function TypePanel({ t }: { t: Theme }) {
  const roles: { name: string; role: keyof Theme['type'] }[] = [
    { name: 'display', role: 'display' },
    { name: 'h1', role: 'h1' },
    { name: 'h2', role: 'h2' },
    { name: 'body', role: 'body' },
    { name: 'bodySm', role: 'bodySm' },
    { name: 'caption', role: 'caption' },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div>
        <GroupTitle>타입 스케일</GroupTitle>
        <div className="flex flex-col gap-4">
          {roles.map(({ name, role }) => {
            const ts = t.type[role];
            return (
              <div key={name} className="flex items-baseline justify-between gap-4 pb-3" style={{ borderBottom: '1px solid var(--color-graphite)' }}>
                <span style={{ ...typeStyle(ts), color: 'var(--color-bone)', fontFamily: t.font }}>다람쥐 Aa 0123</span>
                <span className="text-xs font-mono shrink-0" style={{ color: 'var(--color-ash)' }}>
                  {name} · {ts.size}px / {ts.lineHeight} / w{ts.weight}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <GroupTitle>웨이트</GroupTitle>
        <div className="flex gap-6 flex-wrap">
          {[
            { name: 'regular', w: t.weightRegular },
            { name: 'medium', w: t.weightMedium },
            { name: 'bold', w: t.weightBold },
          ].map(({ name, w }) => (
            <div key={name}>
              <div style={{ fontWeight: w, fontSize: 22, color: 'var(--color-bone)', fontFamily: t.font }}>Aa 가나다</div>
              <div className="text-xs font-mono" style={{ color: 'var(--color-ash)' }}>{name} · {w}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 여백 ── */
function SpacePanel({ t }: { t: Theme }) {
  const scale: { name: string; value: number }[] = [
    { name: 'xs', value: t.space.xs },
    { name: 'sm', value: t.space.sm },
    { name: 'md', value: t.space.md },
    { name: 'lg', value: t.space.lg },
    { name: 'xl', value: t.space.xl },
  ];
  const semantic: { name: string; value: number }[] = [
    { name: 'containerPad', value: t.containerPad },
    { name: 'cardPad', value: t.cardPad },
    { name: 'stackGap', value: t.stackGap },
    { name: 'rowGap', value: t.rowGap },
  ];
  return (
    <div className="flex flex-col gap-6">
      <div>
        <GroupTitle>스페이싱 스케일</GroupTitle>
        <div className="flex flex-col gap-2">
          {scale.map(({ name, value }) => (
            <div key={name} className="flex items-center gap-3">
              <span className="text-xs font-mono shrink-0" style={{ color: 'var(--color-ash)', width: 28 }}>{name}</span>
              <div style={{ height: 16, width: value, background: 'var(--color-bone)', borderRadius: 3 }} />
              <span className="text-xs font-mono" style={{ color: 'var(--color-ash)' }}>{value}px</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <GroupTitle>시맨틱 여백</GroupTitle>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {semantic.map(({ name, value }) => (
            <div key={name} className="rounded-lg p-3" style={{ border: '1px solid var(--color-graphite)' }}>
              <div className="text-xs" style={{ color: 'var(--color-bone)', fontWeight: 600 }}>{name}</div>
              <div className="text-xs font-mono" style={{ color: 'var(--color-ash)' }}>{value}px</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── 모서리 ── */
function RadiusPanel({ t }: { t: Theme }) {
  const radii: { name: string; value: string }[] = [
    { name: 'button', value: t.radius.button },
    { name: 'card', value: t.radius.card },
    { name: 'input', value: t.radius.input },
    { name: 'chip', value: t.radius.chip },
    { name: 'badge', value: t.radius.badge },
  ];
  return (
    <div>
      <GroupTitle>라운드(반경)</GroupTitle>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
        {radii.map(({ name, value }) => (
          <div key={name} className="flex flex-col items-center gap-2">
            <div style={{ width: '100%', height: 64, background: 'var(--color-void)', border: '1px solid var(--color-graphite)', borderRadius: value }} />
            <div className="text-center">
              <div className="text-xs" style={{ color: 'var(--color-bone)', fontWeight: 600 }}>{name}</div>
              <div className="text-xs font-mono" style={{ color: 'var(--color-ash)' }}>{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 모션 ── */
function MotionPanel({ t }: { t: Theme }) {
  const m = t.motion;
  const items: { name: string; value: string }[] = [
    { name: 'duration', value: `${m.duration}ms` },
    { name: 'easing', value: m.easing },
    { name: 'pressScale', value: String(m.pressScale) },
    { name: 'hoverScale', value: String(m.hoverScale) },
  ];
  return (
    <div>
      <GroupTitle>모션 토큰</GroupTitle>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {items.map(({ name, value }) => (
          <div key={name} className="rounded-lg p-3" style={{ border: '1px solid var(--color-graphite)' }}>
            <div className="text-xs" style={{ color: 'var(--color-bone)', fontWeight: 600 }}>{name}</div>
            <div className="text-xs font-mono" style={{ color: 'var(--color-ash)' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
