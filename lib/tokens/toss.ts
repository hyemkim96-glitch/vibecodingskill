import { BrandToken } from '@/types/token';

const colors = [
  { name: 'Blue', value: '#3182F6', variable: '--color-blue', role: '주요 액션, CTA 버튼, 활성 상태' },
  { name: 'Blue Light', value: '#EBF3FE', variable: '--color-blue-light', role: '블루 배경, 강조 영역 배경' },
  { name: 'Gray 900', value: '#191F28', variable: '--color-gray-900', role: '본문 텍스트, 주요 컨텐츠' },
  { name: 'Gray 700', value: '#4E5968', variable: '--color-gray-700', role: '보조 텍스트, 라벨' },
  { name: 'Gray 500', value: '#8B95A1', variable: '--color-gray-500', role: '비활성 텍스트, 플레이스홀더' },
  { name: 'Gray 200', value: '#E5EAF0', variable: '--color-gray-200', role: '구분선, 보더' },
  { name: 'Gray 100', value: '#F2F4F6', variable: '--color-gray-100', role: '카드 배경, 보조 배경' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '기본 배경, 카드 표면' },
  { name: 'Red', value: '#F04452', variable: '--color-red', role: '에러, 위험 액션, 감소 지표' },
  { name: 'Green', value: '#27B853', variable: '--color-green', role: '성공, 증가 지표' },
];

const typography = {
  family: 'Pretendard',
  substitute: 'Apple SD Gothic Neo, Noto Sans KR, system-ui',
  weights: [400, 500, 600, 700],
  sizes: [
    { role: 'Display', size: '32px', lineHeight: '1.2', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '24px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '20px', lineHeight: '1.4', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '16px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

const mobileTypography = {
  ...typography,
  sizes: [
    { role: 'Display', size: '28px', lineHeight: '1.2', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '22px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '18px', lineHeight: '1.4', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '16px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

export const tossToken: BrandToken = {
  slug: 'toss',
  name: 'Toss',
  nameKo: '토스',
  category: '핀테크/금융',
  country: 'KR',
  serviceTypes: ['핀테크 앱', '모바일 퍼스트'],
  theme: 'light',
  description: '빠르고 자신감 있는 금융 인터페이스. 복잡한 금융을 단순하게 만드는 것이 토스의 디자인 철학. 여백을 넉넉하게 사용하고, 핵심 정보를 큰 숫자로 강조하며, 친근한 한국어 어투로 사용자와 대화한다.',
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
        { element: 'bottom-sheet', value: '20px 20px 0 0' },
        { element: 'badge', value: '4px' },
      ],
      layout: {
        maxWidth: '390px',
        sectionGap: '32px',
        touchTarget: '48px',
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
          { name: '32', value: '32px', token: '--spacing-32' },
          { name: '40', value: '40px', token: '--spacing-40' },
          { name: '48', value: '48px', token: '--spacing-48' },
          { name: '64', value: '64px', token: '--spacing-64' },
        ],
      },
      shapes: [
        { element: 'button', value: '8px' },
        { element: 'card', value: '16px' },
        { element: 'input', value: '8px' },
        { element: 'modal', value: '16px' },
        { element: 'badge', value: '4px' },
      ],
      layout: {
        maxWidth: '1200px',
        sectionGap: '64px',
        columns: '12-column grid, 24px gutter',
      },
    },
  },
  guidelines: {
    dos: [
      '숫자를 크고 굵게 — 금액, 잔액 등 핵심 수치는 Display 크기 이상으로 강조',
      '짧고 친근한 한국어 — "아직 내역이 없어요", "잠깐, 확인해볼게요" 어투 사용',
      '블루를 주요 CTA에만 — 페이지당 하나의 Primary 버튼으로 집중',
      '넉넉한 여백 — 모바일 최소 20px, 웹 최소 40px 측면 패딩',
      '성공/실패는 색으로 즉시 — 증가는 Green, 감소는 Red 일관 적용',
    ],
    donts: [
      '여러 강조색 동시 사용 금지 — 블루 외 포인트 컬러를 한 화면에 섞지 않음',
      '작은 터치 영역 금지 — 버튼 최소 높이 48px 유지 (모바일)',
      '전문 금융 용어 사용 금지 — 누구나 이해할 수 있는 일상어로 대체',
      '모달 남용 금지 — 중요한 확인이 아니면 인라인 피드백 사용',
      '무거운 애니메이션 금지 — 트랜지션 200ms 이하, 과도한 이펙트 지양',
    ],
  },
  updatedAt: '2026.06',
};
