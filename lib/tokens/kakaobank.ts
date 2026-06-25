import { BrandToken } from '@/types/token';

const colors = [
  { name: '시그니처 옐로우', value: '#FEE500', variable: '--color-brand-yellow', role: '브랜드 Primary, 핵심 CTA 버튼 배경' },
  { name: '시그니처 브라운', value: '#3C1E1E', variable: '--color-brand-brown', role: 'Yellow 버튼 위 텍스트/아이콘' },
  { name: 'Blue Primary', value: '#1A49C0', variable: '--color-blue-primary', role: '금융 액션, 이체, 금리 강조' },
  { name: 'Blue Light', value: '#EBF0FF', variable: '--color-blue-light', role: '블루 배경 강조 영역' },
  { name: 'Gray 900', value: '#191919', variable: '--color-gray-900', role: '본문 텍스트, 금액 표시' },
  { name: 'Gray 700', value: '#444444', variable: '--color-gray-700', role: '보조 텍스트' },
  { name: 'Gray 500', value: '#888888', variable: '--color-gray-500', role: '비활성, 힌트 텍스트' },
  { name: 'Gray 200', value: '#E8E8E8', variable: '--color-gray-200', role: '구분선, 보더' },
  { name: 'Gray 100', value: '#F5F5F5', variable: '--color-gray-100', role: '카드 배경, 섹션 배경' },
  { name: 'White', value: '#FFFFFF', variable: '--color-white', role: '기본 배경' },
];

const typography = {
  family: "'IBM Plex Sans KR', sans-serif",
  substitute: 'Apple SD Gothic Neo, Noto Sans KR, system-ui',
  weights: [400, 500, 700],
  sizes: [
    { role: 'Display', size: '36px', lineHeight: '1.2', letterSpacing: '-0.02em' },
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
    { role: 'Display', size: '32px', lineHeight: '1.2', letterSpacing: '-0.02em' },
    { role: 'Heading 1', size: '22px', lineHeight: '1.3', letterSpacing: '-0.01em' },
    { role: 'Heading 2', size: '18px', lineHeight: '1.4', letterSpacing: '-0.01em' },
    { role: 'Body 1', size: '16px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Body 2', size: '14px', lineHeight: '1.6', letterSpacing: '0' },
    { role: 'Caption', size: '12px', lineHeight: '1.5', letterSpacing: '0' },
  ],
};

export const kakaobankToken: BrandToken = {
  slug: 'kakaobank',
  name: 'KakaoBank',
  nameKo: '카카오뱅크',
  tagline: '편한 모바일 뱅킹',
  category: '핀테크/금융',
  country: 'KR',
  serviceTypes: ['인터넷 은행', '핀테크', '모바일 퍼스트'],
  theme: 'light',
  description: '신뢰와 편의를 동시에 — 메신저 플랫폼의 친근함에 금융의 신뢰감을 결합. 노란 CTA로 패밀리 서비스임을 명확히 하면서, 금액/이체 등 금융 액션에는 블루를 사용해 심각성을 전달. 숫자 정보는 크고 명확하게.',
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
        { element: 'button', value: '12px' },
        { element: 'card', value: '16px' },
        { element: 'input', value: '8px' },
        { element: 'badge', value: '6px' },
        { element: 'bottom-sheet', value: '20px 20px 0 0' },
      ],
      layout: {
        maxWidth: '390px',
        sectionGap: '24px',
        touchTarget: '52px',
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
          { name: '48', value: '48px', token: '--spacing-48' },
          { name: '64', value: '64px', token: '--spacing-64' },
        ],
      },
      shapes: [
        { element: 'button', value: '12px' },
        { element: 'card', value: '16px' },
        { element: 'input', value: '8px' },
        { element: 'modal', value: '16px' },
        { element: 'badge', value: '6px' },
      ],
      layout: {
        maxWidth: '1080px',
        sectionGap: '64px',
        columns: '중앙 정렬 싱글 컬럼, 최대 680px 콘텐츠',
      },
    },
  },
  guidelines: {
    dos: [
      '잔액/금액은 가장 크게 — Display 사이즈로 현재 잔액, 이번 달 지출 강조',
      '시그니처 노랑 로그인 CTA — 앱 진입 버튼은 FEE500 배경으로 패밀리 서비스 인식',
      '금융 액션에 블루 사용 — 이체, 납부 등 금융 트랜잭션은 블루 계열',
      '보안 상태 명시 — 로그인 방식(지문/PIN), 마지막 접속 시간 노출',
      '간결한 이체 플로우 — 계좌선택→금액입력→확인 최대 3단계',
    ],
    donts: [
      '숫자 소수점 생략 금지 — 금액은 "50,000원" 형태, "5만원" 표기 지양',
      '금융 정보 팝업 남용 금지 — 금리 안내는 인라인, 팝업 최소화',
      '노란색/블루 동시 경쟁 금지 — 한 화면에 두 컬러가 같은 크기로 충돌하면 안 됨',
      '작은 확인 버튼 금지 — 이체 확인 등 중요 액션은 풀 폭 버튼',
      '복잡한 이자 계산 직접 노출 금지 — 예상 이자는 "원리금 합계"로 단순화',
    ],
  },
  updatedAt: '2026.06',
  deep: {
    interaction: {
      duration: '180ms (탭/버튼), 250ms (화면 전환), 300ms (잔액 숫자 count-up)',
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      pressScale: 'scale(0.98)',
      notes: '금융 특성상 안정적이고 신중한 모션. 잔액 숫자는 count-up 애니메이션(300ms). 이체 완료는 체크마크 draw animation. 생체 인증은 진동 피드백. 실수 방지 UI에 충분한 딜레이.',
    },
    voice: {
      tone: '신뢰할 수 있는 동생 같은 은행 — 친근하지만 금융은 정확하게. 카카오 DNA + 금융 전문성.',
      examples: [
        '"이체가 완료됐어요 ✓" (이체 완료)',
        '"이번 달 얼마 썼는지 볼까요?" (지출 분석)',
        '"금리가 올랐어요!" (알림)',
        '"잠깐, 확인해볼게요" (로딩 중)',
      ],
      avoid: ['지나친 전문 금융 용어 — "입금 완료" 대신 "돈이 들어왔어요"', '불안감을 주는 표현 — "잔액 부족" 대신 "조금 더 필요해요"'],
    },
    iconStyle: 'Lucide 계열, 2px stroke. 금융 아이콘: 카드, 이체, 적금, 대출. 카카오 패밀리 아이콘과 일관성. 24×24px 기준.',
  },
};
