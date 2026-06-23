'use client';

import { useTheme } from './ThemeProvider';

export function DarkModeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      style={{
        width: 32,
        height: 32,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        border: '1px solid var(--color-border-normal)',
        background: 'transparent',
        color: 'var(--color-text-normal)',
        cursor: 'pointer',
        fontSize: 14,
        lineHeight: 1,
        flexShrink: 0,
        transition: 'background 150ms, border-color 150ms',
      }}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
