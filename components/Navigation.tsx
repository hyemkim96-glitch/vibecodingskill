'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import { serviceDS } from '@/lib/tokens/serviceTheme';

const { Chip, Text, t } = serviceDS;

const NAV_LINKS = [
  { href: '/tokens',     label: '템플릿' },
  { href: '/foundation', label: '파운데이션' },
  { href: '/components', label: '컴포넌트' },
  { href: '/patterns',   label: '패턴' },
  { href: '/wiki',       label: '위키' },
];

export default function Navigation({ user }: { user: SupabaseUser | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <header style={{
      height: 'var(--nav-height)',
      borderBottom: `1px solid ${t.border}`,
      display: 'grid',
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      padding: `0 ${t.containerPad}px`,
      background: t.bg,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
    }}>
      {/* Left — nav links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: t.space.sm }}>
        {NAV_LINKS.map(({ href, label }) => (
          <Link key={href} href={href} style={{ textDecoration: 'none' }}>
            <Chip active={pathname.startsWith(href)}>{label}</Chip>
          </Link>
        ))}
      </nav>

      {/* Center — logo */}
      <Link href="/" style={{ textDecoration: 'none' }}>
        <Text role="bodySm" weight={t.weightRegular} style={{ letterSpacing: '0.08em', whiteSpace: 'nowrap', color: t.textMain }}>
          DESIGN MD
        </Text>
      </Link>

      {/* Right — auth */}
      <div style={{ display: 'flex', alignItems: 'center', gap: t.space.md, justifyContent: 'flex-end' }}>
        {user ? (
          <>
            <Link href="/profile" style={{ textDecoration: 'none' }}>
              <Text role="caption" color={t.textSub} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                프로필
              </Text>
            </Link>
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
              <Text role="caption" color={t.textSub} style={{ whiteSpace: 'nowrap' }}>
                로그아웃
              </Text>
            </button>
          </>
        ) : (
          <Link href="/auth/login" style={{ textDecoration: 'none' }}>
            <Text role="caption" color={t.textSub} style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
              로그인
            </Text>
          </Link>
        )}
      </div>
    </header>
  );
}
