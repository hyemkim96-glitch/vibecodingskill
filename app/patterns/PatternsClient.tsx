'use client';

import { useState } from 'react';
import BrandUIPreview from '@/components/BrandUIPreview';
import { getCategoryGroups } from '@/lib/serviceCategories';

export default function PatternsClient() {
  const groups = getCategoryGroups();
  const [platform, setPlatform] = useState<'mobile' | 'web'>('mobile');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--color-ash)' }}>
            UI Patterns
          </h1>
          <p className="text-xs" style={{ color: 'var(--color-ash)' }}>
            서비스 유형별 대표 화면 패턴 — 토큰(여백·타입·radii·밀도) 기반 와이어프레임
          </p>
        </div>
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

      <div className="flex flex-col gap-10">
        {groups.map(({ category, representative }) => (
          <section key={category.key} className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-bone)' }}>
                {category.label}
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-ash)' }}>
                {category.description}
              </p>
            </div>
            <div
              className="rounded-lg overflow-hidden self-start w-full"
              style={{
                border: '1px solid var(--color-graphite)',
                maxWidth: platform === 'mobile' ? 390 : '100%',
              }}
            >
              <BrandUIPreview token={representative} platform={platform} mode="wireframe" />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
