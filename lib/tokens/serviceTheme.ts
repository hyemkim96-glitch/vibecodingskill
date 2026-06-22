/**
 * Service-level theme singleton.
 *
 * The service chrome (Navigation, page layouts) needs a stable DS instance
 * independent of any brand token. We resolve the wireframe web theme from the
 * first available token — this always matches the service CSS variables
 * (--color-ash / --color-bone / etc.) that globals.css defines.
 */

import { allTokens } from '@/lib/tokens';
import { resolveTheme } from '@/lib/tokens/resolveTheme';
import { createDS } from '@/components/ds';

export const serviceTheme = resolveTheme(allTokens[0], 'web', 'wireframe');
export const serviceDS = createDS(serviceTheme);
