export interface IProfile {
    id: string;
    username: string;
    ranking: {
        level: string;
        points: number;
    };
    badge: string;
    role: 'user' | 'admin';
    created_at: string;
}
