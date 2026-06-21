'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { DS } from '@/components/ds';

/**
 * Pattern layer — UI screen compositions built from DS primitives.
 *
 * Pattern categories mirror uibowl / real-world screen taxonomy:
 * 메인 · 로그인 · 검색 · 목록(PLP) · 상세(PDP) · 내역 · 마이페이지 · 결제
 *
 * Each pattern is service-agnostic; it renders correctly in both wireframe and
 * brand mode because every dimension flows from the ResolvedTheme via DS.
 *
 * Dependency: DS primitives (컴포넌트) → these compositions (패턴) → BrandUIPreview (브랜드)
 */

export type PatternType =
  | 'main'
  | 'auth'
  | 'search'
  | 'list'
  | 'detail'
  | 'history'
  | 'mypage'
  | 'payment';

export const PATTERN_TYPES: { key: PatternType; label: string; desc: string }[] = [
  { key: 'main',    label: '메인',         desc: '홈 화면 — 배너·추천·빠른 진입' },
  { key: 'auth',    label: '로그인 · 가입', desc: '인증 플로우 — 입력·소셜·약관' },
  { key: 'search',  label: '검색',         desc: '검색 바·자동완성·결과·필터' },
  { key: 'list',    label: '목록 (PLP)',    desc: '상품·콘텐츠 그리드 / 리스트' },
  { key: 'detail',  label: '상세 (PDP)',    desc: '이미지·설명·CTA·리뷰 섹션' },
  { key: 'history', label: '내역',         desc: '거래·활동 타임라인' },
  { key: 'mypage',  label: '마이페이지',    desc: '프로필·설정·멤버십' },
  { key: 'payment', label: '결제',         desc: '결제 수단·금액 확인·완료' },
];

function Screen({ ds, children }: { ds: DS; children: React.ReactNode }) {
  const { t } = ds;
  return (
    <div
      className="flex flex-col"
      style={{
        background: t.bg,
        padding: t.containerPad,
        gap: t.stackGap,
        minHeight: t.isMobile ? 320 : 280,
        fontFamily: t.font,
      }}
    >
      {children}
    </div>
  );
}

/* ── 메인 ── */
function PatternMain({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Button, Card, Chip, Badge, Text, Thumb } = ds;
  const { space } = t;

  if (platform === 'mobile') {
    return (
      <Screen ds={ds}>
        {/* 배너 */}
        <div className="relative" style={{ borderRadius: t.radius.card, overflow: 'hidden' }}>
          <Thumb h={120} />
          <div style={{ position: 'absolute', inset: 0, padding: t.cardPad, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)' }}>
            <Text role="h2" weight={t.weightBold} color="#fff">오늘의 특가</Text>
            <Text role="caption" color="rgba(255,255,255,0.8)">최대 70% 할인</Text>
          </div>
        </div>
        {/* 카테고리 칩 */}
        <div className="flex overflow-hidden" style={{ gap: space.sm }}>
          {['전체', '신규', '인기', '할인'].map((c, i) => <Chip key={c} active={i === 0}>{c}</Chip>)}
        </div>
        {/* 추천 그리드 */}
        <div className="grid grid-cols-2" style={{ gap: space.sm }}>
          {[{ name: '상품 A', price: '9,900', badge: '신규' }, { name: '상품 B', price: '29,000', badge: 'HOT' }].map((item) => (
            <Card key={item.name} pad={false}>
              <div style={{ position: 'relative' }}>
                <Thumb h={80} />
                <span style={{ position: 'absolute', top: space.xs, left: space.xs }}><Badge tone="solid">{item.badge}</Badge></span>
              </div>
              <div style={{ padding: space.sm }}>
                <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: 2 }}>{item.name}</Text>
                <Text role="caption" weight={t.weightBold} color={t.primary}>{item.price}원</Text>
              </div>
            </Card>
          ))}
        </div>
      </Screen>
    );
  }

  return (
    <Screen ds={ds}>
      <div className="grid grid-cols-3" style={{ gap: space.md }}>
        <div className="col-span-2 relative" style={{ borderRadius: t.radius.card, overflow: 'hidden' }}>
          <Thumb h={160} />
          <div style={{ position: 'absolute', inset: 0, padding: t.cardPad, display: 'flex', alignItems: 'flex-end', background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 60%)' }}>
            <div>
              <Text role="h1" weight={t.weightBold} color="#fff">오늘의 특가</Text>
              <div style={{ marginTop: space.xs }}><Button variant="primary" size="sm">자세히 보기</Button></div>
            </div>
          </div>
        </div>
        <div className="flex flex-col" style={{ gap: space.sm }}>
          {[{ name: '추천 A', badge: '신규' }, { name: '추천 B', badge: 'HOT' }].map((item) => (
            <Card key={item.name} pad={false}>
              <Thumb h={56} />
              <div style={{ padding: space.sm }}>
                <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: 2 }}>{item.name}</Text>
                <Badge tone="soft">{item.badge}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex" style={{ gap: space.sm }}>
        {['전체', '신규', '인기', '할인', '브랜드'].map((c, i) => <Chip key={c} active={i === 0}>{c}</Chip>)}
      </div>
    </Screen>
  );
}

/* ── 로그인 · 가입 ── */
function PatternAuth({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Button, Input, Text } = ds;
  const { space } = t;

  const form = (
    <div className="flex flex-col" style={{ gap: space.md }}>
      <div>
        <Text role="h2" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xs }}>로그인</Text>
        <Text role="caption" color={t.textSub}>계정을 입력해주세요</Text>
      </div>
      <div className="flex flex-col" style={{ gap: space.sm }}>
        <Input label="이메일" placeholder="example@email.com" />
        <Input label="비밀번호" placeholder="••••••••" />
      </div>
      <Button variant="primary" full>로그인</Button>
      <div className="flex items-center" style={{ gap: space.sm }}>
        <div style={{ flex: 1, height: 1, background: t.border }} />
        <Text role="caption" color={t.textMuted}>또는</Text>
        <div style={{ flex: 1, height: 1, background: t.border }} />
      </div>
      <div className="flex flex-col" style={{ gap: space.sm }}>
        {['카카오로 계속하기', '네이버로 계속하기', 'Apple로 계속하기'].map((label, i) => (
          <Button key={label} variant={i < 2 ? 'secondary' : 'outline'} full>{label}</Button>
        ))}
      </div>
      <div className="flex justify-center" style={{ gap: space.sm }}>
        <Text role="caption" color={t.textSub}>계정이 없으신가요?</Text>
        <Text role="caption" color={t.primary} weight={t.weightBold}>회원가입</Text>
      </div>
    </div>
  );

  if (platform === 'mobile') return <Screen ds={ds}>{form}</Screen>;

  return (
    <Screen ds={ds}>
      <div className="flex justify-center">
        <div style={{ width: '100%', maxWidth: 340 }}>{form}</div>
      </div>
    </Screen>
  );
}

/* ── 검색 ── */
function PatternSearch({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Chip, Card, Badge, Text, Thumb } = ds;
  const { space } = t;

  return (
    <Screen ds={ds}>
      {/* 검색바 */}
      <div className="flex items-center" style={{ gap: space.sm, background: t.bg, borderRadius: t.radius.chip, border: `2px solid ${t.primary}`, padding: `${space.sm}px ${space.md}px` }}>
        <Text role="bodySm" color={t.primary}>🔍</Text>
        <Text role="bodySm" color={t.textMain}>무선이어폰</Text>
        <span style={{ marginLeft: 'auto', color: t.textMuted, fontSize: 12 }}>✕</span>
      </div>
      {/* 자동완성 */}
      <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        {['무선이어폰 추천', '무선이어폰 가성비', '무선이어폰 노이즈캔슬링'].map((item, i) => (
          <div key={item} className="flex items-center justify-between ds-press cursor-pointer" style={{ padding: `${space.sm}px ${space.md}px`, borderBottom: i < 2 ? `1px solid ${t.border}` : 'none' }}>
            <div className="flex items-center" style={{ gap: space.sm }}>
              <Text role="caption" color={t.textMuted}>🔍</Text>
              <Text role="bodySm">{item}</Text>
            </div>
            <Text role="caption" color={t.textSub}>↗</Text>
          </div>
        ))}
      </div>
      {/* 필터 */}
      <div className="flex overflow-hidden" style={{ gap: space.xs }}>
        {['전체', '5만원 이하', '브랜드', '무선', '노이즈캔슬링'].map((f, i) => <Chip key={f} active={i === 0}>{f}</Chip>)}
      </div>
      {/* 결과 */}
      <div className={platform === 'web' ? 'grid grid-cols-3' : 'grid grid-cols-2'} style={{ gap: space.sm }}>
        {[
          { name: '소니 WF-1000XM5', price: '189,000', badge: '인기' },
          { name: '삼성 갤럭시 버즈2', price: '89,000', badge: '할인' },
          ...(platform === 'web' ? [{ name: '애플 에어팟 프로', price: '279,000', badge: '신규' }] : []),
        ].map((item) => (
          <Card key={item.name} pad={false}>
            <div style={{ position: 'relative' }}>
              <Thumb h={72} />
              <span style={{ position: 'absolute', top: space.xs, right: space.xs }}><Badge tone="soft">{item.badge}</Badge></span>
            </div>
            <div style={{ padding: space.sm }}>
              <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: 2 }}>{item.name}</Text>
              <Text role="caption" weight={t.weightBold} color={t.primary}>{item.price}원</Text>
            </div>
          </Card>
        ))}
      </div>
    </Screen>
  );
}

/* ── 목록 (PLP) ── */
function PatternList({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Chip, Card, Badge, Button, Text, Thumb, ListRow } = ds;
  const { space } = t;

  return (
    <Screen ds={ds}>
      <div className="flex items-center justify-between">
        <Text role="bodySm" weight={t.weightBold}>상품 목록 <Text role="caption" color={t.textSub}>245개</Text></Text>
        <div className="flex items-center" style={{ gap: space.sm }}>
          <Button variant="secondary" size="sm">필터</Button>
          <Button variant="secondary" size="sm">정렬 ▾</Button>
        </div>
      </div>
      <div className="flex overflow-hidden" style={{ gap: space.xs }}>
        {['전체', '5만원 이하', '무료배송', '오늘출발'].map((f, i) => <Chip key={f} active={i === 0}>{f}</Chip>)}
      </div>
      {platform === 'mobile' ? (
        /* 리스트 뷰 */
        <div className="flex flex-col" style={{ gap: space.sm }}>
          {[
            { name: '무선이어폰 XM5', price: '189,000', sub: '무료배송 · ★ 4.8 (1.2k)', badge: '인기' },
            { name: '갤럭시 버즈2 프로', price: '89,000', sub: '오늘출발 · ★ 4.6 (890)', badge: '' },
          ].map((item, i) => (
            <ListRow key={item.name} divider={i === 0}>
              <div className="flex" style={{ gap: space.md, width: '100%' }}>
                <Thumb h={64} w={64} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
                <div className="flex-1 flex flex-col" style={{ gap: space.xs }}>
                  <div className="flex items-start justify-between">
                    <Text role="bodySm" weight={t.weightMedium}>{item.name}</Text>
                    {item.badge && <Badge tone="solid">{item.badge}</Badge>}
                  </div>
                  <Text role="caption" color={t.textSub}>{item.sub}</Text>
                  <Text role="bodySm" weight={t.weightBold} color={t.primary}>{item.price}원</Text>
                </div>
              </div>
            </ListRow>
          ))}
        </div>
      ) : (
        /* 그리드 뷰 */
        <div className="grid grid-cols-4" style={{ gap: space.sm }}>
          {['이어폰 XM5', '버즈2 프로', '에어팟 프로', '갤럭시 버즈'].map((name, i) => (
            <Card key={name} pad={false}>
              <div style={{ position: 'relative' }}>
                <Thumb h={64} />
                {i === 0 && <span style={{ position: 'absolute', top: space.xs, left: space.xs }}><Badge tone="solid">인기</Badge></span>}
              </div>
              <div style={{ padding: space.sm }}>
                <Text role="caption" weight={t.weightMedium} className="truncate" style={{ display: 'block', marginBottom: 2 }}>{name}</Text>
                <Text role="caption" weight={t.weightBold} color={t.primary}>{['189,000', '89,000', '279,000', '119,000'][i]}원</Text>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Screen>
  );
}

/* ── 상세 (PDP) ── */
function PatternDetail({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Button, Chip, Badge, Text, Thumb } = ds;
  const { space } = t;

  const info = (
    <div className="flex flex-col" style={{ gap: space.sm }}>
      <div className="flex items-start justify-between">
        <div>
          <Text role="caption" color={t.textSub} style={{ display: 'block', marginBottom: 2 }}>소니 코리아</Text>
          <Text role="h2" weight={t.weightBold}>무선 이어폰 WF-1000XM5</Text>
        </div>
        <Badge tone="soft">인기</Badge>
      </div>
      <div className="flex items-baseline" style={{ gap: space.sm }}>
        <Text role="h1" weight={t.weightBold} color={t.primary}>189,000원</Text>
        <Text role="bodySm" color={t.textMuted} style={{ textDecoration: 'line-through' }}>229,000원</Text>
        <Badge tone="solid">17%</Badge>
      </div>
      <div className="flex flex-wrap" style={{ gap: space.xs }}>
        {['블랙', '화이트', '실버'].map((c, i) => <Chip key={c} active={i === 0}>{c}</Chip>)}
      </div>
      <div style={{ padding: space.sm, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}` }}>
        <Text role="caption" color={t.textSub} style={{ display: 'block', marginBottom: space.xs }}>배송 정보</Text>
        <Text role="caption" color={t.success}>오늘 주문 시 내일 도착 (무료배송)</Text>
      </div>
    </div>
  );

  if (platform === 'mobile') {
    return (
      <Screen ds={ds}>
        <Thumb h={180} style={{ borderRadius: t.radius.card }} />
        {info}
        <div className="flex" style={{ gap: space.sm }}>
          <Button variant="secondary">찜 ♡</Button>
          <Button variant="primary" full>바로구매</Button>
        </div>
        {/* 탭 */}
        <div className="flex" style={{ borderBottom: `1px solid ${t.border}` }}>
          {['상품정보', '리뷰 128', 'Q&A'].map((tab, i) => (
            <div key={tab} className="flex-1 flex justify-center ds-press cursor-pointer" style={{ paddingBottom: space.sm, borderBottom: i === 0 ? `2px solid ${t.primary}` : '2px solid transparent', marginBottom: -1 }}>
              <Text role="caption" weight={i === 0 ? t.weightBold : t.weightRegular} color={i === 0 ? t.primary : t.textSub}>{tab}</Text>
            </div>
          ))}
        </div>
      </Screen>
    );
  }

  return (
    <Screen ds={ds}>
      <div className="grid grid-cols-2" style={{ gap: space.lg }}>
        <Thumb h={220} style={{ borderRadius: t.radius.card }} />
        <div className="flex flex-col" style={{ gap: space.md }}>
          {info}
          <div className="flex" style={{ gap: space.sm }}>
            <Button variant="secondary">찜 ♡</Button>
            <Button variant="primary" full>바로구매</Button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ── 내역 ── */
function PatternHistory({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Badge, Text, Thumb, ListRow } = ds;
  const { space } = t;

  const items = [
    { name: '무선이어폰 XM5', date: '2024.01.15', price: '189,000원', status: '배송완료', tone: 'soft' as const },
    { name: '스마트워치 Galaxy', date: '2024.01.10', price: '249,000원', status: '배송중', tone: 'solid' as const },
    { name: '블루투스 스피커', date: '2023.12.28', price: '79,000원', status: '취소', tone: 'muted' as const },
  ];

  return (
    <Screen ds={ds}>
      <div className="flex items-center justify-between">
        <Text role="bodySm" weight={t.weightBold}>주문 내역</Text>
        <Text role="caption" color={t.primary}>전체 보기</Text>
      </div>
      {/* 요약 카드 */}
      <div className={platform === 'web' ? 'grid grid-cols-3' : 'grid grid-cols-2'} style={{ gap: space.sm }}>
        {[
          { label: '전체', count: 12 },
          { label: '진행중', count: 2 },
          ...(platform === 'web' ? [{ label: '완료', count: 8 }] : []),
        ].map(({ label, count }) => (
          <div key={label} style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, padding: t.cardPad, textAlign: 'center' as const }}>
            <Text role="h2" weight={t.weightBold} color={t.primary} style={{ display: 'block' }}>{count}</Text>
            <Text role="caption" color={t.textSub}>{label}</Text>
          </div>
        ))}
      </div>
      {/* 타임라인 */}
      <div className="flex flex-col" style={{ gap: space.xs }}>
        <Text role="caption" color={t.textMuted} weight={t.weightBold}>2024년 1월</Text>
        {items.map((item, i) => (
          <ListRow key={item.name} divider={i < items.length - 1} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className="flex items-center" style={{ gap: space.md, width: '100%' }}>
              <Thumb h={48} w={48} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
              <div className="flex-1 flex flex-col" style={{ gap: 2 }}>
                <Text role="bodySm" weight={t.weightMedium}>{item.name}</Text>
                <Text role="caption" color={t.textSub}>{item.date}</Text>
              </div>
              <div className="flex flex-col items-end" style={{ gap: 4 }}>
                <Text role="bodySm" weight={t.weightBold}>{item.price}</Text>
                <Badge tone={item.tone}>{item.status}</Badge>
              </div>
            </div>
          </ListRow>
        ))}
      </div>
    </Screen>
  );
}

/* ── 마이페이지 ── */
function PatternMyPage({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Button, Badge, Text, Avatar, ListRow } = ds;
  const { space } = t;

  return (
    <Screen ds={ds}>
      {/* 프로필 */}
      <div className="flex items-center" style={{ gap: space.md, padding: t.cardPad, background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}` }}>
        <Avatar size={52} />
        <div className="flex-1">
          <Text role="bodySm" weight={t.weightBold} style={{ display: 'block' }}>홍길동</Text>
          <Text role="caption" color={t.textSub}>gildong@email.com</Text>
        </div>
        <Button variant="outline" size="sm">편집</Button>
      </div>
      {/* 멤버십 */}
      <div style={{ background: t.primary, borderRadius: t.radius.card, padding: t.cardPad, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text role="caption" color={t.onPrimary} style={{ opacity: 0.8, display: 'block', marginBottom: 2 }}>현재 등급</Text>
          <Text role="bodySm" weight={t.weightBold} color={t.onPrimary}>골드 멤버</Text>
        </div>
        <Badge tone="soft">VIP</Badge>
      </div>
      {/* 통계 */}
      <div className="grid grid-cols-3" style={{ gap: space.sm }}>
        {[{ label: '주문', count: 12 }, { label: '찜', count: 38 }, { label: '리뷰', count: 7 }].map(({ label, count }) => (
          <div key={label} className="flex flex-col items-center" style={{ gap: space.xs, padding: space.sm, background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}` }}>
            <Text role="h2" weight={t.weightBold} color={t.primary}>{count}</Text>
            <Text role="caption" color={t.textSub}>{label}</Text>
          </div>
        ))}
      </div>
      {/* 메뉴 */}
      <div style={{ background: t.surface, borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
        {['주문 내역', '배송지 관리', '결제 수단', '알림 설정', '고객센터', '로그아웃'].map((item, i, arr) => (
          <ListRow key={item} divider={i < arr.length - 1} style={{ paddingLeft: space.md, paddingRight: space.md }}>
            <Text role="bodySm" weight={t.weightMedium} color={item === '로그아웃' ? t.danger : t.textMain}>{item}</Text>
            {item !== '로그아웃' && <Text role="caption" color={t.textSub}>›</Text>}
          </ListRow>
        ))}
      </div>
    </Screen>
  );
}

/* ── 결제 ── */
function PatternPayment({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Button, Badge, Chip, Text, Thumb } = ds;
  const { space } = t;

  const summary = (
    <div className="flex flex-col" style={{ gap: space.sm }}>
      {/* 주문 상품 */}
      <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, padding: t.cardPad }}>
        <Text role="caption" weight={t.weightBold} color={t.textSub} style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: space.sm }}>주문 상품</Text>
        <div className="flex items-center" style={{ gap: space.sm }}>
          <Thumb h={48} w={48} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
          <div className="flex-1">
            <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block', marginBottom: 2 }}>무선이어폰 WF-1000XM5</Text>
            <Text role="caption" color={t.textSub}>블랙 / 1개</Text>
          </div>
          <Text role="bodySm" weight={t.weightBold}>189,000원</Text>
        </div>
      </div>
      {/* 금액 요약 */}
      <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, padding: t.cardPad }}>
        <Text role="caption" weight={t.weightBold} color={t.textSub} style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: space.sm }}>결제 금액</Text>
        {[{ label: '상품 금액', value: '229,000원' }, { label: '할인', value: '-40,000원', color: t.danger }, { label: '배송비', value: '무료', color: t.success }].map(({ label, value, color }) => (
          <div key={label} className="flex justify-between" style={{ marginBottom: space.xs }}>
            <Text role="caption" color={t.textSub}>{label}</Text>
            <Text role="caption" weight={t.weightMedium} color={color}>{value}</Text>
          </div>
        ))}
        <div style={{ borderTop: `1px solid ${t.border}`, marginTop: space.sm, paddingTop: space.sm }} className="flex justify-between">
          <Text role="bodySm" weight={t.weightBold}>총 결제 금액</Text>
          <Text role="bodySm" weight={t.weightBold} color={t.primary}>189,000원</Text>
        </div>
      </div>
    </div>
  );

  const payMethods = (
    <div className="flex flex-col" style={{ gap: space.sm }}>
      <Text role="caption" weight={t.weightBold} color={t.textSub} style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>결제 수단</Text>
      <div className="flex flex-wrap" style={{ gap: space.xs }}>
        {['신용카드', '카카오페이', '네이버페이', '계좌이체'].map((m, i) => <Chip key={m} active={i === 0}>{m}</Chip>)}
      </div>
      <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`, background: t.bg, display: 'flex', justifyContent: 'space-between' }}>
        <Text role="bodySm">삼성카드 •••• 1234</Text>
        <Text role="caption" color={t.textSub}>▾</Text>
      </div>
    </div>
  );

  if (platform === 'mobile') {
    return (
      <Screen ds={ds}>
        {summary}
        {payMethods}
        <Button variant="primary" full>189,000원 결제하기</Button>
      </Screen>
    );
  }

  return (
    <Screen ds={ds}>
      <div className="grid grid-cols-2" style={{ gap: space.lg }}>
        <div>{summary}</div>
        <div className="flex flex-col" style={{ gap: space.md }}>
          {payMethods}
          <Button variant="primary" full>189,000원 결제하기</Button>
        </div>
      </div>
    </Screen>
  );
}

/* ── dispatcher ── */
export function renderPattern(
  type: PatternType,
  ds: DS,
  platform: 'mobile' | 'web',
): React.ReactNode {
  switch (type) {
    case 'main':    return <PatternMain    ds={ds} platform={platform} />;
    case 'auth':    return <PatternAuth    ds={ds} platform={platform} />;
    case 'search':  return <PatternSearch  ds={ds} platform={platform} />;
    case 'list':    return <PatternList    ds={ds} platform={platform} />;
    case 'detail':  return <PatternDetail  ds={ds} platform={platform} />;
    case 'history': return <PatternHistory ds={ds} platform={platform} />;
    case 'mypage':  return <PatternMyPage  ds={ds} platform={platform} />;
    case 'payment': return <PatternPayment ds={ds} platform={platform} />;
  }
}
