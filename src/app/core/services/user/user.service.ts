import { Injectable } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterace, User } from '../../models/user';
import { Response, UserResponse } from './../../../core/models/response';
import { AuthService } from '../../../auth/services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: UserInterace | undefined; 

  observableUser$!: Observable<Response<UserResponse>>;
  userIsFetched = false;

  constructor(private authService: AuthService) { 
    this.observableUser$ = this.authService.checkAuth();

    this.observableUser$.subscribe({
      next: (value) => {
        this.userIsFetched = true;

        if (value.body.isAuth) {
          this.User = value.body.user;
          this.User.name = value.body.name;
          this.User.surname = value.body.surname;
        }
      },
    });
  }

  isAuth(): boolean {
    return this.user !== undefined;
  }

  set User(user: UserInterace) {
    this.user = new User(user);
  }



  get User(): UserInterace | undefined {
    return this.user;
  }

  get username(): string {
    if (this.isAuth()) {
      if (this.User?.name){
        return this.User?.name;
      }
    }

    return this.User?.email as string;
  }

  logout() {
    this.authService.logout().subscribe((resp) => {
      if (resp.code === HttpStatusCode.Ok && resp.body.isAuth === false){
        this.cleanUser();
      }
    });
  }

  private cleanUser() {
    this.user = undefined;
  }
}
