import { Component } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass, NgIf, NgStyle } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';
import { AuthService } from './../../services/auth/auth.service';
import { UserService } from '../../../core/services/user/user.service';


@Component({
  selector: 'login-page',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgStyle, NgClass, NgIf, RouterLink],
})
export class LoginComponent {
  pending = false;
  pendingButton = 'Вход';
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
    private userService:UserService, 
    private router: Router,
  ) {}

  hasError():boolean {
    return this.errorMessage !== '';
  }

  login() {
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