import { Component} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PendingSubmitAnimationBase } from '../../../auth/shared/pending-submit-animation-base';
import { PopupMessageComponent } from '../../../shared/components/popup-message/popup-message.component';
import { NodeService } from '../../services/node/node.service';
import { DateModule } from '../../../shared/modules/date';
import { Request } from '../../../core/models/request';
import { CreateRelativesList } from '../../../core/models/node';

enum EventType {
  EditNode = 'edit',
  AddFirstNode = 'first',
  AddSpouseNode = 'spouse',
  AddChildNode = 'child',
}

const Titles: Record<EventType, string> = {
  edit: 'Редактирование данных роственника',
  first: 'Добавление первого родственника',
  spouse: 'Добавление супруга',
  child: 'Добавление ребенка',
};

const SubmitButtonEditTitle = 'Обновить данные';
const SubmitButtonAddTitle = 'Добавить родственника';
const SucceedMessage = 'Данные успешно обновлёны.';
const UnknownError = 'Что-то пошло не так. Попробуйте позже.'
const MessageTimeout = 4000; //ms

@Component({
  selector: 'app-edit-node',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage, PopupMessageComponent],
  templateUrl: './edit-node.component.html',
  styleUrl: './edit-node.component.scss'
})
export class EditNodeComponent extends PendingSubmitAnimationBase {
  message = '';
  isSucceed = false;
  renderMessage = false;

  nodeForm = new FormGroup({
    name: new FormControl(''),
    birthdate: new FormControl(''),
    deathdate: new FormControl(''),
    gender: new FormControl(''),
    description: new FormControl(''),
    previewPath: new FormControl(''),
  });

  private nodeFormData = new FormData();

  title: string;
  type: EventType;
  treeId: number;
  nodeId?: number;

  constructor(
    private nodeService: NodeService, 
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super();

    const treeId = this.route.snapshot.paramMap.get('id');
    if (treeId !== null) {
      this.treeId = Number(treeId);
    } else {
      throw new Error('failed to get tree id');
    }
     
    const formType = this.route.snapshot.queryParamMap.get('type');
    if (formType === null) {
      throw new Error('no type');
    }

    this.type = formType as EventType;
    this.title = Titles[formType as EventType];
    this.submitButtonTitle = this.type === EventType.EditNode ? SubmitButtonEditTitle : SubmitButtonAddTitle;
    if (formType !== EventType.EditNode) {
      return;
    }

    const nodeId = this.route.snapshot.paramMap.get('nodeId');
    if (nodeId !== null) {
      this.nodeId = Number(nodeId);
    } else {
      throw new Error('failed to get node id');
    }

    forkJoin({
      node: this.nodeService.get(this.nodeId),
      description: this.nodeService.getDescription(this.nodeId),
    }).subscribe((value) => {
      if (value.node.code === HttpStatusCode.Ok && value.description.code === HttpStatusCode.Ok){
        const { name, birthdate, deathdate, gender, previewPath } = value.node.body;
        const { description } = value.description.body;

        this.nodeForm.patchValue({
          name,
          birthdate,
          deathdate,
          gender,
          description,
          previewPath,
        });
      }
    });
  } 

  loadAvatar(event: Event) {
    let file = (event.target as HTMLInputElement).files?.[0];

    if (file === undefined) {
      return;
    }

    this.nodeFormData.set("preview", file);

    const avatarReader = new FileReader();
    avatarReader.onload = (event) => {
      this.nodeForm.patchValue({ previewPath: event.target?.result as string });
    }

    avatarReader.readAsDataURL(file);
  }

  updateNode() {
    switch (this.type) {
      case EventType.EditNode:
        this.editNode();
        break; 

      case EventType.AddFirstNode:
      case EventType.AddChildNode:
      case EventType.AddSpouseNode:
        this.createNode();
        break;

      default:
        throw new Error('unknown type');
    }
  }

  private editNode() {
    const birthdate = DateModule.formatDate(this.nodeForm.controls.birthdate.value as string);
    let deathdate: string | null = null;
    if (this.nodeForm.controls.deathdate.value !== null) {
      deathdate = DateModule.formatDate(this.nodeForm.controls.deathdate.value as string);
    }
    
    const requestData: Request.Node.Edit = {
      name: this.nodeForm.controls.name.value as string,
      birthdate: birthdate,
      deathdate: deathdate,
      description: this.nodeForm.controls.description.value as string,
      gender: this.nodeForm.controls.gender.value as string,
    }

    this.message = '';
    const animationTimeout = this.startLoadingAnimation();

    this.nodeService.edit(this.nodeId as number, requestData).subscribe({
      next: (value) => {
        if (value.code === HttpStatusCode.Ok){
          if (this.nodeForm.controls.previewPath.value !== '') {
            this.nodeService.updatePreview(this.nodeId as number, this.nodeFormData).subscribe(() => { return; });
          }

          this.message = SucceedMessage;
          this.isSucceed = true;
        } else {
          this.message = UnknownError;
          this.isSucceed = false;
        }
        

        clearInterval(animationTimeout); 
        this.showMessage();

        this.submitButtonTitle = SubmitButtonEditTitle;
        this.pending = false;
      },
      error: (error) => {
        this.message = UnknownError;
        this.isSucceed = false;

        clearInterval(animationTimeout); 
        this.showMessage();

        this.submitButtonTitle = SubmitButtonEditTitle; 
        this.pending = false;
      },
    });
  }

  private createNode() {
    const birthdate = DateModule.formatDate(this.nodeForm.controls.birthdate.value as string);
    let deathdate: string | null = null;
    if (this.nodeForm.controls.deathdate.value !== null && this.nodeForm.controls.deathdate.value !== '') {
      deathdate = DateModule.formatDate(this.nodeForm.controls.deathdate.value as string);
    }

    const requestData: Request.Node.Create = {
      isFirstNode: this.type === EventType.AddFirstNode,
      treeID: this.treeId,
      name: this.nodeForm.controls.name.value as string,
      isSpouse: this.type === EventType.AddSpouseNode,
      gender: this.nodeForm.controls.gender.value as string,
      addition: {
        birthdate: birthdate,
        deathdate: deathdate,
        description: this.nodeForm.controls.description.value as string,
      },
      relatives: this.getRelatives(),
    };

    this.message = '';
    const animationTimeout = this.startLoadingAnimation();

    this.nodeService.create(requestData).subscribe((value) => {
      if (value.code === HttpStatusCode.Ok){
        const { id } = value.body;
        if (this.nodeForm.controls.previewPath.value !== '') {
          this.nodeService.updatePreview(id, this.nodeFormData).subscribe(() => {});
        } 

        this.message = SucceedMessage;
        this.isSucceed = true;
        this.router.navigate(['/', 'tree', this.treeId]);
      } else {
        this.message = UnknownError;
        this.isSucceed = false;
      }

      clearInterval(animationTimeout); 
      this.showMessage();

      this.submitButtonTitle = SubmitButtonAddTitle; 
      this.pending = false;
    });
  }

  private getRelatives(): CreateRelativesList {
    switch (this.type) {
      case EventType.AddFirstNode:
        return {
          children: null,
          parents: null,
          spouses: null,
          siblings: null,
        };
      
      case EventType.AddSpouseNode:
        const spouseId = this.route.snapshot.queryParamMap.get('spouseId');
        if (spouseId === null) {
          throw new Error('no spouseId');
        }

        return {
          children: null,
          parents: null,
          spouses: [Number(spouseId)],
          siblings: null,
        };
      
      case EventType.AddChildNode:
        const firstId = this.route.snapshot.queryParamMap.get('mainId');
        if (firstId === null) {
          throw new Error('no mainId');
        }

        const secondId = this.route.snapshot.queryParamMap.get('spouseId');
        if (secondId === null) {
          throw new Error('no spouseId');
        }

        return {
          children: null,
          parents: [Number(firstId), Number(secondId)],
          spouses: null,
          siblings: null,
        };
      
      default:
        throw new Error('wrong type');
    }
  }

  private showMessage() {
    this.renderMessage = true;

    setTimeout(() => {
      this.renderMessage = false;
    }, MessageTimeout)
  }
}
