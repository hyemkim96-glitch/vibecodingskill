export interface IArticle {
    id: string;
    title: string;
    description: string | null;
    category: 'guide' | 'tool';
    read_time: number | null;
    url: string | null;
    color: string | null;
    content: string | null;
    published: boolean;
    created_at: string;
}
