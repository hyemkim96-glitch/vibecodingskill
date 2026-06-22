'use client';

import { useState } from 'react';
import ComponentSheet, { COMPONENT_CATEGORIES, ComponentCategory } from '@/components/ComponentSheet';
import PillTabs from '@/components/PillTabs';
import { allTokens } from '@/lib/tokens';
import { serviceDS } from '@/lib/tokens/serviceTheme';

const representative = allTokens[0];
const { Text, t } = serviceDS;

export default function ComponentsClient() {
  const [active, setActive] = useState<ComponentCategory>('buttons');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col" style={{ gap: t.space.xs }}>
        <Text role="caption" weight={t.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textSub }}>
          Components
        </Text>
        <Text role="caption" color={t.textMuted}>
          컴포넌트 유형별 와이어프레임 — 버튼·입력·카드·피드백·내비게이션을 한 시트에 나열
        </Text>
      </div>

      {/* Tab bar — shared PillTabs */}
      <PillTabs tabs={COMPONENT_CATEGORIES} active={active} onChange={setActive} />

      <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-graphite)' }}>
        <ComponentSheet token={representative} category={active} />
      </div>
    </div>
  );
}
