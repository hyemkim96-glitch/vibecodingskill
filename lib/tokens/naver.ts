import { BrandToken } from '@/types/token';

const colors = [
  { name: '시그니처 그린', value: '#03C75A', variable: '--color-brand-green', role: '브랜드 Primary, 로그인 버튼, 활성 상태' },
  { name: 'Green Dark', value: '#02B351', variable: '--color-green-dark', role: 'Hover, 눌림 상태' },
  { name: 'Green Light', value: '#E8FBF0', variable: '--color-green-light', role: '브랜드 배경 강조 영역' },
  { name: 'Gray 900', value: '#1A1A1A', variable: '--color-gray-900', role: '본문 텍스트, 제목' },
  { name: 'Gray 700', value: '#404040', variable: '--color-gray-700', role: '보조 텍스트' },
  { name: 'Gray 500', value: '#808080', variable: '--color-gray-500', role: '메타 텍스트, 날짜' },
  { name: 'Gray 200', value: '#E0E0E0', variable: '--color-gray-200', role: '구분선' },
  { name: 'Gray 100', value: '#F5F5F5', variable: '--color-gray-100', role: '백그라운드' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '기본 배경' },
  { name: 'Blue Link', value: '#1A73E8', variable: '--color-blue-link', role: '검색 링크, 인터랙티브 텍스트' },
];

const typography = {
  family: 'Pretendard',
  substitute: 'Apple SD Gothic Neo, Noto Sans KR, system-ui',
  weights: [400, 500, 700],
  sizes: [
    { role: 'Display', size: '32px', lineHeight: '1.25', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '24px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '18px', lineHeight: '1.4', letterSpacing: '0' },
    { role: 'Body 1', size: '16px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

const mobileTypography = {
  ...typography,
  sizes: [
    { role: 'Display', size: '24px', lineHeight: '1.25', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '20px', lineHeight: '1.35', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '16px', lineHeight: '1.4', letterSpacing: '0' },
    { role: 'Body 1', size: '15px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '13px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '11px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

export const naverToken: BrandToken = {
  slug: 'naver',
  name: 'Naver',
  nameKo: '네이버',
  tagline: '정보의 시작',
  category: '플랫폼',
  country: 'KR',
  serviceTypes: ['포털', '검색', '뉴스/콘텐츠 플랫폼'],
  theme: 'light',
  description: '정보 밀도 높고 신뢰감 있는 포털 UI. 시그니처 초록은 한국 인터넷의 상징. 수많은 서비스를 하나의 홈에 연결하는 허브 역할로, 정보 스캔에 최적화된 레이아웃과 명확한 섹션 구분이 핵심.',
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
        { element: 'card', value: '8px' },
        { element: 'input', value: '4px' },
        { element: 'search-bar', value: '24px' },
        { element: 'badge', value: '4px' },
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
        { element: 'card', value: '8px' },
        { element: 'input', value: '4px' },
        { element: 'search-bar', value: '24px' },
        { element: 'modal', value: '8px' },
      ],
      layout: {
        maxWidth: '1080px',
        sectionGap: '32px',
        columns: '주 콘텐츠 + 사이드바 (740px + 300px), 24px gap',
      },
    },
  },
  guidelines: {
    dos: [
      '초록 로그인 버튼 고수 — 로그인 버튼은 반드시 #03C75A 배경, 공식 가이드 준수',
      '섹션 명확 구분 — 뉴스/쇼핑/블로그 등 서비스별 배경색/라인으로 영역 분리',
      '검색창 최우선 배치 — 모든 화면에서 검색 기능 1초 내 접근 가능',
      '정보 스캔 최적화 — 뉴스 헤드라인은 2줄 이내, 썸네일 16:9 일관',
      '실시간 업데이트 — 뉴스/랭킹은 타임스탬프 포함, 최신성 강조',
    ],
    donts: [
      '녹색 남용 금지 — CTA 외 장식적 녹색 사용은 브랜드 아이덴티티 희석',
      '광고와 콘텐츠 혼재 금지 — 광고는 명확한 "광고" 레이블 필수',
      '정보 과적재 금지 — 한 섹션에 5개 이상 아이템은 탭/더보기로 분리',
      '모바일에서 PC 레이아웃 금지 — 사이드바는 모바일에서 숨김 처리',
      '로딩 없는 무한 콘텐츠 금지 — 더보기 버튼으로 사용자 컨트롤 제공',
    ],
  },
  updatedAt: '2026.06',
  deep: {
    interaction: {
      duration: '100ms (탭 반응), 150ms (패널/드롭다운 열기)',
      easing: 'ease-out',
      pressScale: 'scale(0.98)',
      notes: '정보 포털 특성상 빠른 응답이 신뢰감. 검색 결과는 즉시 표시. 뉴스 탭 전환은 slide-in. 실시간 랭킹 업데이트는 fade. 광고 배너는 cross-fade 전환.',
    },
    voice: {
      tone: '신뢰할 수 있는 정보 제공자 — 중립적이고 명확하게. 정확한 정보, 빠른 전달.',
      examples: [
        '"검색 결과 1,234개" (결과 수)',
        '"3분 전 업데이트" (시간 포맷)',
        '"실시간 검색어 1위" (랭킹 정보)',
        '"자동 저장되었습니다" (상태 안내)',
      ],
      avoid: ['과도한 친근함 — 포털은 중립적 정보 기관으로 인식', '긴 문장 — 정보 스캔에 최적화된 짧은 레이블'],
    },
    iconStyle: 'Lucide 계열, 2px stroke. 검색, 알림, 홈, 메뉴 아이콘 중심. 서비스별 컬러 아이콘 허용(초록 기반). 24×24px 기준.',
  },
};
