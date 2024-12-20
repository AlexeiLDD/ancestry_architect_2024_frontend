import { Member } from "../../../core/models/node";
import { SeederOptions } from "./seederOptions";

export class TreeNode {
    id: number;
    name: string;
    class: string;
    textClass: string;
    depthOffset: number;
    marriages: TreeNodeMarriage[];
    extra: object;

    constructor(member: Member, options?: SeederOptions) {
        this.id = member.id;
        this.name = member?.name ?? "";
        this.class = options?.class?.(member) ?? "";
        this.textClass = options?.textClass?.(member) ?? "";
        this.depthOffset = member.depthOffset ?? -1;
        this.marriages = new Array<TreeNodeMarriage>();
        this.extra = options?.extra?.(member) ?? {};
    }
    
    canInsertAsDescendant(descendent: TreeNode): boolean {
        if (this.id === descendent.id) {
            return false;
        }

        // use for loop instead of forEach, forEach's function boundary inhibits proper return statements
        for (let index = 0; index < this.marriages.length; index++) {
            const marriage = this.marriages[index];

            if (marriage.spouse?.id === descendent.id) {
                return false;
            }

            if (marriage.children.map(child => child.id).includes(descendent.id)) {
                this._overwriteChild(marriage, descendent);
                return true;
            }

            if (this._canInsertAsDescendantByPivotingOnAMarriage(marriage, descendent)) {
                return true;
            }

            if (marriage.children.some((child) => child.canInsertAsDescendant(descendent))) {
                return true;
            }
        }
        
        return false;
    }

    private _overwriteChild(marriage: TreeNodeMarriage, newChild: TreeNode): void {
        const index = marriage.children.findIndex(child => child.id === newChild.id);
        marriage.children.splice(index, 1, newChild);
    }

    private _canInsertAsDescendantByPivotingOnAMarriage(marriage: TreeNodeMarriage, descendent: TreeNode): boolean {
        if (marriage.spouse === undefined) {
            return false;
        }

        const childIds = marriage.children.map(child => child.id);
        if (!descendent.marriages.map(m => m.spouse?.id)
            .some(id => childIds.includes(id as number))) {
            return false;
        }

        const marriageToPivotOn = descendent.marriages.find(m => childIds.includes(m.spouse?.id as number));
        const newDescendent = this._pivotOnMarriage(marriageToPivotOn as TreeNodeMarriage, descendent);
        this._overwriteChild(marriage, newDescendent);

        return true;
    }

    private _pivotOnMarriage(marriage: TreeNodeMarriage, descendent: TreeNode): TreeNode {
        const newDescendent = marriage?.spouse as TreeNode;
        const newMarriage = new TreeNodeMarriage();

        // clear others to prevent nested marriage chains
        descendent.marriages = new Array<TreeNodeMarriage>();
        newMarriage.spouse = descendent;
        newMarriage.children = marriage?.children;
        newDescendent.marriages.push(newMarriage);

        return newDescendent;
    }
}

export class TreeNodeMarriage {
    spouse: TreeNode | null;
    children: TreeNode[];
    extra?: { mainId: number, spouseId: number };

    constructor() {
        this.spouse = null;
        this.children = new Array<TreeNode>();
    }
}
