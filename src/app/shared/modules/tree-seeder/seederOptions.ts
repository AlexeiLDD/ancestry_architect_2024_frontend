import { Member } from "./member";

export interface SeederOptions {
    class?: (member: Member) => string;
    textClass?: (member: Member) => string;
    extra?: (member: Member) => object;
}
