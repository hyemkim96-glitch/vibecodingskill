'use client';

import { useState } from 'react';
import ComponentSheet, { COMPONENT_CATEGORIES, ComponentCategory } from '@/components/ComponentSheet';
import { allTokens } from '@/lib/tokens';

const representative = allTokens[0];

export default function ComponentsClient() {
  const [active, setActive] = useState<ComponentCategory>('buttons');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--color-ash)' }}>
          Components
        </h1>
        <p className="text-xs" style={{ color: 'var(--color-ash)' }}>
          컴포넌트 유형별 와이어프레임 — 버튼·입력·카드·피드백·내비게이션을 한 시트에 나열
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid var(--color-graphite)' }}>
        {COMPONENT_CATEGORIES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className="shrink-0 text-xs px-4 py-2.5 cursor-pointer transition-colors"
            style={{
              color: active === key ? 'var(--color-bone)' : 'var(--color-ash)',
              fontWeight: active === key ? 600 : 400,
              marginBottom: -1,
              background: 'transparent',
              border: 'none',
              borderBottom: active === key
                ? '2px solid var(--color-bone)'
                : '2px solid transparent',
            } as React.CSSProperties}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-graphite)' }}>
        <ComponentSheet token={representative} category={active} />
      </div>
    </div>
  );
}
