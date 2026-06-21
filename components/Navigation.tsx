'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import styles from './Navigation.module.css';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

const navItems = [
    { name: 'Design MD', href: '/tokens' },
    { name: '위키', href: '/wiki' },
];

export default function Navigation({ user }: { user: SupabaseUser | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <>
            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <div className={styles.headerLeft}>
                        <Link href="/" className={styles.logo}>
                            Design MD
                        </Link>
                        <nav className={styles.desktopNav}>
                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`${styles.desktopNavItem} ${pathname.startsWith(item.href) ? styles.active : ''}`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className={styles.headerRight}>
                        {user ? (
                            <div className={styles.userActions}>
                                <Link href="/profile" className={styles.profileBtn}>
                                    <User size={16} />
                                </Link>
                                <button className={styles.logoutBtn} onClick={handleLogout}>
                                    <LogOut size={16} />
                                </button>
                            </div>
                        ) : (
                            <Link href="/auth/login" className={styles.loginBtn}>
                                로그인
                            </Link>
                        )}
                        <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile drawer */}
            {isOpen && (
                <div className={styles.mobileDrawer}>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`${styles.mobileNavItem} ${pathname.startsWith(item.href) ? styles.active : ''}`}
                            onClick={() => setIsOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    {user && (
                        <button className={styles.mobileLogout} onClick={handleLogout}>
                            <LogOut size={16} /> 로그아웃
                        </button>
                    )}
                </div>
            )}
            {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
        </>
    );
}
