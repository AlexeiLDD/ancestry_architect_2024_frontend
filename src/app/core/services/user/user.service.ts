import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInterace } from '../../models/auth';
import { HttpBase } from '../../models/http-base';
import { Response, UserResponse } from './../../../core/models/response';
import { User } from './../../../core/models/auth';


@Injectable({
  providedIn: 'root'
})
export class UserService extends HttpBase {
  private user: UserInterace | undefined; 

  constructor(private http: HttpClient) { 
    super(); 
  
    this.http.get<Response<UserResponse>>(
      `${this.baseURL}auth/check_auth`,
      { headers: this.baseHeaders },
    ).subscribe({
      next: (value) => {
        if (value.payload.isAuth) {
          this.User = value.payload;
        }
      },
    });
  }

  isAuth(): boolean {
    return this.user !== undefined
  }

  // Set user from UserResponse.
  set User(userResponse: UserResponse) {
    this.user = new User(userResponse.user);
    this.user.name = userResponse.name;
    this.user.lastName = userResponse.surname;
  }

  get User(): UserInterace | undefined {
    return this.user
  }
}
