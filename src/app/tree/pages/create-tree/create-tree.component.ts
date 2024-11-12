import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TreeService } from '../../services/tree/tree.service';
import { HttpStatusCode, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

const UnknownErrorMessage = 'Что-то пошло не так :( Попробуйте позже.';

@Component({
  selector: 'app-create-tree',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-tree.component.html',
  styleUrl: './create-tree.component.scss'
})
export class CreateTreeComponent {
  createTreeForm = new FormGroup({
    name: new FormControl('', [Validators.required,]),
  });

  errorMessage = '';
  
  constructor(
    private treeService: TreeService,
    private router: Router,
  ) {}

  submitCreateTreeForm() {
    this.treeService.create({name: this.createTreeForm.controls.name.value as string}).subscribe({
      next: (value) => {
        if (value.code === HttpStatusCode.Ok){
          const { id } = value.body;

          this.errorMessage = '';

          this.router.navigateByUrl(`tree/${id}`);
        }

        this.errorMessage = UnknownErrorMessage;
      },
      error: (err: HttpErrorResponse) => {
          this.errorMessage = UnknownErrorMessage;
      },
    });
  }
}
