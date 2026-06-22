'use client';

import React from 'react';
import { DS } from '@/components/ds';

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

/* ── 메인 ── */
function PatternMain({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Button, Card, Chip, Badge, Text, Thumb, Icon } = ds;
  const { space } = t;

  if (platform === 'mobile') {
    return (
      <Screen ds={ds}>
        <div style={{ position: 'relative', borderRadius: t.radius.card, overflow: 'hidden' }}>
          <Thumb h={120} />
          <div style={{ position: 'absolute', inset: 0, padding: t.cardPad, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', background: t.scrim }}>
            <Text role="h2" weight={t.weightBold} color={t.textOnImage}>오늘의 특가</Text>
            <Text role="caption" color={t.textOnImage} style={{ opacity: 0.85 }}>최대 70% 할인</Text>
          </div>
        </div>
        <div style={{ display: 'flex', overflow: 'hidden', gap: space.sm }}>
          {['전체', '신규', '인기', '할인'].map((c, i) => <Chip key={c} active={i === 0}>{c}</Chip>)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: space.sm }}>
          {[{ name: '상품 A', price: '9,900', badge: '신규' }, { name: '상품 B', price: '29,000', badge: 'HOT' }].map((item) => (
            <Card key={item.name} pad={false}>
              <div style={{ position: 'relative' }}>
                <Thumb h={80} />
                <span style={{ position: 'absolute', top: space.xs, left: space.xs }}><Badge tone="solid">{item.badge}</Badge></span>
              </div>
              <div style={{ padding: space.sm }}>
                <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{item.name}</Text>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: space.md }}>
        <div style={{ gridColumn: 'span 2', position: 'relative', borderRadius: t.radius.card, overflow: 'hidden' }}>
          <Thumb h={160} />
          <div style={{ position: 'absolute', inset: 0, padding: t.cardPad, display: 'flex', alignItems: 'flex-end', background: t.scrim }}>
            <div>
              <Text role="h1" weight={t.weightBold} color={t.textOnImage}>오늘의 특가</Text>
              <div style={{ marginTop: space.xs }}><Button variant="primary" size="sm">자세히 보기</Button></div>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
          {[{ name: '추천 A', badge: '신규' }, { name: '추천 B', badge: 'HOT' }].map((item) => (
            <Card key={item.name} pad={false}>
              <Thumb h={56} />
              <div style={{ padding: space.sm }}>
                <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{item.name}</Text>
                <Badge tone="soft">{item.badge}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: space.sm }}>
        {['전체', '신규', '인기', '할인', '브랜드'].map((c, i) => <Chip key={c} active={i === 0}>{c}</Chip>)}
      </div>
    </Screen>
  );
}

/* ── 로그인·가입 ── */
function PatternAuth({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Button, Input, Text } = ds;
  const { space } = t;

  const form = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
      <div>
        <Text role="h2" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xs }}>로그인</Text>
        <Text role="caption" color={t.textSub}>계정을 입력해주세요</Text>
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
        <Text role="caption" color={t.primary} weight={t.weightBold}>회원가입</Text>
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
function PatternSearch({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Chip, Card, Badge, Text, Thumb, Icon } = ds;
  const { space } = t;

  return (
    <Screen ds={ds}>
      <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, background: t.bg, borderRadius: t.radius.chip, border: `2px solid ${t.primary}`, padding: `${space.sm}px ${space.md}px` }}>
        <Icon name="search" size={14} color={t.primary} />
        <Text role="bodySm">무선이어폰</Text>
        <span style={{ marginLeft: 'auto', color: t.textMuted, display: 'flex' }}><Icon name="close" size={14} color={t.textMuted} /></span>
      </div>
      <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
        {['무선이어폰 추천', '무선이어폰 가성비', '무선이어폰 노이즈캔슬링'].map((item, i) => (
          <div key={item} className="ds-press cursor-pointer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `${space.sm}px ${space.md}px`, borderBottom: i < 2 ? `1px solid ${t.border}` : 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
              <Icon name="search" size={13} color={t.textMuted} />
              <Text role="bodySm">{item}</Text>
            </div>
            <Icon name="chevronRight" size={13} color={t.textSub} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', overflow: 'hidden', gap: space.xs }}>
        {['전체', '5만원 이하', '브랜드', '무선', '노이즈캔슬링'].map((f, i) => <Chip key={f} active={i === 0}>{f}</Chip>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: platform === 'web' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: space.sm }}>
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
              <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>{item.name}</Text>
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
  const { t, Chip, Card, Badge, Button, Text, Thumb, ListRow, Icon } = ds;
  const { space } = t;

  return (
    <Screen ds={ds}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text role="bodySm" weight={t.weightBold}>상품 목록 <Text role="caption" color={t.textSub}>245개</Text></Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
          <Button variant="secondary" size="sm"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="filter" size={12} color={t.textSub} />필터</span></Button>
          <Button variant="secondary" size="sm"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>정렬<Icon name="chevronDown" size={12} color={t.textSub} /></span></Button>
        </div>
      </div>
      <div style={{ display: 'flex', overflow: 'hidden', gap: space.xs }}>
        {['전체', '5만원 이하', '무료배송', '오늘출발'].map((f, i) => <Chip key={f} active={i === 0}>{f}</Chip>)}
      </div>
      {platform === 'mobile' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
          {[
            { name: '무선이어폰 XM5', price: '189,000', ship: '무료배송', rating: '4.8', reviews: '1.2k', badge: '인기' },
            { name: '갤럭시 버즈2 프로', price: '89,000', ship: '오늘출발', rating: '4.6', reviews: '890', badge: '' },
          ].map((item, i) => (
            <ListRow key={item.name} divider={i === 0}>
              <div style={{ display: 'flex', gap: space.md, width: '100%' }}>
                <Thumb h={64} w={64} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space.xs }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <Text role="bodySm" weight={t.weightMedium}>{item.name}</Text>
                    {item.badge && <Badge tone="solid">{item.badge}</Badge>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: space.xs }}>
                    <Text role="caption" color={t.textSub}>{item.ship} · </Text>
                    <span style={{ color: t.accent, display: 'inline-flex' }}><Icon name="star" size={12} /></span>
                    <Text role="caption" color={t.textSub}>{item.rating} ({item.reviews})</Text>
                  </div>
                  <Text role="bodySm" weight={t.weightBold} color={t.primary}>{item.price}원</Text>
                </div>
              </div>
            </ListRow>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: space.sm }}>
          {['이어폰 XM5', '버즈2 프로', '에어팟 프로', '갤럭시 버즈'].map((name, i) => (
            <Card key={name} pad={false}>
              <div style={{ position: 'relative' }}>
                <Thumb h={64} />
                {i === 0 && <span style={{ position: 'absolute', top: space.xs, left: space.xs }}><Badge tone="solid">인기</Badge></span>}
              </div>
              <div style={{ padding: space.sm }}>
                <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Text>
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
  const { t, Button, Chip, Badge, Text, Thumb, Icon } = ds;
  const { space } = t;

  const info = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <Text role="caption" color={t.textSub} style={{ display: 'block', marginBottom: space.xxs }}>소니 코리아</Text>
          <Text role="h2" weight={t.weightBold}>무선 이어폰 WF-1000XM5</Text>
        </div>
        <Badge tone="soft">인기</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: space.sm }}>
        <Text role="h1" weight={t.weightBold} color={t.primary}>189,000원</Text>
        <Text role="bodySm" color={t.textMuted} style={{ textDecoration: 'line-through' }}>229,000원</Text>
        <Badge tone="solid">17%</Badge>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.xs }}>
        {['블랙', '화이트', '실버'].map((c, i) => <Chip key={c} active={i === 0}>{c}</Chip>)}
      </div>
      <div style={{ padding: space.sm, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.xs, marginBottom: space.xs }}>
          <Icon name="truck" size={12} color={t.textSub} />
          <Text role="caption" color={t.textSub}>배송 정보</Text>
        </div>
        <Text role="caption" color={t.success}>오늘 주문 시 내일 도착 (무료배송)</Text>
      </div>
    </div>
  );

  const { TopBar } = ds;

  if (platform === 'mobile') {
    return (
      <Screen ds={ds} topBar={<TopBar title="상품 상세" actions={[{ icon: 'send' }, { icon: 'more' }]} />}>
        <Thumb h={180} style={{ borderRadius: t.radius.card }} />
        {info}
        <div style={{ display: 'flex', gap: space.sm }}>
          <Button variant="secondary"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="heart" size={14} color={t.textSub} />찜</span></Button>
          <Button variant="primary" full>바로구매</Button>
        </div>
        <div style={{ display: 'flex', borderBottom: `1px solid ${t.border}` }}>
          {['상품정보', '리뷰 128', 'Q&A'].map((tab, i) => (
            <div key={tab} className="ds-press cursor-pointer" style={{ flex: 1, display: 'flex', justifyContent: 'center', paddingBottom: space.sm, borderBottom: i === 0 ? `2px solid ${t.primary}` : '2px solid transparent', marginBottom: -1 }}>
              <Text role="caption" weight={i === 0 ? t.weightBold : t.weightRegular} color={i === 0 ? t.primary : t.textSub}>{tab}</Text>
            </div>
          ))}
        </div>
      </Screen>
    );
  }

  return (
    <Screen ds={ds} topBar={<TopBar title="상품 상세" actions={[{ icon: 'send' }, { icon: 'more' }]} />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: space.lg }}>
        <Thumb h={220} style={{ borderRadius: t.radius.card }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
          {info}
          <div style={{ display: 'flex', gap: space.sm }}>
            <Button variant="secondary"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="heart" size={14} color={t.textSub} />찜</span></Button>
            <Button variant="primary" full>바로구매</Button>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/* ── 내역 ── */
function PatternHistory({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Badge, Text, Thumb, ListRow, Icon, TopBar } = ds;
  const { space } = t;

  const items = [
    { name: '무선이어폰 XM5', date: '2024.01.15', price: '189,000원', status: '배송완료', tone: 'soft' as const },
    { name: '스마트워치 Galaxy', date: '2024.01.10', price: '249,000원', status: '배송중', tone: 'solid' as const },
    { name: '블루투스 스피커', date: '2023.12.28', price: '79,000원', status: '취소', tone: 'muted' as const },
  ];

  return (
    <Screen ds={ds} topBar={<TopBar title="주문 내역" actions={[{ icon: 'filter', label: '필터' }]} />}>
      <div style={{ display: 'grid', gridTemplateColumns: platform === 'web' ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)', gap: space.sm }}>
        {[{ label: '전체', count: 12, icon: 'package' as const }, { label: '진행중', count: 2, icon: 'truck' as const }, ...(platform === 'web' ? [{ label: '완료', count: 8, icon: 'checkCircle' as const }] : [])].map(({ label, count, icon }) => (
          <div key={label} style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, padding: t.cardPad, textAlign: 'center' as const }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: space.xs }}><Icon name={icon} size={16} color={t.primary} /></div>
            <Text role="h2" weight={t.weightBold} color={t.primary} style={{ display: 'block' }}>{count}</Text>
            <Text role="caption" color={t.textSub}>{label}</Text>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
        <Text role="caption" color={t.textMuted} weight={t.weightBold}>2024년 1월</Text>
        {items.map((item, i) => (
          <ListRow key={item.name} divider={i < items.length - 1} style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.md, width: '100%' }}>
              <Thumb h={48} w={48} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space.xxs }}>
                <Text role="bodySm" weight={t.weightMedium}>{item.name}</Text>
                <Text role="caption" color={t.textSub}>{item.date}</Text>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: space.xs }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: space.md, padding: t.cardPad, background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}` }}>
        <Avatar size={52} />
        <div style={{ flex: 1 }}>
          <Text role="bodySm" weight={t.weightBold} style={{ display: 'block' }}>홍길동</Text>
          <Text role="caption" color={t.textSub}>gildong@email.com</Text>
        </div>
        <Button variant="outline" size="sm"><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="edit" size={12} color={t.primary} />편집</span></Button>
      </div>
      <div style={{ background: t.primary, borderRadius: t.radius.card, padding: t.cardPad, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Text role="caption" color={t.onPrimary} style={{ opacity: 0.8, display: 'block', marginBottom: space.xxs }}>현재 등급</Text>
          <Text role="bodySm" weight={t.weightBold} color={t.onPrimary}>골드 멤버</Text>
        </div>
        <Badge tone="soft">VIP</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: space.sm }}>
        {[
          { label: '주문', count: 12, icon: 'package' as const },
          { label: '찜', count: 38, icon: 'heart' as const },
          { label: '리뷰', count: 7, icon: 'star' as const },
        ].map(({ label, count, icon }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.xs, padding: space.sm, background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}` }}>
            <Icon name={icon} size={16} color={t.primary} />
            <Text role="h2" weight={t.weightBold} color={t.primary}>{count}</Text>
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
function PatternPayment({ ds, platform }: { ds: DS; platform: 'mobile' | 'web' }) {
  const { t, Button, Chip, Text, Thumb, Icon, TopBar, Table } = ds;
  const { space } = t;

  const summary = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
      <div style={{ background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, padding: t.cardPad }}>
        <Text role="caption" weight={t.weightBold} color={t.textSub} style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: space.sm }}>주문 상품</Text>
        <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
          <Thumb h={48} w={48} style={{ borderRadius: t.radius.card, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>무선이어폰 WF-1000XM5</Text>
            <Text role="caption" color={t.textSub}>블랙 / 1개</Text>
          </div>
          <Text role="bodySm" weight={t.weightBold}>189,000원</Text>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
        <Text role="caption" weight={t.weightBold} color={t.textSub} style={{ display: 'block', textTransform: 'uppercase', letterSpacing: '0.06em' }}>결제 금액</Text>
        <Table
          rows={[
            { label: '상품 금액', value: '229,000원' },
            { label: '할인', value: '-40,000원', tone: 'danger' },
            { label: '배송비', value: '무료', tone: 'success' },
          ]}
          footer={{ label: '총 결제 금액', value: '189,000원' }}
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
        {['신용카드', '카카오페이', '네이버페이', '계좌이체'].map((m, i) => <Chip key={m} active={i === 0}>{m}</Chip>)}
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
        <Button variant="primary" full>189,000원 결제하기</Button>
      </Screen>
    );
  }

  return (
    <Screen ds={ds} topBar={<TopBar title="결제하기" />}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: space.lg }}>
        <div>{summary}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
          {payMethods}
          <Button variant="primary" full>189,000원 결제하기</Button>
        </div>
      </div>
    </Screen>
  );
}

/* ── dispatcher ── */
export function renderPattern(type: PatternType, ds: DS, platform: 'mobile' | 'web'): React.ReactNode {
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
