import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { PendingSubmitAnimationBase } from '../../shared/pending-submit-animation-base';
import { AuthService } from './../../services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';
import { Request } from '../../../core/models/request';

const SubmitButtonTitle = 'Вход';
const UnknownErrorMessage = 'Что-то пошло не так :( Попробуйте позже.';
const WrongCredentialsErrorMessage = 'Неверный Email или пароль.'

@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf, RouterLink],
})
export class LoginComponent extends PendingSubmitAnimationBase {
  override submitButtonTitle = SubmitButtonTitle;

  errorMessage = '';

  profileForm = new FormGroup({
    email: new FormControl('', 
      [Validators.required]
    ),
    password: new FormControl('', 
      [Validators.required]
    ),
  });

  constructor(
    private authService: AuthService, 
    private userService: UserService, 
    private router: Router,
  ) { super() }

  hasError(): boolean {
    return this.errorMessage !== '';
  }

  login() {
    this.errorMessage = '';
    const animationTimeout = this.startLoadingAnimation();

    const request: Request.Auth.Login = {
      email: this.profileForm.value.email as string,
      password: this.profileForm.value.password as string,
    };
    
    this.authService.login(request).subscribe({
      next: (value) => {
        if (value.code === HttpStatusCode.Ok){
          this.userService.User = value.body.user;
          this.userService.User.name = value.body.name;
          this.userService.User.surname = value.body.name;

          clearInterval(animationTimeout); 
          
          this.router.navigate(['/', 'tree', 'list']);
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === HttpStatusCode.BadRequest) {
          this.errorMessage = WrongCredentialsErrorMessage;
        } else {
          this.errorMessage = UnknownErrorMessage;
        }
        
        clearInterval(animationTimeout); 
        this.submitButtonTitle = SubmitButtonTitle; 
        this.pending = false;
      },
    });
  }
}