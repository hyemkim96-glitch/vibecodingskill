'use client';

import React from 'react';
import { BrandToken } from '@/types/token';
import { resolveTheme } from '@/lib/tokens/resolveTheme';
import { createDS, motionVars, typeStyle } from '@/components/ds';
import { ServiceType } from '@/lib/serviceCategories';

/**
 * ComponentSheet — the Components gallery (the bottom of the dependency chain).
 *
 * Renders the DS component primitives directly (the same atoms the patterns are
 * built from), grouped by the kind of components a given service type uses.
 * Wireframe theme: token-driven structure, neutral grayscale palette.
 *
 * Uses a uniform CSS grid (not masonry) so the whitespace rhythm is consistent
 * across every tile and every service type.
 */
export default function ComponentSheet({
  token,
  service,
}: {
  token: BrandToken;
  service: ServiceType;
}) {
  const t = resolveTheme(token, 'mobile', 'wireframe');
  const ds = createDS(t, true);
  const { Button, Input, Badge, Chip, Text } = ds;
  const { space } = t;

  const Tile = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div
      style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius.card, padding: t.cardPad }}
    >
      <p
        style={{
          ...typeStyle(t.type.caption),
          color: t.textSub,
          fontWeight: t.weightBold,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: space.md,
        }}
      >
        {title}
      </p>
      <div className="flex flex-col" style={{ gap: space.sm }}>
        {children}
      </div>
    </div>
  );

  const cardCopy: Record<ServiceType, string> = {
    finance: '잔액·자산 카드',
    messaging: '말풍선',
    delivery: '가게 카드',
    search: '검색 / 바로가기',
    commerce: '상품 카드',
    local: '거래 글 항목',
  };

  /* service-specific representative card */
  let cardTile: React.ReactNode = null;
  if (service === 'finance') {
    cardTile = (
      <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, padding: t.cardPad }}>
        <Text role="caption" color={t.textSub} style={{ display: 'block', marginBottom: space.xs }}>현재 잔액</Text>
        <Text role="display" weight={t.weightBold}>1,234,567원</Text>
        <div style={{ marginTop: space.sm }}><Button variant="primary" full>이체하기</Button></div>
      </div>
    );
  } else if (service === 'messaging') {
    cardTile = (
      <>
        <div className="flex"><div style={{ maxWidth: '80%', padding: `${space.sm}px ${space.md}px`, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}` }}><Text role="bodySm">안녕하세요!</Text></div></div>
        <div className="flex justify-end"><div style={{ maxWidth: '80%', padding: `${space.sm}px ${space.md}px`, borderRadius: t.radius.card, background: t.primary }}><Text role="bodySm" color={t.onPrimary}>네 좋아요 😊</Text></div></div>
      </>
    );
  } else if (service === 'delivery') {
    cardTile = (
      <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        <ds.Thumb h={72} />
        <div style={{ padding: space.md }}>
          <div className="flex justify-between items-center" style={{ marginBottom: space.xs }}>
            <Text role="bodySm" weight={t.weightBold}>맛있는 치킨집</Text>
            <Text role="caption" color={t.textSub}>★ 4.8</Text>
          </div>
          <div className="flex items-center" style={{ gap: space.sm }}>
            <Button variant="primary" size="sm">주문하기</Button>
            <Badge tone="soft">빠른배달</Badge>
          </div>
        </div>
      </div>
    );
  } else if (service === 'search') {
    cardTile = (
      <>
        <div className="flex items-center justify-between" style={{ border: `2px solid ${t.primary}`, borderRadius: t.radius.chip, padding: `${space.sm}px ${space.md}px` }}>
          <Text role="bodySm" color={t.textMuted}>검색어 입력</Text>
          <Text role="bodySm" color={t.primary}>🔍</Text>
        </div>
        <div className="grid grid-cols-4" style={{ gap: space.sm }}>
          {['메일', '카페', '뉴스', '지도'].map((s) => (
            <div key={s} className="flex flex-col items-center" style={{ gap: space.xs }}>
              <div style={{ width: 32, height: 32, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}` }} />
              <Text role="caption" color={t.textSub}>{s}</Text>
            </div>
          ))}
        </div>
      </>
    );
  } else if (service === 'commerce') {
    cardTile = (
      <>
        <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
          <div style={{ position: 'relative' }}>
            <ds.Thumb h={84} />
            <span style={{ position: 'absolute', top: space.xs, left: space.xs }}><Badge tone="solid">35%</Badge></span>
          </div>
          <div style={{ padding: space.sm }}>
            <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: 2 }}>무선 이어폰</Text>
            <Text role="bodySm" weight={t.weightBold} color={t.primary}>89,000원</Text>
          </div>
        </div>
        <Button variant="primary" full>장바구니 담기</Button>
      </>
    );
  } else {
    cardTile = (
      <div className="flex" style={{ gap: space.md }}>
        <ds.Thumb h={60} w={60} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
        <div className="flex-1 flex flex-col" style={{ gap: space.xs }}>
          <div className="flex items-center" style={{ gap: space.sm }}>
            <Text role="bodySm" weight={t.weightBold}>아이폰 15 팔아요</Text>
            <Badge tone="solid">판매중</Badge>
          </div>
          <Text role="caption" color={t.textSub}>서초구 · 10분 전</Text>
          <Text role="bodySm" weight={t.weightBold}>900,000원</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-root" style={{ ...motionVars(t), background: t.surfaceAlt, padding: t.containerPad, fontFamily: t.font }}>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 items-start"
        style={{ gap: space.md }}
      >
        <Tile title={cardCopy[service]}>{cardTile}</Tile>

        <Tile title="Buttons">
          <Button variant="primary" full>Primary</Button>
          <Button variant="secondary" full>Secondary</Button>
          <Button variant="outline" full>Outline</Button>
          <Button variant="primary" full disabled>Disabled</Button>
        </Tile>

        <Tile title="Inputs">
          <Input label="레이블" placeholder="플레이스홀더" />
          <Input label="포커스" placeholder="입력 중…" focus />
        </Tile>

        <Tile title="Selection">
          <div className="flex items-center" style={{ gap: space.md }}>
            {[true, false].map((on, i) => (
              <div key={i} className="flex items-center" style={{ gap: space.xs }}>
                <span style={{ width: 16, height: 16, borderRadius: 4, background: on ? t.primary : t.bg, border: `1px solid ${on ? t.primary : t.border}`, color: t.onPrimary, fontSize: 11, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{on ? '✓' : ''}</span>
                <Text role="caption">{on ? '선택됨' : '미선택'}</Text>
              </div>
            ))}
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
                <Text role="bodySm" weight={t.weightMedium}>{label}</Text>
              </div>
            ))}
          </div>
        </Tile>

        <Tile title="List / Menu">
          <div style={{ background: t.surface, borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
            {['항목 A', '항목 B', '항목 C'].map((item, i) => (
              <div key={item} className="ds-press flex items-center justify-between cursor-pointer hover:bg-black/[0.04]" style={{ padding: `${space.sm}px ${space.md}px`, borderBottom: i < 2 ? `1px solid ${t.border}` : 'none' }}>
                <Text role="bodySm" weight={t.weightMedium}>{item}</Text>
                <Text role="caption" color={t.textSub}>→</Text>
              </div>
            ))}
          </div>
        </Tile>
      </div>
    </div>
  );
}
