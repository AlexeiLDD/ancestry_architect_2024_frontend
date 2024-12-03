import dTree from 'd3-dtree';
import { SeederOptions } from '../../../shared/modules/tree-seeder/seederOptions';
import { Tree } from '../../../core/models/tree';
import { dSeeder } from '../../../shared/modules/tree-seeder/seeder';
import { deepOmit } from '../../../shared/modules/deep-omit';
import { DateModule } from '../../../shared/modules/date';
import { Member, MemberExcerpt } from '../../../core/models/node';

interface CallbackFunctions {
  sharedNodeEmit: (member: MemberExcerpt) => void,
  contextNodeEmit: (member: MemberExcerpt) => void,
  clickNodeEmit: (member: MemberExcerpt) => void,
  marriageEmit: (extra: { mainId: number, spouseId: number }) => void,
}

export class TreeBuilderService {
  private treeData?: Record<string, any>;

  private dSeederOptions: SeederOptions  = { 
    class: (member: Member) => member.gender,
    extra: (member: Member) => {
      return {
        id: member.id,
        name: member.name,
        nickname: member.nickname,
        date: member.date,
        hasSpouses: member.hasSpouses,
        hasChildren: member.hasChildren,
        hasParents: member.hasParents,
        spouseId: member.spouseId,
        previewPath: member.previewPath,
      };
    }
  };

  private callbackFunctions: CallbackFunctions;

  constructor(sharedNodeEmit: (member: MemberExcerpt) => void,
              contextNodeEmit: (member: MemberExcerpt) => void,
              clickNodeEmit: (member: MemberExcerpt) => void,
              marriageEmit: (extra: { mainId: number, spouseId: number }) => void,
  ) {
    this.callbackFunctions = {
      sharedNodeEmit,
      contextNodeEmit,
      clickNodeEmit,
      marriageEmit,
    };
  }

  init(contId: string, data: Tree) {
    const { memberList, targetId } = this.initData(data);

    const treeData = this.initTreeData(memberList, targetId);

    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) - 100;
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0) - 60;
    
    dTree.init(treeData, {
      target: contId,
      debug: true,
      height: vh,
      width: vw,
      nodeWidth: 150,
      hideMarriageNodes: false,
      marriageNodeSize: 50,
      callbacks: {
        nodeClick: this.nodeClick.bind(this),
        nodeRightClick: this.nodeRightClick.bind(this),
        marriageClick: this.marriageClick.bind(this),
        textRenderer: this.textRenderer,
        nodeRenderer: this.nodeRenderer,
        marriageRenderer: this.marriageRenderer,
      },
    });
  }

  private nodeClick(name: string, extra: MemberExcerpt) {
    this.callbackFunctions.sharedNodeEmit(extra);
    this.callbackFunctions.clickNodeEmit(extra);
  }

  private nodeRightClick(name: string, extra: MemberExcerpt) {
    this.callbackFunctions.sharedNodeEmit(extra);
    this.callbackFunctions.contextNodeEmit(extra);
  }
  
  private marriageClick(extra: any) {
    this.callbackFunctions.marriageEmit(extra);
  }

  private textRenderer(name: string, extra: MemberExcerpt, textClass: string) {
    const date = extra?.date || '';

    let extendedName = name;
    if (extra && extra.nickname) {
      extendedName += ` (${extra.nickname})`;
    }

    let previewPath = 'avatar.webp';
    if (extra && extra?.previewPath !== '') {
      previewPath = extra.previewPath;
    }

    return `
    <div class="node">
      <img class="node__avatar" src="${previewPath}" alt="text" height="50px" width="50px"> 
      <p align="center" class="${textClass}">${extendedName}<div class="node__date">${date}</div></p>
    </div>
    `;
  }

  private nodeRenderer(
    name: any, 
    x: any, y: any, 
    height: any, width: any, 
    extra: any, id: string, 
    nodeClass: string, textClass: any, 
    textRenderer: (arg0: any, arg1: any, arg2: any) => string,
  ) {
    return `
      <div style="height:100px;width:100%;" class="${textClass}" id="node${id}">
        ${textRenderer(name, extra, nodeClass)}
      </div>
    `;
  }

  private marriageRenderer(
    x: any, y: any, 
    height: any, width: any, 
    extra: any, id: any, 
    nodeClass: any,
  ) {
    return `
      <div style="height:100%" class="${nodeClass}" id="node${id}">
        <img src="new-user-svgrepo-com.svg" alt="text" height="50px" width="50px"> 
      </div>
    `;
  }

  private initData(data: Tree): { memberList: Member[], targetId: number } {
    const targetId = data
      .layers[data.layers.length - 1]
      .nodes.find(value => !value.isSpouse)
      ?.id;
    
    if (targetId === undefined) {
      throw new Error('can not get target id');
    }

    const memberList = data.layers
      .flatMap(layer => layer.nodes)
      .map(node => (
        {
          id: node.id,
          name: node.name,
          parent1Id: node.relatives.parents[0] || null,
          parent2Id: node.relatives.parents[1] || null,
          spouseId: node.isSpouse ? node.relatives.spouses[0] : undefined,
          hasSpouses: node.relatives.spouses.length !== 0,
          hasParents: node.relatives.parents.length !== 0,
          hasChildren: node.relatives.children.length !== 0,
          gender: node.gender == 'Мужской' ? 'man' : 'woman',
          previewPath: node.previewPath,
          date: node.deathdate == null 
            ? DateModule.formatDateToPreview(node.birthdate)
            : `${DateModule.formatDateToPreview(node.birthdate)} - ${DateModule.formatDateToPreview(node.deathdate)}`,
        }
      ) as Member);
    console.log(memberList);

    return {
      memberList,
      targetId,
    };
  }

  private initTreeData(memberList: Member[], targetId: number): Record<string, any> {
    let treeData: Record<string, any> = dSeeder.seed(memberList, targetId, this.dSeederOptions) as Record<string, any>;

    return deepOmit(treeData, 'depthOffset');
  }
}
