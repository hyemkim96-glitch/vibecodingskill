'use client';

import React from 'react';

/**
 * PillTabs — 서비스 레벨 표준 필터/카테고리 탭 컨트롤.
 *
 * 페이지 하위 카테고리(같은 레벨의 필터 탭)는 반드시 이 컴포넌트를 사용한다.
 * 페이지마다 인라인으로 다르게 구현하면 같은 레벨 UI가 다르게 보이므로,
 * 단일 소스(이 컴포넌트)로 통일한다.
 *
 * 활성 상태 = filled(채움), 비활성 = outline. 서비스 토큰(--color-*)만 사용.
 */

export interface PillTab<T extends string> {
  key: T;
  label: string;
}

export default function PillTabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: PillTab<T>[];
  active: T;
  onChange: (key: T) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto flex-wrap" role="tablist">
      {tabs.map(({ key, label }) => {
        const on = key === active;
        return (
          <button
            key={key}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(key)}
            className="shrink-0 inline-flex items-center justify-center text-xs rounded-full cursor-pointer transition-all"
            style={{
              lineHeight: 1,
              paddingTop: 11,
              paddingBottom: 9,
              paddingLeft: 22,
              paddingRight: 22,
              color: on ? 'var(--color-void)' : 'var(--color-ash)',
              fontWeight: on ? 600 : 400,
              background: on ? 'var(--color-bone)' : 'transparent',
              border: '1px solid',
              borderColor: on ? 'var(--color-bone)' : 'var(--color-graphite)',
              letterSpacing: '0.01em',
            } as React.CSSProperties}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
