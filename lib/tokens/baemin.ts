import { BrandToken } from '@/types/token';

const colors = [
  { name: 'Mint', value: '#2AC1BC', variable: '--color-mint', role: '브랜드 Primary, CTA 버튼, 활성 상태' },
  { name: 'Mint Light', value: '#E8F8F7', variable: '--color-mint-light', role: '민트 배경, 강조 영역' },
  { name: 'Baemin Yellow', value: '#FFCE00', variable: '--color-baemin-yellow', role: '배달 상태 강조, 포인트 액센트' },
  { name: 'Gray 900', value: '#333333', variable: '--color-gray-900', role: '본문 텍스트, 제목' },
  { name: 'Gray 700', value: '#666666', variable: '--color-gray-700', role: '보조 텍스트' },
  { name: 'Gray 400', value: '#AAAAAA', variable: '--color-gray-400', role: '비활성 텍스트, 플레이스홀더' },
  { name: 'Gray 200', value: '#E5E5E5', variable: '--color-gray-200', role: '구분선, 보더' },
  { name: 'Gray 100', value: '#F6F6F6', variable: '--color-gray-100', role: '배경, 카드 배경' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '기본 배경' },
  { name: 'Red', value: '#FF4444', variable: '--color-red', role: '에러, 취소, 마감 임박' },
];

const typography = {
  family: 'Baemin',
  substitute: 'Pretendard, Apple SD Gothic Neo, Noto Sans KR, system-ui',
  weights: [400, 500, 700],
  sizes: [
    { role: 'Display', size: '28px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Heading 1', size: '22px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '18px', lineHeight: '1.4', letterSpacing: '0' },
    { role: 'Body 1', size: '16px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

const mobileTypography = {
  ...typography,
  sizes: [
    { role: 'Display', size: '24px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Heading 1', size: '20px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '17px', lineHeight: '1.4', letterSpacing: '0' },
    { role: 'Body 1', size: '15px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '13px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

export const baeminToken: BrandToken = {
  slug: 'baemin',
  name: 'Baemin',
  nameKo: '배달의민족',
  category: '플랫폼',
  country: 'KR',
  serviceTypes: ['음식 배달', 'O2O', '푸드테크'],
  theme: 'light',
  description: '유머러스하고 친근한 배달 플랫폼 UI. 민트 컬러와 자체 폰트로 강한 브랜드 아이덴티티 구축. 주문 진행 상태를 단계별로 명확히 전달하고, 가게/메뉴 탐색을 직관적인 이미지 중심으로 제공.',
  colors,
  platforms: {
    mobile: {
      typography: mobileTypography,
      spacing: {
        baseUnit: '4px',
        density: 'comfortable',
        scale: [
          { name: '4', value: '4px', token: '--spacing-4' },
          { name: '8', value: '8px', token: '--spacing-8' },
          { name: '12', value: '12px', token: '--spacing-12' },
          { name: '16', value: '16px', token: '--spacing-16' },
          { name: '20', value: '20px', token: '--spacing-20' },
          { name: '24', value: '24px', token: '--spacing-24' },
          { name: '32', value: '32px', token: '--spacing-32' },
        ],
      },
      shapes: [
        { element: 'button', value: '8px' },
        { element: 'card', value: '12px' },
        { element: 'input', value: '8px' },
        { element: 'badge', value: '4px' },
        { element: 'chip', value: '20px' },
        { element: 'bottom-sheet', value: '16px 16px 0 0' },
      ],
      layout: {
        maxWidth: '390px',
        sectionGap: '8px',
        touchTarget: '48px',
      },
    },
    web: {
      typography,
      spacing: {
        baseUnit: '8px',
        density: 'comfortable',
        scale: [
          { name: '8', value: '8px', token: '--spacing-8' },
          { name: '16', value: '16px', token: '--spacing-16' },
          { name: '24', value: '24px', token: '--spacing-24' },
          { name: '32', value: '32px', token: '--spacing-32' },
          { name: '48', value: '48px', token: '--spacing-48' },
          { name: '64', value: '64px', token: '--spacing-64' },
        ],
      },
      shapes: [
        { element: 'button', value: '8px' },
        { element: 'card', value: '12px' },
        { element: 'input', value: '8px' },
        { element: 'modal', value: '12px' },
        { element: 'chip', value: '20px' },
      ],
      layout: {
        maxWidth: '1200px',
        sectionGap: '40px',
        columns: '음식점 4열 그리드, 16px gutter',
      },
    },
  },
  guidelines: {
    dos: [
      '민트를 Primary CTA에 집중 — "주문하기", "담기" 등 핵심 액션에만 사용',
      '배달 상태 시각화 — 주문접수→조리중→배달중→완료 단계 아이콘+색상으로 표현',
      '리뷰/평점 노출 강조 — 별점, 주문수, 사진 리뷰 수를 카드에 항상 표시',
      '음식 사진 퀄리티 우선 — 가게 대표 이미지는 최소 3:2 비율 가로형',
      '배민 폰트 활용 — 제목과 슬로건에 자체 폰트로 아이덴티티 강화',
    ],
    donts: [
      '복잡한 카테고리 구조 금지 — 메인 카테고리 8개 이내로 단순화',
      '주문 완료 후 추가 유도 금지 — 결제 후 팝업/추천은 사용자 경험 저하',
      '배달비 정보 숨기기 금지 — 메뉴 탐색 전에 배달비 명시',
      '느린 로딩 이미지 금지 — WebP 포맷, lazy loading 필수',
      '긴 주문 단계 금지 — 최대 3단계 (장바구니→결제→확인) 이내',
    ],
  },
  updatedAt: '2026.06',
};
