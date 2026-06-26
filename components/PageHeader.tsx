'use client';

import React from 'react';
import { serviceDS, serviceDarkDS } from '@/lib/tokens/serviceTheme';
import { useTheme } from './ThemeProvider';

/**
 * 모든 탭 페이지 공통 헤더 — eyebrow 타이틀 + 설명 바디.
 * 색·크기·굵기는 전부 Foundation 토큰(DS Text role)을 참조하며, 페이지마다
 * 제각각이던 설명글 컬러/사이즈를 한 곳에서 통일한다.
 */
export default function PageHeader({
  eyebrow,
  description,
  right,
}: {
  eyebrow: string;
  description?: React.ReactNode;
  right?: React.ReactNode;
}) {
  const { theme } = useTheme();
  const { Text, t } = theme === 'dark' ? serviceDarkDS : serviceDS;

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: t.space.lg }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.sm, maxWidth: 760 }}>
        <Text
          role="caption"
          weight={t.weightMedium}
          style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textSub }}
        >
          {eyebrow}
        </Text>
        {description != null && (
          <Text role="body" color={t.textSub} weight={t.weightMedium} style={{ lineHeight: 1.7 }}>
            {description}
          </Text>
        )}
      </div>
      {right}
    </div>
  );
}
