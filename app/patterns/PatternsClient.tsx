'use client';

import { useState } from 'react';
import { allTokens } from '@/lib/tokens';
import { resolveTheme } from '@/lib/tokens/resolveTheme';
import { createDS, motionVars } from '@/components/ds';
import { renderPattern, PATTERN_TYPES, PatternType } from '@/components/patterns';
import PillTabs from '@/components/PillTabs';

const representative = allTokens[0];

export default function PatternsClient() {
  const [activePattern, setActivePattern] = useState<PatternType>('main');
  const [platform, setPlatform] = useState<'mobile' | 'web'>('mobile');

  const theme = resolveTheme(representative, platform, 'wireframe');
  const ds = createDS(theme, true);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space.xl }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: theme.space.lg }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: theme.space.sm }}>
          <ds.Text role="caption" weight={theme.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: theme.textSub }}>
            UI Patterns
          </ds.Text>
          <ds.Text role="caption" color={theme.textMuted}>
            {PATTERN_TYPES.find((p) => p.key === activePattern)?.desc}
          </ds.Text>
        </div>
        {/* 플랫폼 토글 */}
        <div style={{ display: 'flex', flexShrink: 0, gap: theme.space.sm }}>
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
        borderRadius: theme.radius.card,
        overflow: 'hidden',
        border: `1px solid ${theme.border}`,
        maxWidth: platform === 'mobile' ? 390 : '100%',
      }}>
        <div className="ds-root" style={motionVars(theme)}>
          {renderPattern(activePattern, ds, platform)}
        </div>
      </div>
    </div>
  );
}
