import { BrandToken } from '@/types/token';

const colors = [
  { name: 'Black', value: '#000000', variable: '--color-black', role: '브랜드 Primary, 핵심 텍스트, CTA 버튼' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '기본 배경, 카드 표면, 역전 텍스트' },
  { name: 'Gray 800', value: '#222222', variable: '--color-gray-800', role: '보조 제목, 강조 텍스트' },
  { name: 'Gray 600', value: '#555555', variable: '--color-gray-600', role: '본문 텍스트' },
  { name: 'Gray 400', value: '#999999', variable: '--color-gray-400', role: '보조 텍스트, 캡션' },
  { name: 'Gray 200', value: '#DDDDDD', variable: '--color-gray-200', role: '구분선, 보더' },
  { name: 'Gray 100', value: '#F5F5F5', variable: '--color-gray-100', role: '배경 섹션, 카드 배경' },
  { name: 'Point Red', value: '#FF0000', variable: '--color-point-red', role: '할인율, 세일 뱃지, 긴급 포인트' },
  { name: 'Blue', value: '#0066FF', variable: '--color-blue', role: '링크, 브랜드 인증 뱃지' },
  { name: 'Mustard', value: '#F5C000', variable: '--color-mustard', role: '베스트, 인기 아이템 강조' },
];

const typography = {
  family: 'Pretendard',
  substitute: 'Apple SD Gothic Neo, Noto Sans KR, system-ui',
  weights: [400, 500, 600, 700, 900],
  sizes: [
    { role: 'Display', size: '40px', lineHeight: '1.15', letterSpacing: '-0.03em' },
    { role: 'Heading 1', size: '28px', lineHeight: '1.2', letterSpacing: '-0.02em' },
    { role: 'Heading 2', size: '20px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '15px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '13px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '11px', lineHeight: '1.5', letterSpacing: '0.02em' },
  ],
};

const mobileTypography = {
  ...typography,
  sizes: [
    { role: 'Display', size: '28px', lineHeight: '1.15', letterSpacing: '-0.03em' },
    { role: 'Heading 1', size: '22px', lineHeight: '1.2', letterSpacing: '-0.02em' },
    { role: 'Heading 2', size: '17px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '12px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '11px', lineHeight: '1.5', letterSpacing: '0.02em' },
  ],
};

export const musinsaToken: BrandToken = {
  slug: 'musinsa',
  name: 'Musinsa',
  nameKo: '무신사',
  tagline: '스트리트 패션',
  category: '커머스',
  country: 'KR',
  serviceTypes: ['패션 커머스', '스트리트웨어', '브랜드 편집샵'],
  theme: 'light',
  description: '강렬하고 패션 포워드한 UI. 블랙 앤 화이트 기반에 콘텐츠 중심 레이아웃. 상품 이미지를 최대한 크게 노출하고, 할인율과 가격을 눈에 띄게 강조. 스트리트 패션 감성의 타이포그래피가 특징.',
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
        { element: 'button', value: '0px' },
        { element: 'card', value: '0px' },
        { element: 'input', value: '4px' },
        { element: 'badge', value: '2px' },
        { element: 'chip', value: '20px' },
      ],
      layout: {
        maxWidth: '390px',
        sectionGap: '16px',
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
          { name: '64', value: '64px', token: '--spacing-64' },
        ],
      },
      shapes: [
        { element: 'button', value: '0px' },
        { element: 'card', value: '0px' },
        { element: 'input', value: '4px' },
        { element: 'modal', value: '4px' },
        { element: 'chip', value: '20px' },
      ],
      layout: {
        maxWidth: '1280px',
        sectionGap: '48px',
        columns: '4-column product grid, 16px gutter',
      },
    },
  },
  guidelines: {
    dos: [
      '상품 이미지 최대화 — 카드 높이의 80% 이상을 이미지로, 텍스트는 최소화',
      '할인율 빨간색 강조 — "30% OFF" 텍스트는 항상 빨간색, 굵은 폰트',
      '블랙 버튼으로 강렬함 — Primary CTA는 검정 배경에 흰 텍스트',
      '브랜드 로고 선명하게 — 패션 브랜드 로고 크롭 없이 노출',
      '코디 이미지 활용 — 단품보다 착장 이미지로 컨텍스트 제공',
    ],
    donts: [
      '둥근 모서리 과용 금지 — 각진 UI가 무신사 감성, radius는 최소화',
      '파스텔/밝은 색상 CTA 금지 — 강렬한 블랙/레드 포인트 유지',
      '작은 상품 썸네일 금지 — 최소 1:1.2 비율 이상의 세로형 이미지',
      '정가만 표시 금지 — 할인가/정가 병행 표시로 가치 인식 강화',
      '텍스트 heavy 레이아웃 금지 — 비주얼이 설명을 대체해야 함',
    ],
  },
  updatedAt: '2026.06',
};
