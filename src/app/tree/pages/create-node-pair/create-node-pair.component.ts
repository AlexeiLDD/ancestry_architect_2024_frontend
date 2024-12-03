import { Component} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PendingSubmitAnimationBase } from '../../../auth/shared/pending-submit-animation-base';
import { PopupMessageComponent } from '../../../shared/components/popup-message/popup-message.component';
import { NodeService } from '../../services/node/node.service';
import { DateModule } from '../../../shared/modules/date';
import { Request } from '../../../core/models/request';

const Title = 'Добавление родителей'
const SubmitButtonTitle = 'Добавить родителей';
const SucceedMessage = 'Данные успешно обновлёны.';
const UnknownError = 'Что-то пошло не так. Попробуйте позже.'
const MessageTimeout = 4000; //ms

@Component({
  selector: 'app-create-node-pair',
  standalone: true,
  imports: [ReactiveFormsModule, NgOptimizedImage, PopupMessageComponent, FormsModule],
  templateUrl: './create-node-pair.component.html',
  styleUrl: './create-node-pair.component.scss'
})
export class CreateNodePairComponent extends PendingSubmitAnimationBase {
  title = Title;
  override submitButtonTitle = SubmitButtonTitle;

  message = '';
  isSucceed = false;
  renderMessage = false;

  pairNodeForm = new FormGroup({
    name1: new FormControl(''),
    birthdate1: new FormControl(''),
    deathdate1: new FormControl(''),
    gender1: new FormControl(''),
    description1: new FormControl(''),
    previewPath1: new FormControl(''),
    name2: new FormControl(''),
    birthdate2: new FormControl(''),
    deathdate2: new FormControl(''),
    gender2: new FormControl(''),
    description2: new FormControl(''),
    previewPath2: new FormControl(''),
  });

  private nodeFormData1 = new FormData();
  private nodeFormData2 = new FormData();

  treeId: number;
  childId?: number;
  mainParant = 1;

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

    const childId = this.route.snapshot.queryParamMap.get('childId');
    if (childId !== null) {
      this.childId = Number(childId);
    } else {
      throw new Error('failed to get child id');
    }
  }

  loadAvatar(event: Event) {
    const target = event.target as HTMLInputElement;
    let file = target.files?.[0];

    if (file === undefined) {
      return;
    }

    const nodeFormData = target.name === 'avatar1' ? this.nodeFormData1 : this.nodeFormData2;
    nodeFormData.set("preview", file);

    const avatarReader = new FileReader();
    avatarReader.onload = (event) => {
      if (target.name === 'avatar1') {
        this.pairNodeForm.patchValue({ previewPath1: event.target?.result as string });
      } else {
        this.pairNodeForm.patchValue({ previewPath2: event.target?.result as string });
      }
    }

    avatarReader.readAsDataURL(file);
  }

  createPairNode() {
    const birthdate1 = DateModule.formatDate(this.pairNodeForm.controls.birthdate1.value as string);
    const birthdate2 = DateModule.formatDate(this.pairNodeForm.controls.birthdate2.value as string);
    let deathdate1: string | null = null;
    if (this.pairNodeForm.controls.deathdate1.value !== null && this.pairNodeForm.controls.deathdate1.value !== '') {
      deathdate1 = DateModule.formatDate(this.pairNodeForm.controls.deathdate1.value as string);
    }
    let deathdate2: string | null = null;
    if (this.pairNodeForm.controls.deathdate2.value !== null && this.pairNodeForm.controls.deathdate2.value !== '') {
      deathdate2 = DateModule.formatDate(this.pairNodeForm.controls.deathdate2.value as string);
    }

    const requestData1: Request.Node.Create = {
      isFirstNode: false,
      treeID: this.treeId,
      name: this.pairNodeForm.controls.name1.value as string,
      isSpouse: this.mainParant !== 1,
      gender: this.pairNodeForm.controls.gender1.value as string,
      addition: {
        birthdate: birthdate1,
        deathdate: deathdate1,
        description: this.pairNodeForm.controls.description1.value as string,
      },
      relatives: {
        children: [Number(this.childId)],
        parents: null,
        spouses: null,
        siblings: null,
      },
    };

    const requestData2: Request.Node.Create = {
      isFirstNode: false,
      treeID: this.treeId,
      name: this.pairNodeForm.controls.name2.value as string,
      isSpouse: this.mainParant !== 2,
      gender: this.pairNodeForm.controls.gender2.value as string,
      addition: {
        birthdate: birthdate2,
        deathdate: deathdate2,
        description: this.pairNodeForm.controls.description2.value as string,
      },
      relatives: {
        children: [Number(this.childId)],
        parents: null,
        spouses: null,
        siblings: null,
      },
    };

    let firstRequestData, secondRequestData: Request.Node.Create;
    let firstFormData, secondFormData: FormData;
    let firstPreviewPath, secondPreviewPath: string | null;
    if (this.mainParant === 1) {
      firstRequestData = requestData1;
      secondRequestData = requestData2;
      firstFormData = this.nodeFormData1;
      secondFormData = this.nodeFormData2;
      firstPreviewPath = this.pairNodeForm.controls.previewPath1.value;
      secondPreviewPath = this.pairNodeForm.controls.previewPath2.value;
    } else {
      firstRequestData = requestData2;
      secondRequestData = requestData1;
      firstFormData = this.nodeFormData2;
      secondFormData = this.nodeFormData1;
      firstPreviewPath = this.pairNodeForm.controls.previewPath2.value;
      secondPreviewPath = this.pairNodeForm.controls.previewPath1.value;
    }

    this.message = '';
    const animationTimeout = this.startLoadingAnimation();

    this.nodeService.create(firstRequestData).subscribe((value) => {
      if (value.code === HttpStatusCode.Ok){
        const { id } = value.body;

        if (firstPreviewPath !== '') {
          this.nodeService.updatePreview(id, firstFormData).subscribe(() => {});
        } 

        secondRequestData.relatives.spouses = [id];
        this.nodeService.create(secondRequestData).subscribe((value) => {
          if (value.code === HttpStatusCode.Ok){
            const { id } = value.body;

            if (secondPreviewPath !== '') {
              this.nodeService.updatePreview(id, secondFormData).subscribe(() => {});
            } 

            this.message = SucceedMessage;
            this.isSucceed = true;
            this.router.navigate(['/', 'tree', this.treeId]);
          } else {
            this.message = UnknownError;
            this.isSucceed = false;
          }
        });
      } else {
        this.message = UnknownError;
        this.isSucceed = false;
      }

      clearInterval(animationTimeout); 
      this.showMessage();

      this.pending = false;
    });
  }

  private showMessage() {
    this.renderMessage = true;

    setTimeout(() => {
      this.renderMessage = false;
    }, MessageTimeout)
  }
}
