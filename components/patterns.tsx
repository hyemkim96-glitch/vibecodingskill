'use client';

import React from 'react';
import { DS } from '@/components/ds';
import { ensureContrast } from '@/lib/tokens/resolveTheme';
import { ContentPack } from '@/lib/content/packs';

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

/** Append 원 only to bare numeric prices — preserves 연 2.0%, +12.4%, 4,500 등. */
function price(p?: string): string {
  if (!p) return '';
  return /^[\d,]+$/.test(p) ? `${p}원` : p;
}

function Screen({ ds, topBar, children }: { ds: DS; topBar?: React.ReactNode; children: React.ReactNode }) {
  const { t } = ds;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: t.bg, minHeight: t.isMobile ? 320 : 280, fontFamily: t.font, overflow: 'hidden' }}>
      {topBar}
      <div style={{ display: 'flex', flexDirection: 'column', padding: t.containerPad, gap: t.stackGap, flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

/* ── signature band — the brand's distinctive moment ── */
function Signature({ ds, pack }: { ds: DS; pack: ContentPack }) {
  const { StatusTracker, BalanceCard, GaugeMeter, RankingList, SaveCollect, EditorialCard, ChatList } = ds;
  const m = pack.metric;
  const steps = pack.statusSteps.length ? pack.statusSteps : ['접수', '준비', '배송', '완료'];
  switch (pack.signature) {
    case 'status':
      return <StatusTracker steps={steps} current={Math.min(2, steps.length - 1)} />;
    case 'balance':
      return <BalanceCard label={m?.label ?? '잔액'} value={m?.value ?? ''} delta={m?.delta} actions={['보내기', '충전']} />;
    case 'gauge':
      return <GaugeMeter label={m?.label ?? '점수'} value={m?.value ?? ''} ratio={0.66} caption={m?.delta} />;
    case 'ranking':
      return <RankingList items={pack.listRows.map((r) => ({ title: r.title, sub: r.sub, delta: r.meta === '▲' ? 'up' : r.meta === '▼' ? 'down' : 'same' }))} />;
    case 'collect':
      return <SaveCollect count={1204} saved tag={pack.detailMeta[0]} h={140} />;
    case 'editorial':
      return <EditorialCard tag="EDITOR'S PICK" title={pack.heroTitle} sub={pack.heroSub} h={150} />;
    case 'chat':
      return <ChatList messages={pack.listRows.slice(0, 3).map((r, i) => ({ text: r.sub ?? r.title, me: i === 1, time: r.meta }))} />;
  }
}

/* ── item collection rendered per layout archetype ── */
function ItemsLayout({ ds, pack, platform }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web' }) {
  const { t, Card, Badge, Text, Thumb, SaveCollect } = ds;
  const { space } = t;
  const items = pack.items.filter((it) => it.name);
  const a = t.archetype;
  const collect = pack.signature === 'collect';

  const PriceLine = ({ p }: { p?: string }) =>
    p ? <Text role="caption" weight={t.weightBold} color={t.textMain}>{price(p)}</Text> : null;

  // List — thumbnail left, multi-line text right (Naver·Daangn)
  if (a === 'list') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
        {items.map((it, i) => (
          <div key={it.name} className="ds-press" style={{ display: 'flex', gap: space.md, paddingBottom: space.sm, borderBottom: i < items.length - 1 ? `1px solid ${t.border}` : 'none', cursor: 'pointer' }}>
            <Thumb h={56} w={56} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space.xxs }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: space.xs }}>
                <Text role="bodySm" weight={t.weightMedium}>{it.name}</Text>
                {it.badge && <Badge tone="soft">{it.badge}</Badge>}
              </div>
              {it.meta && <Text role="caption" color={t.textSub}>{it.meta}</Text>}
              <PriceLine p={it.price} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Stack — single airy column, large cards (Toss·KakaoBank)
  if (a === 'stack') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
        {items.map((it) => (
          <Card key={it.name} style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
            <div style={{ width: 44, height: 44, borderRadius: 9999, background: t.primaryTint, flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <Text role="bodySm" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xxs }}>{it.name}</Text>
              {it.meta && <Text role="caption" color={t.textSub}>{it.meta}</Text>}
            </div>
            {it.price && <Text role="bodySm" weight={t.weightBold} color={ensureContrast(t.primary, t.bg)}>{price(it.price)}</Text>}
          </Card>
        ))}
      </div>
    );
  }

  // Feed — full-bleed vertical cards (29CM editorial / default)
  if (a === 'feed') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
        {items.map((it) => (
          <Card key={it.name} pad={false}>
            <Thumb h={platform === 'web' ? 160 : 130} />
            <div style={{ padding: t.cardPad, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{it.name}</Text>
                {it.meta && <Text role="caption" color={t.textSub}>{it.meta}</Text>}
              </div>
              <PriceLine p={it.price} />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  // Masonry — 2-col staggered (Ohouse). Uses SaveCollect tiles when collect brand.
  if (a === 'masonry') {
    const cols: ContentPack['items'][] = [[], []];
    items.forEach((it, i) => cols[i % 2].push(it));
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: space.sm, alignItems: 'start' }}>
        {cols.map((col, ci) => (
          <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
            {col.map((it, ri) => (
              <Card key={it.name} pad={false}>
                {collect
                  ? <SaveCollect count={1204 - ri * 180} saved={ri === 0} h={(ci + ri) % 2 === 0 ? 120 : 88} />
                  : <Thumb h={(ci + ri) % 2 === 0 ? 120 : 88} />}
                <div style={{ padding: space.sm }}>
                  <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{it.name}</Text>
                  <PriceLine p={it.price} />
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Grid (default) — dense 2-col mobile / 4-col web (Baemin·Coupang·Musinsa)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${platform === 'web' ? 4 : 2}, 1fr)`, gap: space.sm }}>
      {items.map((it) => (
        <Card key={it.name} pad={false}>
          <div style={{ position: 'relative' }}>
            <Thumb h={80} />
            {it.badge && <span style={{ position: 'absolute', top: space.xs, left: space.xs }}><Badge tone="solid">{it.badge}</Badge></span>}
          </div>
          <div style={{ padding: space.sm }}>
            <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</Text>
            {it.meta && <Text role="caption" color={t.textSub} style={{ display: 'block', marginBottom: space.xxs }}>{it.meta}</Text>}
            <PriceLine p={it.price} />
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ── 메인 ── */
function PatternMain({ ds, pack, platform }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web' }) {
  const { t, Chip, Text, Thumb } = ds;
  const { space } = t;

  // Fashion leads with an editorial hero; others use a scrim banner.
  const hero = pack.signature === 'editorial'
    ? <Signature ds={ds} pack={pack} />
    : (
      <div style={{ position: 'relative', borderRadius: t.radius.card, overflow: 'hidden' }}>
        <Thumb h={platform === 'web' ? 150 : 120} />
        <div style={{ position: 'absolute', inset: 0, padding: t.cardPad, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: t.scrim }}>
          <Text role="h2" weight={t.weightBold} color={t.textOnImage}>{pack.heroTitle}</Text>
          <Text role="caption" color={t.textOnImage} style={{ opacity: 0.85 }}>{pack.heroSub}</Text>
        </div>
      </div>
    );

  // Signature band under hero (skip editorial — already the hero; skip collect — shown in masonry items)
  const showSignatureBand = pack.signature !== 'editorial' && pack.signature !== 'collect';

  return (
    <Screen ds={ds}>
      {hero}
      {showSignatureBand && <Signature ds={ds} pack={pack} />}
      <div style={{ display: 'flex', overflow: 'hidden', gap: space.sm }}>
        {pack.chips.map((c, i) => <Chip key={c} active={i === 0}>{c}</Chip>)}
      </div>
      <ItemsLayout ds={ds} pack={pack} platform={platform} />
    </Screen>
  );
}

/* ── 로그인·가입 ── */
function PatternAuth({ ds, pack, platform }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web' }) {
  const { t, Button, Input, Text } = ds;
  const { space } = t;

  const form = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
      <div>
        <Text role="h2" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xs }}>로그인</Text>
        <Text role="caption" color={t.textSub}>{pack.heroSub}</Text>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
        <Input label="이메일" placeholder="example@email.com" />
        <Input label="비밀번호" placeholder="••••••••" />
      </div>
      <Button variant="primary" full>로그인</Button>
      <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
        <div style={{ flex: 1, height: 1, background: t.border }} />
        <Text role="caption" color={t.textMuted}>또는</Text>
        <div style={{ flex: 1, height: 1, background: t.border }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
        {['카카오로 계속하기', '네이버로 계속하기', 'Apple로 계속하기'].map((label, i) => (
          <Button key={label} variant={i < 2 ? 'secondary' : 'outline'} full>{label}</Button>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: space.sm }}>
        <Text role="caption" color={t.textSub}>계정이 없으신가요?</Text>
        <Text role="caption" color={ensureContrast(t.primary, t.bg)} weight={t.weightBold}>회원가입</Text>
      </div>
    </div>
  );

  return (
    <Screen ds={ds}>
      {platform === 'mobile' ? form : <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '100%', maxWidth: 340 }}>{form}</div></div>}
    </Screen>
  );
}

/* ── 검색 ── */
function PatternSearch({ ds, pack, platform }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web' }) {
  const { t, Text, Icon } = ds;
  const { space } = t;
  const query = pack.items[0]?.name ?? '검색어';
  const suggestions = pack.items.slice(0, 3).map((it) => it.name);

  return (
    <Screen ds={ds}>
      <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, background: t.bg, borderRadius: t.radius.chip, border: `2px solid ${t.primary}`, padding: `${space.sm}px ${space.md}px` }}>
        <Icon name="search" size={14} color={ensureContrast(t.primary, t.bg)} />
        <Text role="bodySm">{query}</Text>
        <span style={{ marginLeft: 'auto', color: t.textMuted, display: 'flex' }}><Icon name="close" size={14} color={t.textMuted} /></span>
      </div>
      <div style={{ background: t.bg, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        {suggestions.map((item, i) => (
          <div key={item} className="ds-press cursor-pointer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${space.sm}px ${space.md}px`, borderBottom: i < suggestions.length - 1 ? `1px solid ${t.border}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
              <Icon name="search" size={13} color={t.textMuted} />
              <Text role="bodySm">{item}</Text>
            </div>
            <Icon name="chevronRight" size={13} color={t.textSub} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', overflow: 'hidden', gap: space.xs }}>
        {pack.chips.map((f, i) => <ds.Chip key={f} active={i === 0}>{f}</ds.Chip>)}
      </div>
      <ItemsLayout ds={ds} pack={pack} platform={platform} />
    </Screen>
  );
}

/* ── 목록 (PLP) ── */
function PatternList({ ds, pack, platform }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web' }) {
  const { t, Button, Text, Icon } = ds;
  const { space } = t;

  return (
    <Screen ds={ds}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text role="bodySm" weight={t.weightBold}>{pack.heroTitle} <Text role="caption" color={t.textSub}>245개</Text></Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
          <Button variant="secondary" size="sm"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="filter" size={12} color={t.textSub} />필터</span></Button>
          <Button variant="secondary" size="sm"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>정렬<Icon name="chevronDown" size={12} color={t.textSub} /></span></Button>
        </div>
      </div>
      <div style={{ display: 'flex', overflow: 'hidden', gap: space.xs }}>
        {pack.chips.map((f, i) => <ds.Chip key={f} active={i === 0}>{f}</ds.Chip>)}
      </div>
      <ItemsLayout ds={ds} pack={pack} platform={platform} />
    </Screen>
  );
}

/* ── 상세 (PDP) ── */
function PatternDetail({ ds, pack, platform }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web' }) {
  const { t, Button, Chip, Badge, Text, Thumb, Icon, TopBar } = ds;
  const { space } = t;
  const priceItem = pack.items.find((it) => it.price);

  const info = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <Text role="caption" color={t.textSub} style={{ display: 'block', marginBottom: space.xxs }}>{pack.detailMeta[0]}</Text>
          <Text role="h2" weight={t.weightBold}>{pack.detailTitle}</Text>
        </div>
        {priceItem?.badge && <Badge tone="soft">{priceItem.badge}</Badge>}
      </div>
      {priceItem?.price && (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: space.sm }}>
          <Text role="h1" weight={t.weightBold} color={t.textMain}>{price(priceItem.price)}</Text>
        </div>
      )}
      <div style={{ padding: space.sm, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: space.xs }}>
        {pack.detailMeta.slice(1).map((line) => (
          <div key={line} style={{ display: 'flex', alignItems: 'center', gap: space.xs }}>
            <Icon name="check" size={12} color={ensureContrast(t.success, t.bg)} />
            <Text role="caption" color={t.textSub}>{line}</Text>
          </div>
        ))}
      </div>
    </div>
  );

  if (platform === 'mobile') {
    return (
      <Screen ds={ds} topBar={<TopBar title="상세" actions={[{ icon: 'send' }, { icon: 'more' }]} />}>
        <Thumb h={180} style={{ borderRadius: t.radius.card }} />
        {info}
        <div style={{ display: 'flex', gap: space.sm }}>
          <Button variant="secondary"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="heart" size={14} color={t.textSub} />찜</span></Button>
          <Button variant="primary" full>{pack.snippets[2] ?? '바로구매'}</Button>
        </div>
        <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}` }}>
          {['상품정보', '리뷰 128', 'Q&A'].map((tab, i) => (
            <div key={tab} className="ds-press cursor-pointer" style={{ flex: 1, display: 'flex', justifyContent: 'center', paddingBottom: space.sm, borderBottom: i === 0 ? `2px solid ${t.primary}` : '2px solid transparent', marginBottom: -1 }}>
              <Text role="caption" weight={i === 0 ? t.weightBold : t.weightRegular} color={i === 0 ? ensureContrast(t.primary, t.bg) : t.textSub}>{tab}</Text>
            </div>
          ))}
        </div>
      </Screen>
    );
  }

  return (
    <Screen ds={ds} topBar={<TopBar title="상세" actions={[{ icon: 'send' }, { icon: 'more' }]} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: space.lg }}>
        <Thumb h={220} style={{ borderRadius: t.radius.card }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
          {info}
          <div style={{ display: 'flex', gap: space.sm }}>
            <Button variant="secondary"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="heart" size={14} color={t.textSub} />찜</span></Button>
            <Button variant="primary" full>{pack.snippets[2] ?? '바로구매'}</Button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ── 내역 ── */
function PatternHistory({ ds, pack, platform }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web' }) {
  const { t, Badge, Text, Thumb, ListRow, TopBar, BalanceCard } = ds;
  const { space } = t;
  const tones = ['soft', 'solid', 'muted'] as const;
  const m = pack.metric;

  return (
    <Screen ds={ds} topBar={<TopBar title="내역" actions={[{ icon: 'filter', label: '필터' }]} />}>
      {/* Summary card — always shown so the component is visible in base patterns too */}
      <BalanceCard
        label={m?.label ?? '이번 달 지출'}
        value={m?.value ?? '0원'}
        delta={m?.delta}
        actions={['내보내기', '보내기']}
      />
      {/* Non-balance signature still shows (e.g. StatusTracker for delivery order history) */}
      {pack.signature !== 'balance' && <Signature ds={ds} pack={pack} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
        <Text role="caption" color={t.textMuted} weight={t.weightBold}>최근 활동</Text>
        {pack.listRows.map((item, i) => (
          <ListRow key={item.title + i} divider={i < pack.listRows.length - 1} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.md, width: '100%' }}>
              <Thumb h={44} w={44} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space.xxs }}>
                <Text role="bodySm" weight={t.weightMedium}>{item.title}</Text>
                {item.sub && <Text role="caption" color={t.textSub}>{item.sub}</Text>}
              </div>
              {item.meta && <Badge tone={tones[i % tones.length]}>{item.meta}</Badge>}
            </div>
          </ListRow>
        ))}
      </div>
    </Screen>
  );
}

/* ── 마이페이지 ── */
function PatternMyPage({ ds, pack, platform }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web' }) {
  const { t, Button, Badge, Text, Avatar, ListRow, Icon, TopBar } = ds;
  const { space } = t;

  const menuItems: { label: string; icon: Parameters<typeof Icon>[0]['name']; danger?: boolean }[] = [
    { label: '주문 내역', icon: 'package' },
    { label: '배송지 관리', icon: 'pin' },
    { label: '결제 수단', icon: 'card' },
    { label: '알림 설정', icon: 'bell' },
    { label: '고객센터', icon: 'chat' },
    { label: '로그아웃', icon: 'logout', danger: true },
  ];

  return (
    <Screen ds={ds} topBar={<TopBar title="마이페이지" back={false} actions={[{ icon: 'settings' }]} />}>
      <div style={{ display: 'flex', alignItems: 'center', gap: space.md, padding: t.cardPad, background: t.bg, borderRadius: t.radius.card, border: `1px solid ${t.border}` }}>
        <Avatar size={52} />
        <div style={{ flex: 1 }}>
          <Text role="bodySm" weight={t.weightBold} style={{ display: 'block' }}>홍길동</Text>
          <Text role="caption" color={t.textSub}>{pack.snippets[0]}</Text>
        </div>
        <Button variant="outline" size="sm"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="edit" size={12} color={ensureContrast(t.primary, t.bg)} />편집</span></Button>
      </div>
      {/* membership / signature highlight */}
      {pack.signature === 'gauge' || pack.signature === 'balance'
        ? <Signature ds={ds} pack={pack} />
        : (
          <div style={{ background: t.primary, borderRadius: t.radius.card, padding: t.cardPad, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Text role="caption" color={t.onPrimary} style={{ opacity: 0.8, display: 'block', marginBottom: space.xxs }}>현재 등급</Text>
              <Text role="bodySm" weight={t.weightBold} color={t.onPrimary}>골드 멤버</Text>
            </div>
            <Badge tone="soft">VIP</Badge>
          </div>
        )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: space.sm }}>
        {[
          { label: '주문', count: 12, icon: 'package' as const },
          { label: '찜', count: 38, icon: 'heart' as const },
          { label: '리뷰', count: 7, icon: 'star' as const },
        ].map(({ label, count, icon }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.xs, padding: space.sm, background: t.bg, borderRadius: t.radius.card, border: `1px solid ${t.border}` }}>
            <Icon name={icon} size={16} color={ensureContrast(t.primary, t.bg)} />
            <Text role="h2" weight={t.weightBold} color={ensureContrast(t.primary, t.bg)}>{count}</Text>
            <Text role="caption" color={t.textSub}>{label}</Text>
          </div>
        ))}
      </div>
      <div style={{ background: t.surface, borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
        {menuItems.map((item, i, arr) => (
          <ListRow key={item.label} divider={i < arr.length - 1} style={{ paddingLeft: space.md, paddingRight: space.md }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
              <Icon name={item.icon} size={16} color={item.danger ? t.danger : t.textSub} />
              <Text role="bodySm" weight={t.weightMedium} color={item.danger ? t.danger : t.textMain}>{item.label}</Text>
            </div>
            {!item.danger && <Icon name="chevronRight" size={14} color={t.textSub} />}
          </ListRow>
        ))}
      </div>
    </Screen>
  );
}

/* ── 결제 ── */
function PatternPayment({ ds, pack, platform }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web' }) {
  const { t, Button, Text, Thumb, Icon, TopBar, Table } = ds;
  const { space } = t;
  const item = pack.items.find((it) => it.price) ?? pack.items[0];
  const payLabel = item?.price ? `${price(item.price)} 결제하기` : '결제하기';

  const summary = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      <div style={{ background: t.bg, borderRadius: t.radius.card, border: `1px solid ${t.border}`, padding: t.cardPad }}>
        <Text role="caption" weight={t.weightBold} color={t.textSub} style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: space.sm }}>주문 상품</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
          <Thumb h={48} w={48} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{item?.name}</Text>
            <Text role="caption" color={t.textSub}>{item?.meta}</Text>
          </div>
          <Text role="bodySm" weight={t.weightBold}>{price(item?.price)}</Text>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
        <Text role="caption" weight={t.weightBold} color={t.textSub} style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>결제 금액</Text>
        <Table
          rows={[
            { label: '상품 금액', value: price(item?.price) },
            { label: '할인', value: '-3,000원', tone: 'danger' },
            { label: '배송비', value: '무료', tone: 'success' },
          ]}
          footer={{ label: '총 결제 금액', value: price(item?.price) }}
        />
      </div>
    </div>
  );

  const payMethods = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: space.xs }}>
        <Icon name="card" size={14} color={t.textSub} />
        <Text role="caption" weight={t.weightBold} color={t.textSub} style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>결제 수단</Text>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.xs }}>
        {['신용카드', '카카오페이', '네이버페이', '계좌이체'].map((m, i) => <ds.Chip key={m} active={i === 0}>{m}</ds.Chip>)}
      </div>
      <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`, background: t.bg, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text role="bodySm">삼성카드 •••• 1234</Text>
        <Icon name="chevronDown" size={14} color={t.textSub} />
      </div>
    </div>
  );

  if (platform === 'mobile') {
    return (
      <Screen ds={ds} topBar={<TopBar title="결제하기" />}>
        {summary}
        {payMethods}
        <Button variant="primary" full>{payLabel}</Button>
      </Screen>
    );
  }

  return (
    <Screen ds={ds} topBar={<TopBar title="결제하기" />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: space.lg }}>
        <div>{summary}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
          {payMethods}
          <Button variant="primary" full>{payLabel}</Button>
        </div>
      </div>
    </Screen>
  );
}

/* ── dispatcher ── */
export function renderPattern(type: PatternType, ds: DS, platform: 'mobile' | 'web', pack: ContentPack): React.ReactNode {
  switch (type) {
    case 'main':    return <PatternMain    ds={ds} pack={pack} platform={platform} />;
    case 'auth':    return <PatternAuth    ds={ds} pack={pack} platform={platform} />;
    case 'search':  return <PatternSearch  ds={ds} pack={pack} platform={platform} />;
    case 'list':    return <PatternList    ds={ds} pack={pack} platform={platform} />;
    case 'detail':  return <PatternDetail  ds={ds} pack={pack} platform={platform} />;
    case 'history': return <PatternHistory ds={ds} pack={pack} platform={platform} />;
    case 'mypage':  return <PatternMyPage  ds={ds} pack={pack} platform={platform} />;
    case 'payment': return <PatternPayment ds={ds} pack={pack} platform={platform} />;
  }
}
