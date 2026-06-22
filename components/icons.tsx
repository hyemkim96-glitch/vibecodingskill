'use client';

import React from 'react';
import {
  Home, Search, ShoppingCart, Heart, User, Package, Bell, ChevronRight,
  ArrowLeft, MoreHorizontal, X, Send, Plus, ArrowUp, Check, Camera,
  Star, MapPin, CreditCard, Settings, MessageCircle, LogOut, Filter,
  SlidersHorizontal, Mail, Newspaper, Map, TrendingUp, Grid2x2,
  ChevronDown, Eye, Edit, RefreshCw, Truck, Clock, Zap,
  AlertCircle, CheckCircle, RotateCcw, Bookmark
} from 'lucide-react';

import {
  House, MagnifyingGlass, ShoppingCartSimple, Heart as PhHeart,
  User as PhUser, Package as PhPackage, Bell as PhBell,
  CaretRight, ArrowLeft as PhArrowLeft, DotsThree, X as PhX,
  PaperPlaneTilt, Plus as PhPlus, ArrowUp as PhArrowUp,
  Check as PhCheck, Camera as PhCamera, Star as PhStar,
  MapPin as PhMapPin, CreditCard as PhCreditCard, Gear, ChatCircle,
  SignOut, Funnel, Sliders, Envelope, Article, MapTrifold,
  TrendUp, SquaresFour, CaretDown, Eye as PhEye, PencilSimple,
  ArrowClockwise, Truck as PhTruck, Clock as PhClock, Lightning,
  WarningCircle, CheckCircle as PhCheckCircle, ArrowCounterClockwise,
  BookmarkSimple
} from '@phosphor-icons/react';

import {
  IconHome2, IconSearch, IconShoppingCart, IconHeart, IconUser,
  IconPackage, IconBell, IconChevronRight, IconArrowLeft,
  IconDots, IconX, IconSend, IconPlus, IconArrowUp, IconCheck,
  IconCamera, IconStar, IconMapPin, IconCreditCard, IconSettings,
  IconMessageCircle, IconLogout, IconFilter, IconAdjustments,
  IconMail, IconNews, IconMap, IconTrendingUp, IconLayoutGrid,
  IconChevronDown, IconEye, IconEdit, IconRefresh, IconTruck,
  IconClock, IconBolt, IconAlertCircle, IconCircleCheck,
  IconRotate, IconBookmark
} from '@tabler/icons-react';

/**
 * Icon system — maps semantic icon names to the correct library for each
 * brand archetype.
 *
 * Library selection by service character:
 *  - Lucide   → finance / search / commerce (clean, professional SaaS)
 *  - Phosphor → messaging / delivery / local (expressive, warm, rounded)
 *  - Tabler   → commerce (distinctive, slightly editorial)
 *
 * All icons use `currentColor` so they inherit the token color via CSS.
 */

export type IconStyle = 'lucide' | 'phosphor' | 'tabler';
export type IconName =
  | 'home' | 'search' | 'cart' | 'heart' | 'user' | 'package' | 'bell'
  | 'chevronRight' | 'arrowLeft' | 'more' | 'close' | 'send' | 'plus'
  | 'arrowUp' | 'check' | 'camera' | 'star' | 'pin' | 'card' | 'settings'
  | 'chat' | 'logout' | 'filter' | 'sliders' | 'mail' | 'news' | 'map'
  | 'trending' | 'grid' | 'chevronDown' | 'eye' | 'edit' | 'refresh'
  | 'truck' | 'clock' | 'zap' | 'alertCircle' | 'checkCircle' | 'undo'
  | 'bookmark';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: IconStyle;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill'; // Phosphor only
  className?: string;
}

const LUCIDE_MAP: Record<IconName, React.ComponentType<{ size?: number; color?: string; className?: string; strokeWidth?: number }>> = {
  home: Home, search: Search, cart: ShoppingCart, heart: Heart, user: User,
  package: Package, bell: Bell, chevronRight: ChevronRight, arrowLeft: ArrowLeft,
  more: MoreHorizontal, close: X, send: Send, plus: Plus, arrowUp: ArrowUp,
  check: Check, camera: Camera, star: Star, pin: MapPin, card: CreditCard,
  settings: Settings, chat: MessageCircle, logout: LogOut, filter: Filter,
  sliders: SlidersHorizontal, mail: Mail, news: Newspaper, map: Map,
  trending: TrendingUp, grid: Grid2x2, chevronDown: ChevronDown, eye: Eye,
  edit: Edit, refresh: RefreshCw, truck: Truck, clock: Clock, zap: Zap,
  alertCircle: AlertCircle, checkCircle: CheckCircle, undo: RotateCcw,
  bookmark: Bookmark,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PHOSPHOR_MAP: Record<IconName, React.ComponentType<any>> = {
  home: House, search: MagnifyingGlass, cart: ShoppingCartSimple, heart: PhHeart,
  user: PhUser, package: PhPackage, bell: PhBell, chevronRight: CaretRight,
  arrowLeft: PhArrowLeft, more: DotsThree, close: PhX, send: PaperPlaneTilt,
  plus: PhPlus, arrowUp: PhArrowUp, check: PhCheck, camera: PhCamera,
  star: PhStar, pin: PhMapPin, card: PhCreditCard, settings: Gear,
  chat: ChatCircle, logout: SignOut, filter: Funnel, sliders: Sliders,
  mail: Envelope, news: Article, map: MapTrifold, trending: TrendUp,
  grid: SquaresFour, chevronDown: CaretDown, eye: PhEye, edit: PencilSimple,
  refresh: ArrowClockwise, truck: PhTruck, clock: PhClock, zap: Lightning,
  alertCircle: WarningCircle, checkCircle: PhCheckCircle, undo: ArrowCounterClockwise,
  bookmark: BookmarkSimple,
};

const TABLER_MAP: Record<IconName, React.ComponentType<{ size?: number; color?: string; className?: string; stroke?: number }>> = {
  home: IconHome2, search: IconSearch, cart: IconShoppingCart, heart: IconHeart,
  user: IconUser, package: IconPackage, bell: IconBell, chevronRight: IconChevronRight,
  arrowLeft: IconArrowLeft, more: IconDots, close: IconX, send: IconSend,
  plus: IconPlus, arrowUp: IconArrowUp, check: IconCheck, camera: IconCamera,
  star: IconStar, pin: IconMapPin, card: IconCreditCard, settings: IconSettings,
  chat: IconMessageCircle, logout: IconLogout, filter: IconFilter,
  sliders: IconAdjustments, mail: IconMail, news: IconNews, map: IconMap,
  trending: IconTrendingUp, grid: IconLayoutGrid, chevronDown: IconChevronDown,
  eye: IconEye, edit: IconEdit, refresh: IconRefresh, truck: IconTruck,
  clock: IconClock, zap: IconBolt, alertCircle: IconAlertCircle,
  checkCircle: IconCircleCheck, undo: IconRotate, bookmark: IconBookmark,
};

export function Icon({ name, size = 16, color = 'currentColor', style = 'lucide', weight = 'regular', className = '' }: IconProps) {
  if (style === 'phosphor') {
    const Ic = PHOSPHOR_MAP[name];
    return <Ic size={size} color={color} weight={weight} className={className} />;
  }
  if (style === 'tabler') {
    const Ic = TABLER_MAP[name];
    return <Ic size={size} color={color} stroke={1.5} className={className} />;
  }
  const Ic = LUCIDE_MAP[name];
  return <Ic size={size} color={color} strokeWidth={1.75} className={className} />;
}

/**
 * Determine icon style for a brand based on service type and iconStyle text.
 * - Phosphor: messaging, delivery, local — expressive, warm, rounded
 * - Tabler: one commerce sub-brand (musinsa-like, editorial)
 * - Lucide: finance, search, default
 */
export function resolveIconStyle(
  serviceType: string,
  iconStyleText?: string,
): IconStyle {
  // iconStyle hint in brand deep data takes priority
  if (iconStyleText) {
    const t = iconStyleText.toLowerCase();
    if (/fill|bold|두꺼|굵/.test(t)) return 'phosphor';
    if (/tabler|editorial|각진/.test(t)) return 'tabler';
    if (/lucide|stroke|라인|선형/.test(t)) return 'lucide';
  }
  // fall back to service type character
  switch (serviceType) {
    case 'messaging':
    case 'delivery':
    case 'local':
      return 'phosphor';  // warm, rounded, expressive
    case 'commerce':
      return 'tabler';    // distinctive, slightly editorial
    case 'finance':
    case 'search':
    default:
      return 'lucide';    // clean, professional
  }
}
