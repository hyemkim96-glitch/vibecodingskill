'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ResolvedTheme, ResolvedType, ensureContrast, contrastOn } from '@/lib/tokens/resolveTheme';
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
    size?: 'sm' | 'md' | 'lg';
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
  NavTab: React.FC<{ children: React.ReactNode; active?: boolean }>;
  Stepper: React.FC<{ value?: number; min?: number; max?: number }>;
  Rating: React.FC<{ value?: number; max?: number; size?: number }>;
  ListRow: React.FC<{
    children: React.ReactNode;
    divider?: boolean;
    style?: React.CSSProperties;
  }>;
  Thumb: React.FC<{ h: number; w?: number; style?: React.CSSProperties }>;
  Avatar: React.FC<{ size?: number }>;
  Icon: React.FC<{ name: IconName; size?: number; color?: string }>;
  Checkbox: React.FC<{ checked?: boolean; label?: string; indeterminate?: boolean; disabled?: boolean }>;
  Switch: React.FC<{ on?: boolean; disabled?: boolean; label?: string }>;
  Radio: React.FC<{ checked?: boolean; label?: string; disabled?: boolean }>;
  Textarea: React.FC<{ label?: string; placeholder: string; rows?: number; focus?: boolean }>;
  Select: React.FC<{ label?: string; placeholder: string; value?: string; disabled?: boolean }>;
  Divider: React.FC<{ label?: string; vertical?: boolean; style?: React.CSSProperties }>;
  Skeleton: React.FC<{ w?: number | string; h?: number; radius?: number | string; style?: React.CSSProperties }>;
  Progress: React.FC<{ value?: number; max?: number; tone?: 'primary' | 'success' | 'danger'; label?: string }>;
  TopBar: React.FC<{
    title?: string;
    back?: boolean;
    actions?: Array<{ icon: IconName; label?: string }>;
    transparent?: boolean;
    style?: React.CSSProperties;
  }>;
  Table: React.FC<{
    headers?: string[];
    rows: Array<{ label: string; value: React.ReactNode; tone?: 'default' | 'danger' | 'success' | 'muted' }>;
    footer?: { label: string; value: React.ReactNode };
    style?: React.CSSProperties;
  }>;
  Toast: React.FC<{
    message: string;
    tone?: 'default' | 'success' | 'danger' | 'warning' | 'info';
    action?: string;
    style?: React.CSSProperties;
  }>;
  TokenCard: React.FC<{
    name: string;
    value: string;
    desc?: string;
    swatch?: string;
    style?: React.CSSProperties;
  }>;

  // ── signature primitives (brand-distinctive, theme-driven) ──
  StatusTracker: React.FC<{ steps: string[]; current?: number; style?: React.CSSProperties }>;
  BalanceCard: React.FC<{ label: string; value: string; delta?: string; actions?: string[]; style?: React.CSSProperties }>;
  GaugeMeter: React.FC<{ label: string; value: string; ratio?: number; caption?: string; style?: React.CSSProperties }>;
  RankingList: React.FC<{ items: Array<{ title: string; sub?: string; delta?: 'up' | 'down' | 'same' }>; style?: React.CSSProperties }>;
  SaveCollect: React.FC<{ count?: number; saved?: boolean; tag?: string; h?: number; style?: React.CSSProperties }>;
  EditorialCard: React.FC<{ title: string; sub?: string; tag?: string; h?: number; style?: React.CSSProperties }>;
  ChatList: React.FC<{ messages: Array<{ text: string; me?: boolean; time?: string }>; style?: React.CSSProperties }>;
  ComingSoon: React.FC<{ title?: string; sub?: string; style?: React.CSSProperties }>;
  AspectRatio: React.FC<{ ratio?: number; label?: string; children?: React.ReactNode; style?: React.CSSProperties }>;
  Carousel: React.FC<{ items: Array<{ label: string; sub?: string; h?: number }>; style?: React.CSSProperties }>;
  ContextMenu: React.FC<{ items: Array<{ icon?: IconName; label: string; danger?: boolean; divider?: boolean }>; style?: React.CSSProperties }>;
  Dialogue: React.FC<{ title: string; body?: string; actions?: string[]; style?: React.CSSProperties }>;
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
        wordBreak: 'keep-all',
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
        ...typeStyle(t.type[size === 'sm' ? 'caption' : size === 'lg' ? 'body' : 'bodySm']),
        fontWeight: t.weightBold,
        borderRadius: t.radius.button,
        background:
          variant === 'primary' ? t.primary
          : variant === 'ghost' ? 'transparent'
          : t.surface,
        color:
          variant === 'primary' ? t.onPrimary : variant === 'outline' ? ensureContrast(t.primary, t.surface) : t.textMain,
        border:
          variant === 'outline'
            ? `1px solid ${t.primary}`
            : variant === 'secondary'
              ? `1px solid ${t.border}`
              : 'none',
        padding: size === 'sm' ? `${space.xs}px ${space.md}px` : size === 'lg' ? `${space.md}px ${space.xl}px` : `${space.sm}px ${space.lg}px`,
      }}
    >
      {children}
    </button>
  );

  const Card: DS['Card'] = ({ children, pad = true, interactive = true, style = {}, className = '' }) => (
    <div
      className={cn('overflow-hidden', interactive && 'ds-hover cursor-pointer', className)}
      style={{
        background: t.bg,
        borderRadius: t.radius.card,
        boxShadow: `0 0 0 1px ${t.border}`,
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
      soft: { bg: t.primaryTint, fg: ensureContrast(t.primary, t.primaryTint), bd: 'none' },
      accent: { bg: t.accent, fg: contrastOn(t.accent), bd: 'none' },
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

  const NavTab: DS['NavTab'] = ({ children, active = false }) => (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        ...typeStyle(t.type.bodySm),
        fontWeight: active ? t.weightBold : t.weightRegular,
        color: active ? t.textMain : t.textMuted,
        paddingTop: space.sm + 1,
        paddingBottom: space.sm - 1,
        paddingLeft: space.md,
        paddingRight: space.md,
        borderBottom: active ? `2px solid ${t.primary}` : '2px solid transparent',
        whiteSpace: 'nowrap' as const,
        cursor: 'pointer',
        transition: 'color 0.15s, border-color 0.15s',
      }}
    >
      {children}
    </span>
  );

  const Stepper: DS['Stepper'] = ({ value = 1, min = 0, max = 99 }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', border: `1px solid ${t.border}`, borderRadius: t.radius.button, overflow: 'hidden' }}>
      <button
        className="ds-press"
        disabled={value <= min}
        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: value <= min ? 'not-allowed' : 'pointer', color: value <= min ? t.textDisabled : t.textMain, fontSize: 18, fontWeight: t.weightBold }}
      >−</button>
      <span style={{ minWidth: 36, textAlign: 'center', ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, color: t.textMain, borderLeft: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}`, padding: `0 ${space.xs}px`, lineHeight: '36px' }}>{value}</span>
      <button
        className="ds-press"
        disabled={value >= max}
        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: value >= max ? 'not-allowed' : 'pointer', color: value >= max ? t.textDisabled : t.textMain, fontSize: 18, fontWeight: t.weightBold }}
      >+</button>
    </div>
  );

  // Rating stars adopt the brand's primary colour so the component reads as
  // part of the active theme rather than a fixed amber. Never a hardcoded hex.
  const Rating: DS['Rating'] = ({ value = 4, max = 5, size = 16 }) => {
    const star = t.primary;
    const gid = React.useId();
    return (
    // min size hugs the stars; max size fills the container and wraps instead
    // of overflowing when the column is too narrow for the full row.
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2, maxWidth: '100%', minWidth: 0 }}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value);
        const half = !filled && i < value;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 16 16" fill={filled ? star : half ? `url(#${gid})` : 'none'} stroke={filled || half ? star : t.border} strokeWidth="1.5">
            {half && (
              <defs>
                <linearGradient id={gid} x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor={star} />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
            <polygon points="8,1.5 10.1,5.8 14.9,6.5 11.4,9.9 12.2,14.7 8,12.5 3.8,14.7 4.6,9.9 1.1,6.5 5.9,5.8" />
          </svg>
        );
      })}
    </div>
    );
  };

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

  const Checkbox: DS['Checkbox'] = ({ checked = false, label, indeterminate = false, disabled = false }) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: space.sm, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1 }}>
      <span
        style={{
          width: 18, height: 18, borderRadius: t.radius.badge,
          border: checked || indeterminate ? 'none' : `1.5px solid ${t.border}`,
          background: checked || indeterminate ? t.primary : t.bg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}
      >
        {indeterminate
          ? <span style={{ width: 8, height: 2, background: t.onPrimary, borderRadius: 1 }} />
          : checked
            ? <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><polyline points="1,4 4,7 9,1" stroke={t.onPrimary} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : null}
      </span>
      {label && <span style={{ ...typeStyle(t.type.bodySm), color: disabled ? t.textDisabled : t.textMain }}>{label}</span>}
    </label>
  );

  const Switch: DS['Switch'] = ({ on = false, disabled = false, label }) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: space.sm, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1 }}>
      <span
        style={{
          width: 42, height: 24, borderRadius: 9999,
          background: on ? t.primary : t.surfaceAlt,
          border: `1.5px solid ${on ? t.primary : t.border}`,
          position: 'relative', display: 'inline-block', transition: 'background 0.15s',
          flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: on ? 21 : 2,
          width: 16, height: 16, borderRadius: 9999,
          background: on ? t.onPrimary : t.textMuted,
          transition: 'left 0.15s',
        }} />
      </span>
      {label && <span style={{ ...typeStyle(t.type.bodySm), color: t.textMain }}>{label}</span>}
    </label>
  );

  const Radio: DS['Radio'] = ({ checked = false, label, disabled = false }) => (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: space.sm, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1 }}>
      <span style={{
        width: 18, height: 18, borderRadius: 9999,
        border: checked ? `5px solid ${t.primary}` : `1.5px solid ${t.border}`,
        background: t.bg, display: 'inline-block', flexShrink: 0,
      }} />
      {label && <span style={{ ...typeStyle(t.type.bodySm), color: disabled ? t.textDisabled : t.textMain }}>{label}</span>}
    </label>
  );

  const Textarea: DS['Textarea'] = ({ label, placeholder, rows = 3, focus = false }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
      {label && <span style={{ ...typeStyle(t.type.caption), color: t.textMain, fontWeight: t.weightMedium }}>{label}</span>}
      <div
        style={{
          border: focus ? `2px solid ${t.primary}` : `1px solid ${t.border}`,
          borderRadius: t.radius.input, padding: `${space.sm}px ${space.md}px`,
          background: t.bg, boxShadow: focus ? `0 0 0 3px ${t.primaryTint}` : 'none',
          minHeight: rows * 24,
        }}
      >
        <span style={{ ...typeStyle(t.type.bodySm), color: focus ? t.textMain : t.textMuted }}>{placeholder}</span>
      </div>
    </div>
  );

  const Select: DS['Select'] = ({ label, placeholder, value, disabled = false }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs, opacity: disabled ? 0.4 : 1 }}>
      {label && <span style={{ ...typeStyle(t.type.caption), color: t.textMain, fontWeight: t.weightMedium }}>{label}</span>}
      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          border: `1px solid ${t.border}`, borderRadius: t.radius.input,
          padding: `${space.sm}px ${space.md}px`, background: t.bg,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span style={{ ...typeStyle(t.type.bodySm), color: value ? t.textMain : t.textMuted }}>{value ?? placeholder}</span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <polyline points="4,6 8,10 12,6" stroke={t.textMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );

  const Divider: DS['Divider'] = ({ label, vertical = false, style: extStyle = {} }) => {
    if (vertical) return (
      <div style={{ width: 1, background: t.border, alignSelf: 'stretch', ...extStyle }} />
    );
    if (!label) return (
      <div style={{ height: 1, background: t.border, ...extStyle }} />
    );
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, ...extStyle }}>
        <div style={{ flex: 1, height: 1, background: t.border }} />
        <span style={{ ...typeStyle(t.type.caption), color: t.textMuted }}>{label}</span>
        <div style={{ flex: 1, height: 1, background: t.border }} />
      </div>
    );
  };

  const Skeleton: DS['Skeleton'] = ({ w = '100%', h = 16, radius, style: extStyle = {} }) => (
    <div
      style={{
        width: w, height: h,
        borderRadius: radius ?? t.radius.badge,
        background: wireframe
          ? `repeating-linear-gradient(90deg, ${t.surfaceAlt}, ${t.surfaceAlt} 40%, ${t.border} 50%, ${t.surfaceAlt} 60%, ${t.surfaceAlt} 100%)`
          : t.surfaceAlt,
        ...extStyle,
      }}
    />
  );

  const Progress: DS['Progress'] = ({ value = 60, max = 100, tone = 'primary', label }) => {
    const barColor = tone === 'success' ? t.success : tone === 'danger' ? t.danger : t.primary;
    const labelColor = tone === 'success' ? t.successText : tone === 'danger' ? t.dangerText : t.textMain;
    const ratio = Math.min(1, Math.max(0, value / max));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
        {label && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ ...typeStyle(t.type.caption), color: t.textSub }}>{label}</span>
            <span style={{ ...typeStyle(t.type.caption), color: labelColor, fontWeight: t.weightBold }}>{Math.round(ratio * 100)}%</span>
          </div>
        )}
        <div style={{ height: 6, borderRadius: 9999, background: t.surfaceAlt, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${ratio * 100}%`, borderRadius: 9999, background: barColor }} />
        </div>
      </div>
    );
  };

  const TopBar: DS['TopBar'] = ({ title, back = true, actions = [], transparent = false, style: extStyle = {} }) => (
    <div
      style={{
        display: 'flex', alignItems: 'center',
        padding: `${space.sm}px ${space.md}px`,
        background: transparent ? 'transparent' : t.bg,
        borderBottom: transparent ? 'none' : `1px solid ${t.border}`,
        gap: space.sm,
        ...extStyle,
      }}
    >
      {back && (
        <div className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, cursor: 'pointer', borderRadius: t.radius.button, flexShrink: 0 }}>
          <Icon name="arrowLeft" size={20} color={t.textMain} />
        </div>
      )}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {title && (
          <span style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, color: t.textMain, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
        )}
      </div>
      {actions.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: space.xs, flexShrink: 0 }}>
          {actions.map(({ icon, label }) => (
            <div key={icon} className="ds-press" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, cursor: 'pointer', borderRadius: t.radius.button }}>
              {label
                ? <span style={{ ...typeStyle(t.type.bodySm), color: ensureContrast(t.primary, t.bg), fontWeight: t.weightBold }}>{label}</span>
                : <Icon name={icon} size={20} color={t.textMain} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Table: DS['Table'] = ({ headers, rows, footer, style }) => (
    <div style={{ borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden', ...style }}>
      {headers && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${space.xs}px ${space.md}px`, background: t.surfaceAlt, borderBottom: `1px solid ${t.border}` }}>
          {headers.map((h) => (
            <span key={h} style={{ ...typeStyle(t.type.caption), fontWeight: t.weightBold, color: t.textSub }}>{h}</span>
          ))}
        </div>
      )}
      {rows.map(({ label, value, tone }, i) => {
        const valueColor = tone === 'danger' ? t.danger : tone === 'success' ? t.success : tone === 'muted' ? t.textMuted : t.textMain;
        return (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${space.sm}px ${space.md}px`, borderBottom: (footer || i < rows.length - 1) ? `1px solid ${t.border}` : 'none', background: t.surface }}>
            <span style={{ ...typeStyle(t.type.caption), color: t.textSub }}>{label}</span>
            <span style={{ ...typeStyle(t.type.caption), fontWeight: t.weightMedium, color: valueColor }}>{value}</span>
          </div>
        );
      })}
      {footer && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: `${space.sm}px ${space.md}px`, background: t.surfaceAlt }}>
          <span style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, color: t.textMain }}>{footer.label}</span>
          <span style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, color: t.textMain }}>{footer.value}</span>
        </div>
      )}
    </div>
  );

  const Toast: DS['Toast'] = ({ message, tone = 'default', action, style }) => {
    const TONE = {
      success: { bg: t.successWeak, border: t.success,   accent: t.success,   textColor: t.successText, icon: 'checkCircle' as IconName },
      danger:  { bg: t.dangerWeak,  border: t.danger,    accent: t.danger,    textColor: t.dangerText,  icon: 'alertCircle' as IconName },
      warning: { bg: t.warningWeak, border: t.warning,   accent: t.warning,   textColor: t.warningText, icon: 'alertCircle' as IconName },
      info:    { bg: t.infoWeak,    border: t.info,      accent: t.info,      textColor: t.infoText,    icon: 'info'        as IconName },
      default: { bg: t.surface,     border: t.border,    accent: t.textMuted, textColor: t.textSub,     icon: 'info'        as IconName },
    };
    const { bg, border: bdColor, accent, textColor, icon } = TONE[tone];
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: space.sm,
        padding: `${space.sm}px ${space.md}px`, borderRadius: t.radius.card,
        background: bg,
        border: `1px solid ${bdColor}`,
        boxShadow: t.shadow.md,
        ...style,
      }}>
        <Icon name={icon} size={16} color={accent} />
        <span style={{ ...typeStyle(t.type.bodySm), color: textColor, flex: 1 }}>{message}</span>
        {action && <span className="ds-press" style={{ ...typeStyle(t.type.bodySm), color: ensureContrast(accent, bg), fontWeight: t.weightBold, cursor: 'pointer', flexShrink: 0 }}>{action}</span>}
      </div>
    );
  };

  const TokenCard: DS['TokenCard'] = ({ name, value, desc, swatch, style }) => (
    <div style={{ borderRadius: t.radius.card, padding: space.md, border: `1px solid ${t.border}`, background: t.surface, display: 'flex', flexDirection: 'column', gap: space.xs, ...style }}>
      {swatch && <div style={{ width: '100%', height: 36, borderRadius: t.radius.badge, background: swatch, marginBottom: space.xs }} />}
      <span style={{ ...typeStyle(t.type.caption), fontWeight: t.weightBold, color: t.textMain, fontFamily: 'monospace' }}>{name}</span>
      <span style={{ ...typeStyle(t.type.caption), color: t.textSub }}>{value}</span>
      {desc && <span style={{ ...typeStyle(t.type.caption), color: t.textMuted }}>{desc}</span>}
    </div>
  );

  /* ── signature primitives ── */

  const StatusTracker: DS['StatusTracker'] = ({ steps, current = 0, style }) => (
    <div style={{ display: 'flex', alignItems: 'flex-start', ...style }}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const reached = i <= current;
        const dotColor = reached ? t.primary : t.surfaceAlt;
        return (
          <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.xs, position: 'relative' }}>
            {i > 0 && (
              <div style={{ position: 'absolute', top: 11, right: '50%', width: '100%', height: 2, background: i <= current ? t.primary : t.border }} />
            )}
            <div style={{
              width: 24, height: 24, borderRadius: 9999, zIndex: 1,
              background: dotColor, color: t.onPrimary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: active ? `2px solid ${t.primary}` : 'none',
              boxShadow: active ? `0 0 0 3px ${t.primaryTint}` : 'none',
            }}>
              {done
                ? <Icon name="check" size={13} color={t.onPrimary} />
                : <span style={{ ...typeStyle(t.type.caption), fontWeight: t.weightBold, color: reached ? t.onPrimary : t.textMuted }}>{i + 1}</span>}
            </div>
            <span style={{ ...typeStyle(t.type.caption), color: reached ? t.textMain : t.textMuted, fontWeight: active ? t.weightBold : t.weightRegular, textAlign: 'center', wordBreak: 'keep-all', overflowWrap: 'break-word' }}>{label}</span>
          </div>
        );
      })}
    </div>
  );

  const BalanceCard: DS['BalanceCard'] = ({ label, value, delta, actions = [], style }) => (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: space.md,
      padding: space.lg, borderRadius: t.radius.card,
      background: t.surface, border: `1px solid ${t.border}`, ...style,
    }}>
      <span style={{ ...typeStyle(t.type.caption), color: t.textSub }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: space.sm }}>
        <span style={{ ...typeStyle(t.type.h1), fontWeight: t.weightBold, color: t.textMain }}>{value}</span>
        {delta && <span style={{ ...typeStyle(t.type.caption), fontWeight: t.weightBold, color: ensureContrast(t.success, t.surface) }}>{delta}</span>}
      </div>
      {actions.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: space.sm, marginTop: space.lg }}>
          {actions.map((a, i) => {
            const isPrimary = i === actions.length - 1;
            return (
              <span key={a} className="ds-press" style={{
                ...typeStyle(t.type.bodySm), fontWeight: t.weightBold,
                color: isPrimary ? t.onPrimary : t.primary,
                background: isPrimary ? t.primary : 'transparent',
                border: isPrimary ? 'none' : `1.5px solid ${t.primary}`,
                padding: `${space.xs}px ${space.md}px`,
                borderRadius: t.radius.button, cursor: 'pointer',
              }}>{a}</span>
            );
          })}
        </div>
      )}
    </div>
  );

  const GaugeMeter: DS['GaugeMeter'] = ({ label, value, ratio = 0.6, caption, style }) => {
    const r = Math.min(1, Math.max(0, ratio));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs, padding: t.cardPad, borderRadius: t.radius.card, background: t.surface, border: `1px solid ${t.border}`, ...style }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ ...typeStyle(t.type.caption), color: t.textSub }}>{label}</span>
          <span style={{ ...typeStyle(t.type.body), fontWeight: t.weightBold, color: ensureContrast(t.primary, t.surface) }}>{value}</span>
        </div>
        <div style={{ position: 'relative', height: 8, borderRadius: 9999, background: t.surfaceAlt, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, width: `${r * 100}%`, borderRadius: 9999, background: `linear-gradient(90deg, ${t.primaryTint}, ${t.primary})` }} />
        </div>
        {caption && <span style={{ ...typeStyle(t.type.caption), color: t.textMuted }}>{caption}</span>}
      </div>
    );
  };

  const RankingList: DS['RankingList'] = ({ items, style }) => (
    <div style={{ display: 'flex', flexDirection: 'column', borderRadius: t.radius.card, border: `1px solid ${t.border}`, background: t.surface, overflow: 'hidden', ...style }}>
      {items.map((it, i) => {
        const deltaColor = it.delta === 'up' ? t.danger : it.delta === 'down' ? ensureContrast(t.info, t.surface) : t.textMuted;
        const deltaSym = it.delta === 'up' ? '▲' : it.delta === 'down' ? '▼' : '▬';
        return (
          <div key={it.title} className="ds-press" style={{ display: 'flex', alignItems: 'center', gap: space.sm, padding: `${space.sm}px ${space.md}px`, borderBottom: i < items.length - 1 ? `1px solid ${t.border}` : 'none', background: t.surface, cursor: 'pointer' }}>
            <span style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, color: ensureContrast(t.primary, t.surface), width: 18, flexShrink: 0 }}>{i + 1}</span>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <span style={{ ...typeStyle(t.type.bodySm), color: t.textMain, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.title}</span>
              {it.sub && <span style={{ ...typeStyle(t.type.caption), color: t.textMuted }}>{it.sub}</span>}
            </div>
            <span style={{ ...typeStyle(t.type.caption), color: deltaColor, flexShrink: 0 }}>{deltaSym}</span>
          </div>
        );
      })}
    </div>
  );

  const SaveCollect: DS['SaveCollect'] = ({ count = 0, saved = false, tag, h = 120, style }) => (
    <div style={{ position: 'relative', borderRadius: t.radius.card, overflow: 'hidden', ...style }}>
      <Thumb h={h} />
      <div className="ds-press" style={{ position: 'absolute', top: space.sm, right: space.sm, width: 30, height: 30, borderRadius: 9999, background: t.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: t.shadow.sm, cursor: 'pointer' }}>
        <Icon name="heart" size={16} color={saved ? t.danger : t.textMuted} />
      </div>
      {tag && (
        <div style={{ position: 'absolute', left: space.sm, bottom: space.sm, display: 'flex', alignItems: 'center', gap: space.xs, padding: `${space.xxs}px ${space.sm}px`, borderRadius: 9999, background: 'rgba(0,0,0,0.6)' }}>
          <Icon name="bookmark" size={11} color={t.textOnImage} />
          <span style={{ ...typeStyle(t.type.caption), color: t.textOnImage }}>{tag}</span>
        </div>
      )}
      <div style={{ position: 'absolute', right: space.sm, bottom: space.sm, display: 'flex', alignItems: 'center', gap: space.xxs, padding: `${space.xxs}px ${space.sm}px`, borderRadius: 9999, background: 'rgba(0,0,0,0.6)' }}>
        <Icon name="heart" size={11} color={t.textOnImage} />
        <span style={{ ...typeStyle(t.type.caption), color: t.textOnImage }}>{count.toLocaleString()}</span>
      </div>
    </div>
  );

  const EditorialCard: DS['EditorialCard'] = ({ title, sub, tag, h = 180, style }) => (
    <div style={{ position: 'relative', borderRadius: t.radius.card, overflow: 'hidden', ...style }}>
      <Thumb h={h} />
      <div style={{ position: 'absolute', inset: 0, background: t.scrim }} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: t.cardPad, display: 'flex', flexDirection: 'column', gap: space.xxs }}>
        {tag && <span style={{ ...typeStyle(t.type.caption), fontWeight: t.weightBold, letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textOnImage, opacity: 0.85 }}>{tag}</span>}
        <span style={{ ...typeStyle(t.type.h2), fontWeight: t.weightBold, color: t.textOnImage }}>{title}</span>
        {sub && <span style={{ ...typeStyle(t.type.caption), color: t.textOnImage, opacity: 0.85 }}>{sub}</span>}
      </div>
    </div>
  );

  const ChatList: DS['ChatList'] = ({ messages, style }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm, padding: t.cardPad, borderRadius: t.radius.card, background: t.surfaceAlt, ...style }}>
      {messages.map((m, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.me ? 'flex-end' : 'flex-start', gap: 2 }}>
          <div style={{
            maxWidth: '78%', padding: `${space.xs}px ${space.lg}px`, borderRadius: t.radius.card,
            background: m.me ? t.primary : t.surface,
            color: m.me ? t.onPrimary : t.textMain,
            border: m.me ? 'none' : `1px solid ${t.border}`,
          }}>
            <span style={{ ...typeStyle(t.type.bodySm), color: 'inherit' }}>{m.text}</span>
          </div>
          {m.time && <span style={{ ...typeStyle(t.type.caption), color: t.textMuted }}>{m.time}</span>}
        </div>
      ))}
    </div>
  );

  const ComingSoon: DS['ComingSoon'] = ({ title = '오픈 예정', sub, style }) => (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: 180, background: t.surfaceAlt, borderRadius: t.radius.card,
      ...style,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 16 }}>
        {/* Speech bubble */}
        <div style={{
          position: 'relative', background: t.bg,
          border: `1px solid ${t.border}`, borderRadius: t.radius.card,
          padding: `${space.sm}px ${space.lg}px`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: space.xs,
          boxShadow: `0 4px 20px rgba(0,0,0,0.06)`, marginBottom: 14,
        }}>
          <span style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, color: t.textMain }}>
            🔒 {title}
          </span>
          {sub && <span style={{ ...typeStyle(t.type.caption), color: t.textSub, textAlign: 'center', maxWidth: 220 }}>{sub}</span>}
          {/* Tail — rotated square, half hidden behind bubble bottom for seamless joint */}
          <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: 10, height: 10, background: t.bg, borderBottom: `1px solid ${t.border}`, borderRight: `1px solid ${t.border}` }} />
        </div>
      </div>
    </div>
  );

  const AspectRatio: DS['AspectRatio'] = ({ ratio = 16 / 9, label, children, style }) => (
    <div style={{ position: 'relative', width: '100%', paddingTop: `${(1 / ratio) * 100}%`, borderRadius: t.radius.card, overflow: 'hidden', ...style }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: wireframe
          ? `repeating-linear-gradient(135deg, ${t.surfaceAlt}, ${t.surfaceAlt} 6px, ${t.surface} 6px, ${t.surface} 12px)`
          : t.surfaceAlt,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {children ?? (label && <span style={{ ...typeStyle(t.type.caption), color: t.textMuted }}>{label}</span>)}
      </div>
    </div>
  );

  const Carousel: DS['Carousel'] = ({ items, style }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: space.sm, ...style }}>
      <div style={{ display: 'flex', gap: space.sm, overflow: 'hidden' }}>
        {items.map((item, i) => (
          <div key={i} className="ds-hover" style={{ flexShrink: 0, width: 140, borderRadius: t.radius.card, overflow: 'hidden', background: t.surface, boxShadow: `0 0 0 1px ${t.border}`, cursor: 'pointer' }}>
            <Thumb h={item.h ?? 80} />
            <div style={{ padding: space.sm }}>
              <Text role="caption" weight={t.weightBold} style={{ display: 'block', marginBottom: item.sub ? space.xxs : 0 }}>{item.label}</Text>
              {item.sub && <Text role="caption" color={t.textSub}>{item.sub}</Text>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: space.xxs }}>
        {items.map((_, i) => (
          <div key={i} style={{ width: i === 0 ? 18 : 6, height: 6, borderRadius: 9999, background: i === 0 ? t.primary : t.border }} />
        ))}
      </div>
    </div>
  );

  const ContextMenu: DS['ContextMenu'] = ({ items, style }) => (
    <div style={{ background: t.bg, border: `1px solid ${t.border}`, borderRadius: t.radius.card, boxShadow: t.shadow.lg, overflow: 'hidden', ...style }}>
      {items.map((item, i) => (
        <React.Fragment key={`${item.label}-${i}`}>
          {item.divider && i > 0 && <div style={{ height: 1, background: t.border }} />}
          <div className="ds-press" style={{ display: 'flex', alignItems: 'center', gap: space.sm, padding: `${space.sm}px ${space.md}px`, cursor: 'pointer' }}>
            {item.icon && <Icon name={item.icon} size={15} color={item.danger ? t.danger : t.textSub} />}
            <span style={{ ...typeStyle(t.type.bodySm), color: item.danger ? t.danger : t.textMain, flex: 1 }}>{item.label}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  const Dialogue: DS['Dialogue'] = ({ title, body, actions = ['취소', '확인'], style }) => (
    <div style={{ position: 'relative', minHeight: 160, background: 'rgba(0,0,0,0.35)', borderRadius: t.radius.card, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: `${space.xl}px`, ...style }}>
      <div style={{ width: '100%', background: t.bg, borderRadius: t.radius.card, padding: `${space.xl}px`, boxShadow: t.shadow.lg }}>
        <div style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, color: t.textMain, marginBottom: body ? space.sm : space.lg }}>{title}</div>
        {body && <div style={{ ...typeStyle(t.type.bodySm), color: t.textSub, marginBottom: space.lg }}>{body}</div>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: space.sm }}>
          {actions.map((a, i) => {
            const isPrimary = i === actions.length - 1;
            return (
              <span key={a} className="ds-press" style={{
                ...typeStyle(t.type.bodySm), fontWeight: t.weightBold,
                color: isPrimary ? t.onPrimary : t.textMain,
                background: isPrimary ? t.primary : 'transparent',
                border: isPrimary ? 'none' : `1.5px solid ${t.border}`,
                padding: `${space.xs}px ${space.md}px`,
                borderRadius: t.radius.button, cursor: 'pointer', display: 'inline-flex', alignItems: 'center',
              }}>{a}</span>
            );
          })}
        </div>
      </div>
    </div>
  );

  return { t, Text, Button, Card, Input, Badge, Chip, NavTab, Stepper, Rating, ListRow, Thumb, Avatar, Icon, Checkbox, Switch, Radio, Textarea, Select, Divider, Skeleton, Progress, TopBar, Table, Toast, TokenCard, StatusTracker, BalanceCard, GaugeMeter, RankingList, SaveCollect, EditorialCard, ChatList, ComingSoon, AspectRatio, Carousel, ContextMenu, Dialogue };
}
