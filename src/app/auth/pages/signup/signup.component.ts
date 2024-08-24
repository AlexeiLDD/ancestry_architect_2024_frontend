import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';
import { AuthService } from './../../services/auth/auth.service';
import { dotValidator, specialSymbolsValidator } from '../../shared/directives/special-symbols.directive';
import { EqualValidator } from '../../shared/directives/equal.directive';
import { UserService } from '../../../core/services/user/user.service';


@Component({
  selector: 'signup-page',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, NgClass, NgIf, RouterLink],
})
export class SignupComponent {
  passwordObj = { password: '' };
  pending = false;
  pendingButton = 'Регистрация';
  errorMessage = '';

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
    private userService:UserService, 
    private router: Router,
  ) {}

  hasError():boolean {
    return this.errorMessage !== '';
  }

  onChange(){
    this.passwordObj.password = this.profileForm.value.password as string;

    this.profileForm.controls.repeatedPassword.enable()
  }

  signup() {
    this.pendingButton = 'Загрузка';
    this.pending = true;
    let ticker = 0;

    const LoadingAnimation = setInterval(() => {
      this.pendingButton = this.pendingButton.concat('.');
      ticker++;

      if (ticker % 4 === 0) {
        this.pendingButton = this.pendingButton.slice(0, this.pendingButton.length - 4);
      }
    }, 250);

    if (typeof this.profileForm.value.email === 'string' && 
      typeof this.profileForm.value.password === 'string') 
    {
      this.authService.login(this.profileForm.value.email, this.profileForm.value.password).subscribe({
        next: (value) => {
          if (value.code === HttpStatusCode.Ok){
            this.userService.User = value.payload;
            this.router.navigateByUrl('/');
            clearInterval(LoadingAnimation); 
            this.pendingButton = 'Вход'; 
            this.pending = false;
          }
        },
        error: () => {
          this.errorMessage = 'Что-то пошло не так :( Попробуйте позже.'
          clearInterval(LoadingAnimation); 
          this.pendingButton = 'Вход'; 
          this.pending = false;
        },
      })
    }
  }
}