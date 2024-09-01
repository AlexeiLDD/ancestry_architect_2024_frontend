import { Injectable } from '@angular/core';
import { HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInterace, User } from '../../models/auth';
import { Response, UserResponse } from './../../../core/models/response';
import { AuthService } from '../../../auth/services/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: UserInterace | undefined; 

  observableUser$!: Observable<Response<UserResponse>>;

  constructor(private authService: AuthService) { 
    this.observableUser$ = this.authService.checkAuth();

    this.observableUser$.subscribe({
      next: (value) => {
        if (value.body.isAuth) {
          this.User = value.body;
        }
      },
    });
  }

  isAuth(): boolean {
    return this.user !== undefined;
  }

  // Set user from UserResponse.
  set User(userResponse: UserResponse) {
    this.user = new User(userResponse.user);
    this.user.name = userResponse.name;
    this.user.lastName = userResponse.surname;
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
