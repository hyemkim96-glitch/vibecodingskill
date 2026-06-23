'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { serviceDS, serviceDarkDS } from '@/lib/tokens/serviceTheme';
import { useTheme } from './ThemeProvider';
import { DarkModeToggle } from './DarkModeToggle';

const NAV_LINKS = [
  { href: '/tokens',     label: '템플릿' },
  { href: '/foundation', label: '파운데이션' },
  { href: '/components', label: '컴포넌트' },
  { href: '/patterns',   label: '패턴' },
  { href: '/wiki',       label: '위키' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { NavTab, Text, t } = theme === 'dark' ? serviceDarkDS : serviceDS;

  return (
    <header style={{
      height: 'var(--nav-height)',
      borderBottom: `1px solid ${t.border}`,
      background: t.bg,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 'var(--page-max-width)',
        margin: '0 auto',
        height: '100%',
        padding: `0 ${t.containerPad}px`,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'stretch',
      }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Text role="bodySm" weight={t.weightBold} style={{ letterSpacing: '0.12em', whiteSpace: 'nowrap', color: t.textMain }}>
            DESIGN MD
          </Text>
        </Link>
      </div>

      {/* Nav links */}
      <nav style={{ display: 'flex', alignItems: 'stretch' }}>
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none', display: 'flex', alignItems: 'stretch' }}>
            <NavTab active={pathname.startsWith(href)}>{label}</NavTab>
          </Link>
        ))}
      </nav>

      {/* Right zone */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <DarkModeToggle />
      </div>
      </div>
    </header>
  );
}
