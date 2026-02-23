export interface IWikiTerm {
    id: string;
    term: string;
    definition: string;
    category: string | null;
    example: string | null;
    published: boolean;
    created_at: string;
}
