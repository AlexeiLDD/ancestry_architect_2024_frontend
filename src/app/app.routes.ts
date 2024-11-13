import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { SignupComponent } from './auth/pages/signup/signup.component';
import { ProfileComponent } from './profile/pages/profile/profile/profile.component';
import { TreeListComponent } from './tree/pages/tree-list/tree-list.component';
import { LogoutRequiredService } from './shared/services/logout-required/logout-required.service';
import { LoginRequiredService } from './shared/services/login-required/login-required.service';
import { CreateTreeComponent } from './tree/pages/create-tree/create-tree.component';
import { TreeComponent } from './tree/pages/tree/tree.component';
import { EditNodeComponent } from './tree/pages/edit-node/edit-node.component';

const loginRequiredRoutes: Routes = [
  {
    path: 'profile',
    title: 'Профиль',
    component: ProfileComponent,
    canActivate: [LoginRequiredService]
  },
  {
    path: 'tree/list',
    title: 'Список деревьев',
    component: TreeListComponent,
    canActivate: [LoginRequiredService]
  },
  {
    path: 'tree/create',
    title: 'Создать дерево',
    component: CreateTreeComponent,
    canActivate: [LoginRequiredService]
  },
  {
    path: 'tree/:id',
    title: 'Семейное древо',
    component: TreeComponent,
    canActivate: [LoginRequiredService]
  },
  {
    path: 'tree/:id/node',
    title: 'Добавить родственника',
    component: EditNodeComponent,
    canActivate: [LoginRequiredService]
  },
  {
    path: 'tree/:id/node/:nodeId',
    title: 'Добавить родственника',
    component: EditNodeComponent,
    canActivate: [LoginRequiredService]
  }
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
