
export interface TreeExcerpt {
    id: number,
    user_id: number,
    name: string
}

export interface Member {
    id: number;
    name?: string;
    parent1Id: number | null;
    parent2Id: number | null;
    spouseId?: number;
    gender?: string;
    date?: string;
    nickname?: string;
    depthOffset?: number;
}
