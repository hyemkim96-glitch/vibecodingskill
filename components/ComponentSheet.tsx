'use client';

import React from 'react';
import { BrandToken } from '@/types/token';
import { resolveTheme, ensureContrast } from '@/lib/tokens/resolveTheme';
import { createDS, motionVars, typeStyle } from '@/components/ds';
import { Icon } from '@/components/icons';

/**
 * ComponentSheet — general component library gallery (wireframe theme).
 *
 * Category axis = component type, not service type.
 * Tab: Buttons | Inputs | Cards | Feedback | Navigation
 *
 * All tiles are built from DS primitives — the same atoms the patterns use.
 */

export type ComponentCategory = 'all' | 'buttons' | 'inputs' | 'cards' | 'feedback' | 'navigation';

export const COMPONENT_CATEGORIES: { key: ComponentCategory; label: string }[] = [
  { key: 'all',        label: '전체' },
  { key: 'buttons',    label: '버튼 & 액션' },
  { key: 'inputs',     label: '입력 & 폼' },
  { key: 'cards',      label: '카드 & 리스트' },
  { key: 'feedback',   label: '피드백' },
  { key: 'navigation', label: '내비게이션' },
];

/** Section label shown only in "전체" view to separate category groups. */
function SectionHeading({ t, show, children }: { t: ReturnType<typeof resolveTheme>; show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div style={{ marginBottom: t.space.lg, marginTop: t.space.xl }}>
      <span style={{ ...typeStyle(t.type.bodySm), color: t.textMain, fontWeight: t.weightBold }}>{children}</span>
    </div>
  );
}

function Tile({ t, ds, title, children }: {
  t: ReturnType<typeof resolveTheme>;
  ds: ReturnType<typeof createDS>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius.card, padding: t.space.xl }}>
      <p style={{ ...typeStyle(t.type.bodySm), color: t.textMain, fontWeight: t.weightBold, marginBottom: t.space.lg }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xl }}>
        {children}
      </div>
    </div>
  );
}

export default function ComponentSheet({ token, category }: { token: BrandToken; category: ComponentCategory }) {
  const t = resolveTheme(token, 'mobile', 'wireframe');
  const ds = createDS(t, true);
  const { Button, Input, Badge, Chip, Card, Text, Thumb, Avatar, ListRow, Stepper, Rating,
          Checkbox, Switch, Radio, Textarea, Select, Divider, Skeleton, Progress, TopBar } = ds;
  const { space } = t;
  const all = category === 'all';

  return (
    <div className="ds-root" style={{ ...motionVars(t), display: 'flex', flexDirection: 'column', background: t.surfaceAlt, padding: t.space.xl, fontFamily: t.font, gap: all ? space.xl * 2 : 0 }}>
      {(all || category === 'buttons') && (
        <section>
        <SectionHeading t={t} show={all}>버튼 & 액션</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', alignItems: 'start', gap: space.xl }}>

          <Tile t={t} ds={ds} title="버튼 & 액션">
            {/* 변형 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <Button variant="primary" full>Primary</Button>
              <Button variant="secondary" full>Secondary</Button>
              <Button variant="outline" full>Outline</Button>
              <Button variant="ghost" full>Ghost</Button>
              <Button variant="primary" full disabled>Disabled</Button>
            </div>
            {/* 크기 */}
            <div style={{ display: 'flex', gap: space.sm }}>
              <div style={{ flex: 1 }}><Button variant="primary" size="sm" full>Small</Button></div>
              <div style={{ flex: 1 }}><Button variant="secondary" size="sm" full>취소</Button></div>
            </div>
            {/* 아이콘 버튼 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
              {(['arrowLeft', 'close', 'more', 'settings'] as const).map((ic) => (
                <div key={ic} className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: 40, height: 40, borderRadius: t.radius.button, background: t.surface, border: `1px solid ${t.border}`, color: t.textMain }}>
                  <Icon name={ic} size={18} />
                </div>
              ))}
            </div>
            {/* FAB */}
            <div style={{ display: 'flex', gap: space.sm }}>
              <div className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: 56, height: 56, borderRadius: '9999px', background: t.primary, color: t.onPrimary }}><Icon name="plus" size={24} /></div>
              <div className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: 48, height: 48, borderRadius: '9999px', background: t.primary, color: t.onPrimary }}><Icon name="edit" size={18} /></div>
            </div>
          </Tile>

        </div>
        </section>
      )}

      {(all || category === 'inputs') && (
        <section>
        <SectionHeading t={t} show={all}>입력 & 폼</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', alignItems: 'start', gap: space.xl }}>

          <Tile t={t} ds={ds} title="텍스트 입력">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <Input label="레이블" placeholder="플레이스홀더" />
              <Input label="포커스 상태" placeholder="입력 중…" focus />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
              <span style={{ ...typeStyle(t.type.caption), color: t.textMain, fontWeight: t.weightMedium }}>에러 상태</span>
              <div style={{ border: `1.5px solid ${t.danger}`, borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`, background: t.bg }}>
                <span style={{ ...typeStyle(t.type.bodySm), color: t.textMain }}>잘못된 입력값</span>
              </div>
              <span style={{ ...typeStyle(t.type.caption), color: t.danger }}>올바른 형식으로 입력해주세요</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, background: t.surface, borderRadius: t.radius.chip, border: `1px solid ${t.border}`, padding: `${space.sm}px ${space.md}px`, color: t.textMuted }}>
                <Icon name="search" size={16} />
                <Text role="bodySm" color={t.textMuted}>검색어를 입력하세요</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, background: t.bg, borderRadius: t.radius.chip, border: `2px solid ${t.primary}`, padding: `${space.sm}px ${space.md}px` }}>
                <Icon name="search" size={16} color={t.primary} />
                <Text role="bodySm">검색 포커스 상태</Text>
              </div>
            </div>
            <Textarea label="후기 작성" placeholder="내용을 입력해주세요…" rows={3} />
          </Tile>

          <Tile t={t} ds={ds} title="셀렉트 & 드롭다운">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <Select label="카테고리" placeholder="옵션 선택" />
              <Select label="선택됨" placeholder="" value="옵션 1" />
              <Select label="비활성" placeholder="선택 불가" disabled />
            </div>
            <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radius.card, background: t.surface, overflow: 'hidden' }}>
              {['옵션 1', '옵션 2', '옵션 3'].map((opt, i) => (
                <div key={opt} className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: `${space.sm}px ${space.md}px`, borderBottom: i < 2 ? `1px solid ${t.border}` : 'none', background: i === 0 ? t.primaryTint : 'transparent' }}>
                  <Text role="bodySm" weight={i === 0 ? t.weightBold : t.weightRegular} color={i === 0 ? t.primary : t.textMain}>{opt}</Text>
                  {i === 0 && <span style={{ color: t.primary, display: 'inline-flex' }}><Icon name="check" size={14} /></span>}
                </div>
              ))}
            </div>
          </Tile>

          <Tile t={t} ds={ds} title="체크박스 · 라디오 · 스위치">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <Checkbox checked label="선택됨" />
              <Checkbox label="선택 안 됨" />
              <Checkbox checked indeterminate label="일부 선택" />
              <Checkbox checked disabled label="비활성 선택" />
            </div>
            <Divider label="라디오" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <Radio checked label="옵션 A 선택" />
              <Radio label="옵션 B" />
              <Radio checked disabled label="비활성 선택" />
            </div>
            <Divider label="스위치" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <Switch on label="알림 켜짐" />
              <Switch label="알림 꺼짐" />
              <Switch on disabled label="비활성 ON" />
            </div>
          </Tile>

        </div>
        </section>
      )}

      {(all || category === 'cards') && (
        <section>
        <SectionHeading t={t} show={all}>카드 & 리스트</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', alignItems: 'start', gap: space.xl }}>

          <Tile t={t} ds={ds} title="카드 변형">
            {/* 기본/강조 카드 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <Card>
                <Text role="bodySm" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xs }}>카드 제목</Text>
                <Text role="caption" color={t.textSub}>카드 본문 텍스트가 여기에 들어갑니다. 두 줄 이상이 될 수 있어요.</Text>
              </Card>
              <Card interactive={false} style={{ background: t.primary }}>
                <Text role="bodySm" weight={t.weightBold} color={t.onPrimary} style={{ display: 'block', marginBottom: space.xs }}>강조 카드</Text>
                <Text role="caption" color={t.onPrimary} style={{ opacity: 0.8 }}>Primary 배경 위 카드</Text>
              </Card>
            </div>
            {/* 미디어 카드 */}
            <Card pad={false}>
              <Thumb h={80} />
              <div style={{ padding: space.md }}>
                <Text role="bodySm" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xxs }}>미디어 카드 제목</Text>
                <Text role="caption" color={t.textSub}>서브 텍스트 · 날짜</Text>
              </div>
            </Card>
            {/* 그리드 카드 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: space.sm }}>
              {[0, 1].map((i) => (
                <Card key={i} pad={false}>
                  <Thumb h={56} />
                  <div style={{ padding: space.sm }}>
                    <Text role="caption" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xxs }}>항목 {i + 1}</Text>
                    <Text role="caption" color={t.primary} weight={t.weightBold}>9,900원</Text>
                  </div>
                </Card>
              ))}
            </div>
            {/* 수평 스크롤 */}
            <div style={{ display: 'flex', overflow: 'hidden', gap: space.sm }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{ flexShrink: 0, width: 100, background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden' }}>
                  <Thumb h={60} />
                  <div style={{ padding: space.sm }}>
                    <Text role="caption" weight={t.weightMedium} style={{ display: 'block', marginBottom: space.xxs }}>카드 {i + 1}</Text>
                    <Text role="caption" color={t.textSub}>12,000원</Text>
                  </div>
                </div>
              ))}
            </div>
          </Tile>

          <Tile t={t} ds={ds} title="리스트 로우">
            <div style={{ background: t.surface, borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
              {['첫 번째 항목', '두 번째 항목', '세 번째 항목'].map((item, i) => (
                <ListRow key={item} divider={i < 2} style={{ paddingLeft: space.md, paddingRight: space.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
                    <span style={{ width: 32, height: 32, borderRadius: t.radius.card, background: t.surfaceAlt, flexShrink: 0 }} />
                    <div>
                      <Text role="bodySm" weight={t.weightMedium} style={{ display: 'block' }}>{item}</Text>
                      <Text role="caption" color={t.textSub}>서브 텍스트</Text>
                    </div>
                  </div>
                  <span style={{ color: t.textSub, display: 'inline-flex' }}><Icon name="chevronRight" size={16} /></span>
                </ListRow>
              ))}
            </div>
            <ListRow style={{ paddingLeft: space.md, paddingRight: space.md, background: t.surface, borderRadius: t.radius.card, border: `1px solid ${t.border}` }}>
              <Avatar size={36} />
              <Text role="bodySm" weight={t.weightMedium}>아바타 + 텍스트</Text>
              <Badge tone="soft">NEW</Badge>
            </ListRow>
          </Tile>

        </div>
        </section>
      )}

      {(all || category === 'feedback') && (
        <section>
        <SectionHeading t={t} show={all}>피드백</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', alignItems: 'start', gap: space.xl }}>

          <Tile t={t} ds={ds} title="배지 & 칩">
            {/* 배지 변형 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
              <Badge tone="solid">Solid</Badge>
              <Badge tone="soft">Soft</Badge>
              <Badge tone="accent">Accent</Badge>
              <Badge tone="muted">Muted</Badge>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.sm }}>
              <Badge tone="solid">신규</Badge>
              <Badge tone="soft">HOT</Badge>
              <Badge tone="muted">품절</Badge>
              <Badge tone="soft">35%</Badge>
            </div>
            {/* 칩 & 필터 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.xs }}>
              <Chip active>전체</Chip>
              <Chip>인기순</Chip>
              <Chip>최신순</Chip>
              <Chip>가격순</Chip>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.xs }}>
              {['무료배송', '오늘출발', '리뷰많은', '할인중'].map((label) => (
                <Chip key={label}>{label}</Chip>
              ))}
            </div>
          </Tile>

          <Tile t={t} ds={ds} title="별점 & 리뷰">
            {/* 별점 입력 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
              <Text role="caption" color={t.textSub} weight={t.weightMedium}>평점 선택</Text>
              <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
                <Rating value={4} size={24} />
                <Text role="bodySm" weight={t.weightBold}>4.0</Text>
              </div>
            </div>
            {/* 리뷰 요약 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: space.lg }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Text role="h1" weight={t.weightBold} color={t.primary}>4.3</Text>
                <Rating value={4.3} />
                <Text role="caption" color={t.textMuted}>리뷰 1,284개</Text>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space.xxs }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const ratios: Record<number, number> = { 5: 0.62, 4: 0.21, 3: 0.10, 2: 0.04, 1: 0.03 };
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', gap: space.xs }}>
                      <Text role="caption" color={t.textMuted} style={{ width: 8, textAlign: 'right' }}>{star}</Text>
                      <div style={{ flex: 1, height: 6, borderRadius: 9999, background: t.surfaceAlt }}>
                        <div style={{ height: '100%', width: `${ratios[star] * 100}%`, borderRadius: 9999, background: '#F5A623' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* 리뷰 카드 */}
            <Card interactive={false}>
              <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, marginBottom: space.xs }}>
                <Avatar size={32} />
                <div>
                  <Text role="caption" weight={t.weightBold} style={{ display: 'block' }}>홍**</Text>
                  <Rating value={5} size={12} />
                </div>
                <Text role="caption" color={t.textMuted} style={{ marginLeft: 'auto' }}>3일 전</Text>
              </div>
              <Text role="caption" color={t.textSub}>배송이 빠르고 품질이 너무 좋아요. 재구매 의사 있습니다!</Text>
            </Card>
          </Tile>

          <Tile t={t} ds={ds} title="상태 인디케이터">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              {[
                { dot: t.success,   label: '온라인', sub: '방금 접속' },
                { dot: t.textMuted, label: '오프라인', sub: '3시간 전' },
                { dot: t.primary,   label: '진행 중', sub: '결제 처리' },
              ].map(({ dot, label, sub }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
                  <span style={{ width: 8, height: 8, borderRadius: '9999px', background: dot, flexShrink: 0 }} />
                  <Text role="bodySm" weight={t.weightMedium}>{label}</Text>
                  <Text role="caption" color={t.textSub}>{sub}</Text>
                </div>
              ))}
            </div>
          </Tile>

          <Tile t={t} ds={ds} title="토스트 & 알림">
            {(() => {
              const toastBg = t.textMain;
              return ([
                { color: ensureContrast(t.onPrimary, toastBg), icon: 'checkCircle' as const, label: '저장되었습니다' },
                { color: ensureContrast(t.danger,    toastBg), icon: 'alertCircle' as const,  label: '오류가 발생했습니다' },
                { color: ensureContrast(t.success,   toastBg), icon: 'checkCircle' as const, label: '결제가 완료되었습니다' },
                { color: ensureContrast(t.warning,   toastBg), icon: 'alertCircle' as const,  label: '재고가 부족합니다' },
                { color: ensureContrast(t.info,      toastBg), icon: 'checkCircle' as const, label: '새로운 업데이트가 있어요' },
              ]).map(({ color, icon, label }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: space.sm, padding: `${space.sm}px ${space.md}px`, borderRadius: t.radius.card, background: toastBg }}>
                  <Icon name={icon} size={16} color={color} />
                  <Text role="bodySm" color={color} weight={t.weightMedium}>{label}</Text>
                </div>
              ));
            })()}
          </Tile>

          <Tile t={t} ds={ds} title="프로그레스">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <Progress value={30} max={100} label="업로드 중" />
              <Progress value={65} max={100} label="처리 중" />
              <Progress value={100} max={100} tone="success" label="완료" />
              <Progress value={20} max={100} tone="danger" label="오류" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: space.md }}>
              {[20, 28, 36].map((sz) => (
                <div key={sz} style={{ width: sz, height: sz, borderRadius: '9999px', border: `2.5px solid ${t.border}`, borderTopColor: t.primary }} />
              ))}
            </div>
          </Tile>

          <Tile t={t} ds={ds} title="스켈레톤">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
                <Skeleton w={40} h={40} radius="9999px" />
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: space.xs }}>
                  <Skeleton w="60%" h={14} />
                  <Skeleton w="40%" h={12} />
                </div>
              </div>
              <Skeleton h={72} radius={t.radius.card} />
              <Skeleton h={14} />
              <Skeleton w="75%" h={14} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
              <div style={{ display: 'flex', gap: space.sm }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space.xs }}>
                    <Skeleton h={80} radius={t.radius.card} />
                    <Skeleton h={12} />
                    <Skeleton w="60%" h={12} />
                  </div>
                ))}
              </div>
            </div>
          </Tile>

          <Tile t={t} ds={ds} title="구분선">
            <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
              <Divider />
              <Divider label="또는" />
              <div style={{ display: 'flex', alignItems: 'stretch', gap: space.md, height: 60 }}>
                <Text role="bodySm" color={t.textSub}>좌측</Text>
                <Divider vertical />
                <Text role="bodySm" color={t.textSub}>우측</Text>
              </div>
            </div>
          </Tile>

        </div>
        </section>
      )}

      {(all || category === 'navigation') && (
        <section>
        <SectionHeading t={t} show={all}>내비게이션</SectionHeading>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', alignItems: 'start', gap: space.xl }}>

          <Tile t={t} ds={ds} title="탑 내비게이션 바">
            {/* 상세 페이지: ← + 제목 + 우측 액션 */}
            <TopBar title="상품 상세" actions={[{ icon: 'send' }, { icon: 'more' }]} />
            {/* 텍스트 액션: ← + 제목 + 텍스트 버튼 */}
            <TopBar title="배송지 입력" actions={[{ icon: 'close', label: '완료' }]} />
            {/* 홈: 타이틀만 + 아이콘 */}
            <TopBar title="홈" back={false} actions={[{ icon: 'search' }, { icon: 'bell' }]} />
            {/* 뒤로만 (제목 없음) */}
            <TopBar back />
          </Tile>

          <Tile t={t} ds={ds} title="탭 내비게이션">
            {/* 하단 탭 바 */}
            <div style={{ background: t.bg, borderTop: `1px solid ${t.border}`, padding: `${space.sm}px ${space.md}px` }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
                {[
                  { icon: 'home' as const, label: '홈', active: true },
                  { icon: 'search' as const, label: '검색', active: false },
                  { icon: 'package' as const, label: '주문', active: false },
                  { icon: 'heart' as const, label: '찜', active: false },
                  { icon: 'user' as const, label: '마이', active: false },
                ].map(({ icon, label, active }) => (
                  <div key={label} className="ds-press" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', gap: space.xxs, paddingTop: space.xs, paddingBottom: space.xs }}>
                    <Icon name={icon} size={18} color={active ? t.primary : t.textMuted} />
                    <Text role="caption" weight={active ? t.weightBold : t.weightRegular} color={active ? t.primary : t.textMuted}>{label}</Text>
                  </div>
                ))}
              </div>
            </div>
            {/* 세그먼트 컨트롤 */}
            <div style={{ background: t.surface, borderRadius: t.radius.button, padding: space.xxs, display: 'flex' }}>
              {['전체', '판매중', '거래완료'].map((label, i) => (
                <div key={label} className="ds-press" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: `${space.xs + 2}px ${space.sm}px`, borderRadius: t.radius.button, background: i === 0 ? t.bg : 'transparent', boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                  <Text role="caption" weight={i === 0 ? t.weightBold : t.weightRegular} color={i === 0 ? t.textMain : t.textSub}>{label}</Text>
                </div>
              ))}
            </div>
            {/* 언더라인 탭 */}
            <div style={{ borderBottom: `1px solid ${t.border}`, display: 'flex' }}>
              {['홈', '카테고리', '라이브', '마이'].map((label, i) => (
                <div key={label} className="ds-press" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', paddingBottom: space.sm, paddingTop: space.sm, borderBottom: i === 0 ? `2px solid ${t.primary}` : '2px solid transparent', marginBottom: -1 }}>
                  <Text role="caption" weight={i === 0 ? t.weightBold : t.weightRegular} color={i === 0 ? t.primary : t.textSub}>{label}</Text>
                </div>
              ))}
            </div>
          </Tile>

          <Tile t={t} ds={ds} title="사이드 메뉴 항목">
            <div style={{ background: t.surface, borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
              {([
                { icon: 'user' as const, label: '내 프로필' },
                { icon: 'package' as const, label: '주문 내역' },
                { icon: 'heart' as const, label: '찜 목록' },
                { icon: 'settings' as const, label: '설정' },
              ]).map((item, i) => (
                <ListRow key={item.label} divider={i < 3} style={{ paddingLeft: space.md, paddingRight: space.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, color: t.textMain }}>
                    <Icon name={item.icon} size={18} />
                    <Text role="bodySm" weight={t.weightMedium}>{item.label}</Text>
                  </div>
                  <span style={{ color: t.textSub, display: 'inline-flex' }}><Icon name="chevronRight" size={16} /></span>
                </ListRow>
              ))}
            </div>
          </Tile>

          <Tile t={t} ds={ds} title="브레드크럼 & 페이지네이션">
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: space.xs }}>
              {['홈', '카테고리', '상의', '티셔츠'].map((crumb, i, arr) => (
                <React.Fragment key={crumb}>
                  <Text role="caption" color={i === arr.length - 1 ? t.textMain : t.primary} weight={i === arr.length - 1 ? t.weightBold : t.weightRegular}>{crumb}</Text>
                  {i < arr.length - 1 && <Text role="caption" color={t.textMuted}>/</Text>}
                </React.Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: space.xs }}>
              {['prev', '1', '2', '3', '…', '12', 'next'].map((p, i) => (
                <div key={i} className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: 32, height: 32, borderRadius: t.radius.badge, background: p === '2' ? t.primary : 'transparent', border: p === '2' ? 'none' : `1px solid ${t.border}`, color: p === '2' ? t.onPrimary : t.textSub }}>
                  {p === 'prev' ? <Icon name="arrowLeft" size={14} />
                    : p === 'next' ? <Icon name="chevronRight" size={14} />
                    : <Text role="caption" color={p === '2' ? t.onPrimary : t.textSub} weight={p === '2' ? t.weightBold : t.weightRegular}>{p}</Text>}
                </div>
              ))}
            </div>
          </Tile>

        </div>
        </section>
      )}

    </div>
  );
}

// local helper since contrastOn is not exported from resolveTheme v2
function contrastOnHex(hex: string): string {
  const h = hex.replace('#', '');
  if (h.length < 6) return '#ffffff';
  const linearize = (v: number) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
  const r = linearize(parseInt(h.slice(0, 2), 16));
  const g = linearize(parseInt(h.slice(2, 4), 16));
  const b = linearize(parseInt(h.slice(4, 6), 16));
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return ((1.05) / (L + 0.05)) > ((L + 0.05) / 0.05) ? '#ffffff' : '#111111';
}
