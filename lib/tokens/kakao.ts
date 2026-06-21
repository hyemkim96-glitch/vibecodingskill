import { BrandToken, BrandDeep } from '@/types/token';

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
  deep: {
    interaction: {
      duration: '120ms (micro/탭 피드백), 200ms (모달/시트 열림), 250ms (페이지 전환)',
      easing: 'ease-out (대부분), spring(stiffness 200, damping 25) (말풍선 진입)',
      pressScale: 'scale(0.95) — 버튼·아이콘 탭 피드백',
      notes: '채팅 메시지 진입은 아래에서 위로 슬라이드 + opacity. 이모지 반응(하트 등)은 scale 1→1.4→1 bounce. 읽음 처리는 애니메이션 없이 즉시.',
    },
    voice: {
      tone: '옆집 친구처럼 편하게 — 짧고 직관적. 전 연령이 이해할 수 있는 평어체. 이모지 적극 활용.',
      examples: [
        '"선물 도착! 🎁" (선물 수신 알림)',
        '"채팅을 시작해보세요 💬" (빈 채팅방)',
        '"지금 어디야?" (위치 공유 요청 예시)',
        '"xx님이 나갔습니다" (퇴장 알림)',
        '"읽음 2" (읽지 않은 사람 수)',
      ],
      avoid: [
        '딱딱한 존댓말 — "메시지가 전송되었습니다" 대신 "보냈어요"',
        '영어 전문 용어 — "notification" 대신 "알림", "profile" 대신 "프로필"',
        '긴 문장 — 알림, 버튼 레이블은 10자 이내',
      ],
    },
    components: [
      {
        name: 'Primary CTA Button (시그니처 옐로우)',
        anatomy: '[아이콘?] + 텍스트',
        states: 'default → pressed(scale 0.95, brightness 0.95) → disabled(opacity 0.4)',
        spec: `height: 54px (mobile) / 48px (web)
border-radius: 24px (pill — 브랜드 아이덴티티)
background: #FEE500
color: #3C1E1E
font: 700 16px/1 Noto Sans KR
padding: 0 32px
transition: transform 120ms ease-out, filter 120ms ease-out
사용처: 로그인, 결제 등 최상위 CTA에만`,
      },
      {
        name: 'Chat Bubble — 발신',
        anatomy: '텍스트/미디어 컨테이너 + 전송 시각 + 읽음 수',
        spec: `border-radius: 18px 18px 4px 18px (오른쪽 하단만 각짐)
background: #FEE500
color: #3C1E1E
padding: 10px 14px
max-width: 70% (화면 폭 기준)
font: 400 15px/1.5 Noto Sans KR
시각: 400 11px #767676, 버블 하단 오른쪽 정렬
읽음: "읽음 N" 텍스트, 11px, 시각 왼쪽에 위치`,
      },
      {
        name: 'Chat Bubble — 수신',
        anatomy: '아바타 + 발신자명? + 텍스트/미디어 컨테이너 + 전송 시각',
        spec: `border-radius: 18px 18px 18px 4px (왼쪽 하단만 각짐)
background: #FFFFFF
border: 1px solid #E5E5E5
color: #1A1A1A
padding: 10px 14px
아바타: 36×36px, border-radius 50%
발신자명: 400 12px #3C3C3C, 버블 위 표시 (그룹채팅만)`,
      },
      {
        name: 'Tab Bar',
        anatomy: '아이콘 + 레이블 × N개 (보통 4-5개)',
        spec: `height: 56px + safe-area-inset-bottom
background: #FFFFFF
border-top: 1px solid #E5E5E5
아이콘 크기: 26×26px (line), 활성 시 fill
레이블: 400 10px #767676, 활성 시 700 #1A1A1A
배지: 8×8px 최소, #E53935 background, 흰 텍스트 10px
탭 영역: 최소 44×44px touch target`,
      },
      {
        name: 'Modal / Bottom Sheet',
        anatomy: '딤 배경 > 시트 > [핸들] > 제목 > 콘텐츠 > 버튼 영역',
        spec: `border-radius: 16px 16px 0 0
handle: width 32px, height 4px, radius 2px, #E5E5E5, margin 8px auto
제목: 700 18px #1A1A1A, text-align center
딤: rgba(0,0,0,0.5)
진입: translateY(100%) → 0, 200ms ease-out
버튼 영역: 가로 배열, 각 50%, 높이 52px, border-top 1px solid #E5E5E5`,
      },
      {
        name: 'Search Bar',
        anatomy: '🔍 아이콘 + 플레이스홀더 텍스트',
        states: 'default(bg: #F5F5F5) → focus(bg: #FFFFFF, border: 1px solid #FEE500)',
        spec: `height: 44px
border-radius: 22px (완전 pill)
padding: 0 16px 0 40px (아이콘 공간)
font: 400 15px Noto Sans KR
아이콘: 18×18px, #767676, 좌측 12px에서 수직 중앙`,
      },
      {
        name: 'Profile Avatar',
        anatomy: '이미지 또는 이니셜 fallback',
        spec: `사이즈: 26px (탭바), 36px (채팅 목록), 48px (채팅방 헤더), 64px (프로필 상세), 96px (프로필 편집)
border-radius: 50% (기본), 30% (오픈채팅 — 약간 각짐)
fallback: 이니셜 1자, background #FEE500, color #3C1E1E`,
      },
    ],
    breakpoints: [
      { name: 'Mobile', value: '390px', behavior: '기준 디자인. 하단 탭바 4개. 채팅 목록 단일 컬럼.' },
      { name: 'Tablet (세로)', value: '768px', behavior: '채팅 목록 + 채팅방 2열 분할. 탭바 → 사이드바.' },
      { name: 'Tablet (가로)/Desktop', value: '1024px+', behavior: '3분할: 서비스 목록 | 채팅 목록 | 채팅방. PC 카카오톡 레이아웃.' },
    ],
    iconStyle: '2px 라운드 stroke, 24×24px 기준. 시그니처 옐로우를 아이콘 강조 포인트로 사용. 이모티콘 스타일은 카카오 프렌즈 캐릭터 영향 — 둥글고 귀여운 실루엣. 시스템 아이콘은 SF Symbols / Material Icons 스타일 혼용.',
    imageStyle: '프로필 사진: 자유. 콘텐츠 카드: 16/9 비율, 모서리 8px. 이모티콘/스티커: 정방형(360×360px), 투명 배경 PNG. 배너: 가로 전체폭, 높이 120-160px, 브랜드 일러스트 선호.',
    accessibilityNotes: `최소 터치 영역 44×44px
포커스 링: 2px solid #FEE500, offset 2px
시각 장애: 채팅 메시지 순서 보장 (aria-live="polite")
이모티콘: alt text 또는 aria-label 필수
읽음 상태: "읽지 않은 사람 2명" 형태로 aria-label
색약: 노란색 외 상태 표시에 아이콘 병행 필수`,
  },
};
