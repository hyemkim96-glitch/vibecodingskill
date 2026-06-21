import { BrandToken } from '@/types/token';

const colors = [
  { name: '시그니처 오렌지', value: '#FF6F0F', variable: '--color-brand-orange', role: '브랜드 Primary, CTA 버튼, 활성 상태' },
  { name: '오렌지 라이트', value: '#FFF0E6', variable: '--color-orange-light', role: '오렌지 배경, 강조 영역 배경' },
  { name: 'Gray 900', value: '#1D2533', variable: '--color-gray-900', role: '본문 텍스트, 제목' },
  { name: 'Gray 700', value: '#4D5664', variable: '--color-gray-700', role: '보조 텍스트' },
  { name: 'Gray 500', value: '#868E9C', variable: '--color-gray-500', role: '비활성 텍스트, 힌트' },
  { name: 'Gray 300', value: '#C8CBD3', variable: '--color-gray-300', role: '구분선' },
  { name: 'Gray 100', value: '#F5F6F7', variable: '--color-gray-100', role: '카드 배경, 섹션 배경' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '기본 배경, 카드 표면' },
  { name: 'Green', value: '#1AC47D', variable: '--color-green', role: '성공, 인증 완료, 안전 거래' },
  { name: 'Red', value: '#FF3040', variable: '--color-red', role: '에러, 신고, 위험 액션' },
];

const typography = {
  family: 'Pretendard',
  substitute: 'Apple SD Gothic Neo, Noto Sans KR, system-ui',
  weights: [400, 500, 700],
  sizes: [
    { role: 'Display', size: '28px', lineHeight: '1.3', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '22px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '18px', lineHeight: '1.4', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '16px', lineHeight: '1.65', letterSpacing: '0' },
    { role: 'Body 2', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

const mobileTypography = {
  ...typography,
  sizes: [
    { role: 'Display', size: '24px', lineHeight: '1.3', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '20px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '17px', lineHeight: '1.4', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '15px', lineHeight: '1.65', letterSpacing: '0' },
    { role: 'Body 2', size: '13px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

export const daangnToken: BrandToken = {
  slug: 'daangn',
  name: 'Daangn',
  nameKo: '당근',
  tagline: '동네 생활권',
  category: '플랫폼',
  country: 'KR',
  serviceTypes: ['지역 커뮤니티', '중고거래', 'O2O'],
  theme: 'light',
  description: '따뜻하고 신뢰 기반의 지역 커뮤니티 UI. 시그니처 오렌지는 친근함과 에너지를 상징. 피드 형태의 정보 노출, 프로필 신뢰도 지표, 위치 기반 컨텍스트가 디자인 전반에 녹아있다.',
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
        { element: 'button', value: '6px' },
        { element: 'card', value: '8px' },
        { element: 'input', value: '6px' },
        { element: 'badge', value: '4px' },
        { element: 'avatar', value: '50%' },
        { element: 'chip', value: '20px' },
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
        { element: 'button', value: '6px' },
        { element: 'card', value: '10px' },
        { element: 'input', value: '6px' },
        { element: 'modal', value: '12px' },
        { element: 'chip', value: '20px' },
      ],
      layout: {
        maxWidth: '1200px',
        sectionGap: '48px',
        columns: '2-column main + sidebar, 24px gutter',
      },
    },
  },
  guidelines: {
    dos: [
      '오렌지를 Primary 액션에 집중 — 구매/연락하기 등 핵심 CTA에만 사용',
      '신뢰 지표 노출 — 매너온도, 거래 횟수, 인증 뱃지를 프로필에 항상 표시',
      '위치 컨텍스트 강조 — "강남구 역삼동 · 5분 전" 형태의 위치+시간 정보',
      '피드형 레이아웃 — 상품 카드는 2열 그리드, 이미지 > 제목 > 가격 순서',
      '간결한 텍스트 — 제목 15자 이내, 중고거래 특성상 핵심 정보 우선',
    ],
    donts: [
      '화려한 그래픽 남용 금지 — 사용자 생성 콘텐츠가 중심, UI는 조연',
      '복잡한 가격 정책 표시 금지 — 단일 가격 + "가격제안" 여부만',
      '과도한 알림 요청 금지 — 첫 실행 시 위치/알림 모두 동시 요청 금지',
      '신뢰 정보 숨기기 금지 — 매너온도/거래수 항상 노출',
      '회원가입 강제 금지 — 탐색은 비로그인으로 가능하게',
    ],
  },
  updatedAt: '2026.06',
};
