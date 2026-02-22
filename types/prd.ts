export interface IPRD {
    id?: string;
    user_id: string;
    content: string;
    metadata: {
        serviceName: string;
        targetUser: string;
        keyFeatures: string[];
        designSystem: string;
        techStack: string;
    };
    created_at?: string;
}
