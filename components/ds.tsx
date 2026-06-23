'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ResolvedTheme, ResolvedType, ensureContrast } from '@/lib/tokens/resolveTheme';
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
        style={{ width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', cursor: value >= max ? 'not-allowed' : 'pointer', color: value >= max ? t.textDisabled : t.primary, fontSize: 18, fontWeight: t.weightBold }}
      >+</button>
    </div>
  );

  const Rating: DS['Rating'] = ({ value = 4, max = 5, size = 16 }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.floor(value);
        const half = !filled && i < value;
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 16 16" fill={filled ? '#F5A623' : half ? 'url(#half)' : 'none'} stroke={filled || half ? '#F5A623' : t.border} strokeWidth="1.5">
            {half && (
              <defs>
                <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#F5A623" />
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
          position: 'absolute', top: 2, left: on ? 18 : 2,
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
    const ratio = Math.min(1, Math.max(0, value / max));
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: space.xs }}>
        {label && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ ...typeStyle(t.type.caption), color: t.textSub }}>{label}</span>
            <span style={{ ...typeStyle(t.type.caption), color: barColor, fontWeight: t.weightBold }}>{Math.round(ratio * 100)}%</span>
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
                ? <span style={{ ...typeStyle(t.type.bodySm), color: t.primary, fontWeight: t.weightBold }}>{label}</span>
                : <Icon name={icon} size={20} color={t.textMain} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Table: DS['Table'] = ({ rows, footer, style }) => (
    <div style={{ borderRadius: t.radius.card, border: `1px solid ${t.border}`, overflow: 'hidden', ...style }}>
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
          <span style={{ ...typeStyle(t.type.bodySm), fontWeight: t.weightBold, color: t.primary }}>{footer.value}</span>
        </div>
      )}
    </div>
  );

  const Toast: DS['Toast'] = ({ message, tone = 'default', action, style }) => {
    const bg = tone === 'success' ? t.success : tone === 'danger' ? t.danger : tone === 'warning' ? t.warning : tone === 'info' ? t.info : t.textMain;
    const fg = ensureContrast(t.bg, bg);
    const iconName: Record<string, IconName> = { success: 'checkCircle', danger: 'alertCircle', warning: 'alertCircle', info: 'info', default: 'info' };
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: space.sm, padding: `${space.sm}px ${space.md}px`, borderRadius: t.radius.card, background: bg, ...style }}>
        <Icon name={iconName[tone]} size={16} color={fg} />
        <span style={{ ...typeStyle(t.type.bodySm), color: fg, flex: 1 }}>{message}</span>
        {action && <span className="ds-press" style={{ ...typeStyle(t.type.bodySm), color: fg, fontWeight: t.weightBold, cursor: 'pointer', opacity: 0.9, flexShrink: 0 }}>{action}</span>}
      </div>
    );
  };

  const TokenCard: DS['TokenCard'] = ({ name, value, desc, swatch, style }) => (
    <div style={{ borderRadius: t.radius.card, padding: space.md, border: `1px solid ${t.border}`, background: t.surface, display: 'flex', flexDirection: 'column', gap: space.xs, ...style }}>
      {swatch && <div style={{ width: '100%', height: 36, borderRadius: t.radius.badge, background: swatch, marginBottom: space.xs }} />}
      <span style={{ ...typeStyle(t.type.caption), fontWeight: t.weightBold, color: t.textMain, fontFamily: 'monospace' }}>{name}</span>
      <span style={{ ...typeStyle(t.type.caption), color: t.primary }}>{value}</span>
      {desc && <span style={{ ...typeStyle(t.type.caption), color: t.textMuted }}>{desc}</span>}
    </div>
  );

  return { t, Text, Button, Card, Input, Badge, Chip, NavTab, Stepper, Rating, ListRow, Thumb, Avatar, Icon, Checkbox, Switch, Radio, Textarea, Select, Divider, Skeleton, Progress, TopBar, Table, Toast, TokenCard };
}
