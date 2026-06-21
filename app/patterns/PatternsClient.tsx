'use client';

import { BrandToken } from '@/types/token';
import BrandUIPreview from '@/components/BrandUIPreview';

const PATTERN_TYPES = ['전체', '핀테크/금융', '플랫폼', '커머스', '지역/커뮤니티', '패션/라이프스타일'] as const;

export default function PatternsClient({ tokens }: { tokens: BrandToken[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--color-ash)' }}>
          UI Patterns
        </h1>
        <p className="text-xs" style={{ color: 'var(--color-ash)' }}>
          각 브랜드 디자인 토큰으로 렌더링된 대표 UI 패턴 — 모바일 기준
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
        {tokens.map((token) => (
          <div key={token.slug} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium tracking-wider uppercase" style={{ color: 'var(--color-bone)' }}>
                {token.tagline}
              </span>
              <span className="text-xs" style={{ color: 'var(--color-ash)' }}>
                {token.category}
              </span>
            </div>
            <div
              className="rounded-lg overflow-hidden"
              style={{ border: '1px solid var(--color-graphite)' }}
            >
              <BrandUIPreview token={token} platform="mobile" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
