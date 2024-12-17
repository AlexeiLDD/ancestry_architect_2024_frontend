import { Member } from "../../../core/models/node";
import { SeederOptions } from "./seederOptions";
import { TreeNode, TreeNodeMarriage } from "./treeNode";

export namespace dSeeder {
    let _generationLimit = 100; // Ограничение на количество поколений

    // Получение члена семьи по ID с сохранением данных о родителях
    function _getWithParentIds(data: Member[], id: number | null): Member {
        const member = data.find((member) => member.id === id);

        if (member === undefined) {
            throw new Error(`Member with id (${id}) was not found`); // Ошибка, если член не найден
        }
        return member;
    }

    // Получение члена семьи по ID без данных о родителях
    function _getWithoutParentIds(data: Member[], id: number | null): Member {
        let member = _getWithParentIds(data, id);

        member.parent1Id = null;
        member.parent2Id = null; // Удаляем информацию о родителях
        return member;
    }

    // Получение списка членов семьи по множеству ID с опцией сохранения данных о родителях
    function _get(data: Member[], ids: number[], options: { preserveParentIds: boolean }): Member[] {
        const members = new Array<Member>();
        ids.forEach(id => {
            const member = (options.preserveParentIds)
                ? _getWithParentIds(data, id) // Если нужно сохранить информацию о родителях
                : _getWithoutParentIds(data, id); // Если не нужно сохранять информацию о родителях
            members.push(member);
        });
        return members;
    }

    // Получение детей для указанных родителей
    function _getChildren(data: Member[], ...parents: Member[]): Member[] {
        const childIds = data.filter((member) =>
            parents.some((parent) => parent.id === member.parent1Id || parent.id === member.parent2Id))
            .map((member) => member.id);

        if (childIds.length === 0) {
            return []; // Если детей нет, возвращаем пустой массив
        }
        const children = _get(data, childIds, { preserveParentIds: true });

        const parentDepthOffset = parents.find((parent) => parent.depthOffset !== undefined)?.depthOffset;
        if (parentDepthOffset !== undefined) {
            children.forEach((child) => child.depthOffset = parentDepthOffset + 1); // Устанавливаем глубину детей
        }
        return children;
    }

    // Получение других родителей для указанных детей и родителей
    function _getOtherParents(data: Member[], children: Member[], ...parents: Member[]): Member[] {
        const parentIds = parents.map((parent) => parent.id);
        const otherParentIds = children.map((child) =>
            parentIds.includes(child.parent1Id as number)
                ? child.parent2Id
                : child.parent1Id);

        // Удаляем дубликаты, если у братьев/сестер общий родитель
        const uniqueOtherParentIds = otherParentIds.filter((value, index) =>
            index === otherParentIds.indexOf(value));

        // Убираем родительские ID, чтобы их предков не включали
        const otherParents = _get(data, uniqueOtherParentIds as number[], { preserveParentIds: false });

        const parentDepthOffset = parents.find((parent) => parent.depthOffset !== undefined)?.depthOffset;
        if (parentDepthOffset !== undefined) {
            otherParents.forEach((otherParent) => otherParent.depthOffset = parentDepthOffset); // Устанавливаем глубину для других родителей
        }
        return otherParents;
    }

    // Получение супругов для членов семьи
    function _getSpouses(rawData: Member[], preparedData: Member[]): Member[] {
        return rawData
            .filter((member) => member.spouseId !== undefined)
            .filter((member) => preparedData.find((anotherMember) => anotherMember.id === member.id) === undefined);
    }

    // Получение всех родственников для указанного ID
    function _getRelatives(data: Member[], targetId?: number): Member[] {
        if (data.length === 0) {
            throw new Error("Data cannot be empty"); // Ошибка, если данные пусты
        }

        if (targetId === undefined) {
            throw new Error("TargetId cannot be undefined"); // Ошибка, если не указан targetId
        }

        const depthOffsetStart = 1; // Начальная глубина
        const members = new Array<Member>();

        const target = _getWithParentIds(data, targetId);

        const hasParent1 = target.parent1Id !== null;
        const hasParent2 = target.parent2Id !== null;
        if (!hasParent1 && !hasParent2) {
            target.depthOffset = depthOffsetStart;
        } else {
            target.depthOffset = depthOffsetStart + 1;

            const parentIds = new Array<number>();
            if (hasParent1) {
                parentIds.push(target.parent1Id as number);
            }
            if (hasParent2) {
                parentIds.push(target.parent2Id as number);
            }
            const parents = _get(data, parentIds, { preserveParentIds: false });
            parents.forEach((parent) => parent.depthOffset = depthOffsetStart);
            members.push(...parents);

            const siblingIds = data.filter((member) =>
                ((member.parent1Id === target.parent1Id || member.parent2Id === target.parent2Id)
                    || (member.parent1Id === target.parent2Id || member.parent2Id === target.parent1Id))
                && member.id !== target.id).map((member) => member.id);
            const siblings = _get(data, siblingIds, { preserveParentIds: true });
            siblings.forEach((sibling) => sibling.depthOffset = depthOffsetStart + 1);
            members.push(...siblings);
        }
        members.push(target);

        const children = _getChildren(data, target);
        members.push(...children);

        if (children.length === 0) {
            const spouses = _getSpouses(data, members);
            members.push(...spouses);
            return members;
        }

        const otherParents = _getOtherParents(data, children, target);
        members.push(...otherParents);

        let nextGeneration = children;
        do {
            const nextGenerationChildren = _getChildren(data, ...nextGeneration);
            members.push(...nextGenerationChildren);

            const nextGenerationOtherParents = _getOtherParents(data, nextGenerationChildren, ...nextGeneration);
            members.push(...nextGenerationOtherParents);

            nextGeneration = nextGenerationChildren;
        } while (nextGeneration.length > 0);

        const spouses = _getSpouses(data, members);
        members.push(...spouses);

        return members;
    }

    // Объединение данных в структуру браков
    function _combineIntoMarriages(data: Member[], options?: SeederOptions): TreeNode[] {
        if (data.length === 1) {
            return data.map((member) => new TreeNode(member, options));
        }

        let parentGroups = data
            .filter((member) => member.spouseId !== undefined)
            .map(val => [val.spouseId, val.id]);

        const treeNodes = new Array<TreeNode>();
        parentGroups.forEach((currentParentGroup) => {
            const nodeId = currentParentGroup[0];
            const node = new TreeNode(_getWithParentIds(data, nodeId as number), options);

            const nodeMarriages = parentGroups.filter((group) => group.includes(nodeId));
            nodeMarriages.forEach((marriedCouple) => {
                const index = parentGroups.indexOf(marriedCouple);
                if (index !== parentGroups.indexOf(currentParentGroup)) {
                    parentGroups.splice(index, 1); // Удаляем группу брака, чтобы избежать повторных обработок
                }

                const marriage = new TreeNodeMarriage();

                const spouseId = marriedCouple[1];
                if (spouseId !== undefined) {
                    marriage.spouse = new TreeNode(_getWithParentIds(data, spouseId), options);
                    marriage.extra = { mainId: nodeId as number, spouseId: marriage.spouse.id };
                }

                marriage.children = data.filter((member) => {
                    if (member.parent1Id !== null && member.parent2Id !== null) {
                        return marriedCouple.includes(member.parent1Id as number)
                            && marriedCouple.includes(member.parent2Id as number);
                    }
                    if (member.parent1Id !== null && member.parent2Id === null) {
                        return marriedCouple.includes(member.parent1Id as number)
                            && member.parent2Id === null;
                    }
                    if (member.parent1Id === null && member.parent2Id !== null) {
                        return marriedCouple.includes(member.parent2Id as number)
                            && member.parent1Id === null;
                    }
                    return false;
                }).map((child) => new TreeNode(child, options));
                node.marriages.push(marriage);
            });

            treeNodes.push(node);
        });

        return treeNodes;
    }

    // Упорядочение и объединение деревьев в одну структуру
    function _coalesce(data: TreeNode[]): TreeNode[] {
        if (data.length === 0) {
            throw new Error("Data cannot be empty"); // Ошибка, если данных нет
        }

        if (data.length === 1) {
            return data;
        }

        let count = 0;
        while (data.length > 1) {
            for (let index = 0; index < data.length; index++) {
                const node = data[index];
                const otherNodes = data.filter((otherNode) => otherNode !== node);

                if (otherNodes.some(otherNode => otherNode.canInsertAsDescendant(node))) {
                    data.splice(index, 1); // Удаляем узел, если он может быть потомком другого
                }
            }
            count++;

            if (count > _generationLimit) {
                throw new Error(`Data contains multiple roots or spans more than ${_generationLimit} generations.`); // Ошибка, если превышено количество поколений
            }
        }
        return data;
    }

    // Основная функция для инициализации дерева
    export function seed(data: Member[], targetId: number, options?: SeederOptions): TreeNode[] {
        const members = _getRelatives(data, targetId); // Получаем родственников
        const marriages = _combineIntoMarriages(members, options); // Объединяем в структуру браков
        const rootNode = _coalesce(marriages); // Собираем дерево
        return rootNode;
    }
    
    export const _private = {
        _getRelatives,
        _combineIntoMarriages,
        _coalesce
    };
}
