/**
 * @designmd/tokens — Package barrel export
 * OKLCH-based semantic color system with light/dark mode
 */

export * from './palette';
export * from './semanticTokens';
export * from './colorAutomation';
export * from './resolveTheme';
export * from './generate';

// Re-export allTokens from the existing index
export { allTokens, getTokenBySlug } from './index';

export const VERSION = '0.1.0';
