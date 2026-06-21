import { BrandToken, BrandDeep } from '@/types/token';

const colors = [
  { name: 'Blue', value: '#246CF8', variable: '--color-blue', role: '주요 액션, CTA 버튼, 활성 상태' },
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
  tagline: '깔끔한 금융',
  category: '핀테크/금융',
  country: 'KR',
  serviceTypes: ['핀테크 앱', '모바일 퍼스트'],
  theme: 'light',
  description: '빠르고 자신감 있는 금융 인터페이스. 복잡한 금융을 단순하게 만드는 것이 핵심 디자인 철학. 여백을 넉넉하게 사용하고, 핵심 정보를 큰 숫자로 강조하며, 친근한 한국어 어투로 사용자와 대화한다.',
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
  deep: {
    interaction: {
      duration: '150ms (micro), 200ms (standard), 300ms (page transition)',
      easing: 'cubic-bezier(0.2, 0, 0, 1) — 빠른 가속 후 부드러운 감속',
      pressScale: 'scale(0.97) — 버튼 눌림 피드백',
      notes: '애니메이션은 목적이 있을 때만. 숫자 카운트업은 예외적으로 허용(잔액 표시). Spring physics 지양, CSS transition 선호.',
    },
    voice: {
      tone: '친근하지만 정확한 친구 — 전문 용어 없이, 오해 없이. 존댓말이되 딱딱하지 않게.',
      examples: [
        '"아직 내역이 없어요" (빈 상태)',
        '"잠깐, 확인이 필요해요" (에러)',
        '"보냈어요! 도착까지 1-2분이에요" (성공)',
        '"이번 달 xx원 썼어요" (지출 요약)',
        '"혹시 이 거래 맞나요?" (이상 거래 감지)',
      ],
      avoid: [
        '금융 전문 용어 — "지급 완료", "처리 중" 대신 "보냈어요", "확인 중이에요"',
        '수동태 — "결제가 완료되었습니다" 대신 "결제했어요"',
        '부정형 시작 — "잔액 부족으로 실패" 대신 "잔액이 xx원 부족해요"',
      ],
    },
    components: [
      {
        name: 'Primary Button',
        anatomy: '[아이콘?] + 텍스트 레이블',
        states: 'default → pressed(scale 0.97) → loading(spinner) → disabled(opacity 0.4)',
        spec: `height: 52px (mobile) / 48px (web)
border-radius: 8px
background: #246CF8
color: #FFFFFF
font: 600 17px/1 Pretendard
padding: 0 24px
min-width: 120px (web), 100% (mobile full-width CTA)
icon-gap: 6px
transition: transform 150ms cubic-bezier(0.2,0,0,1), background 150ms`,
      },
      {
        name: 'Secondary Button',
        anatomy: '[아이콘?] + 텍스트 레이블',
        states: 'default → hover(bg: #F2F4F6) → pressed(scale 0.97) → disabled(opacity 0.4)',
        spec: `height: 52px (mobile) / 48px (web)
border-radius: 8px
background: #F2F4F6
color: #191F28
font: 500 17px/1 Pretendard`,
      },
      {
        name: 'Text Button',
        anatomy: '텍스트 레이블 [→ 아이콘?]',
        states: 'default(color: #246CF8) → pressed(opacity 0.7)',
        spec: `height: auto (min touch 44px)
color: #246CF8
font: 500 15px/1 Pretendard
underline: none (hover 시에도 없음)
사용처: 보조 액션, "더보기", "자세히"`,
      },
      {
        name: 'Card',
        anatomy: '컨테이너 > [상단 컬러 바?] > 헤더 행 > 본문 > [하단 액션?]',
        spec: `border-radius: 12px (mobile) / 16px (web)
background: #FFFFFF
border: none (shadow 사용)
box-shadow: 0 2px 12px rgba(0,0,0,0.06)
padding: 20px
hover: box-shadow 0 4px 20px rgba(0,0,0,0.10), transform translateY(-2px)
transition: 200ms cubic-bezier(0.2,0,0,1)`,
      },
      {
        name: 'Input Field',
        anatomy: '레이블 > 입력창 > [보조 텍스트 | 에러 메시지]',
        states: 'default(border: #E5EAF0) → focus(border: #246CF8, shadow: 0 0 0 3px rgba(36,108,248,0.15)) → error(border: #F04452)',
        spec: `height: 52px
border-radius: 8px
border: 1px solid
padding: 0 16px
font: 400 17px Pretendard
label: 400 13px #4E5968, margin-bottom 6px
error-msg: 400 13px #F04452, margin-top 4px`,
      },
      {
        name: 'Bottom Sheet',
        anatomy: '딤 배경 > 시트 컨테이너 > 핸들 > 제목? > 콘텐츠 > 액션 버튼',
        spec: `border-radius: 20px 20px 0 0
handle: width 36px, height 4px, radius 2px, color #E5EAF0, margin 12px auto
background: #FFFFFF
padding: 0 20px 34px (safe area 포함)
title: 600 18px #191F28
진입: translateY(100%) → 0, 300ms spring(stiffness 300, damping 30)
딤: opacity 0 → 0.5, 200ms`,
      },
      {
        name: 'Toast / Snackbar',
        anatomy: '[아이콘] + 메시지 [+ 액션 텍스트?]',
        spec: `height: 52px
border-radius: 12px
background: #191F28
color: #FFFFFF
font: 400 15px
padding: 0 20px
위치: 하단에서 84px (탭바 위)
진입: translateY(20px) + opacity 0 → 0, 200ms
자동 닫힘: 2000ms
max-width: calc(100% - 40px)`,
      },
    ],
    breakpoints: [
      { name: 'Mobile S', value: '375px', behavior: '기준 디자인. 전체 폭 버튼, 단일 컬럼, 하단 탭바' },
      { name: 'Mobile L', value: '430px', behavior: '여백 24px로 증가. 레이아웃 동일' },
      { name: 'Tablet', value: '768px', behavior: '하단 탭바 → 사이드 내비. 콘텐츠 최대폭 600px 중앙 정렬' },
      { name: 'Desktop', value: '1200px', behavior: '2컬럼 레이아웃. 왼쪽 내비 220px + 콘텐츠 영역. 버튼 고정폭' },
    ],
    iconStyle: 'Line 스타일, 2px stroke, 24×24px 기준. 모서리 rounded. 채움(fill) 아이콘은 활성 탭/선택 상태에만. 커스텀 아이콘셋 사용 (Lucide 계열 영향 받음).',
    imageStyle: '인물 사진 없음. 추상적 일러스트레이션, 단색 또는 그라데이션. 실사 이미지는 서비스 썸네일(카드 안)에만. aspect-ratio: 16/9 또는 1/1.',
    accessibilityNotes: `최소 터치 영역 48×48px (WCAG 2.5.5)
포커스 링: 3px solid #246CF8, offset 2px
색맹 대응: 색상만으로 의미 전달 금지 — 아이콘 또는 텍스트 병기
에러 상태: aria-invalid="true" + aria-describedby 에러 메시지 ID
스크린리더: 금액 읽기 — "오만원" 아닌 "50,000원" 포맷으로 aria-label
모션 민감도: prefers-reduced-motion 시 모든 transition 비활성화`,
  },
};
