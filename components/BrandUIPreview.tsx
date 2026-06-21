'use client';

import { BrandToken } from '@/types/token';
import { resolveTheme, ThemeMode } from '@/lib/tokens/resolveTheme';
import { createDS, motionVars } from '@/components/ds';
import { renderPattern, PatternType } from '@/components/patterns';
import { getServiceType, ServiceType } from '@/lib/serviceCategories';

/**
 * Brand Design — top of the dependency chain.
 *
 *     DS(컴포넌트) ← renderPattern(패턴) ← BrandUIPreview(브랜드)
 *
 * Maps each service type to its most representative pattern type, then renders
 * it with the brand's own resolved theme. Every visible difference — color,
 * radius, spacing rhythm, type scale, motion feel — flows from tokens alone.
 */

const SERVICE_TO_PATTERN: Record<ServiceType, PatternType> = {
  finance:   'history',  // 잔액+거래 내역이 핵심
  messaging: 'main',     // 채팅 목록 = 메인 화면
  delivery:  'list',     // 음식점 목록 = PLP
  search:    'search',   // 검색이 진입점
  commerce:  'list',     // 상품 목록 = PLP
  local:     'list',     // 중고 목록 = PLP
};

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
  const patternType = SERVICE_TO_PATTERN[service];

  // Override DS theme's isMobile so patterns can branch on it
  ds.t = { ...ds.t, isMobile: platform === 'mobile' };

  return (
    <div className="ds-root" style={motionVars(theme)}>
      {renderPattern(patternType, ds, platform)}
    </div>
  );
}
