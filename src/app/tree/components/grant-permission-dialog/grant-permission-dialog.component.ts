import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { DialogComponent } from '../../../shared/components/dialog/dialog.component';

@Component({
  selector: 'app-grant-permission-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './grant-permission-dialog.component.html',
  styleUrl: './grant-permission-dialog.component.scss'
})
export class GrantPermissionDialogComponent extends DialogComponent{
  @Output() submitGrantPermission = new EventEmitter<string>(); 
  
  grantPermissionForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submitGrantPermissionForm() {
    this.submitGrantPermission.emit(this.grantPermissionForm.value.email as string);
  }
}
