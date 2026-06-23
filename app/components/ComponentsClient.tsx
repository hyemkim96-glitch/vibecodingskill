'use client';

import { useState } from 'react';
import ComponentSheet, { COMPONENT_CATEGORIES, ComponentCategory } from '@/components/ComponentSheet';
import PillTabs from '@/components/PillTabs';
import { serviceDS, serviceMobileTheme } from '@/lib/tokens/serviceTheme';

const { Text, t } = serviceDS;

export default function ComponentsClient() {
  const [active, setActive] = useState<ComponentCategory>('buttons');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xl }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.sm }}>
        <Text role="caption" weight={t.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textSub }}>
          Components
        </Text>
        <Text role="caption" color={t.textMuted}>
          컴포넌트 유형별 와이어프레임 — 버튼·입력·카드·피드백·내비게이션을 한 시트에 나열
        </Text>
      </div>

      {/* Tab bar — shared PillTabs */}
      <PillTabs tabs={COMPONENT_CATEGORIES} active={active} onChange={setActive} />

      <div style={{ borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
        <ComponentSheet theme={serviceMobileTheme} category={active} />
      </div>
    </div>
  );
}
