import { Member, MemberExcerpt } from "../../../core/models/node";

export interface SeederOptions {
    class?: (member: Member) => string;
    textClass?: (member: Member) => string;
    extra?: (member: Member) => MemberExcerpt;
}
