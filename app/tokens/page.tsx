import Link from 'next/link';
import { allTokens } from '@/lib/tokens';
import styles from './TokensIndex.module.css';

export default function TokensPage() {
  const korean = allTokens.filter((t) => t.country === 'KR');
  const global = allTokens.filter((t) => t.country === 'GLOBAL');

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>브랜드 디자인 토큰</h1>
        <p className={styles.desc}>
          세계 유수 브랜드의 디자인 시스템을 AI에 바로 넣을 수 있는 .md 토큰으로 제공합니다.
        </p>
      </div>

      {korean.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>한국 브랜드</h2>
          <div className={styles.grid}>
            {korean.map((token) => (
              <Link key={token.slug} href={`/tokens/${token.slug}`} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{token.name}</span>
                  <span className={styles.cardCategory}>{token.category}</span>
                </div>
                <p className={styles.cardDesc}>{token.description.slice(0, 80)}...</p>
                <div className={styles.cardColors}>
                  {token.colors.slice(0, 5).map((c) => (
                    <div
                      key={c.variable}
                      className={styles.colorDot}
                      style={{ background: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.serviceTypes}>
                    {token.serviceTypes.slice(0, 2).join(' · ')}
                  </span>
                  <span className={styles.updatedAt}>{token.updatedAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {global.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionLabel}>글로벌 브랜드</h2>
          <div className={styles.grid}>
            {global.map((token) => (
              <Link key={token.slug} href={`/tokens/${token.slug}`} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.cardName}>{token.name}</span>
                  <span className={styles.cardCategory}>{token.category}</span>
                </div>
                <p className={styles.cardDesc}>{token.description.slice(0, 80)}...</p>
                <div className={styles.cardColors}>
                  {token.colors.slice(0, 5).map((c) => (
                    <div
                      key={c.variable}
                      className={styles.colorDot}
                      style={{ background: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
                <div className={styles.cardFooter}>
                  <span className={styles.serviceTypes}>
                    {token.serviceTypes.slice(0, 2).join(' · ')}
                  </span>
                  <span className={styles.updatedAt}>{token.updatedAt}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
