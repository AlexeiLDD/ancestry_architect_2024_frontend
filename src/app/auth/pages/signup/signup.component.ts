import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';
import { PendingSubmitAnimationBase } from '../../shared/pending-submit-animation-base';
import { AuthService } from './../../services/auth/auth.service';
import { dotValidator, specialSymbolsValidator } from '../../shared/directives/special-symbols.directive';
import { EqualValidator } from '../../shared/directives/equal.directive';
import { UserService } from '../../../core/services/user/user.service';
import { Request } from '../../../core/models/request';

const SubmitButtonTitle = 'Регистрация';
const UnknownErrorMessage = 'Что-то пошло не так :( Попробуйте позже.';

@Component({
  selector: 'signup-page',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, NgClass, NgIf, RouterLink],
})
export class SignupComponent extends PendingSubmitAnimationBase {
  override submitButtonTitle = SubmitButtonTitle;

  errorMessage = '';
  // Object represents a pointer to password string.
  passwordObj = { password: '' };

  profileForm = new FormGroup({
    email: new FormControl('', 
      [Validators.required, Validators.email, dotValidator]
    ),
    password: new FormControl('', 
      [Validators.required, Validators.minLength(8), specialSymbolsValidator]
    ),
    repeatedPassword : new FormControl('', 
      [Validators.required, EqualValidator(this.passwordObj)]
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

  onChange(){
    this.passwordObj.password = this.profileForm.value.password as string;

    this.profileForm.controls.repeatedPassword.enable();
  }

  signup() {
    const animationTimeout = this.startLoadingAnimation();

    const request: Request.Auth.Signup = {
      email: this.profileForm.value.email as string,
      password: this.profileForm.value.password as string,
      passwordRepeat: this.profileForm.value.repeatedPassword as string,
    }
    
    this.authService.signup(request).subscribe({
      next: (value) => {
        if (value.code === HttpStatusCode.Ok){
          this.userService.User = value.body.user;
          this.userService.User.name = value.body.name;
          this.userService.User.surname = value.body.name;

          clearInterval(animationTimeout); 
          
          this.router.navigateByUrl('/');
        }
      },
      error: () => {
        this.errorMessage = UnknownErrorMessage;
        clearInterval(animationTimeout); 
        this.submitButtonTitle = SubmitButtonTitle; 
        this.pending = false;
      },
    });
  }
}