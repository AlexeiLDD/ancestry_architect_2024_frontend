
export interface Node {
    id: number;
    layerID: number;
    name: string;
    birthdate: string;
    deathdate:string | null;
    previewPath: string;
    relatives: RelativesList;
    isSpouse: boolean;
    gender: string;
}

interface RelativesList {
    spouses: Array<number>;
    parents: Array<number>;
    children: Array<number>;
}

export interface Member {
    id: number;
    name?: string;
    parent1Id: number | null;
    parent2Id: number | null;
    hasSpouses: boolean;
    hasParents: boolean;
    hasChildren: boolean;
    spouseId?: number;
    gender: string;
    date?: string;
    nickname?: string;
    depthOffset?: number;
}

export interface MemberExcerpt {
    id: number;
    name?: string;
    hasSpouses: boolean;
    hasParents: boolean;
    hasChildren: boolean;
    spouseId?: number;
    date?: string;
    nickname?: string;
}