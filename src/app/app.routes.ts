import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { SignupComponent } from './auth/pages/signup/signup.component';
import { ProfileComponent } from './profile/pages/profile/profile/profile.component';
import { LogoutRequiredService } from './shared/services/logout-required/logout-required.service';

export const routes: Routes = [
  {
    path: 'auth/login',
    title: 'Вход',
    component: LoginComponent,
    canActivate: [LogoutRequiredService]
  },
  {
    path: 'auth/signup',
    title: 'Регистрация',
    component: SignupComponent,
    canActivate: [LogoutRequiredService]
  },
  {
    path: 'profile',
    title: 'Профиль',
    component: ProfileComponent,
  }
];
