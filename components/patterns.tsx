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

export const PATTERN_VARIANTS: Record<PatternType, { key: string; label: string }[]> = {
  main: [
    { key: 'commerce', label: '커머스' },
    { key: 'finance',  label: '금융' },
    { key: 'portal',   label: '포털' },
  ],
  auth: [
    { key: 'login',  label: '로그인' },
    { key: 'signup', label: '회원가입' },
    { key: 'pin',    label: 'PIN 입력' },
  ],
  search: [
    { key: 'initial', label: '초기 화면' },
    { key: 'result',  label: '검색 결과' },
  ],
  list: [
    { key: 'grid', label: '그리드' },
    { key: 'list', label: '리스트' },
  ],
  detail: [
    { key: 'product', label: '상품 상세' },
    { key: 'review',  label: '리뷰' },
  ],
  history: [
    { key: 'bank',     label: '통장 내역' },
    { key: 'order',    label: '결제 내역' },
    { key: 'activity', label: '활동 내역' },
  ],
  mypage: [
    { key: 'default', label: '기본형' },
    { key: 'banking', label: '뱅킹형' },
  ],
  payment: [
    { key: 'checkout', label: '결제하기' },
    { key: 'complete', label: '결제 완료' },
  ],
};

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
function ItemsLayout({ ds, pack, platform, forceArchetype }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web'; forceArchetype?: string }) {
  const { t, Card, Badge, Text, Thumb, SaveCollect } = ds;
  const { space } = t;
  const items = pack.items.filter((it) => it.name);
  const a = forceArchetype ?? t.archetype;
  const collect = pack.signature === 'collect';

  const PriceLine = ({ p }: { p?: string }) =>
    p ? <Text role="caption" weight={t.weightBold} color={t.textMain}>{price(p)}</Text> : null;

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
function PatternMain({ ds, pack, platform, variant = 'commerce' }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web'; variant?: string }) {
  const { t, Chip, Text, Thumb, EditorialCard, BalanceCard, Icon, Card, RankingList } = ds;
  const { space } = t;

  /* ── 금융 홈 ── */
  if (variant === 'finance') {
    const quickActions = ['보내기', '받기', '납부', '환전'];
    const txRows = [
      { name: '스타벅스', sub: '카드결제', amount: '-4,500', dir: 'out' },
      { name: '급여', sub: '입금', amount: '+3,200,000', dir: 'in' },
      { name: '넷플릭스', sub: '정기결제', amount: '-17,000', dir: 'out' },
    ];
    return (
      <Screen ds={ds}>
        <BalanceCard label="내 잔액" value={pack.metric?.value ?? '2,450,000원'} delta={pack.metric?.delta} actions={['보내기', '충전']} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: space.sm }}>
          {quickActions.map((a) => (
            <div key={a} className="ds-press" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.xs, padding: space.sm, background: t.surface, borderRadius: t.radius.card, cursor: 'pointer', border: `1px solid ${t.border}` }}>
              <div style={{ width: 32, height: 32, borderRadius: 9999, background: t.primaryTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="card" size={14} color={ensureContrast(t.primary, t.primaryTint)} />
              </div>
              <Text role="caption" color={t.textSub}>{a}</Text>
            </div>
          ))}
        </div>
        <div>
          <Text role="caption" weight={t.weightBold} color={t.textMuted} style={{ display: 'block', marginBottom: space.sm }}>최근 거래</Text>
          <div style={{ display: 'flex', flexDirection: 'column', background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
            {txRows.map((row, i) => (
              <div key={row.name} style={{ display: 'flex', alignItems: 'center', gap: space.md, padding: `${space.sm}px ${space.md}px`, borderBottom: i < txRows.length - 1 ? `1px solid ${t.border}` : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 9999, background: t.primaryTint, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block' }}>{row.name}</Text>
                  <Text role="caption" color={t.textSub}>{row.sub}</Text>
                </div>
                <Text role="bodySm" weight={t.weightBold} color={row.dir === 'in' ? t.success : t.textMain}>{row.amount}</Text>
              </div>
            ))}
          </div>
        </div>
      </Screen>
    );
  }

  /* ── 포털 홈 ── */
  if (variant === 'portal') {
    const news = pack.listRows.slice(0, 3);
    const rankItems = pack.items.slice(0, 4).map((it, i) => ({
      title: it.name, sub: `인기 ${i + 1}위`, delta: (['up', 'up', 'same', 'down'] as const)[i],
    }));
    return (
      <Screen ds={ds}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, background: t.surface, borderRadius: t.radius.chip, border: `1px solid ${t.border}`, padding: `${space.sm}px ${space.md}px` }}>
          <Icon name="search" size={14} color={t.textMuted} />
          <Text role="bodySm" color={t.textMuted}>{pack.items[0]?.name ?? '검색'}</Text>
        </div>
        <div style={{ display: 'flex', overflow: 'hidden', gap: space.xs }}>
          {pack.chips.map((c, i) => <Chip key={c} active={i === 0}>{c}</Chip>)}
        </div>
        <RankingList items={rankItems} />
        <div>
          <Text role="caption" weight={t.weightBold} color={t.textMuted} style={{ display: 'block', marginBottom: space.sm }}>주요 뉴스</Text>
          {news.map((item, i) => (
            <div key={item.title} className="ds-press" style={{ display: 'flex', gap: space.md, paddingBottom: space.sm, marginBottom: space.sm, borderBottom: i < news.length - 1 ? `1px solid ${t.border}` : 'none', cursor: 'pointer' }}>
              <Thumb h={52} w={72} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{item.title}</Text>
                {item.sub && <Text role="caption" color={t.textSub}>{item.sub}</Text>}
              </div>
            </div>
          ))}
        </div>
      </Screen>
    );
  }

  /* ── 커머스 홈 (default) ── */
  const hero = <EditorialCard tag={pack.chips[0] ?? '추천'} title={pack.heroTitle} sub={pack.heroSub} h={platform === 'web' ? 150 : 120} />;
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
function PatternAuth({ ds, pack, platform, variant = 'login' }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web'; variant?: string }) {
  const { t, Button, Input, Text, Icon } = ds;
  const { space } = t;

  /* ── PIN 입력 ── */
  if (variant === 'pin') {
    const dots = [true, true, false, false, false, false];
    const keys = ['1','2','3','4','5','6','7','8','9','','0','⌫'];
    return (
      <Screen ds={ds}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.lg, paddingTop: space.xl }}>
          <div>
            <Text role="h2" weight={t.weightBold} style={{ display: 'block', textAlign: 'center', marginBottom: space.xs }}>PIN 번호 입력</Text>
            <Text role="caption" color={t.textSub} style={{ display: 'block', textAlign: 'center' }}>6자리 PIN 번호를 입력하세요</Text>
          </div>
          <div style={{ display: 'flex', gap: space.md }}>
            {dots.map((filled, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 9999, background: filled ? t.primary : 'transparent', border: `2px solid ${filled ? t.primary : t.border}` }} />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: space.sm, width: '100%', maxWidth: 240 }}>
            {keys.map((k, i) => (
              <button key={i} style={{ height: 48, borderRadius: t.radius.button, background: k ? t.surface : 'transparent', border: k ? `1px solid ${t.border}` : 'none', cursor: k ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.font }}>
                <Text role="bodySm" weight={t.weightBold} color={k === '⌫' ? t.textSub : t.textMain}>{k}</Text>
              </button>
            ))}
          </div>
          <Text role="caption" color={ensureContrast(t.primary, t.bg)} style={{ cursor: 'pointer' }}>PIN 번호를 잊으셨나요?</Text>
        </div>
      </Screen>
    );
  }

  /* ── 회원가입 ── */
  if (variant === 'signup') {
    const form = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
        <div>
          <Text role="h2" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xs }}>회원가입</Text>
          <Text role="caption" color={t.textSub}>서비스를 이용하려면 계정이 필요합니다</Text>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
          <Input label="이름" placeholder="홍길동" />
          <Input label="이메일" placeholder="example@email.com" />
          <Input label="비밀번호" placeholder="8자 이상, 영문+숫자" />
          <Input label="비밀번호 확인" placeholder="비밀번호를 다시 입력" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
          {['전체 약관 동의', '이용약관 동의 (필수)', '개인정보처리방침 동의 (필수)', '마케팅 수신 동의 (선택)'].map((term, i) => (
            <div key={term} style={{ display: 'flex', alignItems: 'center', gap: space.sm, padding: `${space.xs}px 0`, borderBottom: i === 0 ? `1px solid ${t.border}` : 'none', paddingBottom: i === 0 ? space.sm : undefined }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, border: `2px solid ${i === 0 || i === 1 ? t.primary : t.border}`, background: i === 0 || i === 1 ? t.primary : 'transparent', flexShrink: 0 }} />
              <Text role="caption" weight={i === 0 ? t.weightBold : t.weightRegular} color={t.textMain}>{term}</Text>
            </div>
          ))}
        </div>
        <Button variant="primary" full>가입하기</Button>
        <div style={{ display: 'flex', justifyContent: 'center', gap: space.sm }}>
          <Text role="caption" color={t.textSub}>이미 계정이 있으신가요?</Text>
          <Text role="caption" color={ensureContrast(t.primary, t.bg)} weight={t.weightBold}>로그인</Text>
        </div>
      </div>
    );
    return (
      <Screen ds={ds}>
        {platform === 'mobile' ? form : <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: '100%', maxWidth: 340 }}>{form}</div></div>}
      </Screen>
    );
  }

  /* ── 로그인 (default) ── */
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
function PatternSearch({ ds, pack, platform, variant = 'initial' }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web'; variant?: string }) {
  const { t, Text, Icon, RankingList } = ds;
  const { space } = t;
  const query = pack.items[0]?.name ?? '검색어';

  const searchBar = (focused: boolean) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, background: t.bg, borderRadius: t.radius.chip, border: `2px solid ${focused ? t.primary : t.border}`, padding: `${space.sm}px ${space.md}px` }}>
      <Icon name="search" size={14} color={focused ? ensureContrast(t.primary, t.bg) : t.textMuted} />
      <Text role="bodySm" color={focused ? t.textMain : t.textMuted}>{focused ? query : '검색어를 입력하세요'}</Text>
      {focused && <span style={{ marginLeft: 'auto', color: t.textMuted, display: 'flex' }}><Icon name="close" size={14} color={t.textMuted} /></span>}
    </div>
  );

  /* ── 검색 결과 ── */
  if (variant === 'result') {
    return (
      <Screen ds={ds}>
        {searchBar(true)}
        <div style={{ display: 'flex', overflow: 'hidden', gap: space.xs }}>
          {pack.chips.map((f, i) => <ds.Chip key={f} active={i === 0}>{f}</ds.Chip>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text role="caption" color={t.textSub}>결과 <Text role="caption" weight={t.weightBold} color={t.textMain}>127개</Text></Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: space.xs }}>
            <Text role="caption" color={t.textSub}>인기순</Text>
            <Icon name="chevronDown" size={12} color={t.textSub} />
          </div>
        </div>
        <ItemsLayout ds={ds} pack={pack} platform={platform} />
      </Screen>
    );
  }

  /* ── 초기 화면 (default) ── */
  const suggestions = pack.items.slice(0, 3).map((it) => it.name);
  const rankItems = pack.items.slice(0, 4).map((it, i) => ({
    title: it.name, sub: `인기 ${i + 1}위`, delta: (['up', 'up', 'same', 'down'] as const)[i],
  }));

  return (
    <Screen ds={ds}>
      {searchBar(false)}
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
      <div>
        <Text role="caption" weight={t.weightBold} color={t.textMuted} style={{ display: 'block', marginBottom: space.sm }}>실시간 인기</Text>
        <RankingList items={rankItems} />
      </div>
      <div style={{ display: 'flex', overflow: 'hidden', gap: space.xs }}>
        {pack.chips.map((f, i) => <ds.Chip key={f} active={i === 0}>{f}</ds.Chip>)}
      </div>
    </Screen>
  );
}

/* ── 목록 (PLP) ── */
function PatternList({ ds, pack, platform, variant = 'grid' }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web'; variant?: string }) {
  const { t, Button, Text, Icon, SaveCollect } = ds;
  const { space } = t;
  const collectItems = pack.items.slice(0, platform === 'web' ? 4 : 2);
  const forceArchetype = variant === 'list' ? 'list' : undefined;

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
      {variant === 'grid' && (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${collectItems.length}, 1fr)`, gap: space.sm }}>
          {collectItems.map((it, i) => (
            <SaveCollect key={it.name} count={1200 - i * 180} saved={i === 0} tag={it.name} h={90} />
          ))}
        </div>
      )}
      <ItemsLayout ds={ds} pack={pack} platform={platform} forceArchetype={forceArchetype} />
    </Screen>
  );
}

/* ── 상세 (PDP) ── */
function PatternDetail({ ds, pack, platform, variant = 'product' }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web'; variant?: string }) {
  const { t, Button, Text, Thumb, Icon, TopBar, Badge } = ds;
  const { space } = t;
  const priceItem = pack.items.find((it) => it.price);

  /* ── 리뷰 ── */
  if (variant === 'review') {
    const avgRating = 4.3;
    const bars = [
      { stars: 5, pct: 68 }, { stars: 4, pct: 20 }, { stars: 3, pct: 7 }, { stars: 2, pct: 3 }, { stars: 1, pct: 2 },
    ];
    const reviews = pack.listRows.slice(0, 2);
    return (
      <Screen ds={ds} topBar={<TopBar title="리뷰" actions={[{ icon: 'more' }]} />}>
        <div style={{ display: 'flex', gap: space.lg, padding: t.cardPad, background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}` }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: space.xs, flexShrink: 0 }}>
            <Text role="h1" weight={t.weightBold}>{avgRating}</Text>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width={12} height={12} viewBox="0 0 12 12" fill={s <= Math.round(avgRating) ? t.starFill : t.border}>
                  <path d="M6 1l1.4 2.8L11 4.4l-2.5 2.4.6 3.4L6 8.8l-3.1 1.4.6-3.4L1 4.4l3.6-.6z" />
                </svg>
              ))}
            </div>
            <Text role="caption" color={t.textSub}>128개 리뷰</Text>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space.xs }}>
            {bars.map(({ stars, pct }) => (
              <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: space.xs }}>
                <Text role="caption" color={t.textSub} style={{ width: 8, flexShrink: 0 }}>{stars}</Text>
                <div style={{ flex: 1, height: 4, background: t.border, borderRadius: 9999, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: t.starFill, borderRadius: 9999 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        {reviews.map((r, i) => (
          <div key={r.title} style={{ padding: t.cardPad, background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: space.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} width={10} height={10} viewBox="0 0 12 12" fill={s <= 4 + (i % 2) ? t.starFill : t.border}>
                    <path d="M6 1l1.4 2.8L11 4.4l-2.5 2.4.6 3.4L6 8.8l-3.1 1.4.6-3.4L1 4.4l3.6-.6z" />
                  </svg>
                ))}
              </div>
              <Text role="caption" color={t.textMuted}>{r.meta ?? '3일 전'}</Text>
            </div>
            <Text role="caption" weight={t.weightBold}>{r.title}</Text>
            {r.sub && <Text role="caption" color={t.textSub}>{r.sub}</Text>}
          </div>
        ))}
        <Button variant="outline" full>리뷰 더보기</Button>
      </Screen>
    );
  }

  /* ── 상품 상세 (default) ── */
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
      <div style={{ padding: space.sm, borderRadius: t.radius.card, background: t.bg, border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: space.xs }}>
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
function PatternHistory({ ds, pack, platform, variant = 'bank' }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web'; variant?: string }) {
  const { t, Badge, Text, Thumb, ListRow, TopBar, BalanceCard, StatusTracker, Icon } = ds;
  const { space } = t;
  const tones = ['soft', 'solid', 'muted'] as const;
  const m = pack.metric;

  /* ── 결제 내역 ── */
  if (variant === 'order') {
    const steps = pack.statusSteps.length ? pack.statusSteps : ['주문확인', '상품준비', '배송중', '배달완료'];
    const orders = [
      { name: pack.items[0]?.name ?? '주문 상품 A', sub: pack.items[0]?.meta ?? '옵션: 기본', price: pack.items[0]?.price ?? '29,900', status: '배송중', date: '2024.06.12' },
      { name: pack.items[1]?.name ?? '주문 상품 B', sub: pack.items[1]?.meta ?? '옵션: 기본', price: pack.items[1]?.price ?? '15,000', status: '배달완료', date: '2024.06.08' },
    ];
    return (
      <Screen ds={ds} topBar={<TopBar title="결제 내역" actions={[{ icon: 'filter', label: '필터' }]} />}>
        <StatusTracker steps={steps} current={2} />
        {orders.map((order, i) => (
          <div key={order.name} style={{ padding: t.cardPad, background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, display: 'flex', flexDirection: 'column', gap: space.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text role="caption" color={t.textSub}>{order.date}</Text>
              <Badge tone={i === 0 ? 'solid' : 'muted'}>{order.status}</Badge>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
              <Thumb h={52} w={52} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{order.name}</Text>
                <Text role="caption" color={t.textSub}>{order.sub}</Text>
              </div>
              <Text role="bodySm" weight={t.weightBold}>{price(order.price)}</Text>
            </div>
            <div style={{ display: 'flex', gap: space.sm }}>
              <ds.Button variant="secondary" size="sm" full>교환·반품</ds.Button>
              {i === 1 && <ds.Button variant="outline" size="sm" full>리뷰 작성</ds.Button>}
            </div>
          </div>
        ))}
      </Screen>
    );
  }

  /* ── 활동 내역 ── */
  if (variant === 'activity') {
    const activities = [
      { icon: 'heart' as const, text: '내 게시글에 좋아요를 눌렀습니다', sub: '오늘 오전 10:32', color: t.danger },
      { icon: 'chat' as const, text: '새 댓글: "정말 좋아 보여요!"', sub: '어제 오후 3:15', color: t.info },
      { icon: 'star' as const, text: '리뷰가 도움됐어요 +5', sub: '2일 전', color: t.starFill },
      { icon: 'bell' as const, text: '관심 상품 가격이 내렸어요', sub: '3일 전', color: t.warning },
      { icon: 'package' as const, text: '주문이 배송 완료되었습니다', sub: '5일 전', color: t.success },
    ];
    return (
      <Screen ds={ds} topBar={<TopBar title="활동 내역" actions={[{ icon: 'settings' }]} />}>
        <div style={{ display: 'flex', flexDirection: 'column', background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
          {activities.map((act, i) => (
            <div key={act.text} className="ds-press" style={{ display: 'flex', alignItems: 'flex-start', gap: space.md, padding: `${space.sm}px ${space.md}px`, borderBottom: i < activities.length - 1 ? `1px solid ${t.border}` : 'none', cursor: 'pointer' }}>
              <div style={{ width: 32, height: 32, borderRadius: 9999, background: t.primaryTint, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Icon name={act.icon} size={14} color={act.color} />
              </div>
              <div style={{ flex: 1 }}>
                <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{act.text}</Text>
                <Text role="caption" color={t.textSub}>{act.sub}</Text>
              </div>
            </div>
          ))}
        </div>
      </Screen>
    );
  }

  /* ── 통장 내역 (default) ── */
  const txRows = [
    { name: pack.listRows[0]?.title ?? '카드결제', sub: '카드 •••• 1234', amount: pack.listRows[0]?.meta ?? '-32,000', dir: 'out' },
    { name: '급여', sub: '(주)회사', amount: '+3,200,000', dir: 'in' },
    { name: pack.listRows[1]?.title ?? '자동이체', sub: '월세', amount: pack.listRows[1]?.meta ?? '-650,000', dir: 'out' },
    { name: '이자', sub: '예금 이자', amount: '+1,240', dir: 'in' },
  ];

  return (
    <Screen ds={ds} topBar={<TopBar title="통장 내역" actions={[{ icon: 'filter', label: '필터' }]} />}>
      <BalanceCard
        label={m?.label ?? '내 잔액'}
        value={m?.value ?? '1,823,450원'}
        delta={m?.delta ?? '이번 달 지출 -420,500원'}
        actions={['보내기', '받기']}
      />
      <div>
        <Text role="caption" weight={t.weightBold} color={t.textMuted} style={{ display: 'block', marginBottom: space.sm }}>최근 거래</Text>
        <div style={{ display: 'flex', flexDirection: 'column', background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
          {txRows.map((row, i) => (
            <div key={row.name + i} style={{ display: 'flex', alignItems: 'center', gap: space.md, padding: `${space.sm}px ${space.md}px`, borderBottom: i < txRows.length - 1 ? `1px solid ${t.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9999, background: t.primaryTint, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block' }}>{row.name}</Text>
                <Text role="caption" color={t.textSub}>{row.sub}</Text>
              </div>
              <Text role="bodySm" weight={t.weightBold} color={row.dir === 'in' ? t.success : t.textMain}>{row.amount}</Text>
            </div>
          ))}
        </div>
      </div>
    </Screen>
  );
}

/* ── 마이페이지 ── */
function PatternMyPage({ ds, pack, platform, variant = 'default' }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web'; variant?: string }) {
  const { t, Button, Badge, Text, Avatar, ListRow, Icon, TopBar, BalanceCard } = ds;
  const { space } = t;

  /* ── 뱅킹형 ── */
  if (variant === 'banking') {
    const accounts = [
      { name: '입출금 통장', sub: '•••• 1234', amount: '1,823,450원', badge: '주계좌' },
      { name: '정기예금', sub: '•••• 5678', amount: '5,000,000원', badge: '연 3.5%' },
      { name: '적금', sub: '•••• 9012', amount: '420,000원', badge: '월 30,000원' },
    ];
    return (
      <Screen ds={ds} topBar={<TopBar title="자산" back={false} actions={[{ icon: 'settings' }]} />}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
          <Avatar size={44} />
          <div>
            <Text role="bodySm" weight={t.weightBold} style={{ display: 'block' }}>홍길동</Text>
            <Text role="caption" color={t.textSub}>{pack.snippets[0] ?? '총 자산 현황'}</Text>
          </div>
        </div>
        <BalanceCard label="총 자산" value="7,243,450원" delta="이번 달 +320,000원" actions={['보내기', '충전', '투자']} />
        <div>
          <Text role="caption" weight={t.weightBold} color={t.textMuted} style={{ display: 'block', marginBottom: space.sm }}>내 계좌</Text>
          <div style={{ display: 'flex', flexDirection: 'column', background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
            {accounts.map((acc, i) => (
              <ListRow key={acc.name} divider={i < accounts.length - 1} style={{ paddingLeft: space.md, paddingRight: space.md }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: space.xs, marginBottom: space.xxs }}>
                    <Text role="bodySm" weight={t.weightMedium}>{acc.name}</Text>
                    <Badge tone="soft">{acc.badge}</Badge>
                  </div>
                  <Text role="caption" color={t.textSub}>{acc.sub}</Text>
                </div>
                <Text role="bodySm" weight={t.weightBold}>{acc.amount}</Text>
              </ListRow>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: space.sm }}>
          {['계좌 추가', '카드 연결', '자산 분석'].map((a) => (
            <Button key={a} variant="secondary" size="sm" full>{a}</Button>
          ))}
        </div>
      </Screen>
    );
  }

  /* ── 기본형 (default) ── */
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
        <Button variant="outline" size="sm"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="edit" size={12} color={ensureContrast(t.primary, t.surface)} />편집</span></Button>
      </div>
      <ds.GaugeMeter
        label={pack.metric?.label ?? '활동 점수'}
        value={pack.metric?.value ?? '72점'}
        ratio={0.72}
        caption={pack.metric?.delta ?? '좋아요'}
      />
      <ds.ChatList messages={pack.listRows.slice(0, 2).map((r, i) => ({ text: r.sub ?? r.title, me: i === 1, time: r.meta }))} />
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
      <div style={{ background: t.bg, borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
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
function PatternPayment({ ds, pack, platform, variant = 'checkout' }: { ds: DS; pack: ContentPack; platform: 'mobile' | 'web'; variant?: string }) {
  const { t, Button, Text, Thumb, Icon, TopBar, Table } = ds;
  const { space } = t;
  const item = pack.items.find((it) => it.price) ?? pack.items[0];
  const payLabel = item?.price ? `${price(item.price)} 결제하기` : '결제하기';

  /* ── 결제 완료 ── */
  if (variant === 'complete') {
    return (
      <Screen ds={ds} topBar={<TopBar title="결제 완료" back={false} />}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.lg, paddingTop: space.xl, paddingBottom: space.xl }}>
          <div style={{ width: 64, height: 64, borderRadius: 9999, background: t.primaryTint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="check" size={28} color={ensureContrast(t.primary, t.primaryTint)} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.xs }}>
            <Text role="h2" weight={t.weightBold}>결제가 완료되었습니다</Text>
            <Text role="caption" color={t.textSub}>주문번호 #ORD-2024-06-{String(Math.floor(Math.random() * 90000) + 10000)}</Text>
          </div>
          <div style={{ width: '100%', background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, padding: t.cardPad, display: 'flex', flexDirection: 'column', gap: space.sm }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
              <Thumb h={48} w={48} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{item?.name}</Text>
                <Text role="caption" color={t.textSub}>{item?.meta}</Text>
              </div>
              <Text role="bodySm" weight={t.weightBold}>{price(item?.price)}</Text>
            </div>
            <div style={{ height: 1, background: t.border }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text role="caption" color={t.textSub}>예상 도착일</Text>
              <Text role="caption" weight={t.weightBold}>내일 오후 2~6시</Text>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
          <Button variant="primary" full>주문 내역 보기</Button>
          <Button variant="secondary" full>쇼핑 계속하기</Button>
        </div>
      </Screen>
    );
  }

  /* ── 결제하기 (default) ── */
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
export function renderPattern(type: PatternType, ds: DS, platform: 'mobile' | 'web', pack: ContentPack, variant?: string): React.ReactNode {
  switch (type) {
    case 'main':    return <PatternMain    ds={ds} pack={pack} platform={platform} variant={variant} />;
    case 'auth':    return <PatternAuth    ds={ds} pack={pack} platform={platform} variant={variant} />;
    case 'search':  return <PatternSearch  ds={ds} pack={pack} platform={platform} variant={variant} />;
    case 'list':    return <PatternList    ds={ds} pack={pack} platform={platform} variant={variant} />;
    case 'detail':  return <PatternDetail  ds={ds} pack={pack} platform={platform} variant={variant} />;
    case 'history': return <PatternHistory ds={ds} pack={pack} platform={platform} variant={variant} />;
    case 'mypage':  return <PatternMyPage  ds={ds} pack={pack} platform={platform} variant={variant} />;
    case 'payment': return <PatternPayment ds={ds} pack={pack} platform={platform} variant={variant} />;
  }
}
