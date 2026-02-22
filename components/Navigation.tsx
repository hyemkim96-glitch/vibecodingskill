'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Library, Lightbulb, FileText, Menu, X, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import styles from './Navigation.module.css';
import { createClient } from '@/lib/supabase/client';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface NavItem {
    name: string;
    href: string;
    icon: any;
    premium?: boolean;
    comingSoon?: boolean;
}

const navItems: NavItem[] = [
    { name: '스킬셋 라이브러리', href: '/', icon: Library },
    { name: '바이브 코딩 꿀팁', href: '/tips', icon: Lightbulb },
    { name: 'PRD 생성기', href: '/prd-gen', icon: FileText, comingSoon: true },
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
                    <Link href="/" className={styles.logo}>
                        Vibe Coding Skills
                    </Link>
                    <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            <nav className={`${styles.nav} ${isOpen ? styles.open : ''}`}>
                <div className={styles.navLinks}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        if (item.comingSoon) {
                            return (
                                <div key={item.href} className={`${styles.navItem} ${styles.disabled}`}>
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                    <span className={styles.comingSoonBadge}>오픈 예정</span>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                                {item.premium && <span className={styles.premiumBadge}>Premium</span>}
                            </Link>
                        );
                    })}
                </div>
                {user?.email && (
                    <div className={styles.navFooter}>
                        <div className={styles.userSection}>
                            <div className={styles.userInfo}>
                                <Link
                                    href="/profile"
                                    className={styles.profileLink}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <User size={18} />
                                    <span>프로필</span>
                                </Link>
                                <button className={styles.logoutBtn} onClick={handleLogout}>
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </nav>
            {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
        </>
    );
}
