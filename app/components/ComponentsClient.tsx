'use client';

import { useState } from 'react';
import ComponentSheet, { COMPONENT_CATEGORIES, ComponentCategory } from '@/components/ComponentSheet';
import PillTabs from '@/components/PillTabs';
import PageHeader from '@/components/PageHeader';
import { useTheme } from '@/components/ThemeProvider';
import { serviceDS, serviceMobileTheme, serviceDarkDS, serviceDarkMobileTheme } from '@/lib/tokens/serviceTheme';

export default function ComponentsClient() {
  const [active, setActive] = useState<ComponentCategory>('buttons');
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const { t } = dark ? serviceDarkDS : serviceDS;
  const sheetTheme = dark ? serviceDarkMobileTheme : serviceMobileTheme;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xl }}>
      <PageHeader
        eyebrow="Components"
        description="컴포넌트 유형별 와이어프레임 — 버튼·입력·카드·피드백·내비게이션을 한 시트에 나열"
      />

      <PillTabs tabs={COMPONENT_CATEGORIES} active={active} onChange={setActive} />

      <div style={{ borderRadius: t.radius.card, overflow: 'hidden', border: `1px solid ${t.border}` }}>
        <ComponentSheet theme={sheetTheme} category={active} />
      </div>
    </div>
  );
}
