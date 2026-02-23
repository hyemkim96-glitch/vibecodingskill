export interface IWikiTerm {
    id: string;
    term: string;
    definition: string;
    category: string | null;
    url: string | null;
    published: boolean;
    created_at: string;
}
