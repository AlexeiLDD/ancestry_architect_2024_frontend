import { Node } from "./node";

export interface TreeExcerpt {
    id: number,
    user_id: number,
    name: string
}

export interface Tree {
    id: number;
    name: string;
    layers: Array<Layer>;
}

export interface Layer {
    id: number;
    number: number;
    nodes: Array<Node>;
}
