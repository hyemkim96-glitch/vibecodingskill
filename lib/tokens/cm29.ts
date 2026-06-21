import { BrandToken } from '@/types/token';

const colors = [
  { name: 'Brand Black', value: '#1A1A1A', variable: '--color-brand-black', role: '브랜드 Primary, CTA 버튼, 핵심 텍스트' },
  { name: 'Warm Beige', value: '#F5F0EB', variable: '--color-warm-beige', role: '메인 배경, 따뜻한 섹션 배경' },
  { name: 'Cream', value: '#FAF7F4', variable: '--color-cream', role: '카드 배경, 보조 배경' },
  { name: 'Gray 700', value: '#555555', variable: '--color-gray-700', role: '본문 텍스트' },
  { name: 'Gray 500', value: '#888888', variable: '--color-gray-500', role: '보조 텍스트, 캡션' },
  { name: 'Gray 300', value: '#CCCCCC', variable: '--color-gray-300', role: '구분선, 보더' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '카드 표면, 역전 텍스트 배경' },
  { name: 'Point Red', value: '#C8473A', variable: '--color-point-red', role: '할인율, 세일, 포인트 강조' },
  { name: 'Gold', value: '#B8962E', variable: '--color-gold', role: '프리미엄 뱃지, 큐레이션 강조' },
  { name: 'Sage Green', value: '#7B9E87', variable: '--color-sage-green', role: '라이프스타일 카테고리 액센트' },
];

const typography = {
  family: 'Noto Serif KR',
  substitute: 'Georgia, Times New Roman, serif',
  weights: [300, 400, 500, 700],
  sizes: [
    { role: 'Display', size: '36px', lineHeight: '1.2', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '26px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '20px', lineHeight: '1.4', letterSpacing: '0' },
    { role: 'Body 1', size: '15px', lineHeight: '1.8', letterSpacing: '0.01em' },
    { role: 'Body 2', size: '13px', lineHeight: '1.75', letterSpacing: '0.01em' },
    { role: 'Caption', size: '11px', lineHeight: '1.6', letterSpacing: '0.02em' },
  ],
};

const mobileTypography = {
  ...typography,
  sizes: [
    { role: 'Display', size: '26px', lineHeight: '1.2', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '20px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '17px', lineHeight: '1.4', letterSpacing: '0' },
    { role: 'Body 1', size: '14px', lineHeight: '1.8', letterSpacing: '0.01em' },
    { role: 'Body 2', size: '13px', lineHeight: '1.75', letterSpacing: '0.01em' },
    { role: 'Caption', size: '11px', lineHeight: '1.6', letterSpacing: '0.02em' },
  ],
};

export const cm29Token: BrandToken = {
  slug: '29cm',
  name: '29CM',
  nameKo: '29CM',
  category: '커머스',
  country: 'KR',
  serviceTypes: ['라이프스타일 커머스', '편집샵', '감성 큐레이션'],
  theme: 'light',
  description: '감성적이고 에디토리얼한 쇼핑 경험. 따뜻한 베이지 팔레트에 세리프 폰트를 혼합해 잡지 같은 분위기를 연출. 큐레이션된 라이프스타일 콘텐츠와 상품을 매거진 레이아웃으로 보여준다.',
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
        { element: 'button', value: '2px' },
        { element: 'card', value: '4px' },
        { element: 'input', value: '2px' },
        { element: 'badge', value: '2px' },
        { element: 'tag', value: '2px' },
      ],
      layout: {
        maxWidth: '390px',
        sectionGap: '32px',
        touchTarget: '44px',
      },
    },
    web: {
      typography,
      spacing: {
        baseUnit: '8px',
        density: 'spacious',
        scale: [
          { name: '8', value: '8px', token: '--spacing-8' },
          { name: '16', value: '16px', token: '--spacing-16' },
          { name: '24', value: '24px', token: '--spacing-24' },
          { name: '40', value: '40px', token: '--spacing-40' },
          { name: '56', value: '56px', token: '--spacing-56' },
          { name: '80', value: '80px', token: '--spacing-80' },
        ],
      },
      shapes: [
        { element: 'button', value: '2px' },
        { element: 'card', value: '4px' },
        { element: 'input', value: '2px' },
        { element: 'modal', value: '4px' },
        { element: 'tag', value: '2px' },
      ],
      layout: {
        maxWidth: '1440px',
        sectionGap: '80px',
        columns: '매거진 레이아웃, 비대칭 컬럼, 32px gutter',
      },
    },
  },
  guidelines: {
    dos: [
      '에디토리얼 톤 유지 — "이번 시즌의 선택", "당신만의 스타일" 등 잡지 어투',
      '화이트스페이스 넉넉하게 — 여백으로 고급스러움 표현, 콘텐츠 밀도 낮게',
      '세리프 + 산세리프 믹스 — 제목은 Noto Serif KR, 본문은 시스템 폰트',
      '베이지/크림 배경 활용 — 순수 흰색 대신 따뜻한 오프화이트 계열',
      '큐레이션 스토리 강조 — 상품 나열보다 "이 브랜드의 철학" 먼저',
    ],
    donts: [
      '형광색/강렬한 포인트 컬러 금지 — 감성을 해치는 원색 버튼 사용 지양',
      '촘촘한 상품 그리드 금지 — 3열 이상 빽빽한 나열은 가치를 떨어뜨림',
      '딱딱한 할인/판매 언어 금지 — "~% 할인" 대신 "더 합리적으로" 등 표현',
      '로고 없는 브랜드 노출 금지 — 모든 브랜드는 공식 로고 + 스토리 필수',
      '일관성 없는 이미지 믹스 금지 — 화이트 배경 상품 이미지만 사용',
    ],
  },
  updatedAt: '2026.06',
};
