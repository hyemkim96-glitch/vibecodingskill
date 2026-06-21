'use client';

import React from 'react';
import { BrandToken } from '@/types/token';
import { resolveTheme, ThemeMode } from '@/lib/tokens/resolveTheme';
import { createDS, motionVars } from '@/components/ds';
import { renderPattern } from '@/components/patterns';
import { getServiceType } from '@/lib/serviceCategories';

/**
 * Brand Design — the top of the dependency chain.
 *
 *     컴포넌트(DS) ← 패턴(renderPattern) ← 브랜드 디자인(this)
 *
 * A brand's preview is simply: resolve the brand's tokens into a theme, build
 * the DS primitives from it, then render the pattern for the brand's service
 * type. Nothing here is brand-specific markup — every visible difference
 * (color, radius, spacing rhythm, type scale, motion feel) flows from tokens.
 */
export default function BrandUIPreview({
  token,
  platform,
  mode = 'brand',
}: {
  token: BrandToken;
  platform: 'mobile' | 'web';
  mode?: ThemeMode;
}) {
  const theme = resolveTheme(token, platform, mode);
  const ds = createDS(theme, mode === 'wireframe');
  const service = getServiceType(token);

  return (
    <div className="ds-root" style={motionVars(theme)}>
      {renderPattern(service, ds, platform)}
    </div>
  );
}
