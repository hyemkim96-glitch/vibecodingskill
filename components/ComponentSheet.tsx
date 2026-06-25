'use client';

import React from 'react';
import { ResolvedTheme, ensureContrast } from '@/lib/tokens/resolveTheme';
import { createDS, motionVars, typeStyle } from '@/components/ds';
import { Icon as RawIcon } from '@/components/icons';
import { SignatureKind } from '@/lib/content/packs';

export type ComponentCategory = 'all' | 'buttons' | 'inputs' | 'cards' | 'feedback' | 'navigation' | 'messaging';

export const COMPONENT_CATEGORIES: { key: ComponentCategory; label: string }[] = [
  { key: 'all',        label: '전체' },
  { key: 'buttons',    label: '버튼 & 액션' },
  { key: 'inputs',     label: '입력 & 폼' },
  { key: 'cards',      label: '카드 & 리스트' },
  { key: 'feedback',   label: '피드백' },
  { key: 'navigation', label: '내비게이션' },
  { key: 'messaging',  label: '메시지' },
];

function SectionHeading({ t, show, children }: { t: ResolvedTheme; show: boolean; children: React.ReactNode }) {
  if (!show) return null;
  return (
    <div style={{ marginBottom: t.space.lg, marginTop: t.space.xl }}>
      <span style={{ ...typeStyle(t.type.bodySm), color: t.textMain, fontWeight: t.weightBold }}>{children}</span>
    </div>
  );
}

/** A single bento tile — fills its grid cell. Content is top-aligned; grows to fit (no height cap so nothing is clipped). */
function Tile({ t, ds, title, children, col = 1 }: {
  t: ResolvedTheme;
  ds: ReturnType<typeof createDS>;
  title: string;
  children: React.ReactNode;
  col?: 1 | 2 | 3 | 4;
}) {
  return (
    <div style={{
      background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius.card, padding: t.space.md,
      gridColumn: col > 1 ? `span ${col}` : undefined,
      display: 'flex', flexDirection: 'column',
      minHeight: 100, minWidth: 0,
    }}>
      <p style={{ ...typeStyle(t.type.bodySm), color: t.textMain, fontWeight: t.weightBold, marginBottom: t.space.sm, flexShrink: 0 }}>
        {title}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.sm }}>
        {children}
      </div>
    </div>
  );
}

/** One row of the bento grid — tiles inside are forced to the same height (CSS grid stretch).
 *  Columns keep a 150px floor so tiles never squish below a usable width; when the container
 *  is narrower than 4 floors, the sheet scrolls horizontally instead of crushing the cells. */
function RowGrid({ space, children }: { space: ResolvedTheme['space']; children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(150px, 1fr))', gap: space.sm }}>
      {children}
    </div>
  );
}

export default function ComponentSheet({ theme: t, category, signature }: { theme: ResolvedTheme; category: ComponentCategory; signature?: SignatureKind }) {
  const ds = createDS(t, true);
  const { Button, Input, Badge, Chip, Card, Text, Thumb, Avatar, ListRow, Stepper, Rating,
          Checkbox, Switch, Radio, Textarea, Select, Divider, Skeleton, Progress, TopBar, Table, Toast,
          StatusTracker, BalanceCard, GaugeMeter, RankingList, SaveCollect, EditorialCard, ChatList, ComingSoon,
          Carousel, ContextMenu, Dialogue } = ds;
  const { space } = t;
  const all = category === 'all';
  const showSig = (k: SignatureKind) => !signature || signature === k;
  // Inject the brand's icon library into every direct <Icon> below so icon
  // shapes change per brand (lucide line / phosphor rounded / tabler editorial),
  // matching the DS-internal icons. Per-call style still overrides if passed.
  const Icon = (props: React.ComponentProps<typeof RawIcon>) => (
    <RawIcon {...props} style={props.style ?? t.iconStyle} />
  );

  return (
    <div className="ds-root" style={{ ...motionVars(t), display: 'flex', flexDirection: 'column', background: t.surfaceAlt, padding: t.space.md, fontFamily: t.font, gap: all ? space.xl : space.sm, overflowX: 'auto' }}>

      {/* ── 버튼 & 액션 ── */}
      {(all || category === 'buttons') && (
        <section>
          <SectionHeading t={t} show={all}>버튼 & 액션</SectionHeading>
          <RowGrid space={space}>
            <Tile t={t} ds={ds} title="텍스트 버튼" col={1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
                <Button variant="primary" full>Primary</Button>
                <Button variant="secondary" full>Secondary</Button>
                <Button variant="outline" full>Outline</Button>
                <Button variant="ghost" full>Ghost</Button>
                <Button variant="primary" full disabled>Disabled</Button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: space.sm }}>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" size="md">Medium</Button>
                <Button variant="primary" size="sm">Small</Button>
              </div>
            </Tile>

            <Tile t={t} ds={ds} title="아이콘 버튼" col={2}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
                  {(['arrowLeft', 'close', 'more', 'settings'] as const).map((ic) => (
                    <div key={ic} className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: 40, height: 40, borderRadius: t.radius.button, background: t.surface, border: `1px solid ${t.border}`, color: t.textMain }}>
                      <Icon name={ic} size={18} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
                  {(['search', 'heart', 'filter', 'bell'] as const).map((ic) => (
                    <div key={ic} className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: 40, height: 40, borderRadius: t.radius.button, color: t.textSub }}>
                      <Icon name={ic} size={20} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
                  {(['plus', 'edit', 'send', 'checkCircle'] as const).map((ic) => (
                    <div key={ic} className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: 40, height: 40, borderRadius: t.radius.button, background: t.primary, color: t.onPrimary }}>
                      <Icon name={ic} size={18} />
                    </div>
                  ))}
                </div>
              </div>
            </Tile>

            <Tile t={t} ds={ds} title="플로팅 버튼 (FAB)" col={1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: space.md }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: space.md }}>
                  {[{ size: 56, ic: 'plus', label: 'Large' }, { size: 44, ic: 'edit', label: 'Medium' }, { size: 36, ic: 'plus', label: 'Small' }].map(({ size, ic, label }) => (
                    <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.xs }}>
                      <div className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: size, height: size, borderRadius: '9999px', background: t.primary, color: t.onPrimary }}>
                        <Icon name={ic as any} size={Math.round(size * 0.4)} />
                      </div>
                      <Text role="caption" color={t.textMuted}>{label}</Text>
                    </div>
                  ))}
                </div>
                <div className="ds-press" style={{ display: 'inline-flex', alignItems: 'center', gap: space.sm, cursor: 'pointer', padding: `${space.sm}px ${space.lg}px`, borderRadius: '9999px', background: t.primary, color: t.onPrimary, alignSelf: 'flex-start' }}>
                  <Icon name="plus" size={18} color={t.onPrimary} />
                  <span style={{ fontSize: t.type.bodySm.size, lineHeight: t.type.bodySm.lineHeight, color: t.onPrimary, fontWeight: t.weightBold }}>새 글 작성</span>
                </div>
              </div>
            </Tile>
          </RowGrid>
        </section>
      )}

      {/* ── 입력 & 폼 ── */}
      {(all || category === 'inputs') && (
        <section>
          <SectionHeading t={t} show={all}>입력 & 폼</SectionHeading>
          <RowGrid space={space}>
            <Tile t={t} ds={ds} title="텍스트 입력" col={2}>
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

            <Tile t={t} ds={ds} title="셀렉트 & 드롭다운" col={1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
                <Select label="카테고리" placeholder="옵션 선택" />
                <Select label="선택됨" placeholder="" value="옵션 1" />
                <Select label="비활성" placeholder="선택 불가" disabled />
              </div>
              <div style={{ border: `1px solid ${t.border}`, borderRadius: t.radius.card, background: t.surface, overflow: 'hidden' }}>
                {['옵션 1', '옵션 2', '옵션 3'].map((opt, i) => (
                  <div key={opt} className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: `${space.sm}px ${space.md}px`, borderBottom: i < 2 ? `1px solid ${t.border}` : 'none', background: i === 0 ? t.primaryTint : 'transparent' }}>
                    <Text role="bodySm" weight={i === 0 ? t.weightBold : t.weightRegular} color={i === 0 ? ensureContrast(t.primary, t.primaryTint) : t.textMain}>{opt}</Text>
                    {i === 0 && <span style={{ color: ensureContrast(t.primary, t.primaryTint), display: 'inline-flex' }}><Icon name="check" size={14} /></span>}
                  </div>
                ))}
              </div>
            </Tile>

            <Tile t={t} ds={ds} title="체크박스 · 라디오 · 스위치" col={1}>
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
          </RowGrid>
        </section>
      )}

      {/* ── 카드 & 리스트 ── */}
      {(all || category === 'cards') && (
        <section>
          <SectionHeading t={t} show={all}>카드 & 리스트</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>

            {/* Row 1: 카드 변형 + 리스트 로우 */}
            <RowGrid space={space}>
              <Tile t={t} ds={ds} title="카드 변형" col={2}>
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
                <Card pad={false}>
                  <Thumb h={80} />
                  <div style={{ padding: space.md }}>
                    <Text role="bodySm" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xxs }}>미디어 카드 제목</Text>
                    <Text role="caption" color={t.textSub}>서브 텍스트 · 날짜</Text>
                  </div>
                </Card>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: space.sm }}>
                  {[0, 1].map((i) => (
                    <Card key={i} pad={false}>
                      <Thumb h={56} />
                      <div style={{ padding: space.sm }}>
                        <Text role="caption" weight={t.weightBold} style={{ display: 'block', marginBottom: space.xxs }}>항목 {i + 1}</Text>
                        <Text role="caption" color={t.textMain} weight={t.weightBold}>9,900원</Text>
                      </div>
                    </Card>
                  ))}
                </div>
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

              <Tile t={t} ds={ds} title="리스트 로우" col={2}>
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
            </RowGrid>

            {/* Row 2: 아바타 + 스테퍼 + 구분선 */}
            <RowGrid space={space}>
              <Tile t={t} ds={ds} title="아바타" col={2}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: space.md }}>
                  {[56, 44, 36, 28, 20].map((sz) => (
                    <div key={sz} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.xs }}>
                      <Avatar size={sz} />
                      <Text role="caption" color={t.textMuted}>{sz}</Text>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
                  <div style={{ position: 'relative', display: 'inline-flex' }}>
                    <Avatar size={40} />
                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '9999px', background: t.success, border: `2px solid ${t.bg}` }} />
                  </div>
                  <div style={{ position: 'relative', display: 'inline-flex' }}>
                    <Avatar size={40} />
                    <span style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '9999px', background: t.textMuted, border: `2px solid ${t.bg}` }} />
                  </div>
                  <div style={{ display: 'flex' }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} style={{ marginLeft: i === 0 ? 0 : -10 }}>
                        <Avatar size={32} />
                      </div>
                    ))}
                    <div style={{ marginLeft: -10, width: 32, height: 32, borderRadius: '9999px', background: t.surfaceAlt, border: `2px solid ${t.bg}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Text role="caption" color={t.textSub} weight={t.weightBold}>+5</Text>
                    </div>
                  </div>
                </div>
              </Tile>

              <Tile t={t} ds={ds} title="스테퍼" col={1}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text role="caption" color={t.textSub}>기본</Text>
                    <Stepper value={1} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text role="caption" color={t.textSub}>최솟값</Text>
                    <Stepper value={0} min={0} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text role="caption" color={t.textSub}>최댓값</Text>
                    <Stepper value={99} max={99} />
                  </div>
                </div>
              </Tile>

              <Tile t={t} ds={ds} title="구분선" col={1}>
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
            </RowGrid>

            {/* Row 3: 테이블 + 캐러셀 */}
            <RowGrid space={space}>
              <Tile t={t} ds={ds} title="테이블 (키-값)" col={2}>
                <Divider label="테이블 셀" />
                <Table
                  rows={[
                    { label: '상품 금액', value: '229,000원' },
                    { label: '할인',     value: '-40,000원', tone: 'danger' },
                    { label: '배송비',   value: '무료',      tone: 'success' },
                  ]}
                  footer={{ label: '총 결제 금액', value: '189,000원' }}
                />
                <Divider label="헤더" />
                <Table
                  headers={['상품명', '가격']}
                  rows={[]}
                />
                <Divider label="합본" />
                <Table
                  headers={['상품명', '가격']}
                  rows={[
                    { label: '반팔 티셔츠', value: '29,000원' },
                    { label: '데님 팬츠',   value: '59,000원' },
                    { label: '운동화',      value: '89,000원' },
                  ]}
                  footer={{ label: '총 합계', value: '177,000원' }}
                />
              </Tile>

              <Tile t={t} ds={ds} title="캐러셀" col={2}>
                <Carousel items={[
                  { label: '슬라이드 1', sub: '첫 번째 항목' },
                  { label: '슬라이드 2', sub: '두 번째 항목' },
                  { label: '슬라이드 3', sub: '세 번째 항목' },
                ]} />
              </Tile>
            </RowGrid>

            {/* Row 3.5: 잔액 카드 (col=2 확보) */}
            {showSig('balance') && (
              <RowGrid space={space}>
                <Tile t={t} ds={ds} title="잔액 카드" col={2}>
                  <BalanceCard label="총 자산" value="12,480,200원" delta="+2.4%" actions={['보내기', '충전']} />
                </Tile>
              </RowGrid>
            )}

            {/* Row 4: sig tiles */}
            {(showSig('collect') || showSig('editorial') || showSig('ranking')) && (
              <RowGrid space={space}>
                {showSig('collect') && (
                  <Tile t={t} ds={ds} title="스크랩 카드" col={1}>
                    <SaveCollect count={1204} saved tag="상품 8개" h={140} />
                  </Tile>
                )}
                {showSig('editorial') && (
                  <Tile t={t} ds={ds} title="에디토리얼 카드" col={1}>
                    <EditorialCard tag="EDITOR'S PICK" title="이번 주 신상 룩" sub="에디터가 고른 코디 제안" h={160} />
                  </Tile>
                )}
                {showSig('ranking') && (
                  <Tile t={t} ds={ds} title="실시간 랭킹" col={1}>
                    <RankingList items={[
                      { title: '금리 동결 결정', sub: '실시간 1위', delta: 'up' },
                      { title: 'AI 반도체 수출', sub: '실시간 2위', delta: 'up' },
                      { title: '주말 날씨',     sub: '실시간 3위', delta: 'same' },
                      { title: '프로야구 개막',  sub: '실시간 4위', delta: 'down' },
                    ]} />
                  </Tile>
                )}
              </RowGrid>
            )}
          </div>
        </section>
      )}

      {/* ── 피드백 ── */}
      {(all || category === 'feedback') && (
        <section>
          <SectionHeading t={t} show={all}>피드백</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>

            {/* Row 1: 배지&칩 + 레이팅 + 상태 인디케이터 */}
            <RowGrid space={space}>
              <Tile t={t} ds={ds} title="배지 & 칩" col={2}>
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

              <Tile t={t} ds={ds} title="레이팅" col={1}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
                  {([5, 4.3, 3.5, 1] as const).map((v) => (
                    <div key={v} style={{ display: 'flex', alignItems: 'center', gap: space.sm }}>
                      <Rating value={v} size={16} />
                      <Text role="caption" color={t.textSub} weight={t.weightMedium}>{v}</Text>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: space.sm }}>
                  <Rating value={4} size={20} />
                  <Text role="bodySm" weight={t.weightBold}>4.0</Text>
                  <Text role="caption" color={t.textMuted}>(1,284)</Text>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: space.md }}>
                  {([12, 16, 20, 24] as const).map((sz) => (
                    <div key={sz} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.xs, minWidth: 0 }}>
                      <Rating value={4} max={5} size={sz} />
                      <Text role="caption" color={t.textMuted}>{sz}px</Text>
                    </div>
                  ))}
                </div>
              </Tile>

              <Tile t={t} ds={ds} title="상태 인디케이터" col={1}>
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
            </RowGrid>

            {/* Row 2: 토스트 + 프로그레스 + 스켈레톤 */}
            <RowGrid space={space}>
              <Tile t={t} ds={ds} title="토스트 & 알림" col={2}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>
                  <Toast message="저장되었습니다" />
                  <Toast message="결제가 완료되었습니다" tone="success" />
                  <Toast message="오류가 발생했습니다" tone="danger" action="다시 시도" />
                  <Toast message="재고가 부족합니다" tone="warning" />
                  <Toast message="새로운 업데이트가 있어요" tone="info" action="확인" />
                </div>
              </Tile>

              <Tile t={t} ds={ds} title="프로그레스" col={1}>
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

              <Tile t={t} ds={ds} title="스켈레톤" col={1}>
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
                <div style={{ display: 'flex', gap: space.sm }}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: space.xs }}>
                      <Skeleton h={80} radius={t.radius.card} />
                      <Skeleton h={12} />
                      <Skeleton w="60%" h={12} />
                    </div>
                  ))}
                </div>
              </Tile>
            </RowGrid>

            {/* Row 3: 시그니처 + 다이얼로그 + 오픈예정 */}
            <RowGrid space={space}>
              {showSig('status') && (
                <Tile t={t} ds={ds} title="단계 인디케이터" col={1}>
                  <StatusTracker steps={['주문접수', '조리중', '배달중', '완료']} current={2} />
                </Tile>
              )}
              {showSig('gauge') && (
                <Tile t={t} ds={ds} title="게이지" col={1}>
                  <GaugeMeter label="매너온도" value="36.5°C" ratio={0.66} caption="따뜻한 이웃이에요" />
                </Tile>
              )}
              <Tile t={t} ds={ds} title="다이얼로그" col={(4 - (showSig('status') ? 1 : 0) - (showSig('gauge') ? 1 : 0) - 1) as 1 | 2 | 3}>
                <Dialogue
                  title="결제를 진행할까요?"
                  body="선택한 상품 189,000원이 결제됩니다. 취소하면 장바구니로 돌아갑니다."
                  actions={['취소', '결제하기']}
                />
              </Tile>
              <Tile t={t} ds={ds} title="오픈 예정 말풍선" col={1}>
                <ComingSoon sub="준비 중인 기능이에요" />
              </Tile>
            </RowGrid>
          </div>
        </section>
      )}

      {/* ── 내비게이션 ── */}
      {(all || category === 'navigation') && (
        <section>
          <SectionHeading t={t} show={all}>내비게이션</SectionHeading>
          <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm }}>

            {/* Row 1: 탑바 + 탭 내비 */}
            <RowGrid space={space}>
              <Tile t={t} ds={ds} title="탑 내비게이션 바" col={2}>
                <TopBar title="상품 상세" actions={[{ icon: 'send' }, { icon: 'more' }]} />
                <TopBar title="배송지 입력" actions={[{ icon: 'close', label: '완료' }]} />
                <TopBar title="홈" back={false} actions={[{ icon: 'search' }, { icon: 'bell' }]} />
                <TopBar back />
              </Tile>

              <Tile t={t} ds={ds} title="탭 내비게이션" col={2}>
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
                        <Icon name={icon} size={18} color={active ? ensureContrast(t.primary, t.bg) : t.textMuted} />
                        <Text role="caption" weight={active ? t.weightBold : t.weightRegular} color={active ? ensureContrast(t.primary, t.bg) : t.textMuted}>{label}</Text>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ background: t.surface, borderRadius: t.radius.button, padding: space.xxs, display: 'flex' }}>
                  {['전체', '판매중', '거래완료'].map((label, i) => (
                    <div key={label} className="ds-press" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: `${space.xs + 2}px ${space.sm}px`, borderRadius: t.radius.button, background: i === 0 ? t.bg : 'transparent', boxShadow: i === 0 ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>
                      <Text role="caption" weight={i === 0 ? t.weightBold : t.weightRegular} color={i === 0 ? t.textMain : t.textSub}>{label}</Text>
                    </div>
                  ))}
                </div>
                <div style={{ borderBottom: `1px solid ${t.border}`, display: 'flex' }}>
                  {['홈', '카테고리', '라이브', '마이'].map((label, i) => (
                    <div key={label} className="ds-press" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', paddingBottom: space.sm, paddingTop: space.sm, borderBottom: i === 0 ? `2px solid ${t.primary}` : '2px solid transparent', marginBottom: -1 }}>
                      <Text role="caption" weight={i === 0 ? t.weightBold : t.weightRegular} color={i === 0 ? ensureContrast(t.primary, t.bg) : t.textSub}>{label}</Text>
                    </div>
                  ))}
                </div>
              </Tile>
            </RowGrid>

            {/* Row 2: 사이드메뉴 + 컨텍스트메뉴 + 브레드크럼 */}
            <RowGrid space={space}>
              <Tile t={t} ds={ds} title="사이드 메뉴 항목" col={1}>
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

              <Tile t={t} ds={ds} title="컨텍스트 메뉴" col={1}>
                <ContextMenu items={[
                  { icon: 'edit',     label: '수정하기' },
                  { icon: 'send',     label: '공유하기' },
                  { icon: 'bookmark', label: '저장하기', divider: true },
                  { icon: 'close',    label: '삭제하기', danger: true },
                ]} />
              </Tile>

              <Tile t={t} ds={ds} title="브레드크럼 & 페이지네이션" col={2}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: space.xs }}>
                  {['홈', '카테고리', '상의', '티셔츠'].map((crumb, i, arr) => (
                    <React.Fragment key={crumb}>
                      <Text role="caption" color={i === arr.length - 1 ? t.textMain : ensureContrast(t.primary, t.bg)} weight={i === arr.length - 1 ? t.weightBold : t.weightRegular}>{crumb}</Text>
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
            </RowGrid>
          </div>
        </section>
      )}

      {/* ── 메시지 ── */}
      {(all || category === 'messaging') && (
        <section>
          <SectionHeading t={t} show={all}>메시지</SectionHeading>
          <RowGrid space={space}>
            <Tile t={t} ds={ds} title="수신 버블" col={2}>
              <ChatList messages={[{ text: '주문하신 상품이 배송 출발했어요 📦', time: '오전 10:24' }]} />
              <ChatList messages={[{ text: '긴 수신 메시지는 말풍선 안에서 자동으로 줄 바꿈 처리됩니다. 여러 줄이 될 수 있어요.' }]} />
              <ChatList messages={[{ text: '타임스탬프 없는 메시지' }]} />
            </Tile>

            <Tile t={t} ds={ds} title="발신 버블" col={2}>
              <ChatList messages={[{ text: '감사합니다! 잘 받겠습니다 😊', me: true, time: '오전 10:25' }]} />
              <ChatList messages={[{ text: '긴 발신 메시지도 동일하게 줄 바꿈이 적용되어 말풍선 너비 안에서 자연스럽게 표시됩니다.', me: true }]} />
              <ChatList messages={[{ text: '짧은 발신', me: true }]} />
            </Tile>
          </RowGrid>
        </section>
      )}

    </div>
  );
}

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
