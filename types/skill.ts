export interface ISkill {
    id?: string;
    name: string;
    description: string;
    content: string;
    tokens: string;
    effect: string;
    tags: string[];
    author_id?: string;
    status?: 'pending' | 'approved';
    created_at?: string;
}
