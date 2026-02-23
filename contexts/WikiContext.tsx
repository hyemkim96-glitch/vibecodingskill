'use client';

import { createContext, useContext } from 'react';
import { IWikiTerm } from '@/types/wiki';

interface WikiContextValue {
    terms: IWikiTerm[];
}

const WikiContext = createContext<WikiContextValue>({ terms: [] });

export function useWikiTerms() {
    return useContext(WikiContext);
}

export { WikiContext };
