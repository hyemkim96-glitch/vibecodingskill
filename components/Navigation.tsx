'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';
import styles from './Navigation.module.css';

export default function Navigation({ user }: { user: SupabaseUser | null }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <Link href="/tokens" className={`${styles.filterChip} ${pathname.startsWith('/tokens') ? styles.active : ''}`}>
                    토큰
                </Link>
                <Link href="/patterns" className={`${styles.filterChip} ${pathname.startsWith('/patterns') ? styles.active : ''}`}>
                    패턴
                </Link>
                <Link href="/components" className={`${styles.filterChip} ${pathname.startsWith('/components') ? styles.active : ''}`}>
                    컴포넌트
                </Link>
                <Link href="/wiki" className={`${styles.filterChip} ${pathname.startsWith('/wiki') ? styles.active : ''}`}>
                    위키
                </Link>
            </div>

            <Link href="/" className={styles.logo}>
                DESIGN MD
            </Link>

            <div className={styles.right}>
                {user ? (
                    <>
                        <Link href="/profile" className={styles.action}>프로필</Link>
                        <button className={styles.action} onClick={handleLogout}>로그아웃</button>
                    </>
                ) : (
                    <Link href="/auth/login" className={styles.action}>로그인</Link>
                )}
            </div>
        </header>
    );
}
