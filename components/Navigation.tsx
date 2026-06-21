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
                    TOKENS
                </Link>
                <Link href="/wiki" className={`${styles.filterChip} ${pathname.startsWith('/wiki') ? styles.active : ''}`}>
                    WIKI
                </Link>
            </div>

            <Link href="/" className={styles.logo}>
                DESIGN MD
            </Link>

            <div className={styles.right}>
                {user ? (
                    <>
                        <Link href="/profile" className={styles.action}>PROFILE</Link>
                        <button className={styles.action} onClick={handleLogout}>LOGOUT</button>
                    </>
                ) : (
                    <Link href="/auth/login" className={styles.action}>LOGIN</Link>
                )}
            </div>
        </header>
    );
}
