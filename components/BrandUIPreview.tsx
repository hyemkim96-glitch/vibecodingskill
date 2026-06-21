'use client';

import { BrandToken } from '@/types/token';
import { cn } from '@/lib/utils';

function getContrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62 ? '#111111' : '#ffffff';
}

function getPrimaryColor(colors: BrandToken['colors']) {
  return colors.find(c => /primary/i.test(c.role))?.value
    ?? colors.find(c => !/gray|white|black|grey/i.test(c.name))?.value
    ?? '#888';
}

function getColor(colors: BrandToken['colors'], role: RegExp, fallback: string) {
  return colors.find(c => role.test(c.role))?.value ?? fallback;
}

export default function BrandUIPreview({
  token,
  platform,
}: {
  token: BrandToken;
  platform: 'mobile' | 'web';
}) {
  const c = token.colors;
  const primary = getPrimaryColor(c);
  const onPrimary = getContrastColor(primary);
  const bg = getColor(c, /기본 배경/, '#ffffff');
  const cardBg = getColor(c, /카드 배경|보조 배경/, '#f5f5f5');
  const textMain = getColor(c, /본문 텍스트|주요 컨텐츠/, '#111111');
  const textSub = getColor(c, /보조 텍스트/, '#666666');
  const textMuted = getColor(c, /비활성|힌트|플레이스홀더/, '#aaaaaa');
  const borderColor = getColor(c, /구분선|보더/, '#e5e7eb');
  const accent = c.find(col => !/gray|white|black|grey/i.test(col.name) && col.value !== primary)?.value ?? primary;

  const p = token.platforms[platform];
  const btnRadius = p.shapes.find(s => s.element === 'button')?.value ?? '8px';
  const cardRadius = p.shapes.find(s => s.element === 'card')?.value ?? '12px';
  const inputRadius = p.shapes.find(s => s.element === 'input')?.value ?? '6px';
  const chipRadius = p.shapes.find(s => s.element === 'chip')?.value ?? '9999px';
  const badgeRadius = p.shapes.find(s => s.element === 'badge')?.value ?? '4px';
  const spacing = p.spacing.scale;
  const pad = parseInt(spacing[3]?.value ?? '16px');
  const gap = parseInt(spacing[1]?.value ?? '8px');
  const isMobile = platform === 'mobile';
  const category = token.category;
  const isLocal = token.serviceTypes?.some(s => /지역|커뮤니티|중고/.test(s));

  // primitive style tokens as inline vars — keeps Tailwind for layout/interaction
  const t = {
    primary,
    onPrimary,
    bg,
    cardBg,
    textMain,
    textSub,
    textMuted,
    border: borderColor,
    accent,
    btnRadius,
    cardRadius,
    inputRadius,
    chipRadius,
    badgeRadius,
    pad: `${pad}px`,
    gap: `${gap}px`,
  };

  /* ── shared micro-components ── */
  const Btn = ({
    children, variant = 'primary', disabled = false, className = '', style = {},
  }: {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <button
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center font-semibold text-xs transition-all duration-150 select-none cursor-pointer',
        'hover:brightness-105 active:scale-95',
        disabled && 'opacity-35 pointer-events-none',
        className,
      )}
      style={{
        borderRadius: t.btnRadius,
        background: variant === 'primary' ? t.primary : variant === 'secondary' ? t.cardBg : 'transparent',
        color: variant === 'primary' ? t.onPrimary : t.textMain,
        border: variant === 'secondary' ? `1px solid ${t.border}` : 'none',
        padding: '8px 16px',
        ...style,
      }}
    >
      {children}
    </button>
  );

  const UiCard = ({ children, className = '', style = {}, onClick }: {
    children: React.ReactNode; className?: string; style?: React.CSSProperties; onClick?: () => void;
  }) => (
    <div
      onClick={onClick}
      className={cn(
        'overflow-hidden transition-all duration-200',
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99]',
        className,
      )}
      style={{ background: t.cardBg, borderRadius: t.cardRadius, ...style }}
    >
      {children}
    </div>
  );

  const Chip = ({ children, active = false }: { children: React.ReactNode; active?: boolean }) => (
    <span
      className="inline-flex items-center cursor-pointer whitespace-nowrap text-xs font-medium transition-all duration-150 hover:opacity-80 active:scale-95"
      style={{
        padding: '5px 12px',
        borderRadius: t.chipRadius,
        background: active ? t.primary : t.cardBg,
        color: active ? t.onPrimary : t.textSub,
        border: !active ? `1px solid ${t.border}` : 'none',
      }}
    >
      {children}
    </span>
  );

  const Row = ({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
    <div className={cn('flex items-center transition-colors duration-100 rounded-md cursor-pointer hover:bg-black/[0.03]', className)} style={style}>
      {children}
    </div>
  );

  /* ── 핀테크/금융 ── */
  if (category === '핀테크/금융') {
    if (isMobile) {
      return (
        <div className="flex flex-col p-4 gap-3" style={{ background: t.bg, minHeight: 280 }}>
          {/* 잔액 카드 */}
          <UiCard className="p-4 flex flex-col gap-1.5 shadow-sm" onClick={() => {}}>
            <span className="text-[11px] font-medium" style={{ color: t.textSub }}>현재 잔액</span>
            <span className="text-[26px] font-bold tracking-tight leading-none" style={{ color: t.textMain }}>
              1,234,567<span className="text-[13px] font-normal ml-1">원</span>
            </span>
            <span className="text-[11px]" style={{ color: t.textMuted }}>전월 대비 ▲ 12% 증가</span>
          </UiCard>

          {/* 빠른 액션 */}
          <div className="flex gap-2">
            {[
              { label: '이체', v: 'primary' },
              { label: '충전', v: 'secondary' },
              { label: '조회', v: 'secondary' },
            ].map(({ label, v }) => (
              <Btn key={label} variant={v as 'primary' | 'secondary'} className="flex-1" style={{ padding: '10px 0' }}>
                {label}
              </Btn>
            ))}
          </div>

          {/* 거래 내역 */}
          {[
            { name: '스타벅스', sub: '카드결제', amount: '-6,500원', color: t.textMain },
            { name: '급여', sub: '입금', amount: '+3,200,000원', color: accent },
          ].map((item, i) => (
            <Row
              key={item.name}
              className="justify-between px-2 py-2.5"
              style={{ borderBottom: i === 0 ? `1px solid ${t.border}` : 'none' }}
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-medium" style={{ color: t.textMain }}>{item.name}</span>
                <span className="text-[11px]" style={{ color: t.textSub }}>{item.sub}</span>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: item.color }}>{item.amount}</span>
            </Row>
          ))}

          <Btn variant="primary" disabled className="w-full" style={{ padding: '11px' }}>
            이체 불가 (잔액 부족)
          </Btn>
        </div>
      );
    }

    /* web 대시보드 */
    return (
      <div className="flex flex-row items-stretch gap-4 p-5" style={{ background: t.bg, minHeight: 260 }}>
        <div className="flex flex-col gap-3 w-48 shrink-0">
          <UiCard className="p-4 shadow-sm" onClick={() => {}}>
            <p className="text-[11px] mb-1.5" style={{ color: t.textSub }}>총 자산</p>
            <p className="text-xl font-bold tracking-tight" style={{ color: t.textMain }}>₩ 12,345,678</p>
          </UiCard>
          <div
            className="rounded-xl p-4 cursor-pointer hover:opacity-90 transition-opacity"
            style={{ background: t.primary, borderRadius: t.cardRadius }}
          >
            <p className="text-[11px] mb-1.5 opacity-75" style={{ color: t.onPrimary }}>이번 달 지출</p>
            <p className="text-lg font-bold" style={{ color: t.onPrimary }}>₩ 456,789</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          {[
            { name: '스타벅스', cat: '카페', amount: '-6,500', color: t.textMain },
            { name: '급여', cat: '입금', amount: '+3,200,000', color: accent },
            { name: '넷플릭스', cat: '구독', amount: '-17,000', color: t.textMain },
          ].map((item) => (
            <Row
              key={item.name}
              className="justify-between px-3 py-2.5 rounded-lg"
              style={{ background: t.cardBg }}
            >
              <div>
                <span className="text-[13px] font-medium mr-2" style={{ color: t.textMain }}>{item.name}</span>
                <span className="text-[11px]" style={{ color: t.textSub }}>{item.cat}</span>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: item.color }}>{item.amount}원</span>
            </Row>
          ))}
          <Btn variant="primary" className="w-full mt-1" style={{ padding: '10px' }}>이체하기</Btn>
        </div>
      </div>
    );
  }

  /* ── 플랫폼/배달 ── */
  if (category === '플랫폼') {
    if (isMobile) {
      return (
        <div className="flex flex-col p-4 gap-3" style={{ background: t.bg, minHeight: 280 }}>
          <div
            className="flex items-center gap-2 px-3 py-2 text-[12px] transition-colors hover:border-gray-400 cursor-text"
            style={{ background: t.cardBg, borderRadius: t.inputRadius, border: `1px solid ${t.border}`, color: t.textMuted }}
          >
            🔍 음식, 가게 검색
          </div>
          <div className="flex gap-2 overflow-hidden">
            {['치킨', '피자', '한식', '중식'].map((cat, i) => (
              <Chip key={cat} active={i === 0}>{cat}</Chip>
            ))}
          </div>
          <UiCard onClick={() => {}}>
            <div className="h-20" style={{ background: `linear-gradient(135deg, ${t.primary}44, ${t.accent}33)` }} />
            <div className="p-3 flex flex-col gap-1.5">
              <div className="flex justify-between items-start">
                <span className="text-[14px] font-bold" style={{ color: t.textMain }}>맛있는 치킨집</span>
                <span className="text-[11px]" style={{ color: t.textSub }}>★ 4.8 (1.2k)</span>
              </div>
              <span className="text-[11px]" style={{ color: t.textSub }}>배달비 2,000원 · 최소 15,000원</span>
              <div className="flex items-center gap-2 mt-1">
                <Btn variant="primary" style={{ padding: '6px 14px', fontSize: '11px' }}>주문하기</Btn>
                <span
                  className="text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{ background: t.accent, color: getContrastColor(t.accent) }}
                >
                  🚀 빠른배달
                </span>
              </div>
            </div>
          </UiCard>
        </div>
      );
    }

    return (
      <div className="flex flex-col p-5 gap-4" style={{ background: t.bg, minHeight: 260 }}>
        <div className="flex gap-2 flex-wrap">
          {['전체', '치킨', '피자', '한식', '중식', '분식'].map((cat, i) => (
            <Chip key={cat} active={i === 0}>{cat}</Chip>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {['맛있는 치킨집', '행복한 피자', '우리동네 한식'].map((name, i) => (
            <UiCard key={name} className="shadow-sm" style={{ border: `1px solid ${t.border}` }} onClick={() => {}}>
              <div className="h-[70px]" style={{ background: `linear-gradient(135deg, ${t.primary}33, ${t.accent}22)` }} />
              <div className="p-2.5">
                <p className="text-[12px] font-semibold mb-1" style={{ color: t.textMain }}>{name}</p>
                <div className="flex justify-between items-center">
                  <span className="text-[11px]" style={{ color: t.textSub }}>★ {(4.5 + i * 0.1).toFixed(1)}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: t.primary + '22', color: t.primary }}>주문</span>
                </div>
              </div>
            </UiCard>
          ))}
        </div>
      </div>
    );
  }

  /* ── 커머스 ── */
  if (category === '커머스') {
    if (isMobile) {
      return (
        <div className="flex flex-col p-4 gap-3" style={{ background: t.bg, minHeight: 280 }}>
          {/* 배너 */}
          <div
            className="flex justify-between items-center p-4 cursor-pointer hover:opacity-95 transition-opacity"
            style={{ background: t.primary, borderRadius: t.cardRadius }}
          >
            <div>
              <p className="text-[10px] font-medium opacity-80" style={{ color: t.onPrimary }}>오늘만 이 가격</p>
              <p className="text-[16px] font-black" style={{ color: t.onPrimary }}>최대 70% OFF</p>
            </div>
            <Btn variant="ghost" style={{ background: 'rgba(255,255,255,0.2)', color: t.onPrimary, padding: '6px 12px', fontSize: '11px' }}>
              보러가기 →
            </Btn>
          </div>

          {/* 상품 그리드 */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: '무선 이어폰', price: '89,000', discount: '35%', sold: false },
              { name: '스마트워치', price: '249,000', discount: '22%', sold: true },
            ].map((item) => (
              <UiCard key={item.name} className="shadow-sm" onClick={() => {}}>
                <div
                  className="h-20 flex items-start justify-end p-2"
                  style={{ background: `${t.border}` }}
                >
                  <span
                    className="text-[10px] font-black px-1.5 py-0.5"
                    style={{ background: t.primary, color: t.onPrimary, borderRadius: t.badgeRadius }}
                  >
                    {item.discount}
                  </span>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] font-medium mb-1" style={{ color: t.textMain }}>{item.name}</p>
                  <p className="text-[13px] font-bold" style={{ color: t.primary }}>{item.price}원</p>
                  {item.sold && (
                    <span className="text-[10px] text-white px-2 py-0.5 rounded-full mt-1 inline-block" style={{ background: t.textMuted }}>품절</span>
                  )}
                </div>
              </UiCard>
            ))}
          </div>

          <Btn variant="primary" className="w-full" style={{ padding: '12px' }}>
            장바구니 담기
          </Btn>
          <Btn variant="secondary" disabled className="w-full" style={{ padding: '12px' }}>
            품절된 상품이 있어요
          </Btn>
        </div>
      );
    }

    return (
      <div className="p-5 flex flex-col gap-4" style={{ background: t.bg, minHeight: 260 }}>
        <div className="flex justify-between items-center">
          <span className="text-[13px] font-bold" style={{ color: t.textMain }}>인기 상품</span>
          <span className="text-[11px] font-semibold cursor-pointer hover:opacity-70 transition-opacity" style={{ color: t.primary }}>전체보기 →</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {['무선이어폰', '스마트워치', '노트북', '태블릿'].map((name, i) => (
            <UiCard key={name} className="shadow-sm" style={{ border: `1px solid ${t.border}` }} onClick={() => {}}>
              <div className="h-[60px] relative" style={{ background: t.border }}>
                <span
                  className="absolute top-1.5 left-1.5 text-[9px] font-black px-1.5 py-0.5"
                  style={{ background: t.primary, color: t.onPrimary, borderRadius: t.badgeRadius }}
                >
                  {[35, 22, 18, 40][i]}%
                </span>
              </div>
              <div className="p-2">
                <p className="text-[10px] font-medium mb-0.5 truncate" style={{ color: t.textMain }}>{name}</p>
                <p className="text-[11px] font-bold" style={{ color: t.primary }}>{['89,000', '249,000', '1,190,000', '489,000'][i]}원</p>
              </div>
            </UiCard>
          ))}
        </div>
      </div>
    );
  }

  /* ── 지역/커뮤니티 ── */
  if (isLocal) {
    if (isMobile) {
      return (
        <div className="flex flex-col p-4 gap-3" style={{ background: t.bg, minHeight: 280 }}>
          <div className="flex gap-2">
            <div
              className="flex-1 text-[12px] px-3 py-2 cursor-text transition-colors hover:border-gray-400"
              style={{ background: t.cardBg, borderRadius: t.inputRadius, border: `1px solid ${t.border}`, color: t.textMuted }}
            >
              📍 우리 동네 검색
            </div>
            <Btn variant="primary" style={{ padding: '8px 14px' }}>글쓰기</Btn>
          </div>

          {[
            { title: '아이폰 15 팔아요', loc: '서초구 · 10분 전', price: '900,000원', badge: '판매중' },
            { title: '자전거 삽니다', loc: '강남구 · 1시간 전', price: '50,000원', badge: '구매중' },
          ].map((item, i) => (
            <Row
              key={item.title}
              className="gap-3 py-2.5 px-1"
              style={{ borderBottom: i === 0 ? `1px solid ${t.border}` : 'none', alignItems: 'flex-start' }}
            >
              <div
                className="w-[60px] h-[60px] shrink-0 shadow-sm"
                style={{ background: t.cardBg, borderRadius: t.cardRadius }}
              />
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold" style={{ color: t.textMain }}>{item.title}</span>
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: t.primary + '22', color: t.primary }}
                  >
                    {item.badge}
                  </span>
                </div>
                <span className="text-[11px]" style={{ color: t.textSub }}>{item.loc}</span>
                <span className="text-[13px] font-bold" style={{ color: t.textMain }}>{item.price}</span>
              </div>
            </Row>
          ))}
        </div>
      );
    }

    return (
      <div className="p-5 flex flex-col gap-3" style={{ background: t.bg, minHeight: 260 }}>
        <div className="grid grid-cols-3 gap-3">
          {['아이폰 15', '자전거', '소파'].map((name, i) => (
            <UiCard key={name} className="shadow-sm" style={{ border: `1px solid ${t.border}` }} onClick={() => {}}>
              <div className="h-20" style={{ background: t.border }} />
              <div className="p-3">
                <p className="text-[12px] font-semibold mb-1" style={{ color: t.textMain }}>{name}</p>
                <p className="text-[11px] mb-1.5" style={{ color: t.textSub }}>서초구 · {['10분', '1시간', '3시간'][i]} 전</p>
                <p className="text-[13px] font-bold" style={{ color: t.textMain }}>{['900,000', '80,000', '120,000'][i]}원</p>
              </div>
            </UiCard>
          ))}
        </div>
      </div>
    );
  }

  /* ── 패션/라이프스타일 ── */
  if (isMobile) {
    return (
      <div className="flex flex-col p-4 gap-3" style={{ background: t.bg, minHeight: 280 }}>
        <UiCard
          className="shadow-sm p-4 flex flex-col gap-2"
          style={{ background: `linear-gradient(145deg, ${t.cardBg}, ${t.bg})`, border: `1px solid ${t.border}` }}
          onClick={() => {}}
        >
          <span className="text-[10px] font-semibold tracking-[0.1em] uppercase" style={{ color: t.textSub }}>New Arrivals</span>
          <span className="text-[18px] font-bold tracking-tight leading-snug" style={{ color: t.textMain }}>{token.tagline}</span>
          <Btn variant="primary" className="self-start mt-1" style={{ padding: '7px 16px' }}>지금 보기</Btn>
        </UiCard>

        <div className="grid grid-cols-2 gap-2">
          {['오버핏 셔츠', '와이드 팬츠'].map((name, i) => (
            <UiCard key={name} className="shadow-sm" onClick={() => {}}>
              <div className="h-[80px]" style={{ background: t.border }} />
              <div className="p-2.5">
                <p className="text-[10px] uppercase tracking-widest mb-0.5 font-medium" style={{ color: t.textSub }}>
                  {['BRAND A', 'BRAND B'][i]}
                </p>
                <p className="text-[12px] font-semibold" style={{ color: t.textMain }}>{name}</p>
                <p className="text-[12px] font-bold mt-0.5" style={{ color: t.primary }}>{['89,000', '129,000'][i]}원</p>
              </div>
            </UiCard>
          ))}
        </div>

        <Btn variant="secondary" disabled className="w-full" style={{ padding: '10px' }}>
          사이즈를 선택해주세요
        </Btn>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-4" style={{ background: t.bg, minHeight: 260 }}>
      <div className="flex gap-4">
        <UiCard
          className="w-52 p-5 flex flex-col gap-3 shadow-sm"
          style={{ border: `1px solid ${t.border}` }}
          onClick={() => {}}
        >
          <span className="text-[10px] uppercase tracking-[0.1em] font-semibold" style={{ color: t.textSub }}>Featured</span>
          <span className="text-xl font-bold tracking-tight leading-snug" style={{ color: t.textMain }}>{token.tagline}</span>
          <Btn variant="primary" className="self-start" style={{ padding: '8px 20px' }}>쇼핑하기</Btn>
        </UiCard>
        <div className="flex-1 grid grid-cols-3 gap-2">
          {['셔츠', '팬츠', '자켓'].map((name, i) => (
            <UiCard key={name} className="shadow-sm" style={{ border: `1px solid ${t.border}` }} onClick={() => {}}>
              <div className="h-[70px]" style={{ background: t.border }} />
              <div className="p-2">
                <p className="text-[11px] font-semibold" style={{ color: t.textMain }}>{name}</p>
                <p className="text-[11px] font-bold mt-0.5" style={{ color: t.primary }}>{['89,000', '149,000', '219,000'][i]}원</p>
              </div>
            </UiCard>
          ))}
        </div>
      </div>
    </div>
  );
}
