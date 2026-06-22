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
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--color-ash)' }}>
            UI Patterns
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-ash)' }}>
            {PATTERN_TYPES.find((p) => p.key === activePattern)?.desc}
          </p>
        </div>
        {/* 플랫폼 토글 */}
        <div className="flex gap-1 shrink-0">
          {(['mobile', 'web'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className="text-xs px-3 py-1.5 rounded-md transition-all cursor-pointer"
              style={{
                background: platform === p ? 'var(--color-bone)' : 'transparent',
                color: platform === p ? 'var(--color-void)' : 'var(--color-ash)',
                border: '1px solid var(--color-graphite)',
              }}
            >
              {p === 'mobile' ? '모바일' : '웹'}
            </button>
          ))}
        </div>
      </div>

      {/* 패턴 탭 바 — shared PillTabs */}
      <PillTabs tabs={PATTERN_TYPES} active={activePattern} onChange={setActivePattern} />

      {/* 패턴 렌더 */}
      <div
        className="rounded-lg overflow-hidden"
        style={{
          border: '1px solid var(--color-graphite)',
          maxWidth: platform === 'mobile' ? 390 : '100%',
        }}
      >
        <div className="ds-root" style={motionVars(theme)}>
          {renderPattern(activePattern, ds, platform)}
        </div>
      </div>
    </div>
  );
}
