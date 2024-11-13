
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
    spouses: number[];
    parents: number[];
    children: number[];
}

export interface CreateNode {
    isFirstNode: boolean;
    treeID: number;
    name: string;
    isSpouse: boolean;
    gender: string;
    addition: CreateAddition;
    relatives: CreateRelativesList;
}

interface CreateAddition {
    birthdate: string;
    deathdate: string | null;
    description: string;
}

export interface CreateRelativesList {
    spouses: number[] | null;
    parents: number[] | null;
    children: number[] | null;
    siblings: null;
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
    previewPath: string;
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
    previewPath: string;
}