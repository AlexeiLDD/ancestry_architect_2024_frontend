import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';
import { AsyncPipe, NgStyle } from '@angular/common';
import { Observable } from 'rxjs';
import { TreeService } from '../../services/tree/tree.service';
import { TreeBuilderService } from '../../services/tree-builder/tree-builder.service';
import { Tree } from '../../../core/models/tree';
import { ClickOutsideDirective } from '../../../shared/directives/click-outside/click-outside.directive';
import { MemberExcerpt } from '../../../core/models/node';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';
import { NodeService } from '../../services/node/node.service';
import { Response, NodeDescriptionResponse } from '../../../core/models/response';


@Component({
  selector: 'app-tree',
  standalone: true,
  imports: [ClickOutsideDirective, DialogComponent, NgStyle, RouterLink, AsyncPipe],
  templateUrl: './tree.component.html',
  styleUrl: './tree.component.scss'
})
export class TreeComponent {
  contId = '#tree';
  @ViewChild("treeCont", {read: ElementRef}) treeCont: ElementRef | undefined;

  id?: number;
  tree?: Tree;
  currentMember?: MemberExcerpt;

  contextMenuIsRendered = false;
  contextMenuCoordinates = {
    'top.px': 0,
    'left.px': 0,
  };

  isShownDescriptionDialog = false;
  descriptionText$?: Observable<Response<NodeDescriptionResponse>>;

  private treeBuildService: TreeBuilderService;

  constructor(
    private treeService: TreeService,
    private nodeService: NodeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.treeBuildService = new TreeBuilderService(
      this.changeCurrentMember.bind(this),
      this.showContextMenu.bind(this),
      this.openDescriptionDialog.bind(this),
      this.addChild.bind(this),
    );

    this.route.paramMap.subscribe((params) => {
      const stringId = params.get('id');

      this.id = Number(stringId);

      this.treeService.get(this.id as number).subscribe((treeResp) => {
        console.log(treeResp.body);
        this.tree = treeResp.body;
        this.treeBuildService.init(this.contId, this.tree as Tree);
      });
    });
  }

  changeCurrentMember(member: MemberExcerpt) {
    this.currentMember = member;
  }

  showContextMenu(member: MemberExcerpt) {
    console.log(member);
    this.contextMenuIsRendered = true;
  }

  closeContextMenu() {
    if (this.contextMenuIsRendered) {
      this.contextMenuIsRendered = false;
    }
  }

  openDescriptionDialog(member: MemberExcerpt) {
    this.descriptionText$ = this.nodeService.getDescription(member.id);
    this.isShownDescriptionDialog = true;
  }

  closeDescriptionDialog() {
    this.isShownDescriptionDialog = false;
  }

  addChild(parentIds: { mainId: number, spouseId: number }) {
    this.router.navigate( ['/', 'tree', this.id, 'node'], { queryParams: { type: 'child', ...parentIds } });
  }

  canDelete() {
    return (this.currentMember?.spouseId !== undefined && !this.currentMember.hasChildren) ||
      (this.currentMember?.spouseId === undefined && !this.currentMember?.hasChildren && !this.currentMember?.hasSpouses);
  }

  deleteNode() {
    this.nodeService.delete(this.currentMember?.id as number).subscribe({
      next: (value) => {
        if (value.code === HttpStatusCode.Ok) {
          if (this.treeCont !== undefined) {
            this.treeCont.nativeElement.innerHTML = '';
          }

          this.treeService.get(this.id as number).subscribe((treeResp) => {
            this.tree = treeResp.body;
            this.treeBuildService.init(this.contId, this.tree as Tree);
          });
        }
      },
    });
  }

  getPointerCoordinates(event: MouseEvent) {
    this.contextMenuCoordinates = {
      'top.px': event.clientY,
      'left.px': event.clientX,
    }
  }
}
