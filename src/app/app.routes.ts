import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { SignupComponent } from './auth/pages/signup/signup.component';

export const routes: Routes = [
  {
    path: 'auth/login',
    title: 'Вход',
    component: LoginComponent,
  },
  {
    path: 'auth/signup',
    title: 'Регистрация',
    component: SignupComponent,
  },
];
