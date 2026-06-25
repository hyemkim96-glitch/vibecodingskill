'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { IWikiTerm } from '@/types/wiki';
import { useTheme } from '@/components/ThemeProvider';
import styles from './Wiki.module.css';
import { serviceDS, serviceDarkDS } from '@/lib/tokens/serviceTheme';

type SortOrder = 'default' | 'abc' | 'korean';

export default function WikiClient({ terms }: { terms: IWikiTerm[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('default');
  const { theme } = useTheme();
  const { Text, t } = theme === 'dark' ? serviceDarkDS : serviceDS;

  const allCategories = Array.from(
    new Set(terms.map((term) => term.category).filter(Boolean)),
  ).sort() as string[];

  const filtered = terms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? term.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortOrder === 'abc') return a.term.localeCompare(b.term, 'en', { sensitivity: 'base' });
    if (sortOrder === 'korean') return a.term.localeCompare(b.term, 'ko', { sensitivity: 'base' });
    return 0;
  });

  const sortOptions: { label: string; value: SortOrder }[] = [
    { label: '기본', value: 'default' },
    { label: 'ABC', value: 'abc' },
    { label: '가나다', value: 'korean' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.xl }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: t.space.sm }}>
        <Text role="caption" weight={t.weightMedium} style={{ letterSpacing: '0.1em', textTransform: 'uppercase', color: t.textSub }}>
          Wiki
        </Text>
        <Text role="bodySm" color={t.textSub} weight={t.weightMedium} style={{ lineHeight: 1.65 }}>
          디자인 시스템 용어 사전과 공통 언어로 작업 속도를 높입니다.
        </Text>
      </div>

      <div className={styles.toolbar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="용어 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className={styles.sortGroup}>
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.sortBtn} ${sortOrder === opt.value ? styles.sortBtnActive : ''}`}
              onClick={() => setSortOrder(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {allCategories.length > 0 && (
        <div className={styles.categoryFilter}>
          <button
            className={`${styles.chip} ${selectedCategory === null ? styles.chipActive : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            전체
          </button>
          {allCategories.map((cat) => (
            <button
              key={cat}
              className={`${styles.chip} ${selectedCategory === cat ? styles.chipActive : ''}`}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {sorted.length > 0 ? (
        <div className={styles.termList}>
          {sorted.map((term) => (
            <div key={term.id} className={styles.termCard}>
              {term.category && (
                <span className={styles.categoryBadge}>{term.category}</span>
              )}
              <div className={styles.termHeader}>
                <h2 className={styles.termName}>{term.term}</h2>
                {term.url && (
                  <a
                    href={term.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.termUrl}
                  >
                    <ExternalLink size={14} />
                    바로가기
                  </a>
                )}
              </div>
              <p className={styles.definition}>{term.definition}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          {searchTerm ? '검색 결과가 없습니다.' : '등록된 용어가 없습니다.'}
        </div>
      )}
    </div>
  );
}
