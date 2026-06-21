import { BrandToken } from '@/types/token';

const colors = [
  { name: '시그니처 옐로우', value: '#FEE500', variable: '--color-brand-yellow', role: '브랜드 아이덴티티, Primary CTA 배경' },
  { name: '시그니처 브라운', value: '#3C1E1E', variable: '--color-brand-brown', role: 'CTA 텍스트, 아이콘 (노란 배경 위)' },
  { name: 'Gray 900', value: '#1A1A1A', variable: '--color-gray-900', role: '본문 텍스트, 제목' },
  { name: 'Gray 700', value: '#3C3C3C', variable: '--color-gray-700', role: '보조 텍스트' },
  { name: 'Gray 500', value: '#767676', variable: '--color-gray-500', role: '비활성 텍스트, 플레이스홀더' },
  { name: 'Gray 200', value: '#E5E5E5', variable: '--color-gray-200', role: '구분선, 보더' },
  { name: 'Gray 100', value: '#F5F5F5', variable: '--color-gray-100', role: '카드 배경, 보조 배경' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '기본 배경' },
  { name: 'Blue Link', value: '#0D66D0', variable: '--color-blue-link', role: '링크, 인터랙티브 텍스트' },
  { name: 'Red', value: '#E53935', variable: '--color-red', role: '에러, 알림 뱃지' },
];

const typography = {
  family: 'Noto Sans KR',
  substitute: 'Apple SD Gothic Neo, Noto Sans KR, system-ui',
  weights: [400, 500, 700],
  sizes: [
    { role: 'Display', size: '32px', lineHeight: '1.25', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '24px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '20px', lineHeight: '1.4', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '16px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

const mobileTypography = {
  ...typography,
  sizes: [
    { role: 'Display', size: '26px', lineHeight: '1.25', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '22px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '18px', lineHeight: '1.4', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '15px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '13px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '11px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

export const kakaoToken: BrandToken = {
  slug: 'kakao',
  name: 'Kakao',
  nameKo: '카카오',
  tagline: '일상의 연결',
  category: '플랫폼',
  country: 'KR',
  serviceTypes: ['메신저', '플랫폼', '소셜'],
  theme: 'light',
  description: '친근하고 대화 중심의 UI. 시그니처 노란색은 대화와 연결의 상징. 둥근 말풍선, 따뜻한 배경색, 아이콘 중심 내비게이션이 특징이며 전 연령대를 아우르는 직관적 UX를 추구한다.',
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
        { element: 'button', value: '24px' },
        { element: 'card', value: '12px' },
        { element: 'input', value: '8px' },
        { element: 'chat-bubble', value: '18px' },
        { element: 'badge', value: '10px' },
        { element: 'bottom-sheet', value: '16px 16px 0 0' },
      ],
      layout: {
        maxWidth: '390px',
        sectionGap: '24px',
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
        { element: 'button', value: '24px' },
        { element: 'card', value: '12px' },
        { element: 'input', value: '8px' },
        { element: 'modal', value: '12px' },
        { element: 'badge', value: '10px' },
      ],
      layout: {
        maxWidth: '1280px',
        sectionGap: '48px',
        columns: '12-column grid, 20px gutter',
      },
    },
  },
  guidelines: {
    dos: [
      '시그니처 노란색을 Primary CTA에 — 로그인 버튼, 주요 액션은 FEE500 배경에 갈색 텍스트',
      '둥근 UI 요소 — 버튼, 말풍선, 카드 모두 충분한 radius로 친근함 표현',
      '아이콘 + 텍스트 병행 — 전 연령 접근성을 위해 텍스트 레이블 항상 포함',
      '대화 어투 사용 — "시작하기", "친구에게 선물하기" 등 동사 중심',
      '탭바 아이콘 5개 이내 — 홈/채팅/친구/설정 등 핵심 기능만',
    ],
    donts: [
      '노란색 외 다른 컬러를 Primary에 사용 금지 — 브랜드 일관성 최우선',
      '날카로운 각진 UI 금지 — 이 브랜드 아이덴티티는 곡선과 친근함',
      '복잡한 텍스트 메뉴 구조 금지 — 아이콘 내비로 단순화',
      '광고성 팝업 남발 금지 — 첫 실행 시 최대 1개 팝업',
      '작은 터치 영역 금지 — 탭 영역 최소 44px',
    ],
  },
  updatedAt: '2026.06',
};
