'use client';

import { useState } from 'react';
import { createDS, motionVars } from '@/components/ds';
import { renderPattern, PATTERN_TYPES, PatternType } from '@/components/patterns';
import PillTabs from '@/components/PillTabs';
import { serviceDS, serviceTheme, serviceMobileTheme } from '@/lib/tokens/serviceTheme';

const { Text, t: st } = serviceDS;

export default function PatternsClient() {
  const [activePattern, setActivePattern] = useState<PatternType>('main');
  const [platform, setPlatform] = useState<'mobile' | 'web'>('mobile');

  const theme = platform === 'mobile' ? serviceMobileTheme : serviceTheme;
  const ds = createDS(theme, true);

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
        {/* 플랫폼 토글 */}
        <div style={{ display: 'flex', flexShrink: 0, gap: st.space.sm }}>
          {(['mobile', 'web'] as const).map((p) => (
            <button key={p} onClick={() => setPlatform(p)} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <ds.Chip active={platform === p}>{p === 'mobile' ? '모바일' : '웹'}</ds.Chip>
            </button>
          ))}
        </div>
      </div>

      <PillTabs tabs={PATTERN_TYPES} active={activePattern} onChange={setActivePattern} />

      {/* 패턴 렌더 */}
      <div style={{
        borderRadius: st.radius.card,
        overflow: 'hidden',
        border: `1px solid ${st.border}`,
        maxWidth: platform === 'mobile' ? 390 : '100%',
      }}>
        <div className="ds-root" style={motionVars(theme)}>
          {renderPattern(activePattern, ds, platform)}
        </div>
      </div>
    </div>
  );
}
