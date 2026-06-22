'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ResolvedTheme, ResolvedType } from '@/lib/tokens/resolveTheme';
import { Icon as IconBase, IconName } from '@/components/icons';

/**
 * Design System — Component layer (the atoms).
 *
 * `createDS(theme)` returns a set of themed primitives (Button, Input, Card,
 * Badge, Chip, …) derived entirely from a ResolvedTheme. This is the single
 * source of truth for components: both the Components gallery and the Pattern
 * compositions are built from these, so the dependency runs
 *
 *     컴포넌트(DS) ← 패턴(patterns) ← 브랜드 디자인(BrandUIPreview)
 *
 * Every dimension (spacing, type, radius), color and the motion feel
 * (duration / easing / press·hover scale) comes from the brand's tokens.
 */

export function typeStyle(t: ResolvedType): React.CSSProperties {
  return {
    fontSize: t.size,
    lineHeight: t.lineHeight,
    letterSpacing: t.letterSpacing,
    fontWeight: t.weight,
  };
}

/** CSS custom properties that drive the shared .ds-* motion classes. */
export function motionVars(t: ResolvedTheme): React.CSSProperties {
  return {
    ['--ds-dur' as string]: `${t.motion.duration}ms`,
    ['--ds-ease' as string]: t.motion.easing,
    ['--ds-press' as string]: String(t.motion.pressScale),
    ['--ds-hover' as string]: String(t.motion.hoverScale),
  };
}

export interface DS {
  t: ResolvedTheme; // mutable — callers may override (e.g. isMobile)
  Text: React.FC<{
    role?: keyof ResolvedTheme['type'];
    color?: string;
    weight?: number;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }>;
  Button: React.FC<{
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    disabled?: boolean;
    full?: boolean;
    size?: 'sm' | 'md';
  }>;
  Card: React.FC<{
    children: React.ReactNode;
    pad?: boolean;
    interactive?: boolean;
    style?: React.CSSProperties;
    className?: string;
  }>;
  Input: React.FC<{ label?: string; placeholder: string; focus?: boolean }>;
  Badge: React.FC<{
    children: React.ReactNode;
    tone?: 'solid' | 'soft' | 'accent' | 'muted';
  }>;
  Chip: React.FC<{ children: React.ReactNode; active?: boolean }>;
  ListRow: React.FC<{
    children: React.ReactNode;
    divider?: boolean;
    style?: React.CSSProperties;
  }>;
  Thumb: React.FC<{ h: number; w?: number; style?: React.CSSProperties }>;
  Avatar: React.FC<{ size?: number }>;
  Icon: React.FC<{ name: IconName; size?: number; color?: string }>;
}

export function createDS(t: ResolvedTheme, wireframe = false): DS {
  const { space } = t;

  const Text: DS['Text'] = ({ role = 'body', color, weight, children, className = '', style = {} }) => (
    <span
      className={className}
      style={{
        ...typeStyle(t.type[role]),
        ...(weight ? { fontWeight: weight } : {}),
        color: color ?? t.textMain,
        ...style,
      }}
    >
      {children}
    </span>
  );

  const Button: DS['Button'] = ({ children, variant = 'primary', disabled = false, full = false, size = 'md' }) => (
    <button
      disabled={disabled}
      className={cn(
        'ds-press inline-flex items-center justify-center select-none cursor-pointer',
        full && 'w-full',
        disabled && 'opacity-40 pointer-events-none',
      )}
      style={{
        ...typeStyle(t.type[size === 'sm' ? 'caption' : 'bodySm']),
        fontWeight: t.weightBold,
        borderRadius: t.radius.button,
        background:
          variant === 'primary' ? t.primary : variant === 'secondary' ? t.surface : 'transparent',
        color:
          variant === 'primary' ? t.onPrimary : variant === 'outline' ? t.primary : t.textMain,
        border:
          variant === 'outline'
            ? `1px solid ${t.primary}`
            : variant === 'secondary'
              ? `1px solid ${t.border}`
              : 'none',
        padding: size === 'sm' ? `${space.xs}px ${space.md}px` : `${space.sm}px ${space.lg}px`,
      }}
    >
      {children}
    </button>
  );

  const Card: DS['Card'] = ({ children, pad = true, interactive = true, style = {}, className = '' }) => (
    <div
      className={cn('overflow-hidden', interactive && 'ds-hover cursor-pointer', className)}
      style={{
        background: t.surface,
        borderRadius: t.radius.card,
        border: `1px solid ${t.border}`,
        padding: pad ? t.cardPad : 0,
        ...style,
      }}
    >
      {children}
    </div>
  );

  const Input: DS['Input'] = ({ label, placeholder, focus = false }) => (
    <div className="flex flex-col" style={{ gap: space.xs }}>
      {label && (
        <span style={{ ...typeStyle(t.type.caption), color: t.textMain, fontWeight: t.weightMedium }}>
          {label}
        </span>
      )}
      <div
        className="ds-press"
        style={{
          border: focus ? `2px solid ${t.primary}` : `1px solid ${t.border}`,
          borderRadius: t.radius.input,
          padding: `${space.sm}px ${space.md}px`,
          background: t.bg,
          boxShadow: focus ? `0 0 0 3px ${t.primaryTint}` : 'none',
        }}
      >
        <span style={{ ...typeStyle(t.type.bodySm), color: focus ? t.textMain : t.textMuted }}>
          {placeholder}
        </span>
      </div>
    </div>
  );

  const Badge: DS['Badge'] = ({ children, tone = 'solid' }) => {
    const byTone: Record<string, { bg: string; fg: string; bd: string }> = {
      solid: { bg: t.primary, fg: t.onPrimary, bd: 'none' },
      soft: { bg: t.primaryTint, fg: t.primary, bd: 'none' },
      accent: { bg: t.accent, fg: t.onPrimary, bd: 'none' },
      muted: { bg: t.surface, fg: t.textSub, bd: `1px solid ${t.border}` },
    };
    const s = byTone[tone];
    return (
      <span
        className="inline-flex items-center"
        style={{
          fontSize: Math.max(10, t.type.caption.size - 1),
          lineHeight: 1,
          fontWeight: t.weightBold,
          // optical centering: Korean glyphs sit high in the line box, so add
          // extra top padding to push text down to the visual center
          padding: `5px ${space.xs + 3}px 3px`,
          borderRadius: t.radius.badge,
          background: s.bg,
          color: s.fg,
          border: s.bd,
        }}
      >
        {children}
      </span>
    );
  };

  const Chip: DS['Chip'] = ({ children, active = false }) => (
    <span
      className="ds-press inline-flex items-center cursor-pointer whitespace-nowrap"
      style={{
        ...typeStyle(t.type.caption),
        lineHeight: 1,
        fontWeight: t.weightMedium,
        // optical centering (see Badge): nudge glyph down
        paddingTop: space.xs + 2,
        paddingBottom: space.xs,
        paddingLeft: space.md,
        paddingRight: space.md,
        borderRadius: t.radius.chip,
        background: active ? t.primary : t.surface,
        color: active ? t.onPrimary : t.textSub,
        border: active ? 'none' : `1px solid ${t.border}`,
      }}
    >
      {children}
    </span>
  );

  const ListRow: DS['ListRow'] = ({ children, divider = false, style = {} }) => (
    <div
      className="ds-press flex items-center justify-between rounded-md cursor-pointer hover:bg-black/[0.03]"
      style={{
        paddingTop: space.sm,
        paddingBottom: space.sm,
        borderBottom: divider ? `1px solid ${t.border}` : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  );

  const Thumb: DS['Thumb'] = ({ h, w, style = {} }) => (
    <div
      style={{
        height: h,
        width: w,
        background: wireframe
          ? `repeating-linear-gradient(135deg, ${t.surfaceAlt}, ${t.surfaceAlt} 6px, ${t.surface} 6px, ${t.surface} 12px)`
          : t.surfaceAlt,
        ...style,
      }}
    />
  );

  const Avatar: DS['Avatar'] = ({ size = 40 }) => (
    <div className="shrink-0" style={{ width: size, height: size, borderRadius: '9999px', background: t.surfaceAlt }} />
  );

  const iconStyle = t.iconStyle;
  const Icon: DS['Icon'] = ({ name, size = 16, color = 'currentColor' }) => (
    <IconBase name={name} size={size} color={color} style={iconStyle} />
  );

  return { t, Text, Button, Card, Input, Badge, Chip, ListRow, Thumb, Avatar, Icon };
}
