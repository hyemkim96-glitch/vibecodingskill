'use client';

import { useState } from 'react';
import ComponentSheet, { COMPONENT_CATEGORIES, ComponentCategory } from '@/components/ComponentSheet';
import PillTabs from '@/components/PillTabs';
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

      {/* Tab bar — shared PillTabs */}
      <PillTabs tabs={COMPONENT_CATEGORIES} active={active} onChange={setActive} />

      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-graphite)' }}>
        <ComponentSheet token={representative} category={active} />
      </div>
    </div>
  );
}
