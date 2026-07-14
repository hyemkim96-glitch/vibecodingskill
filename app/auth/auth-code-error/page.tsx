import Link from 'next/link'
import { ShieldAlert, Home, RotateCcw } from 'lucide-react'
import styles from './AuthError.module.css'

export default function AuthCodeError() {
    return (
        <div className={styles.container}>
            <div className={styles.errorBox}>
                <ShieldAlert size={48} className={styles.icon} />
                <h1>인증 오류가 발생했어요.</h1>
                <p>인증 링크가 만료됐거나 이미 사용됐을 수 있어요. 다시 로그인해주세요.</p>

                <div className={styles.actions}>
                    <Link href="/auth/login" className={styles.primaryBtn}>
                        <RotateCcw size={18} />
                        다시 로그인하기
                    </Link>
                    <Link href="/" className={styles.secondaryBtn}>
                        <Home size={18} />
                        홈으로 이동
                    </Link>
                </div>
            </div>
        </div>
    )
}
