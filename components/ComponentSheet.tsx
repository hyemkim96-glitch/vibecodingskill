'use client';

import React from 'react';
import { BrandToken } from '@/types/token';
import { cn } from '@/lib/utils';
import { resolveTheme, ResolvedTheme, ResolvedType } from '@/lib/tokens/resolveTheme';
import { ServiceType } from '@/lib/serviceCategories';

/**
 * ComponentSheet — a single wireframe "kitchen-sink" of the UI components a
 * given service type uses, laid out together (bento/masonry). Token-driven
 * structure (spacing, type, radii, density), neutral grayscale palette.
 */

function ts(t: ResolvedType): React.CSSProperties {
  return { fontSize: t.size, lineHeight: t.lineHeight, letterSpacing: t.letterSpacing, fontWeight: t.weight };
}

export default function ComponentSheet({
  token,
  service,
}: {
  token: BrandToken;
  service: ServiceType;
}) {
  const t: ResolvedTheme = resolveTheme(token, 'mobile', 'wireframe');
  const { space } = t;

  /* ── primitives ── */
  const Tile = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div
      className="break-inside-avoid"
      style={{ marginBottom: space.md, background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius.card, padding: t.cardPad }}
    >
      <p style={{ ...ts(t.type.caption), color: t.textSub, fontWeight: t.weightBold, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: space.sm }}>
        {title}
      </p>
      <div className="flex flex-col" style={{ gap: space.sm }}>{children}</div>
    </div>
  );

  const Btn = ({ children, variant = 'primary', disabled = false }: { children: React.ReactNode; variant?: 'primary' | 'secondary' | 'outline'; disabled?: boolean }) => (
    <button
      disabled={disabled}
      className={cn('w-full transition-all duration-150 active:scale-[0.97] cursor-pointer', !disabled && 'hover:brightness-[0.97]', disabled && 'opacity-40 pointer-events-none')}
      style={{
        ...ts(t.type.bodySm), fontWeight: t.weightBold,
        background: variant === 'primary' ? t.primary : variant === 'secondary' ? t.surface : 'transparent',
        color: variant === 'primary' ? t.onPrimary : variant === 'outline' ? t.primary : t.textMain,
        border: variant === 'outline' ? `1px solid ${t.primary}` : variant === 'secondary' ? `1px solid ${t.border}` : 'none',
        borderRadius: t.radius.button, padding: `${space.sm}px ${space.lg}px`,
      }}
    >
      {children}
    </button>
  );

  const Input = ({ label, placeholder, focus = false }: { label: string; placeholder: string; focus?: boolean }) => (
    <div className="flex flex-col" style={{ gap: space.xs }}>
      <label style={{ ...ts(t.type.caption), color: t.textMain, fontWeight: t.weightMedium }}>{label}</label>
      <div style={{ border: focus ? `2px solid ${t.primary}` : `1px solid ${t.border}`, borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`, background: t.bg, boxShadow: focus ? `0 0 0 3px ${t.primary}26` : 'none' }}>
        <span style={{ ...ts(t.type.bodySm), color: focus ? t.textMain : t.textMuted }}>{placeholder}</span>
      </div>
    </div>
  );

  const Badge = ({ children, tone }: { children: React.ReactNode; tone: 'solid' | 'soft' | 'muted' }) => {
    const map = {
      solid: { bg: t.primary, fg: t.onPrimary, bd: 'none' },
      soft: { bg: t.primaryTint, fg: t.primary, bd: 'none' },
      muted: { bg: t.surface, fg: t.textSub, bd: `1px solid ${t.border}` },
    } as const;
    const s = map[tone];
    return <span style={{ fontSize: Math.max(10, t.type.caption.size - 1), fontWeight: t.weightBold, padding: `2px ${space.xs + 3}px`, background: s.bg, color: s.fg, border: s.bd, borderRadius: t.radius.badge }}>{children}</span>;
  };

  const Chip = ({ children, active = false }: { children: React.ReactNode; active?: boolean }) => (
    <span style={{ ...ts(t.type.caption), fontWeight: t.weightMedium, padding: `${space.xs}px ${space.md}px`, borderRadius: t.radius.chip, background: active ? t.primary : t.surface, color: active ? t.onPrimary : t.textSub, border: active ? 'none' : `1px solid ${t.border}` }} className="cursor-pointer transition-all hover:opacity-80 active:scale-95">{children}</span>
  );

  const Thumb = ({ h, w, style = {} }: { h: number; w?: number; style?: React.CSSProperties }) => (
    <div style={{ height: h, width: w, background: `repeating-linear-gradient(135deg, ${t.surfaceAlt}, ${t.surfaceAlt} 6px, ${t.surface} 6px, ${t.surface} 12px)`, ...style }} />
  );

  /* ── shared tiles ── */
  const buttonsTile = (
    <Tile title="Buttons">
      <Btn variant="primary">Primary</Btn>
      <Btn variant="secondary">Secondary</Btn>
      <Btn variant="outline">Outline</Btn>
      <Btn variant="primary" disabled>Disabled</Btn>
    </Tile>
  );

  const inputsTile = (
    <Tile title="Inputs">
      <Input label="레이블" placeholder="플레이스홀더" />
      <Input label="포커스" placeholder="입력 중…" focus />
      <div className="flex flex-col" style={{ gap: space.xs }}>
        <label style={{ ...ts(t.type.caption), color: t.textMain, fontWeight: t.weightMedium }}>셀렉트</label>
        <div className="flex items-center justify-between" style={{ border: `1px solid ${t.border}`, borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`, background: t.bg }}>
          <span style={{ ...ts(t.type.bodySm), color: t.textMain }}>옵션 선택</span>
          <span style={{ ...ts(t.type.caption), color: t.textSub }}>▾</span>
        </div>
      </div>
    </Tile>
  );

  const selectionTile = (
    <Tile title="Selection">
      <div className="flex items-center" style={{ gap: space.sm }}>
        {[true, false].map((on, i) => (
          <div key={i} className="flex items-center" style={{ gap: space.xs }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: on ? t.primary : t.bg, border: `1px solid ${on ? t.primary : t.border}`, color: t.onPrimary, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{on ? '✓' : ''}</span>
            <span style={{ ...ts(t.type.caption), color: t.textMain }}>{on ? '선택됨' : '미선택'}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center" style={{ gap: space.sm }}>
        {[true, false].map((on, i) => (
          <div key={i} className="flex items-center" style={{ gap: space.xs }}>
            <span style={{ width: 16, height: 16, borderRadius: '9999px', background: t.bg, border: `${on ? 5 : 1}px solid ${on ? t.primary : t.border}` }} />
            <span style={{ ...ts(t.type.caption), color: t.textMain }}>{on ? '라디오 ON' : 'OFF'}</span>
          </div>
        ))}
        {/* toggle */}
        <div style={{ width: 34, height: 20, borderRadius: 9999, background: t.primary, position: 'relative', marginLeft: 'auto' }}>
          <span style={{ position: 'absolute', top: 2, right: 2, width: 16, height: 16, borderRadius: '9999px', background: '#fff' }} />
        </div>
      </div>
      <div className="flex flex-wrap" style={{ gap: space.xs }}>
        <Chip active>전체</Chip>
        <Chip>인기</Chip>
        <Chip>최신</Chip>
      </div>
    </Tile>
  );

  const badgesTile = (
    <Tile title="Badges & Status">
      <div className="flex flex-wrap items-center" style={{ gap: space.sm }}>
        <Badge tone="solid">Solid</Badge>
        <Badge tone="soft">Soft</Badge>
        <Badge tone="muted">Muted</Badge>
      </div>
      <div className="flex flex-col" style={{ gap: space.xs }}>
        {[
          { dot: t.textMain, label: '활성' },
          { dot: t.textSub, label: '대기' },
          { dot: t.textMuted, label: '종료' },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center" style={{ gap: space.sm }}>
            <span style={{ width: 8, height: 8, borderRadius: '9999px', background: dot }} />
            <span style={{ ...ts(t.type.bodySm), color: t.textMain, fontWeight: t.weightMedium }}>{label}</span>
          </div>
        ))}
      </div>
    </Tile>
  );

  const listTile = (
    <Tile title="List / Menu">
      <div style={{ background: t.surface, borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
        {['항목 A', '항목 B', '항목 C'].map((item, i) => (
          <div key={item} className="flex items-center justify-between cursor-pointer transition-colors hover:bg-black/[0.04]" style={{ padding: `${space.sm}px ${space.md}px`, borderBottom: i < 2 ? `1px solid ${t.border}` : 'none' }}>
            <span style={{ ...ts(t.type.bodySm), color: t.textMain, fontWeight: t.weightMedium }}>{item}</span>
            <span style={{ ...ts(t.type.caption), color: t.textSub }}>→</span>
          </div>
        ))}
      </div>
    </Tile>
  );

  /* ── service-specific representative card ── */
  let cardTile: React.ReactNode = null;
  if (service === 'finance') {
    cardTile = (
      <Tile title="Balance Card">
        <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, padding: t.cardPad }}>
          <span style={{ ...ts(t.type.caption), color: t.textSub, display: 'block', marginBottom: space.xs }}>현재 잔액</span>
          <span style={{ ...ts(t.type.display), color: t.textMain, fontWeight: t.weightBold }}>1,234,567원</span>
          <div style={{ marginTop: space.sm }}><Btn variant="primary">이체하기</Btn></div>
        </div>
      </Tile>
    );
  } else if (service === 'messaging') {
    cardTile = (
      <Tile title="Chat Bubbles">
        <div className="flex"><div style={{ maxWidth: '80%', padding: `${space.sm}px ${space.md}px`, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}` }}><span style={{ ...ts(t.type.bodySm), color: t.textMain }}>안녕하세요!</span></div></div>
        <div className="flex justify-end"><div style={{ maxWidth: '80%', padding: `${space.sm}px ${space.md}px`, borderRadius: t.radius.card, background: t.primary }}><span style={{ ...ts(t.type.bodySm), color: t.onPrimary }}>네 좋아요 😊</span></div></div>
        <div className="flex items-center" style={{ gap: space.sm }}>
          <div className="flex-1" style={{ border: `1px solid ${t.border}`, borderRadius: t.radius.chip, padding: `${space.sm}px ${space.md}px` }}><span style={{ ...ts(t.type.bodySm), color: t.textMuted }}>메시지 입력…</span></div>
          <Btn variant="primary">전송</Btn>
        </div>
      </Tile>
    );
  } else if (service === 'delivery') {
    cardTile = (
      <Tile title="Store Card">
        <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
          <Thumb h={80} />
          <div style={{ padding: space.md }}>
            <div className="flex justify-between items-center" style={{ marginBottom: space.xs }}>
              <span style={{ ...ts(t.type.bodySm), color: t.textMain, fontWeight: t.weightBold }}>맛있는 치킨집</span>
              <span style={{ ...ts(t.type.caption), color: t.textSub }}>★ 4.8</span>
            </div>
            <div className="flex items-center" style={{ gap: space.sm }}>
              <Btn variant="primary">주문하기</Btn>
              <Badge tone="soft">빠른배달</Badge>
            </div>
          </div>
        </div>
      </Tile>
    );
  } else if (service === 'search') {
    cardTile = (
      <Tile title="Search & Shortcuts">
        <div className="flex items-center justify-between" style={{ border: `2px solid ${t.primary}`, borderRadius: t.radius.chip, padding: `${space.sm}px ${space.md}px` }}>
          <span style={{ ...ts(t.type.bodySm), color: t.textMuted }}>검색어 입력</span>
          <span style={{ ...ts(t.type.bodySm), color: t.primary }}>🔍</span>
        </div>
        <div className="grid grid-cols-4" style={{ gap: space.sm }}>
          {['메일', '카페', '뉴스', '지도'].map((s) => (
            <div key={s} className="flex flex-col items-center" style={{ gap: space.xs }}>
              <div style={{ width: 32, height: 32, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}` }} />
              <span style={{ ...ts(t.type.caption), color: t.textSub }}>{s}</span>
            </div>
          ))}
        </div>
      </Tile>
    );
  } else if (service === 'commerce') {
    cardTile = (
      <Tile title="Product Card">
        <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
          <div style={{ position: 'relative' }}>
            <Thumb h={84} />
            <span style={{ position: 'absolute', top: space.xs, left: space.xs }}><Badge tone="solid">35%</Badge></span>
          </div>
          <div style={{ padding: space.sm }}>
            <span style={{ ...ts(t.type.caption), color: t.textMain, fontWeight: t.weightMedium, display: 'block', marginBottom: 2 }}>무선 이어폰</span>
            <span style={{ ...ts(t.type.bodySm), color: t.primary, fontWeight: t.weightBold }}>89,000원</span>
          </div>
        </div>
        <Btn variant="primary">장바구니 담기</Btn>
      </Tile>
    );
  } else {
    // local
    cardTile = (
      <Tile title="Listing Item">
        <div className="flex" style={{ gap: space.md }}>
          <Thumb h={60} w={60} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
          <div className="flex-1 flex flex-col" style={{ gap: space.xs }}>
            <div className="flex items-center" style={{ gap: space.sm }}>
              <span style={{ ...ts(t.type.bodySm), color: t.textMain, fontWeight: t.weightBold }}>아이폰 15 팔아요</span>
              <Badge tone="solid">판매중</Badge>
            </div>
            <span style={{ ...ts(t.type.caption), color: t.textSub }}>서초구 · 10분 전</span>
            <span style={{ ...ts(t.type.bodySm), color: t.textMain, fontWeight: t.weightBold }}>900,000원</span>
          </div>
        </div>
      </Tile>
    );
  }

  return (
    <div style={{ background: t.surfaceAlt, padding: t.containerPad, fontFamily: t.font }}>
      <div style={{ columnGap: space.md }} className="columns-1 sm:columns-2 xl:columns-3">
        {cardTile}
        {buttonsTile}
        {inputsTile}
        {selectionTile}
        {badgesTile}
        {listTile}
      </div>
    </div>
  );
}
