'use client';

import { useState } from 'react';
import { createDS, motionVars, typeStyle } from '@/components/ds';
import { renderPattern, PATTERN_TYPES, PATTERN_VARIANTS, PatternType } from '@/components/patterns';
import { defaultPack } from '@/lib/content/packs';
import PillTabs from '@/components/PillTabs';
import { useTheme } from '@/components/ThemeProvider';
import { serviceDS, serviceMobileTheme, serviceDarkDS, serviceDarkMobileTheme } from '@/lib/tokens/serviceTheme';

export default function PatternsClient() {
  const [activePattern, setActivePattern] = useState<PatternType>('main');
  const { theme: appTheme } = useTheme();
  const dark = appTheme === 'dark';
  const { Text, t: st } = dark ? serviceDarkDS : serviceDS;

  const theme = dark ? serviceDarkMobileTheme : serviceMobileTheme;
  const ds = createDS(theme, true);

  const variants = PATTERN_VARIANTS[activePattern];
  const cols = variants.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: st.space.xl }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: st.space.lg }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: st.space.sm }}>
          <Text role="caption" weight={st.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: st.textSub }}>
            UI Patterns
          </Text>
          <Text role="caption" color={st.textMuted}>
            {PATTERN_TYPES.find((p) => p.key === activePattern)?.desc}
          </Text>
        </div>
      </div>

      <PillTabs tabs={PATTERN_TYPES} active={activePattern} onChange={setActivePattern} />

      {/* 변형 벤토 그리드 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: st.space.lg,
        alignItems: 'start',
      }}>
        {variants.map((v) => (
          <div key={v.key} style={{ display: 'flex', flexDirection: 'column', gap: st.space.sm }}>
            <span style={{
              ...typeStyle(st.type.caption),
              fontWeight: st.weightBold,
              color: st.textSub,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              {v.label}
            </span>
            <div style={{
              borderRadius: st.radius.card,
              overflow: 'hidden',
              border: `1px solid ${st.border}`,
            }}>
              <div className="ds-root" style={motionVars(theme)}>
                {renderPattern(activePattern, ds, 'mobile', defaultPack, v.key)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
