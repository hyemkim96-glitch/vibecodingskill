'use client';

import React from 'react';
import { BrandToken } from '@/types/token';
import { cn } from '@/lib/utils';
import {
  resolveTheme,
  contrastOn,
  ResolvedTheme,
  ResolvedType,
  ThemeMode,
} from '@/lib/tokens/resolveTheme';

/**
 * Design System Engine — UI Renderer
 *
 * Consumes a fully resolved theme (see resolveTheme) through a small set of
 * primitives. Every dimension — padding, gap, font size, radius — is read
 * from the theme, so the output is genuinely driven by the brand's tokens
 * (spacing scale, density, type scale, shapes) rather than hardcoded.
 */

function typeStyle(t: ResolvedType): React.CSSProperties {
  return {
    fontSize: t.size,
    lineHeight: t.lineHeight,
    letterSpacing: t.letterSpacing,
    fontWeight: t.weight,
  };
}

export default function BrandUIPreview({
  token,
  platform,
  mode = 'brand',
}: {
  token: BrandToken;
  platform: 'mobile' | 'web';
  mode?: ThemeMode;
}) {
  const t = resolveTheme(token, platform, mode);
  const { space } = t;
  const isMobile = t.isMobile;

  /* ── primitives ── */

  const Screen = ({ children }: { children: React.ReactNode }) => (
    <div
      className="flex flex-col"
      style={{
        background: t.bg,
        padding: t.containerPad,
        gap: t.stackGap,
        minHeight: isMobile ? 300 : 260,
        fontFamily: t.font,
      }}
    >
      {children}
    </div>
  );

  const Text = ({
    role = 'body',
    color,
    weight,
    children,
    className = '',
    style = {},
  }: {
    role?: keyof ResolvedTheme['type'];
    color?: string;
    weight?: number;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <span
      className={className}
      style={{
        ...typeStyle(t.type[role]),
        ...(weight ? { fontWeight: weight } : {}),
        color: color ?? t.textMain,
        ...style,
      }}
    >
      {children}
    </span>
  );

  const Btn = ({
    children,
    variant = 'primary',
    disabled = false,
    full = false,
    size = 'md',
  }: {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
    full?: boolean;
    size?: 'sm' | 'md';
  }) => (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 select-none cursor-pointer',
        'hover:brightness-[0.97] active:scale-[0.97]',
        full && 'w-full',
        disabled && 'opacity-40 pointer-events-none',
      )}
      style={{
        ...typeStyle(t.type[size === 'sm' ? 'caption' : 'bodySm']),
        fontWeight: t.weightBold,
        borderRadius: t.radius.button,
        background:
          variant === 'primary'
            ? t.primary
            : variant === 'secondary'
              ? t.surface
              : 'transparent',
        color: variant === 'primary' ? t.onPrimary : t.textMain,
        border: variant === 'secondary' ? `1px solid ${t.border}` : 'none',
        padding:
          size === 'sm'
            ? `${space.xs}px ${space.md}px`
            : `${space.sm}px ${space.lg}px`,
      }}
    >
      {children}
    </button>
  );

  const Card = ({
    children,
    pad = true,
    interactive = true,
    style = {},
    className = '',
  }: {
    children: React.ReactNode;
    pad?: boolean;
    interactive?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }) => (
    <div
      className={cn(
        'overflow-hidden transition-all duration-200',
        interactive &&
          'cursor-pointer hover:shadow-md hover:-translate-y-px active:scale-[0.99]',
        className,
      )}
      style={{
        background: t.surface,
        borderRadius: t.radius.card,
        border: `1px solid ${t.border}`,
        padding: pad ? t.cardPad : 0,
        ...style,
      }}
    >
      {children}
    </div>
  );

  const Chip = ({
    children,
    active = false,
  }: {
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <span
      className="inline-flex items-center cursor-pointer whitespace-nowrap transition-all duration-150 hover:opacity-80 active:scale-95"
      style={{
        ...typeStyle(t.type.caption),
        fontWeight: t.weightMedium,
        padding: `${space.xs}px ${space.md}px`,
        borderRadius: t.radius.chip,
        background: active ? t.primary : t.surface,
        color: active ? t.onPrimary : t.textSub,
        border: active ? 'none' : `1px solid ${t.border}`,
      }}
    >
      {children}
    </span>
  );

  const Badge = ({
    children,
    bg,
  }: {
    children: React.ReactNode;
    bg?: string;
  }) => (
    <span
      className="inline-flex items-center font-bold"
      style={{
        fontSize: Math.max(9, t.type.caption.size - 2),
        lineHeight: 1.2,
        padding: `2px ${space.xs + 2}px`,
        borderRadius: t.radius.badge,
        background: bg ?? t.primary,
        color: contrastOn(bg ?? t.primary),
      }}
    >
      {children}
    </span>
  );

  // a neutral image / thumbnail placeholder
  const Thumb = ({ h, style = {} }: { h: number; style?: React.CSSProperties }) => (
    <div
      style={{
        height: h,
        background:
          mode === 'wireframe'
            ? `repeating-linear-gradient(135deg, ${t.surfaceAlt}, ${t.surfaceAlt} 6px, ${t.surface} 6px, ${t.surface} 12px)`
            : t.surfaceAlt,
        ...style,
      }}
    />
  );

  const Row = ({
    children,
    divider = false,
    style = {},
  }: {
    children: React.ReactNode;
    divider?: boolean;
    style?: React.CSSProperties;
  }) => (
    <div
      className="flex items-center justify-between transition-colors duration-100 rounded-md cursor-pointer hover:bg-black/[0.03]"
      style={{
        paddingTop: space.sm,
        paddingBottom: space.sm,
        borderBottom: divider ? `1px solid ${t.border}` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );

  /* ── category layouts ── */

  // 핀테크/금융
  if (t.category === '핀테크/금융') {
    if (isMobile) {
      return (
        <Screen>
          <Card style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
            <Text role="caption" color={t.textSub} weight={t.weightMedium}>
              현재 잔액
            </Text>
            <Text role="display" weight={t.weightBold} style={{ letterSpacing: '-0.02em' }}>
              1,234,567
              <Text role="bodySm" color={t.textSub} style={{ marginLeft: 4 }}>
                원
              </Text>
            </Text>
            <Text role="caption" color={t.success}>
              전월 대비 ▲ 12%
            </Text>
          </Card>

          <div className="flex" style={{ gap: space.sm }}>
            {[
              { label: '이체', v: 'primary' as const },
              { label: '충전', v: 'secondary' as const },
              { label: '조회', v: 'secondary' as const },
            ].map(({ label, v }) => (
              <div key={label} className="flex-1">
                <Btn variant={v} full>
                  {label}
                </Btn>
              </div>
            ))}
          </div>

          {[
            { name: '스타벅스', sub: '카드결제', amount: '-6,500원', color: t.textMain },
            { name: '급여', sub: '입금', amount: '+3,200,000원', color: t.success },
          ].map((item, i) => (
            <Row key={item.name} divider={i === 0} style={{ paddingLeft: space.xs, paddingRight: space.xs }}>
              <div className="flex flex-col" style={{ gap: 2 }}>
                <Text role="bodySm" weight={t.weightMedium}>{item.name}</Text>
                <Text role="caption" color={t.textSub}>{item.sub}</Text>
              </div>
              <Text role="bodySm" weight={t.weightBold} color={item.color}>
                {item.amount}
              </Text>
            </Row>
          ))}

          <Btn variant="primary" full disabled>
            이체 불가 (잔액 부족)
          </Btn>
        </Screen>
      );
    }

    return (
      <Screen>
        <div className="flex" style={{ gap: space.lg }}>
          <div className="flex flex-col shrink-0" style={{ gap: space.md, width: 200 }}>
            <Card>
              <Text role="caption" color={t.textSub} style={{ display: 'block', marginBottom: space.xs }}>
                총 자산
              </Text>
              <Text role="h2" weight={t.weightBold}>₩ 12,345,678</Text>
            </Card>
            <div style={{ background: t.primary, borderRadius: t.radius.card, padding: t.cardPad }}>
              <Text role="caption" color={t.onPrimary} style={{ display: 'block', marginBottom: space.xs, opacity: 0.8 }}>
                이번 달 지출
              </Text>
              <Text role="h2" weight={t.weightBold} color={t.onPrimary}>₩ 456,789</Text>
            </div>
          </div>
          <div className="flex flex-col flex-1" style={{ gap: space.sm }}>
            {[
              { name: '스타벅스', cat: '카페', amount: '-6,500', color: t.textMain },
              { name: '급여', cat: '입금', amount: '+3,200,000', color: t.success },
              { name: '넷플릭스', cat: '구독', amount: '-17,000', color: t.textMain },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between cursor-pointer transition-colors hover:bg-black/[0.03]"
                style={{ background: t.surface, borderRadius: t.radius.card, padding: `${space.sm}px ${space.md}px` }}
              >
                <span>
                  <Text role="bodySm" weight={t.weightMedium} style={{ marginRight: space.sm }}>{item.name}</Text>
                  <Text role="caption" color={t.textSub}>{item.cat}</Text>
                </span>
                <Text role="bodySm" weight={t.weightBold} color={item.color}>{item.amount}원</Text>
              </div>
            ))}
            <Btn variant="primary" full>이체하기</Btn>
          </div>
        </div>
      </Screen>
    );
  }

  // 플랫폼 (배달/검색)
  if (t.category === '플랫폼' && !t.isLocal) {
    if (isMobile) {
      return (
        <Screen>
          <div
            className="flex items-center cursor-text transition-colors hover:border-gray-400"
            style={{
              gap: space.sm,
              background: t.surface,
              borderRadius: t.radius.input,
              border: `1px solid ${t.border}`,
              padding: `${space.sm}px ${space.md}px`,
            }}
          >
            <Text role="bodySm" color={t.textMuted}>🔍 음식, 가게 검색</Text>
          </div>
          <div className="flex overflow-hidden" style={{ gap: space.sm }}>
            {['치킨', '피자', '한식', '중식'].map((cat, i) => (
              <Chip key={cat} active={i === 0}>{cat}</Chip>
            ))}
          </div>
          <Card pad={false}>
            <Thumb h={88} />
            <div className="flex flex-col" style={{ padding: t.cardPad, gap: space.xs }}>
              <div className="flex justify-between items-start">
                <Text role="bodySm" weight={t.weightBold}>맛있는 치킨집</Text>
                <Text role="caption" color={t.textSub}>★ 4.8</Text>
              </div>
              <Text role="caption" color={t.textSub}>배달비 2,000원 · 최소 15,000원</Text>
              <div className="flex items-center" style={{ gap: space.sm, marginTop: space.xs }}>
                <Btn variant="primary" size="sm">주문하기</Btn>
                <Badge bg={t.accent}>🚀 빠른배달</Badge>
              </div>
            </div>
          </Card>
        </Screen>
      );
    }

    return (
      <Screen>
        <div className="flex flex-wrap" style={{ gap: space.sm }}>
          {['전체', '치킨', '피자', '한식', '중식', '분식'].map((cat, i) => (
            <Chip key={cat} active={i === 0}>{cat}</Chip>
          ))}
        </div>
        <div className="grid grid-cols-3" style={{ gap: space.md }}>
          {['맛있는 치킨집', '행복한 피자', '우리동네 한식'].map((name, i) => (
            <Card key={name} pad={false}>
              <Thumb h={72} />
              <div style={{ padding: space.sm }}>
                <Text role="caption" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xs }}>{name}</Text>
                <div className="flex justify-between items-center">
                  <Text role="caption" color={t.textSub}>★ {(4.5 + i * 0.1).toFixed(1)}</Text>
                  <Badge bg={`${t.primary}22`}>주문</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    );
  }

  // 커머스
  if (t.category === '커머스') {
    if (isMobile) {
      return (
        <Screen>
          <div
            className="flex justify-between items-center cursor-pointer hover:opacity-95 transition-opacity"
            style={{ background: t.primary, borderRadius: t.radius.card, padding: t.cardPad }}
          >
            <div className="flex flex-col" style={{ gap: 2 }}>
              <Text role="caption" color={t.onPrimary} style={{ opacity: 0.8 }}>오늘만 이 가격</Text>
              <Text role="h2" weight={t.weightBold} color={t.onPrimary}>최대 70% OFF</Text>
            </div>
            <Btn variant="ghost" size="sm">
              <span style={{ color: t.onPrimary }}>보러가기 →</span>
            </Btn>
          </div>

          <div className="grid grid-cols-2" style={{ gap: space.sm }}>
            {[
              { name: '무선 이어폰', price: '89,000', discount: '35%', sold: false },
              { name: '스마트워치', price: '249,000', discount: '22%', sold: true },
            ].map((item) => (
              <Card key={item.name} pad={false}>
                <div style={{ position: 'relative' }}>
                  <Thumb h={84} />
                  <span style={{ position: 'absolute', top: space.xs, right: space.xs }}>
                    <Badge>{item.discount}</Badge>
                  </span>
                </div>
                <div style={{ padding: space.sm }}>
                  <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xs }}>{item.name}</Text>
                  <Text role="bodySm" weight={t.weightBold} color={t.primary}>{item.price}원</Text>
                  {item.sold && (
                    <div style={{ marginTop: space.xs }}>
                      <Badge bg={t.textMuted}>품절</Badge>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Btn variant="primary" full>장바구니 담기</Btn>
        </Screen>
      );
    }

    return (
      <Screen>
        <div className="flex justify-between items-center">
          <Text role="bodySm" weight={t.weightBold}>인기 상품</Text>
          <Text role="caption" weight={t.weightBold} color={t.primary} className="cursor-pointer hover:opacity-70 transition-opacity">전체보기 →</Text>
        </div>
        <div className="grid grid-cols-4" style={{ gap: space.sm }}>
          {['무선이어폰', '스마트워치', '노트북', '태블릿'].map((name, i) => (
            <Card key={name} pad={false}>
              <div style={{ position: 'relative' }}>
                <Thumb h={64} />
                <span style={{ position: 'absolute', top: space.xs, left: space.xs }}>
                  <Badge>{[35, 22, 18, 40][i]}%</Badge>
                </span>
              </div>
              <div style={{ padding: space.xs + 2 }}>
                <Text role="caption" weight={t.weightMedium} className="truncate" style={{ display: 'block', marginBottom: 2 }}>{name}</Text>
                <Text role="caption" weight={t.weightBold} color={t.primary}>{['89,000', '249,000', '1,190,000', '489,000'][i]}원</Text>
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    );
  }

  // 지역/커뮤니티
  if (t.isLocal) {
    if (isMobile) {
      return (
        <Screen>
          <div className="flex" style={{ gap: space.sm }}>
            <div
              className="flex-1 flex items-center cursor-text transition-colors hover:border-gray-400"
              style={{ background: t.surface, borderRadius: t.radius.input, border: `1px solid ${t.border}`, padding: `${space.sm}px ${space.md}px` }}
            >
              <Text role="bodySm" color={t.textMuted}>📍 우리 동네 검색</Text>
            </div>
            <Btn variant="primary">글쓰기</Btn>
          </div>

          {[
            { title: '아이폰 15 팔아요', loc: '서초구 · 10분 전', price: '900,000원', badge: '판매중' },
            { title: '자전거 삽니다', loc: '강남구 · 1시간 전', price: '50,000원', badge: '구매중' },
          ].map((item, i) => (
            <div
              key={item.title}
              className="flex cursor-pointer transition-colors hover:bg-black/[0.03] rounded-md"
              style={{ gap: space.md, paddingTop: space.sm, paddingBottom: space.sm, borderBottom: i === 0 ? `1px solid ${t.border}` : 'none' }}
            >
              <Thumb h={60} style={{ width: 60, borderRadius: t.radius.card, flexShrink: 0 }} />
              <div className="flex-1 flex flex-col" style={{ gap: space.xs }}>
                <div className="flex items-center" style={{ gap: space.sm }}>
                  <Text role="bodySm" weight={t.weightBold}>{item.title}</Text>
                  <Badge bg={`${t.primary}22`}>{item.badge}</Badge>
                </div>
                <Text role="caption" color={t.textSub}>{item.loc}</Text>
                <Text role="bodySm" weight={t.weightBold}>{item.price}</Text>
              </div>
            </div>
          ))}
        </Screen>
      );
    }

    return (
      <Screen>
        <div className="grid grid-cols-3" style={{ gap: space.md }}>
          {['아이폰 15', '자전거', '소파'].map((name, i) => (
            <Card key={name} pad={false}>
              <Thumb h={84} />
              <div style={{ padding: t.cardPad }}>
                <Text role="bodySm" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xs }}>{name}</Text>
                <Text role="caption" color={t.textSub} style={{ display: 'block', marginBottom: space.xs }}>서초구 · {['10분', '1시간', '3시간'][i]} 전</Text>
                <Text role="bodySm" weight={t.weightBold}>{['900,000', '80,000', '120,000'][i]}원</Text>
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    );
  }

  // 패션/라이프스타일 (default)
  if (isMobile) {
    return (
      <Screen>
        <Card style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
          <Text role="caption" color={t.textSub} weight={t.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            New Arrivals
          </Text>
          <Text role="h2" weight={t.weightBold}>{token.tagline}</Text>
          <div>
            <Btn variant="primary" size="sm">지금 보기</Btn>
          </div>
        </Card>

        <div className="grid grid-cols-2" style={{ gap: space.sm }}>
          {['오버핏 셔츠', '와이드 팬츠'].map((name, i) => (
            <Card key={name} pad={false}>
              <Thumb h={96} />
              <div style={{ padding: space.sm }}>
                <Text role="caption" color={t.textSub} weight={t.weightMedium} style={{ display: 'block', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>
                  {['BRAND A', 'BRAND B'][i]}
                </Text>
                <Text role="caption" weight={t.weightBold} style={{ display: 'block' }}>{name}</Text>
                <Text role="caption" weight={t.weightBold} color={t.primary} style={{ marginTop: 2, display: 'block' }}>{['89,000', '129,000'][i]}원</Text>
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div className="flex" style={{ gap: space.lg }}>
        <Card style={{ width: 200, display: 'flex', flexDirection: 'column', gap: space.md }}>
          <Text role="caption" color={t.textSub} weight={t.weightBold} style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Featured
          </Text>
          <Text role="h1" weight={t.weightBold}>{token.tagline}</Text>
          <div>
            <Btn variant="primary">쇼핑하기</Btn>
          </div>
        </Card>
        <div className="flex-1 grid grid-cols-3" style={{ gap: space.sm }}>
          {['셔츠', '팬츠', '자켓'].map((name, i) => (
            <Card key={name} pad={false}>
              <Thumb h={72} />
              <div style={{ padding: space.xs + 2 }}>
                <Text role="caption" weight={t.weightBold} style={{ display: 'block' }}>{name}</Text>
                <Text role="caption" weight={t.weightBold} color={t.primary} style={{ marginTop: 2, display: 'block' }}>{['89,000', '149,000', '219,000'][i]}원</Text>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Screen>
  );
}
