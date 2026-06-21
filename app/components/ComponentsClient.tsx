'use client';

import ComponentSheet from '@/components/ComponentSheet';
import { getCategoryGroups } from '@/lib/serviceCategories';

export default function ComponentsClient() {
  const groups = getCategoryGroups();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-sm font-medium tracking-widest uppercase" style={{ color: 'var(--color-ash)' }}>
          Components
        </h1>
        <p className="text-xs" style={{ color: 'var(--color-ash)' }}>
          서비스 유형별로 분류된 컴포넌트 와이어프레임 — 해당 서비스에서 쓰이는 버튼·입력·카드·배지·칩을 한 시트에 나열
        </p>
      </div>

      <div className="flex flex-col gap-10">
        {groups.map(({ category, representative }) => (
          <section key={category.key} className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--color-bone)' }}>
                {category.label}
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-ash)' }}>
                {category.description}
              </p>
            </div>
            <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-graphite)' }}>
              <ComponentSheet token={representative} service={category.key} />
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
