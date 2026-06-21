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
import { getServiceType } from '@/lib/serviceCategories';

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
  const service = getServiceType(token);

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
    tone = 'solid',
  }: {
    children: React.ReactNode;
    tone?: 'solid' | 'soft' | 'accent' | 'muted';
  }) => {
    const styleByTone: Record<string, { bg: string; fg: string }> = {
      solid: { bg: t.primary, fg: t.onPrimary },
      soft: { bg: t.primaryTint, fg: t.primary },
      accent: { bg: t.accent, fg: contrastOn(t.accent) },
      muted: { bg: t.textMuted, fg: contrastOn(t.textMuted) },
    };
    const { bg, fg } = styleByTone[tone];
    return (
      <span
        className="inline-flex items-center font-bold"
        style={{
          fontSize: Math.max(10, t.type.caption.size - 1),
          lineHeight: 1.2,
          padding: `2px ${space.xs + 3}px`,
          borderRadius: t.radius.badge,
          background: bg,
          color: fg,
        }}
      >
        {children}
      </span>
    );
  };

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
  if (service === 'finance') {
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

  // 배달/O2O
  if (service === 'delivery') {
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
                <Badge tone="accent">🚀 빠른배달</Badge>
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
                  <Badge tone="soft">주문</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    );
  }

  // 커머스
  if (service === 'commerce') {
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
                      <Badge tone="muted">품절</Badge>
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
  if (service === 'local') {
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
                  <Badge tone="solid">{item.badge}</Badge>
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

  // 메신저/소셜 — 채팅 UI
  if (service === 'messaging') {
    const Avatar = ({ size = 40 }: { size?: number }) => (
      <div className="shrink-0" style={{ width: size, height: size, borderRadius: '9999px', background: t.surfaceAlt }} />
    );
    const Bubble = ({ text, me = false }: { text: string; me?: boolean }) => (
      <div className={cn('flex', me ? 'justify-end' : 'justify-start')}>
        <div
          style={{
            maxWidth: '74%',
            padding: `${space.sm}px ${space.md}px`,
            borderRadius: t.radius.card,
            background: me ? t.primary : t.surface,
            color: me ? t.onPrimary : t.textMain,
            border: me ? 'none' : `1px solid ${t.border}`,
          }}
        >
          <Text role="bodySm" color={me ? t.onPrimary : t.textMain}>{text}</Text>
        </div>
      </div>
    );
    const InputBar = () => (
      <div className="flex items-center" style={{ gap: space.sm }}>
        <div
          className="flex-1 flex items-center cursor-text"
          style={{ background: t.surface, borderRadius: t.radius.chip, border: `1px solid ${t.border}`, padding: `${space.sm}px ${space.md}px` }}
        >
          <Text role="bodySm" color={t.textMuted}>메시지 입력…</Text>
        </div>
        <Btn variant="primary" size="sm">전송</Btn>
      </div>
    );

    if (isMobile) {
      return (
        <Screen>
          {/* 대화 목록 */}
          {[
            { name: '김토스', msg: '오늘 저녁 어때요?', time: '오후 2:14', unread: 2 },
            { name: '동네모임 💬', msg: '사진 보냈어요', time: '오후 1:02', unread: 0 },
          ].map((c, i) => (
            <div
              key={c.name}
              className="flex items-center cursor-pointer transition-colors hover:bg-black/[0.03] rounded-md"
              style={{ gap: space.md, paddingTop: space.sm, paddingBottom: space.sm, borderBottom: i === 0 ? `1px solid ${t.border}` : 'none' }}
            >
              <Avatar />
              <div className="flex-1 flex flex-col" style={{ gap: 2 }}>
                <Text role="bodySm" weight={t.weightBold}>{c.name}</Text>
                <Text role="caption" color={t.textSub}>{c.msg}</Text>
              </div>
              <div className="flex flex-col items-end" style={{ gap: 4 }}>
                <Text role="caption" color={t.textMuted}>{c.time}</Text>
                {c.unread > 0 && <Badge tone="solid">{c.unread}</Badge>}
              </div>
            </div>
          ))}

          {/* 대화 말풍선 */}
          <div className="flex flex-col" style={{ gap: space.sm, marginTop: space.xs }}>
            <Bubble text="안녕하세요! 지금 시간 괜찮으세요?" />
            <Bubble text="네 좋아요 😊" me />
            <Bubble text="그럼 6시에 봬요" />
          </div>

          <InputBar />
        </Screen>
      );
    }

    return (
      <Screen>
        <div className="flex" style={{ gap: space.md, minHeight: 240 }}>
          {/* 좌: 대화 목록 */}
          <div className="flex flex-col shrink-0" style={{ width: 200, gap: space.xs }}>
            {['김토스', '동네모임 💬', '점심팟', '가족방'].map((name, i) => (
              <div
                key={name}
                className="flex items-center cursor-pointer transition-colors rounded-md"
                style={{ gap: space.sm, padding: `${space.sm}px`, background: i === 0 ? t.surface : 'transparent' }}
              >
                <Avatar size={32} />
                <div className="flex-1 min-w-0">
                  <Text role="caption" weight={t.weightBold} style={{ display: 'block' }}>{name}</Text>
                  <Text role="caption" color={t.textSub} className="truncate" style={{ display: 'block' }}>대화 미리보기…</Text>
                </div>
                {i === 0 && <Badge tone="solid">2</Badge>}
              </div>
            ))}
          </div>
          {/* 우: 대화창 */}
          <div className="flex-1 flex flex-col" style={{ gap: space.sm, borderLeft: `1px solid ${t.border}`, paddingLeft: space.md }}>
            <Bubble text="안녕하세요! 지금 시간 괜찮으세요?" />
            <Bubble text="네 좋아요 😊" me />
            <Bubble text="그럼 6시에 봬요" />
            <div style={{ marginTop: 'auto' }}>
              <InputBar />
            </div>
          </div>
        </div>
      </Screen>
    );
  }

  // 검색/포털 (search) — default fallback
  const shortcuts = ['메일', '카페', '뉴스', '지도', '쇼핑', '증권', '지식인', '더보기'];
  if (isMobile) {
    return (
      <Screen>
        <div
          className="flex items-center justify-between cursor-text"
          style={{ background: t.bg, borderRadius: t.radius.chip, border: `2px solid ${t.primary}`, padding: `${space.sm}px ${space.md}px` }}
        >
          <Text role="bodySm" color={t.textMuted}>검색어를 입력하세요</Text>
          <Text role="bodySm" color={t.primary} weight={t.weightBold}>🔍</Text>
        </div>

        <div className="grid grid-cols-4" style={{ gap: space.sm }}>
          {shortcuts.map((s) => (
            <div key={s} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" style={{ gap: space.xs }}>
              <div style={{ width: 36, height: 36, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}` }} />
              <Text role="caption" color={t.textSub}>{s}</Text>
            </div>
          ))}
        </div>

        <div className="flex flex-col">
          {['오늘의 주요 뉴스 헤드라인', '실시간 급상승 키워드 정리', '날씨 · 미세먼지 정보'].map((title, i) => (
            <div
              key={title}
              className="flex items-center justify-between cursor-pointer transition-colors hover:bg-black/[0.03] rounded-md"
              style={{ gap: space.md, paddingTop: space.sm, paddingBottom: space.sm, borderBottom: i < 2 ? `1px solid ${t.border}` : 'none' }}
            >
              <div className="flex-1">
                <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block' }}>{title}</Text>
                <Text role="caption" color={t.textSub}>연합뉴스 · {i + 1}시간 전</Text>
              </div>
              <Thumb h={48} style={{ width: 64, borderRadius: t.radius.card }} />
            </div>
          ))}
        </div>
      </Screen>
    );
  }

  return (
    <Screen>
      <div
        className="flex items-center justify-between cursor-text self-center"
        style={{ width: '70%', background: t.bg, borderRadius: t.radius.chip, border: `2px solid ${t.primary}`, padding: `${space.sm}px ${space.lg}px` }}
      >
        <Text role="body" color={t.textMuted}>검색어를 입력하세요</Text>
        <Text role="body" color={t.primary} weight={t.weightBold}>🔍</Text>
      </div>
      <div className="grid grid-cols-8" style={{ gap: space.sm }}>
        {shortcuts.map((s) => (
          <div key={s} className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity" style={{ gap: space.xs }}>
            <div style={{ width: 34, height: 34, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}` }} />
            <Text role="caption" color={t.textSub}>{s}</Text>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3" style={{ gap: space.md }}>
        {['주요 뉴스', '실시간 키워드', '오늘의 날씨'].map((title) => (
          <Card key={title}>
            <Text role="bodySm" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xs }}>{title}</Text>
            <Text role="caption" color={t.textSub} style={{ display: 'block', marginBottom: 2 }}>관련 콘텐츠 미리보기 라인 1</Text>
            <Text role="caption" color={t.textSub}>관련 콘텐츠 미리보기 라인 2</Text>
          </Card>
        ))}
      </div>
    </Screen>
  );
}
