'use client';

import { useState } from 'react';
import { ResolvedTheme } from '@/lib/tokens/resolveTheme';
import { typeStyle, createDS } from '@/components/ds';
import PillTabs from '@/components/PillTabs';
import { serviceDS, serviceMobileTheme } from '@/lib/tokens/serviceTheme';
import { neutral, hues, HueName } from '@/lib/tokens/palette';
import { lightTokens, darkTokens } from '@/lib/tokens/semanticTokens';
import { lightRoleTokens, darkRoleTokens, lightVariantTokens, darkVariantTokens } from '@/lib/tokens/roleTokens';

type FoundationCategory = 'color' | 'type' | 'space' | 'radius' | 'stroke' | 'motion';

const CATEGORIES: { key: FoundationCategory; label: string }[] = [
  { key: 'color',  label: '컬러' },
  { key: 'type',   label: '타이포그래피' },
  { key: 'space',  label: '여백' },
  { key: 'radius', label: '모서리' },
  { key: 'stroke', label: '스트로크' },
  { key: 'motion', label: '모션' },
];

const { Text: ServiceText, t: st } = serviceDS;

type Theme = ResolvedTheme;

export default function FoundationClient() {
  const [active, setActive] = useState<FoundationCategory>('color');
  const t = serviceMobileTheme;
  const ds = createDS(t, true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xl }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: st.space.sm }}>
        <ServiceText role="caption" weight={st.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: st.textSub }}>
          Foundation
        </ServiceText>
        <ServiceText role="caption" color={st.textMuted}>
          토큰 = 파운데이션 — 모든 컴포넌트의 컬러·타이포·여백은 이 토큰을 따릅니다.
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
        {active === 'color'  && <ColorPanel  t={t} ds={ds} />}
        {active === 'type'   && <TypePanel   t={t} ds={ds} />}
        {active === 'space'  && <SpacePanel  t={t} ds={ds} />}
        {active === 'radius' && <RadiusPanel t={t} ds={ds} />}
        {active === 'stroke' && <StrokePanel t={t} ds={ds} />}
        {active === 'motion' && <MotionPanel t={t} ds={ds} />}
      </div>
    </div>
  );
}

/* ── 공통 헬퍼 ── */
// DS 타입 스케일 shorthand — 모든 레이블은 반드시 이 토큰을 통해 크기를 결정
const cap = (t: Theme) => ({
  fontSize: t.type.caption.size,
  lineHeight: t.type.caption.lineHeight,
  letterSpacing: t.type.caption.letterSpacing,
} as const);

const bodySm = (t: Theme) => ({
  fontSize: t.type.bodySm.size,
  lineHeight: t.type.bodySm.lineHeight,
  letterSpacing: t.type.bodySm.letterSpacing,
} as const);

function SectionTitle({ t, children }: { t: Theme; children: React.ReactNode }) {
  return (
    <p style={{ ...bodySm(t), fontWeight: t.weightBold, color: t.textMain, marginBottom: t.space.xl }}>
      {children}
    </p>
  );
}

function Section({ t, title, children, first = false }: { t: Theme; title: string; children: React.ReactNode; first?: boolean }) {
  return (
    <div style={{
      paddingTop: first ? 0 : t.space.xl * 2,
      borderTop: first ? 'none' : `1px solid ${t.border}`,
    }}>
      <SectionTitle t={t}>{title}</SectionTitle>
      {children}
    </div>
  );
}

function TokenLabel({ t, name, value, sub }: { t: Theme; name: string; value: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xxs }}>
      <span style={{ ...cap(t), fontWeight: t.weightBold, color: t.textMain }}>{name}</span>
      <span style={{ ...cap(t), color: t.textMuted }}>{value}</span>
      {sub && <span style={{ ...cap(t), color: t.textMuted }}>{sub}</span>}
    </div>
  );
}

/* ══════════════════════════════════════════
   컬러 패널
══════════════════════════════════════════ */
function ColorPanel({ t }: { t: Theme; ds: ReturnType<typeof createDS> }) {
  const neutralSteps = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, 1000] as const;

  const HUE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  const hueNames = Object.keys(hues) as HueName[];

  const semanticGroups = [
    { key: 'Fill',       prefix: '--color-fill-',   roles: ['normal','strong','alternative','neutral','neutral-alt','brand','brand-weak'] },
    { key: 'Text',       prefix: '--color-text-',   roles: ['normal','alternative','assistive','disabled','on-fill','brand'] },
    { key: 'Border',     prefix: '--color-border-', roles: ['normal','strong','weak','brand','focus'] },
    { key: 'Background', prefix: '--color-bg-',     roles: ['normal','alt','elevated'] },
  ];

  const roleGroups = [
    { comp: 'button', label: 'Button' },
    { comp: 'badge',  label: 'Badge'  },
    { comp: 'chip',   label: 'Chip'   },
    { comp: 'input',  label: 'Input'  },
    { comp: 'card',   label: 'Card'   },
    { comp: 'navtab', label: 'NavTab' },
  ];

  const variantGroups = [
    { comp: 'button', label: 'Button' },
    { comp: 'chip',   label: 'Chip'   },
    { comp: 'card',   label: 'Card'   },
    { comp: 'input',  label: 'Input'  },
    { comp: 'navtab', label: 'NavTab' },
  ];

  /* ── 로컬 서브 컴포넌트 ── */

  // 티어 헤더: 번호 배지 + 이름 + 설명
  const TierHeader = ({ num, label, desc, first }: { num: string; label: string; desc: string; first?: boolean }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: t.space.sm,
      paddingTop: first ? 0 : t.space.xl * 2,
      paddingBottom: t.space.md,
      borderTop: first ? 'none' : `1px solid ${t.border}`,
    }}>
      <span style={{
        ...cap(t),
        fontFamily: 'monospace',
        fontWeight: t.weightBold,
        color: t.textMuted,
        background: t.surface,
        border: `1px solid ${t.border}`,
        borderRadius: 4,
        padding: '2px 5px',
        flexShrink: 0,
      }}>{num}</span>
      <span style={{ ...bodySm(t), fontWeight: t.weightBold, color: t.textMain }}>{label}</span>
      <span style={{ ...cap(t), color: t.textMuted }}>{desc}</span>
    </div>
  );

  // 그룹 레이블 (FILL, BUTTON 등)
  const GroupLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{
      ...cap(t),
      fontWeight: t.weightMedium,
      color: t.textSub,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
      marginTop: t.space.lg,
      marginBottom: 2,
      paddingBottom: t.space.xs,
      borderBottom: `1px solid ${t.border}`,
    }}>{children}</div>
  );

  // 컬럼 헤더 (☀ light / ◑ dark)
  const ColHeader = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 110px', gap: t.space.xs, padding: `${t.space.xs}px 0`, marginBottom: 1 }}>
      <span />
      <span style={{ ...cap(t), color: t.textMuted }}>☀ light</span>
      <span style={{ ...cap(t), color: t.textMuted }}>◑ dark</span>
    </div>
  );

  // 통일 토큰 행
  const TRow = ({ name, light, dark }: { name: string; light: string; dark: string }) => (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 110px 110px',
      gap: t.space.xs,
      alignItems: 'center',
      padding: `6px 0`,
      borderBottom: `1px solid ${t.border}`,
    }}>
      <span style={{ ...cap(t), fontFamily: 'monospace', color: t.textSub }}>{name}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: light, border: `1px solid ${t.border}`, flexShrink: 0 }} />
        <span style={{ ...cap(t), fontFamily: 'monospace', color: t.textMuted }}>{light}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <div style={{ width: 12, height: 12, borderRadius: 3, background: dark, border: `1px solid ${t.border}`, flexShrink: 0 }} />
        <span style={{ ...cap(t), fontFamily: 'monospace', color: t.textMuted }}>{dark}</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* ─── TIER 1: Palette ─────────────────────────── */}
      <TierHeader num="1" label="Palette" desc="원시값 — OKLCH 기반 뉴트럴 13단계 + 상태색 5종" first />

      {/* 뉴트럴 바 */}
      <GroupLabel>Neutral</GroupLabel>
      <div style={{ display: 'flex', borderRadius: t.radius.badge, overflow: 'hidden', height: 36, border: `1px solid ${t.border}`, marginTop: t.space.xs }}>
        {neutralSteps.map((step) => (
          <div key={step} style={{ flex: 1, background: neutral[step].hex }} />
        ))}
      </div>
      <div style={{ display: 'flex', marginTop: 3 }}>
        {neutralSteps.map((step) => (
          <div key={step} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: t.textMuted, lineHeight: 1.4 }}>{step}</div>
        ))}
      </div>
      {/* OKLCH 대표값 4개 */}
      <div style={{ display: 'flex', gap: t.space.xs, marginTop: t.space.sm, flexWrap: 'wrap' as const }}>
        {([0, 300, 700, 1000] as const).map((step) => {
          const n = neutral[step];
          const isLight = step < 500;
          return (
            <div key={step} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '3px 7px', borderRadius: t.radius.badge,
              background: n.hex, border: `1px solid ${t.border}`,
            }}>
              <span style={{ ...cap(t), fontFamily: 'monospace', color: t.textSub }}>{step}</span>
              <span style={{ ...cap(t), fontFamily: 'monospace', color: t.textMuted }}>{n.oklch}</span>
            </div>
          );
        })}
      </div>

      {/* 컬러 패밀리 */}
      <GroupLabel>Hues</GroupLabel>
      {/* 스텝 헤더 */}
      <div style={{ display: 'grid', gridTemplateColumns: '52px repeat(11, 1fr)', gap: 2, marginTop: t.space.xs, marginBottom: 2 }}>
        <span />
        {HUE_STEPS.map((s) => (
          <span key={s} style={{ fontSize: 10, color: t.textMuted, textAlign: 'center', lineHeight: 1.4 }}>{s}</span>
        ))}
      </div>
      {hueNames.map((name) => (
        <div key={name} style={{ display: 'grid', gridTemplateColumns: '52px repeat(11, 1fr)', gap: 2, marginBottom: 2 }}>
          <span style={{ ...cap(t), color: t.textSub, alignSelf: 'center', paddingRight: t.space.xs }}>{name}</span>
          {HUE_STEPS.map((step) => {
            const entry = hues[name][step];
            return (
              <div
                key={step}
                title={`${name}-${step}: ${entry.hex}\n${entry.oklch}`}
                style={{
                  height: 28,
                  borderRadius: t.radius.badge,
                  background: entry.hex,
                  border: `1px solid ${t.border}`,
                }}
              />
            );
          })}
        </div>
      ))}

      {/* ─── TIER 2: Semantic ────────────────────────── */}
      <TierHeader num="2" label="Semantic" desc="의미 기반 역할 맵핑 — --color-{category}-{role}" />
      <ColHeader />
      {semanticGroups.map(({ key, prefix, roles }) => (
        <div key={key}>
          <GroupLabel>{key}</GroupLabel>
          {roles.map((role) => {
            const tokenKey = `${prefix}${role}`;
            return (
              <TRow
                key={role}
                name={tokenKey}
                light={lightTokens[tokenKey] ?? '—'}
                dark={darkTokens[tokenKey] ?? '—'}
              />
            );
          })}
        </div>
      ))}

      {/* ─── TIER 3: Role ────────────────────────────── */}
      <TierHeader num="3" label="Role" desc="컴포넌트 슬롯 바인딩 — --comp-{component}-{slot}" />
      <ColHeader />
      {roleGroups.map(({ comp, label }) => {
        const keys = Object.keys(lightRoleTokens).filter(k => k.startsWith(`--comp-${comp}-`));
        return (
          <div key={comp}>
            <GroupLabel>{label}</GroupLabel>
            {keys.map((key) => (
              <TRow
                key={key}
                name={key.replace(`--comp-${comp}-`, '')}
                light={lightRoleTokens[key] ?? '—'}
                dark={darkRoleTokens[key] ?? '—'}
              />
            ))}
          </div>
        );
      })}

      {/* ─── TIER 4: Variant ─────────────────────────── */}
      <TierHeader num="4" label="Variant" desc="인터랙션 상태 오버라이드 — --comp-{component}-{slot}-{state}" />
      <ColHeader />
      {variantGroups.map(({ comp, label }) => {
        const keys = Object.keys(lightVariantTokens).filter(k => k.startsWith(`--comp-${comp}-`));
        return (
          <div key={comp}>
            <GroupLabel>{label}</GroupLabel>
            {keys.map((key) => (
              <TRow
                key={key}
                name={key.replace(`--comp-${comp}-`, '')}
                light={lightVariantTokens[key] ?? '—'}
                dark={darkVariantTokens[key] ?? '—'}
              />
            ))}
          </div>
        );
      })}

    </div>
  );
}

/* ══════════════════════════════════════════
   스트로크 패널
══════════════════════════════════════════ */
function StrokePanel({ t, ds }: { t: Theme; ds: ReturnType<typeof createDS> }) {
  const { Table } = ds;
  const widths = [
    { name: 'hairline', w: 0.5, desc: '구분선 (미세)' },
    { name: 'thin',     w: 1,   desc: '기본 테두리 / 구분선' },
    { name: 'medium',   w: 1.5, desc: '포커스 인풋 / 선택 상태' },
    { name: 'thick',    w: 2,   desc: '활성 탭 인디케이터' },
    { name: 'heavy',    w: 3,   desc: '강조 액센트 바' },
  ] as const;
  const colorRoles = [
    { role: 'normal', light: lightTokens['--color-border-normal'], dark: darkTokens['--color-border-normal'], desc: '기본 테두리' },
    { role: 'strong', light: lightTokens['--color-border-strong'], dark: darkTokens['--color-border-strong'], desc: '강조 테두리' },
    { role: 'weak',   light: lightTokens['--color-border-weak'],   dark: darkTokens['--color-border-weak'],   desc: '연한 구분선' },
    { role: 'brand',  light: lightTokens['--color-border-brand'],  dark: darkTokens['--color-border-brand'],  desc: '브랜드 테두리' },
    { role: 'focus',  light: lightTokens['--color-border-focus'],  dark: darkTokens['--color-border-focus'],  desc: '포커스 링' },
    { role: 'danger', light: lightTokens['--color-border-danger'], dark: darkTokens['--color-border-danger'], desc: '에러 인풋' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Section t={t} title="굵기 (Width)" first>
        <Table
          rows={widths.map(({ name, w, desc }) => ({
            label: name,
            value: (
              <div style={{ display: 'flex', alignItems: 'center', gap: t.space.md, flex: 1 }}>
                <div style={{ flex: 1, height: w, background: t.textMain, borderRadius: w, maxWidth: 160 }} />
                <span style={{ ...cap(t), color: t.textMuted, fontFamily: 'monospace', width: 36 }}>{w}px</span>
                <span style={{ ...cap(t), color: t.textMuted }}>{desc}</span>
              </div>
            ),
          }))}
        />
      </Section>

      <Section t={t} title="컬러 역할 (Color Role)">
        <Table
          rows={colorRoles.map(({ role, light, dark, desc }) => ({
            label: role,
            value: (
              <div style={{ display: 'flex', gap: t.space.lg, flex: 1, alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: t.space.sm, flex: 1 }}>
                  <div style={{ width: 20, height: 20, borderRadius: t.radius.badge, border: `2px solid ${light ?? t.border}`, background: t.bg, flexShrink: 0 }} />
                  <span style={{ ...cap(t), color: t.textMuted, fontFamily: 'monospace' }}>☀ {light ?? '—'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: t.space.sm, flex: 1 }}>
                  <div style={{ width: 20, height: 20, borderRadius: t.radius.badge, border: `2px solid ${dark ?? t.border}`, background: '#18181b', flexShrink: 0 }} />
                  <span style={{ ...cap(t), color: t.textMuted, fontFamily: 'monospace' }}>◑ {dark ?? '—'}</span>
                </div>
                <span style={{ ...cap(t), color: t.textMuted, width: 100, flexShrink: 0 }}>{desc}</span>
              </div>
            ),
          }))}
        />
      </Section>
    </div>
  );
}

/* ══════════════════════════════════════════
   타이포그래피 패널
══════════════════════════════════════════ */
function TypePanel({ t, ds }: { t: Theme; ds: ReturnType<typeof createDS> }) {
  const { Table, TokenCard, Card } = ds;
  const roles: { name: string; role: keyof Theme['type']; sample: string }[] = [
    { name: 'display', role: 'display', sample: '브랜드 디자인을 코드로' },
    { name: 'h1',      role: 'h1',      sample: '디자인 시스템 파운데이션' },
    { name: 'h2',      role: 'h2',      sample: '컴포넌트 라이브러리 구조' },
    { name: 'body',    role: 'body',    sample: '사용자가 직접 확인할 수 있는 디자인 토큰 기반의 일관된 UI 시스템입니다.' },
    { name: 'bodySm',  role: 'bodySm',  sample: '모든 컴포넌트의 컬러·여백·타이포그래피는 파운데이션 토큰을 따릅니다.' },
    { name: 'caption', role: 'caption', sample: '라이트·다크 모드 / WCAG AA 대비비 / OKLCH 균등 명도' },
  ];

  const pretendardWeights = [100, 200, 300, 400, 500, 600, 700, 800, 900];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* 1. 폰트 정보 */}
      <Section t={t} title="서체 — Pretendard Variable" first>
        <Card style={{ padding: t.space.lg }}>
          <div style={{ fontSize: t.type.display.size, fontFamily: t.font, fontWeight: t.weightBold, color: t.textMain, letterSpacing: t.type.display.letterSpacing, lineHeight: t.type.display.lineHeight, marginBottom: t.space.md }}>
            가나다라마바사 Aa Bb
          </div>
          <Table
            rows={[
              { label: '종류', value: 'Variable Font' },
              { label: '웨이트', value: '100 – 900' },
              { label: '한글 지원', value: '완성형 11,172자' },
              { label: '최적화', value: 'Dynamic Subset' },
            ]}
          />
        </Card>
      </Section>

      {/* 2. 타입 스케일 */}
      <Section t={t} title="타입 스케일 — 한글 최적화 행간·자간">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {roles.map(({ name, role, sample }) => {
            const ts = t.type[role];
            return (
              <div key={name} style={{
                display: 'grid',
                gridTemplateColumns: '120px 1fr',
                gap: t.space.lg,
                alignItems: 'start',
                padding: `${t.space.xl}px 0`,
                borderBottom: `1px solid ${t.border}`,
              }}>
                {/* 메타 */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xs, paddingTop: 4 }}>
                  <span style={{ ...cap(t), fontWeight: t.weightBold, color: t.textSub }}>{name}</span>
                  <span style={{ ...cap(t), color: t.textMuted }}>{ts.size}px</span>
                  <span style={{ ...cap(t), color: t.textMuted }}>lh {ts.lineHeight}</span>
                  <span style={{ ...cap(t), color: t.textMuted }}>ls {ts.letterSpacing}</span>
                  <span style={{ ...cap(t), color: t.textMuted }}>w{ts.weight}</span>
                </div>
                {/* 샘플 텍스트 */}
                <span style={{ ...typeStyle(ts), color: t.textMain, fontFamily: t.font }}>
                  {sample}
                </span>
              </div>
            );
          })}
        </div>
      </Section>

      {/* 3. 행간 비교 */}
      <Section t={t} title="행간(line-height) — 한글 네모꼴 자소 밀도 기준">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: t.space.md }}>
          {[
            { label: '1.4 (부족)', lh: 1.4, note: '한글에서 답답하게 느껴짐' },
            { label: '1.65 (권장)', lh: 1.65, note: 'body 기준 최적 행간' },
          ].map(({ label, lh, note }) => (
            <div key={label} style={{ borderRadius: t.radius.card, padding: t.space.md, background: t.surface, border: `1px solid ${t.border}` }}>
              <div style={{ ...cap(t), color: t.textMuted, marginBottom: t.space.sm }}>{label}</div>
              <p style={{ ...bodySm(t), lineHeight: lh, color: t.textMain, fontFamily: t.font, margin: 0 }}>
                사용자가 직접 확인할 수 있는 디자인 토큰 기반의 일관된 UI 시스템입니다. 컴포넌트 라이브러리와 파운데이션은 항상 동기화됩니다.
              </p>
              <div style={{ marginTop: t.space.sm, ...cap(t), color: t.textMuted }}>{note}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* 4. 자간 비교 */}
      <Section t={t} title="자간(letter-spacing) — 역할별 타이트 조정">
        <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.sm }}>
          {[
            { label: 'display (-0.04em)', ls: '-0.04em', size: 28, text: '브랜드 디자인 시스템' },
            { label: 'body (-0.01em)',    ls: '-0.01em', size: 16, text: '브랜드 디자인 시스템 — 기본 본문 텍스트' },
            { label: 'caption (0em)',     ls: '0em',     size: 12, text: '브랜드 디자인 시스템 — 캡션 레벨 텍스트' },
          ].map(({ label, ls, size, text }) => (
            <div key={label} style={{
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: t.space.lg,
              padding: `${t.space.sm}px 0`,
              borderBottom: `1px solid ${t.border}`,
            }}>
              <span style={{ fontSize: size, letterSpacing: ls, color: t.textMain, fontFamily: t.font, fontWeight: 400 }}>{text}</span>
              <span style={{ ...cap(t), color: t.textMuted, flexShrink: 0 }}>{label}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. 타이틀 계층 */}
      <Section t={t} title="타이틀 계층 — 페이지·섹션·레이블 3단계">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            {
              level: '페이지 타이틀',
              desc: 'h1 · bold · 가장 강한 시각 강조',
              node: <span style={{ ...typeStyle(t.type.h1), fontWeight: t.weightBold, color: t.textMain, fontFamily: t.font }}>페이지 타이틀</span>,
            },
            {
              level: '섹션 타이틀',
              desc: 'bodySm · bold · 콘텐츠 그룹 진입점',
              node: <span style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, color: t.textMain, fontFamily: t.font }}>섹션 타이틀</span>,
            },
            {
              level: '인라인 레이블',
              desc: 'caption · medium · 보조 정보',
              node: <span style={{ ...typeStyle(t.type.caption), fontWeight: t.weightMedium, color: t.textSub, fontFamily: t.font }}>인라인 레이블 · 메타 정보</span>,
            },
          ].map(({ level, desc, node }) => (
            <div key={level} style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr',
              gap: t.space.lg,
              alignItems: 'center',
              padding: `${t.space.lg}px 0`,
              borderBottom: `1px solid ${t.border}`,
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xxs }}>
                <span style={{ ...cap(t), fontWeight: t.weightBold, color: t.textSub }}>{level}</span>
                <span style={{ ...cap(t), color: t.textMuted }}>{desc}</span>
              </div>
              {node}
            </div>
          ))}
        </div>
      </Section>

      {/* 6. 웨이트 스케일 */}
      <Section t={t} title="웨이트 스케일 — Pretendard 100–900">
        <Table
          rows={pretendardWeights.map((w) => {
            const isUsed = [t.weightRegular, t.weightMedium, t.weightBold].includes(w);
            return {
              label: `${w}${isUsed ? ' ★' : ''}`,
              value: (
                <span style={{ fontSize: t.type.h2.size, fontWeight: w, color: isUsed ? t.textMain : t.textMuted, fontFamily: t.font, letterSpacing: t.type.h2.letterSpacing, opacity: isUsed ? 1 : 0.5 }}>
                  가나다라 Aa 0123
                </span>
              ),
            };
          })}
        />
        <div style={{ ...cap(t), color: t.textMuted, marginTop: t.space.sm }}>★ = 디자인 시스템 사용 웨이트 (regular·medium·bold)</div>
      </Section>
    </div>
  );
}

/* ══════════════════════════════════════════
   여백 패널
══════════════════════════════════════════ */
function SpacePanel({ t, ds }: { t: Theme; ds: ReturnType<typeof createDS> }) {
  const { Table, TokenCard } = ds;
  const scale: { name: string; value: number }[] = [
    { name: 'xxs', value: t.space.xxs },
    { name: 'xs',  value: t.space.xs },
    { name: 'sm',  value: t.space.sm },
    { name: 'md',  value: t.space.md },
    { name: 'lg',  value: t.space.lg },
    { name: 'xl',  value: t.space.xl },
  ];
  const semantic: { name: string; value: number; desc: string }[] = [
    { name: 'containerPad', value: t.containerPad, desc: '페이지/섹션 내부 패딩' },
    { name: 'cardPad',      value: t.cardPad,      desc: '카드 컴포넌트 내부 패딩' },
    { name: 'stackGap',     value: t.stackGap,     desc: '수직 스택 아이템 간격' },
    { name: 'rowGap',       value: t.rowGap,       desc: '리스트 행 간격' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Section t={t} title="스페이싱 스케일" first>
        <Table
          rows={scale.map(({ name, value }) => ({
            label: name,
            value: (
              <div style={{ display: 'flex', alignItems: 'center', gap: t.space.md }}>
                <div style={{ height: 14, width: Math.max(value, 2), background: t.primary, borderRadius: 2, flexShrink: 0 }} />
                <span style={{ ...cap(t), color: t.textMuted, fontFamily: 'monospace' }}>{value}px</span>
              </div>
            ),
          }))}
        />
      </Section>

      <Section t={t} title="시맨틱 여백">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: t.space.md }}>
          {semantic.map(({ name, value, desc }) => (
            <TokenCard key={name} name={name} value={`${value}px`} desc={desc} />
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ══════════════════════════════════════════
   모서리 패널
══════════════════════════════════════════ */
function RadiusPanel({ t, ds }: { t: Theme; ds: ReturnType<typeof createDS> }) {
  const { Table } = ds;
  const radii = [
    { name: 'button', value: t.radius.button, desc: '버튼' },
    { name: 'card',   value: t.radius.card,   desc: '카드' },
    { name: 'input',  value: t.radius.input,  desc: '입력창' },
    { name: 'chip',   value: t.radius.chip,   desc: '칩/필터' },
    { name: 'badge',  value: t.radius.badge,  desc: '뱃지' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Section t={t} title="라운드(반경)" first>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: t.space.lg, marginBottom: t.space.xl }}>
          {radii.map(({ name, value, desc }) => (
            <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: t.space.sm }}>
              <div style={{ width: '100%', height: 64, background: t.primaryTint, border: `1px solid ${t.primary}`, borderRadius: value }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...cap(t), fontWeight: t.weightBold, color: t.textMain, marginBottom: t.space.xxs }}>{name}</div>
                <div style={{ ...cap(t), color: t.primary }}>{value}</div>
                <div style={{ ...cap(t), color: t.textMuted }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
        <Table
          rows={radii.map(({ name, value, desc }) => ({
            label: name,
            value: `${value}`,
            tone: 'muted' as const,
          }))}
        />
      </Section>
    </div>
  );
}

/* ══════════════════════════════════════════
   모션 패널
══════════════════════════════════════════ */
function MotionPanel({ t, ds }: { t: Theme; ds: ReturnType<typeof createDS> }) {
  const { Table, TokenCard } = ds;
  const m = t.motion;
  const dur = m.duration;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <style>{`
        @keyframes fd-slide {
          0%   { transform: translateX(0); }
          45%  { transform: translateX(calc(100% - 88px)); }
          55%  { transform: translateX(calc(100% - 88px)); }
          100% { transform: translateX(0); }
        }
        @keyframes fd-press {
          0%, 100% { transform: scale(1); }
          35%, 55% { transform: scale(${m.pressScale}); }
        }
        @keyframes fd-hover {
          0%, 100% { transform: scale(1); }
          35%, 55% { transform: scale(${m.hoverScale}); }
        }
        @keyframes fd-fade {
          0%, 100% { opacity: 1; }
          35%, 55% { opacity: 0.08; }
        }
      `}</style>

      {/* ── 토큰 ── */}
      <Section t={t} title="토큰" first>
        <Table
          rows={[
            { label: 'duration',   value: `${dur}ms`,       tone: 'default' as const },
            { label: 'easing',     value: m.easing,         tone: 'default' as const },
            { label: 'pressScale', value: String(m.pressScale), tone: 'default' as const },
            { label: 'hoverScale', value: String(m.hoverScale), tone: 'default' as const },
          ]}
        />
      </Section>

      {/* ── 미리보기 ── */}
      <Section t={t} title="애니메이션 미리보기">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: t.space.md }}>

          {/* Slide */}
          <div style={{ borderRadius: t.radius.card, border: `1px solid ${t.border}`, background: t.surface, padding: t.space.lg, display: 'flex', flexDirection: 'column', gap: t.space.sm }}>
            <div>
              <div style={{ ...bodySm(t), fontWeight: t.weightBold, color: t.textMain }}>Slide</div>
              <div style={{ ...cap(t), color: t.textMuted }}>{dur}ms · {m.easing}</div>
            </div>
            <div style={{ position: 'relative', height: 44, background: t.surfaceAlt, borderRadius: t.radius.input, overflow: 'hidden', border: `1px solid ${t.border}` }}>
              <div style={{
                position: 'absolute',
                left: 6,
                top: 6,
                height: 32,
                width: 80,
                borderRadius: t.radius.chip,
                background: t.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: `fd-slide ${dur * 3}ms ${m.easing} infinite`,
              }}>
                <span style={{ ...cap(t), color: t.onPrimary, fontWeight: t.weightBold }}>토스트</span>
              </div>
            </div>
            <div style={{ ...cap(t), color: t.textMuted }}>표시 전환 · 드로어 · 토스트</div>
          </div>

          {/* Press Scale */}
          <div style={{ borderRadius: t.radius.card, border: `1px solid ${t.border}`, background: t.surface, padding: t.space.lg, display: 'flex', flexDirection: 'column', gap: t.space.sm }}>
            <div>
              <div style={{ ...bodySm(t), fontWeight: t.weightBold, color: t.textMain }}>Press Scale</div>
              <div style={{ ...cap(t), color: t.textMuted }}>scale({m.pressScale}) — 탭/클릭 시 축소</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 56 }}>
              <div style={{
                padding: '10px 24px',
                borderRadius: t.radius.button,
                background: t.primary,
                color: t.onPrimary,
                fontSize: t.type.bodySm.size,
                fontWeight: t.weightBold,
                animation: `fd-press ${dur * 4}ms ${m.easing} infinite`,
                cursor: 'pointer',
                userSelect: 'none' as const,
                letterSpacing: '-0.01em',
              }}>
                버튼
              </div>
            </div>
            <div style={{ ...cap(t), color: t.textMuted }}>버튼 · 아이콘 버튼 · 리스트 행</div>
          </div>

          {/* Hover Scale */}
          <div style={{ borderRadius: t.radius.card, border: `1px solid ${t.border}`, background: t.surface, padding: t.space.lg, display: 'flex', flexDirection: 'column', gap: t.space.sm }}>
            <div>
              <div style={{ ...bodySm(t), fontWeight: t.weightBold, color: t.textMain }}>Hover Scale</div>
              <div style={{ ...cap(t), color: t.textMuted }}>scale({m.hoverScale}) — 호버 시 확대</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 56 }}>
              <div style={{
                padding: '10px 18px',
                borderRadius: t.radius.card,
                background: t.primaryTint,
                border: `1px solid ${t.primary}`,
                textAlign: 'center',
                animation: `fd-hover ${dur * 4}ms ${m.easing} infinite`,
              }}>
                <div style={{ ...cap(t), fontWeight: t.weightBold, color: t.primary }}>카드</div>
                <div style={{ ...cap(t), color: t.textMuted, marginTop: 2 }}>콘텐츠</div>
              </div>
            </div>
            <div style={{ ...cap(t), color: t.textMuted }}>카드 · 썸네일 · 인터랙티브 셀</div>
          </div>

          {/* Fade */}
          <div style={{ borderRadius: t.radius.card, border: `1px solid ${t.border}`, background: t.surface, padding: t.space.lg, display: 'flex', flexDirection: 'column', gap: t.space.sm }}>
            <div>
              <div style={{ ...bodySm(t), fontWeight: t.weightBold, color: t.textMain }}>Fade</div>
              <div style={{ ...cap(t), color: t.textMuted }}>{dur}ms — 표시·숨김 전환</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 56 }}>
              <div style={{
                padding: '10px 16px',
                borderRadius: t.radius.card,
                background: t.surfaceAlt,
                border: `1px solid ${t.border}`,
                animation: `fd-fade ${dur * 4}ms ${m.easing} infinite`,
                width: 110,
              }}>
                <div style={{ height: 7, background: t.textMuted, borderRadius: 4, opacity: 0.4 }} />
                <div style={{ height: 7, background: t.textMuted, borderRadius: 4, width: '65%', opacity: 0.25, marginTop: 5 }} />
                <div style={{ height: 7, background: t.textMuted, borderRadius: 4, width: '80%', opacity: 0.25, marginTop: 5 }} />
              </div>
            </div>
            <div style={{ ...cap(t), color: t.textMuted }}>모달 · 오버레이 · 스켈레톤</div>
          </div>

        </div>
      </Section>
    </div>
  );
}
