import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { SignupComponent } from './auth/pages/signup/signup.component';
import { ProfileComponent } from './profile/pages/profile/profile/profile.component';
import { LogoutRequiredService } from './shared/services/logout-required/logout-required.service';
import { LoginRequiredService } from './shared/services/login-required/login-required.service';

const loginRequiredRoutes: Routes = [
  {
    path: 'profile',
    title: 'Профиль',
    component: ProfileComponent,
    canActivate: [LoginRequiredService]
  },
];

export const routes: Routes = [
  ...loginRequiredRoutes,
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
    path:'logout',
    redirectTo:({ queryParams }) => {
      let redirectUrl = queryParams['redirectUrl'];

      if (redirectUrl === undefined) {
        return '/';
      }

      loginRequiredRoutes.forEach((route) => {
        if (route.path === undefined) {
          return;
        }
        
        if (route.path === redirectUrl) {
          redirectUrl = '/auth/login';
        }
      });
      
      return redirectUrl;
    },
  },
];
