import { BrandToken } from '@/types/token';

const colors = [
  { name: 'Brand Green', value: '#1ABF80', variable: '--color-brand-green', role: '브랜드 Primary, CTA 버튼, 활성 상태' },
  { name: 'Green Light', value: '#E6F9F2', variable: '--color-green-light', role: '그린 배경, 뱃지 배경' },
  { name: 'Gray 900', value: '#222222', variable: '--color-gray-900', role: '본문 텍스트, 제목' },
  { name: 'Gray 700', value: '#555555', variable: '--color-gray-700', role: '보조 텍스트' },
  { name: 'Gray 500', value: '#888888', variable: '--color-gray-500', role: '메타 텍스트, 날짜' },
  { name: 'Gray 300', value: '#CCCCCC', variable: '--color-gray-300', role: '구분선, 보더' },
  { name: 'Gray 100', value: '#F7F7F7', variable: '--color-gray-100', role: '배경, 카드 배경' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '기본 배경, 카드 표면' },
  { name: 'Orange', value: '#FF6B35', variable: '--color-orange', role: '특가, 긴급 할인, 인기 표시' },
  { name: 'Blue', value: '#3B82F6', variable: '--color-blue', role: '링크, 인포 아이콘' },
];

const typography = {
  family: 'Pretendard',
  substitute: 'Apple SD Gothic Neo, Noto Sans KR, system-ui',
  weights: [400, 500, 600, 700],
  sizes: [
    { role: 'Display', size: '32px', lineHeight: '1.25', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '24px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '20px', lineHeight: '1.4', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '16px', lineHeight: '1.65', letterSpacing: '0' },
    { role: 'Body 2', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

const mobileTypography = {
  ...typography,
  sizes: [
    { role: 'Display', size: '26px', lineHeight: '1.25', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '20px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '17px', lineHeight: '1.4', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '15px', lineHeight: '1.65', letterSpacing: '0' },
    { role: 'Body 2', size: '13px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

export const ohouseToken: BrandToken = {
  slug: 'ohouse',
  name: 'Ohouse',
  nameKo: '오늘의집',
  category: '커머스',
  country: 'KR',
  serviceTypes: ['인테리어 커머스', '라이프스타일 SNS', 'UGC 플랫폼'],
  theme: 'light',
  description: '집꾸미기 영감과 쇼핑을 연결하는 커뮤니티 커머스. 사용자 생성 인테리어 사진이 메인 콘텐츠. 그린 CTA로 자연스럽고 따뜻한 인상을 주며, 핀터레스트형 무한 스크롤 피드와 상품 연결이 핵심.',
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
        { element: 'card', value: '8px' },
        { element: 'input', value: '8px' },
        { element: 'badge', value: '4px' },
        { element: 'chip', value: '20px' },
        { element: 'avatar', value: '50%' },
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
        { element: 'card', value: '8px' },
        { element: 'input', value: '8px' },
        { element: 'modal', value: '12px' },
        { element: 'chip', value: '20px' },
      ],
      layout: {
        maxWidth: '1280px',
        sectionGap: '48px',
        columns: '핀터레스트형 2열 Masonry, 16px gap',
      },
    },
  },
  guidelines: {
    dos: [
      'UGC 사진 최대화 — 사용자 인테리어 사진이 메인, 정방형 또는 세로형',
      '그린 CTA로 자연스럽게 — "구매하기", "스크랩" 버튼에 브랜드 그린 사용',
      '사진 위 상품 태그 — 인테리어 사진에서 직접 상품 클릭으로 연결',
      '인테리어 스타일 카테고리 — 모던/북유럽/빈티지 등 스타일 필터 제공',
      '전후 비교 포맷 — Before/After 인테리어 사진으로 변화 임팩트 강조',
    ],
    donts: [
      '상업적 제품 사진 메인 노출 금지 — 실제 집에서 찍은 사진이 설득력 있음',
      '과도한 그래픽 배너 금지 — 콘텐츠 피드에 광고 배너 최소화',
      '댓글/스크랩 기능 숨기기 금지 — 커뮤니티 기능을 쇼핑만큼 강조',
      '스타일 없는 상품 나열 금지 — 맥락(어떤 공간에 어울리는지) 없는 상품 노출 지양',
      '무거운 동영상 자동재생 금지 — 피드에서 GIF/짧은 영상만, 풀 영상은 탭 후 재생',
    ],
  },
  updatedAt: '2026.06',
};
