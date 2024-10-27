import { Component } from '@angular/core';
import { TreeService } from '../../services/tree/tree.service';
import { Observable } from 'rxjs';
import { Response, TreeListResponse } from '../../../core/models/response';
import { Request } from '../../../core/models/request';
import { AsyncPipe } from '@angular/common';
import { TreeListElementComponent } from '../../components/tree-list-element/tree-list-element.component';
import { GrantPermissionDialogComponent } from '../../components/grant-permission-dialog/grant-permission-dialog.component';
import { PopupMessageComponent } from '../../../shared/components/popup-message/popup-message.component';
import { HttpStatusCode } from '@angular/common/http';

const SucceedMessage = 'Доступ успешно предоставлен.';
const UnknownError = 'Что-то пошло не так. Убедитесь, что пользователь с такой электронной почтой существует.'
const MessageTimeout = 4000; //ms

@Component({
  selector: 'app-tree-list',
  standalone: true,
  imports: [AsyncPipe, TreeListElementComponent, GrantPermissionDialogComponent, PopupMessageComponent],
  templateUrl: './tree-list.component.html',
  styleUrl: './tree-list.component.scss'
})
export class TreeListComponent {
  readonly createdTrees$: Observable<Response<TreeListResponse>>
  readonly availableTrees$: Observable<Response<TreeListResponse>>

  isShownGrantPermissionDialog = false;
  treeId?: number;

  message = '';
  isSucceed = false;
  renderMessage = false;

  constructor(private treeService: TreeService) {
    this.createdTrees$ = this.treeService.getCreatedList();
    this.availableTrees$ = this.treeService.getAvailableList();
  }

  openGrantPermissonDialog(treeId: number) {
    this.treeId = treeId;
    this.isShownGrantPermissionDialog = true;
  }

  closeGrantPermissionDialog() {
    this.isShownGrantPermissionDialog = false;
  }

  grantPermission(email: string) {
    if (this.treeId === undefined) {
      return;
    }

    const request: Request.Tree.GrantPermission = {
      treeID: this.treeId,
      email: email,
    }

    this.treeService.grantPermission(request).subscribe({
      next: (value) => {
        if (value.code === HttpStatusCode.Ok && value.body.success){
          this.closeGrantPermissionDialog();
          this.message = SucceedMessage;
          this.isSucceed = true;
          this.showMessage();

          return;
        }

        this.message = UnknownError;
        this.isSucceed = false;
        this.showMessage();
      },
      error: () => {
        this.message = UnknownError;
        this.isSucceed = false;
        this.showMessage();
      },
    });
  }

  private showMessage() {
    this.renderMessage = true;

    setTimeout(() => {
      this.renderMessage = false;
    }, MessageTimeout)
  }
}
