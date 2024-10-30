import { Member } from "../../../core/models/tree";

export interface SeederOptions {
    class?: (member: Member) => string;
    textClass?: (member: Member) => string;
    extra?: (member: Member) => object;
}
