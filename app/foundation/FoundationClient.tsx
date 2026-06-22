'use client';

import { useState } from 'react';
import { allTokens } from '@/lib/tokens';
import { resolveTheme } from '@/lib/tokens/resolveTheme';
import { typeStyle } from '@/components/ds';
import PillTabs from '@/components/PillTabs';
import { serviceDS } from '@/lib/tokens/serviceTheme';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xl }}>
      {/* 페이지 헤더 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: st.space.sm }}>
        <ServiceText role="caption" weight={st.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: st.textSub }}>
          Foundation
        </ServiceText>
        <ServiceText role="caption" color={st.textMuted}>
          토큰 = 파운데이션 — 컴포넌트보다 작은 구성 요소. 모든 컴포넌트의 컬러·타이포·여백은 이 토큰을 따릅니다.
        </ServiceText>
      </div>

      <PillTabs tabs={CATEGORIES} active={active} onChange={setActive} />

      <div style={{
        borderRadius: t.radius.card,
        overflow: 'hidden',
        padding: t.space.xl,
        border: `1px solid ${t.border}`,
        background: t.surfaceAlt,
      }}>
        {active === 'color'  && <ColorPanel  t={t} />}
        {active === 'type'   && <TypePanel   t={t} />}
        {active === 'space'  && <SpacePanel  t={t} />}
        {active === 'radius' && <RadiusPanel t={t} />}
        {active === 'motion' && <MotionPanel t={t} />}
      </div>
    </div>
  );
}

type Theme = ReturnType<typeof resolveTheme>;

function GroupTitle({ t, children }: { t: Theme; children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: 10,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontWeight: 600,
      color: t.textMuted,
      marginBottom: t.space.md,
    }}>
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
        { name: 'bg',         value: t.bg },
        { name: 'surface',    value: t.surface },
        { name: 'surfaceAlt', value: t.surfaceAlt },
        { name: 'border',     value: t.border },
      ],
    },
    {
      title: '브랜드 / 강조',
      tokens: [
        { name: 'primary',     value: t.primary },
        { name: 'onPrimary',   value: t.onPrimary },
        { name: 'primaryTint', value: t.primaryTint },
        { name: 'accent',      value: t.accent },
      ],
    },
    {
      title: '텍스트',
      tokens: [
        { name: 'textMain',    value: t.textMain },
        { name: 'textSub',     value: t.textSub },
        { name: 'textMuted',   value: t.textMuted },
        { name: 'textOnImage', value: t.textOnImage },
      ],
    },
    {
      title: '상태',
      tokens: [
        { name: 'success', value: t.success },
        { name: 'danger',  value: t.danger },
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.stackGap * 2 }}>
      {groups.map((g) => (
        <div key={g.title}>
          <GroupTitle t={t}>{g.title}</GroupTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.space.md }}>
            {g.tokens.map((tok) => (
              <div key={tok.name} style={{ borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
                <div style={{ height: 64, background: tok.value }} />
                <div style={{
                  padding: `${t.space.sm}px ${t.space.md}px ${t.space.md}px`,
                  background: t.surface,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: t.space.xxs,
                }}>
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
    { name: 'h1',      role: 'h1' },
    { name: 'h2',      role: 'h2' },
    { name: 'body',    role: 'body' },
    { name: 'bodySm',  role: 'bodySm' },
    { name: 'caption', role: 'caption' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xl }}>
      <div>
        <GroupTitle t={t}>타입 스케일</GroupTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.sm }}>
          {roles.map(({ name, role }) => {
            const ts = t.type[role];
            return (
              <div key={name} style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: t.space.lg,
                paddingBottom: t.space.sm,
                borderBottom: `1px solid ${t.border}`,
              }}>
                <span style={{ ...typeStyle(ts), color: t.textMain, fontFamily: t.font }}>다람쥐 Aa 0123</span>
                <span style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted, whiteSpace: 'nowrap' }}>
                  {name} · {ts.size}px / {ts.lineHeight} / w{ts.weight}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <GroupTitle t={t}>웨이트</GroupTitle>
        <div style={{ display: 'flex', gap: t.space.xl, flexWrap: 'wrap' }}>
          {[
            { name: 'regular', w: t.weightRegular },
            { name: 'medium',  w: t.weightMedium },
            { name: 'bold',    w: t.weightBold },
          ].map(({ name, w }) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', gap: t.space.xs }}>
              <div style={{ fontWeight: w, fontSize: 24, color: t.textMain, fontFamily: t.font, lineHeight: 1.2 }}>Aa 가나다</div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted }}>{name} · {w}</div>
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
    { name: 'xxs', value: t.space.xxs },
    { name: 'xs',  value: t.space.xs },
    { name: 'sm',  value: t.space.sm },
    { name: 'md',  value: t.space.md },
    { name: 'lg',  value: t.space.lg },
    { name: 'xl',  value: t.space.xl },
  ];
  const semantic: { name: string; value: number }[] = [
    { name: 'containerPad', value: t.containerPad },
    { name: 'cardPad',      value: t.cardPad },
    { name: 'stackGap',     value: t.stackGap },
    { name: 'rowGap',       value: t.rowGap },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xl }}>
      <div>
        <GroupTitle t={t}>스페이싱 스케일</GroupTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.md }}>
          {scale.map(({ name, value }) => (
            <div key={name} style={{ display: 'flex', alignItems: 'center', gap: t.space.md }}>
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted, width: 32, flexShrink: 0 }}>{name}</span>
              <div style={{ height: 14, width: Math.max(value, 2), background: t.primary, borderRadius: 2 }} />
              <span style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted }}>{value}px</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <GroupTitle t={t}>시맨틱 여백</GroupTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.space.md }}>
          {semantic.map(({ name, value }) => (
            <div key={name} style={{ borderRadius: t.radius.card, padding: t.space.md, border: `1px solid ${t.border}`, background: t.surface }}>
              <div style={{ fontSize: 11, fontWeight: t.weightBold, color: t.textMain, marginBottom: t.space.xs }}>{name}</div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted }}>{value}px</div>
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
    { name: 'card',   value: t.radius.card },
    { name: 'input',  value: t.radius.input },
    { name: 'chip',   value: t.radius.chip },
    { name: 'badge',  value: t.radius.badge },
  ];

  return (
    <div>
      <GroupTitle t={t}>라운드(반경)</GroupTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: t.space.md }}>
        {radii.map(({ name, value }) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: t.space.sm }}>
            <div style={{ width: '100%', height: 64, background: t.surface, border: `1px solid ${t.border}`, borderRadius: value }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: t.weightBold, color: t.textMain, marginBottom: t.space.xxs }}>{name}</div>
              <div style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted }}>{value}</div>
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
    { name: 'duration',   value: `${m.duration}ms` },
    { name: 'easing',     value: m.easing },
    { name: 'pressScale', value: String(m.pressScale) },
    { name: 'hoverScale', value: String(m.hoverScale) },
  ];

  return (
    <div>
      <GroupTitle t={t}>모션 토큰</GroupTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: t.space.md }}>
        {items.map(({ name, value }) => (
          <div key={name} style={{ borderRadius: t.radius.card, padding: t.space.md, border: `1px solid ${t.border}`, background: t.surface }}>
            <div style={{ fontSize: 11, fontWeight: t.weightBold, color: t.textMain, marginBottom: t.space.xs }}>{name}</div>
            <div style={{ fontSize: 10, fontFamily: 'monospace', color: t.textMuted }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
