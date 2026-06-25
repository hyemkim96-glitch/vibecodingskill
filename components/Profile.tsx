'use client';

import styles from './Profile.module.css';
import { User, Shield } from 'lucide-react';

type ProfileUser = {
    email?: string | null;
};

type ProfileData = {
    username?: string | null;
    badge?: string | null;
    ranking?: { level?: string | null } | null;
    role?: string | null;
};

export default function ProfilePage({
    user,
    profile,
}: {
    user: ProfileUser | null,
    profile: ProfileData | null,
}) {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.userCard}>
                    <div className={styles.avatar}>
                        <User size={40} />
                    </div>
                    <div className={styles.info}>
                        <h2>{profile?.username || user?.email}</h2>
                        <div className={styles.badges}>
                            <span className={styles.badge}>{profile?.badge || 'Newbie'}</span>
                            <span className={styles.rank}>Level: {profile?.ranking?.level || 'Beginner'}</span>
                        </div>
                    </div>
                </div>
            </header>

            {profile?.role === 'admin' && (
                <section className={styles.adminSection}>
                    <div className={styles.sectionHeader}>
                        <Shield size={20} />
                        <h3>관리자 메뉴</h3>
                    </div>
                    <a href="/admin" className={styles.adminBtn}>관리자 대시보드로 이동</a>
                </section>
            )}
        </div>
    );
}
