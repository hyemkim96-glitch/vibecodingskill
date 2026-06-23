import { BrandToken } from '@/types/token';

/**
 * Design MD service token.
 *
 * Used as the base theme for Foundation / Components / Patterns pages.
 * Neutral-first design: primary = near-black, no brand hue, Pretendard font,
 * 4px spacing grid, 10px radius — exactly matching globals.css.
 */
export const designMDToken: BrandToken = {
  slug: 'design-md',
  name: 'Design MD',
  tagline: 'Design MD',
  category: '개발자 도구',
  country: 'KR',
  serviceTypes: ['디자인 도구', '개발자 도구'],
  theme: 'light',
  description: 'AI 빌더를 위한 브랜드 디자인 토큰 서비스',
  colors: [
    { name: '기본',       value: '#18181b', variable: '--color-primary',     role: 'Primary' },
    { name: '기본 배경',  value: '#ffffff', variable: '--color-bg',           role: '기본 배경' },
    { name: '카드 배경',  value: '#ffffff', variable: '--color-surface',      role: '카드 배경' },
    { name: '보조 배경',  value: '#fafafa', variable: '--color-surface-alt',  role: '보조 배경' },
    { name: '본문 텍스트',value: '#09090b', variable: '--color-text',         role: '본문 텍스트' },
    { name: '보조 텍스트',value: '#52525b', variable: '--color-text-sub',     role: '보조 텍스트' },
    { name: '구분선',     value: '#e4e4e7', variable: '--color-border',       role: '구분선' },
  ],
  platforms: {
    mobile: {
      spacing: {
        baseUnit: '4px',
        density: 'regular',
        scale: [
          { name: 'xxs', value: '2px',  token: '--spacing-xxs' },
          { name: 'xs',  value: '4px',  token: '--spacing-xs'  },
          { name: 'sm',  value: '8px',  token: '--spacing-sm'  },
          { name: 'md',  value: '12px', token: '--spacing-md'  },
          { name: 'lg',  value: '16px', token: '--spacing-lg'  },
          { name: 'xl',  value: '24px', token: '--spacing-xl'  },
        ],
      },
      shapes: [
        { element: 'button', value: '10px'   },
        { element: 'card',   value: '10px'   },
        { element: 'input',  value: '10px'   },
        { element: 'chip',   value: '9999px' },
        { element: 'badge',  value: '4px'    },
      ],
      layout: { maxWidth: '390px', sectionGap: '24px', touchTarget: '44px' },
      typography: {
        family: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        substitute: 'system-ui',
        weights: [400, 600, 700],
        sizes: [
          { role: 'display',   size: '36px', lineHeight: '1.25', letterSpacing: '-0.04em'  },
          { role: 'Heading 1', size: '26px', lineHeight: '1.35', letterSpacing: '-0.025em' },
          { role: 'Heading 2', size: '20px', lineHeight: '1.40', letterSpacing: '-0.015em' },
          { role: 'Body 1',    size: '16px', lineHeight: '1.65', letterSpacing: '-0.01em'  },
          { role: 'Body 2',    size: '14px', lineHeight: '1.60', letterSpacing: '-0.005em' },
          { role: 'caption',   size: '12px', lineHeight: '1.50', letterSpacing: '0em'      },
        ],
      },
    },
    web: {
      spacing: {
        baseUnit: '4px',
        density: 'regular',
        scale: [
          { name: 'xxs', value: '2px',  token: '--spacing-xxs' },
          { name: 'xs',  value: '4px',  token: '--spacing-xs'  },
          { name: 'sm',  value: '8px',  token: '--spacing-sm'  },
          { name: 'md',  value: '12px', token: '--spacing-md'  },
          { name: 'lg',  value: '16px', token: '--spacing-lg'  },
          { name: 'xl',  value: '24px', token: '--spacing-xl'  },
        ],
      },
      shapes: [
        { element: 'button', value: '10px'   },
        { element: 'card',   value: '10px'   },
        { element: 'input',  value: '10px'   },
        { element: 'chip',   value: '9999px' },
        { element: 'badge',  value: '4px'    },
      ],
      layout: { maxWidth: '1280px', sectionGap: '32px', columns: '12' },
      typography: {
        family: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        substitute: 'system-ui',
        weights: [400, 600, 700],
        sizes: [
          { role: 'display',   size: '36px', lineHeight: '1.25', letterSpacing: '-0.04em'  },
          { role: 'Heading 1', size: '26px', lineHeight: '1.35', letterSpacing: '-0.025em' },
          { role: 'Heading 2', size: '20px', lineHeight: '1.40', letterSpacing: '-0.015em' },
          { role: 'Body 1',    size: '16px', lineHeight: '1.65', letterSpacing: '-0.01em'  },
          { role: 'Body 2',    size: '14px', lineHeight: '1.60', letterSpacing: '-0.005em' },
          { role: 'caption',   size: '12px', lineHeight: '1.50', letterSpacing: '0em'      },
        ],
      },
    },
  },
  guidelines: { dos: [], donts: [] },
  updatedAt: '2026-06',
};
