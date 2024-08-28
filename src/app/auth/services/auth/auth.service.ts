import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpBase } from './../../../core/models/http-base';
import { Request } from '../../../core/models/request';
import { Response, UserResponse } from './../../../core/models/response';
import { User } from './../../../core/models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpBase{
  constructor(private http: HttpClient) { super(); }

  public login(request: Request.Auth.Login): Observable<Response<UserResponse>> {
    return this.http.post<Response<UserResponse>>(
      `${this.baseURL}auth/login`,
      request,
      { headers: this.baseHeaders },
    )
  }

  public signup(request: Request.Auth.Signup): Observable<Response<UserResponse>> {
    return this.http.post<Response<UserResponse>>(
      `${this.baseURL}auth/signup`,
      request,
      { headers: this.baseHeaders },
    )
  }
}
