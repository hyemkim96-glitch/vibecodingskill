'use client';

import { WikiContext } from '@/contexts/WikiContext';
import { IWikiTerm } from '@/types/wiki';

export default function WikiProvider({
    terms,
    children,
}: {
    terms: IWikiTerm[];
    children: React.ReactNode;
}) {
    return (
        <WikiContext.Provider value={{ terms }}>
            {children}
        </WikiContext.Provider>
    );
}
