import { BrandToken } from '@/types/token';

const colors = [
  { name: '시그니처 레드', value: '#E40C2B', variable: '--color-brand-red', role: '브랜드 Primary, CTA 버튼, 긴급 세일' },
  { name: '배송 오렌지', value: '#FF6700', variable: '--color-delivery-orange', role: '빠른 배송 뱃지, 배송 강조' },
  { name: 'Yellow', value: '#FFD700', variable: '--color-yellow', role: '베스트, 추천, 평점 별' },
  { name: 'Green', value: '#00A854', variable: '--color-success-green', role: '성공, 완료, 정상 배송 확인' },
  { name: 'Gray 900', value: '#111111', variable: '--color-gray-900', role: '본문 텍스트, 상품명' },
  { name: 'Gray 700', value: '#444444', variable: '--color-gray-700', role: '보조 텍스트, 스펙' },
  { name: 'Gray 500', value: '#888888', variable: '--color-gray-500', role: '메타 정보, 날짜' },
  { name: 'Gray 200', value: '#E4E4E4', variable: '--color-gray-200', role: '구분선, 보더' },
  { name: 'Gray 100', value: '#F6F6F6', variable: '--color-gray-100', role: '배경, 카드 배경' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '기본 배경' },
  { name: 'Danger Red', value: '#E40C2B', variable: '--color-danger-red', role: '에러, 위험, 취소 상태' },
];

const typography = {
  family: "'Noto Sans KR', sans-serif",
  substitute: 'Apple SD Gothic Neo, Noto Sans KR, system-ui',
  weights: [400, 500, 700, 900],
  sizes: [
    { role: 'Display', size: '30px', lineHeight: '1.2', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '22px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '18px', lineHeight: '1.4', letterSpacing: '0' },
    { role: 'Body 1', size: '15px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '13px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '11px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

const mobileTypography = {
  ...typography,
  sizes: [
    { role: 'Display', size: '24px', lineHeight: '1.2', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '18px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '15px', lineHeight: '1.4', letterSpacing: '0' },
    { role: 'Body 1', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '12px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '11px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

export const coupangToken: BrandToken = {
  slug: 'coupang',
  name: 'Coupang',
  nameKo: '쿠팡',
  tagline: '로켓 쇼핑',
  category: '커머스',
  country: 'KR',
  serviceTypes: ['이커머스', '로켓배송', '쿠팡이츠'],
  theme: 'light',
  description: '구매 전환에 최적화된 고밀도 커머스 UI. 빨간 CTA와 할인율 강조로 즉각적인 구매 욕구 자극. 로켓배송 오렌지 뱃지는 배송 신뢰의 상징. 정보 밀도가 높고 가격/리뷰 중심 레이아웃.',
  colors,
  platforms: {
    mobile: {
      typography: mobileTypography,
      spacing: {
        baseUnit: '4px',
        density: 'compact',
        scale: [
          { name: '4', value: '4px', token: '--spacing-4' },
          { name: '8', value: '8px', token: '--spacing-8' },
          { name: '12', value: '12px', token: '--spacing-12' },
          { name: '16', value: '16px', token: '--spacing-16' },
          { name: '20', value: '20px', token: '--spacing-20' },
          { name: '24', value: '24px', token: '--spacing-24' },
        ],
      },
      shapes: [
        { element: 'button', value: '4px' },
        { element: 'card', value: '4px' },
        { element: 'input', value: '4px' },
        { element: 'badge', value: '2px' },
        { element: 'rocket-badge', value: '4px' },
      ],
      layout: {
        maxWidth: '390px',
        sectionGap: '8px',
        touchTarget: '44px',
      },
    },
    web: {
      typography,
      spacing: {
        baseUnit: '8px',
        density: 'compact',
        scale: [
          { name: '8', value: '8px', token: '--spacing-8' },
          { name: '16', value: '16px', token: '--spacing-16' },
          { name: '24', value: '24px', token: '--spacing-24' },
          { name: '32', value: '32px', token: '--spacing-32' },
          { name: '48', value: '48px', token: '--spacing-48' },
        ],
      },
      shapes: [
        { element: 'button', value: '4px' },
        { element: 'card', value: '4px' },
        { element: 'input', value: '4px' },
        { element: 'modal', value: '8px' },
        { element: 'badge', value: '2px' },
      ],
      layout: {
        maxWidth: '1280px',
        sectionGap: '32px',
        columns: '상품 5열 그리드, 12px gutter',
      },
    },
  },
  guidelines: {
    dos: [
      '할인율 최대 강조 — 빨간색 대형 퍼센트 표시, 정가 취소선 병행',
      '로켓배송 뱃지 최우선 — 오렌지 로켓 뱃지를 카드 상단에 항상 표시',
      '리뷰 수 + 평점 병행 — "★4.8 (12,543)" 형태, 신뢰 지표 명시',
      '장바구니 즉시 담기 — 상품 카드에서 원클릭 장바구니 버튼',
      '재고 긴박감 — "오늘만 이 가격", "남은 수량 3개" 등 FOMO 유도',
    ],
    donts: [
      '빨간색 남용 금지 — 할인/CTA 외 정보성 텍스트에 빨간색 사용 지양',
      '느린 이미지 로딩 금지 — WebP + CDN, 상품 이미지 1초 내 로딩',
      '숨겨진 추가 비용 금지 — 배송비는 상품 카드에서 명시',
      '복잡한 쿠폰 구조 금지 — "최대 N% 할인" 단일 문구로 단순화',
      '결제 방해 요소 금지 — 결제 페이지에서 팝업/배너 최소화',
    ],
  },
  updatedAt: '2026.06',
  deep: {
    interaction: {
      duration: '100ms (탭/CTA 즉각 반응), 150ms (카드 hover), 200ms (모달/바텀시트)',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      pressScale: 'scale(0.96)',
      hoverScale: '1.01',
      notes: '구매 전환 최적화. 버튼 즉각 반응으로 클릭 불안 제거. 로켓 아이콘은 로딩 중 회전 애니메이션. 가격 변경 시 cross-fade(숫자 교체) 없이 즉시 전환.',
    },
    voice: {
      tone: '직접적이고 자신감 있게 — 할인·배송 이점을 직관적으로. 긴장감과 기회를 함께 전달.',
      examples: [
        '"오늘 주문하면 내일 도착! 🚀" (로켓배송 강조)',
        '"3명이 보고 있어요" (FOMO 유도)',
        '"한정 수량 3개 남음" (재고 긴박감)',
        '"쿠폰 적용 완료! -12,000원" (혜택 확인)',
      ],
      avoid: ['느긋한 표현 — "천천히 둘러보세요" 같은 여유 언어는 쿠팡 톤과 맞지 않음'],
    },
    iconStyle: 'Tabler/Fill 스타일, 24×24px. 로켓, 박스, 별점, 장바구니 아이콘이 핵심. 할인율 배지는 별도 그래픽 컴포넌트. 두꺼운 stroke 또는 fill 선호.',
  },
};
