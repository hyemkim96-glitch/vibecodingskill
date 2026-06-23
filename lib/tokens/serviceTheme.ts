/**
 * Service-level theme singletons.
 *
 * The service chrome (Navigation, page layouts, Foundation/Components/Patterns
 * docs pages) needs a stable DS instance independent of any brand token.
 * Wireframe mode ignores brand colors entirely and maps to the service CSS
 * semantic variables (--color-ash / --color-bone / etc.) in globals.css.
 *
 * Use serviceTheme for web/desktop contexts, serviceMobileTheme for mobile
 * UI wireframes (Components, Patterns mobile toggle).
 */

import { designMDToken } from '@/lib/tokens/designMD';
import { resolveTheme } from '@/lib/tokens/resolveTheme';
import { createDS } from '@/components/ds';

export const serviceTheme       = resolveTheme(designMDToken, 'web',    'brand');
export const serviceMobileTheme = resolveTheme(designMDToken, 'mobile', 'brand');
export const serviceDS = createDS(serviceTheme);

// Dark-mode variants: wireframe mode uses WIREFRAME_DARK palette from semanticTokens
// so correct dark bg/surface/text values are applied without needing explicit
// dark hex values in the designMDToken colors array.
const designMDDarkToken = { ...designMDToken, theme: 'dark' as const };
export const serviceDarkTheme       = resolveTheme(designMDDarkToken, 'web',    'wireframe');
export const serviceDarkMobileTheme = resolveTheme(designMDDarkToken, 'mobile', 'wireframe');
export const serviceDarkDS = createDS(serviceDarkTheme);
