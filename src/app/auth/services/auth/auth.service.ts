import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpBase } from './../../../core/models/http-base';
import { Request } from '../../../core/models/request';
import { Response, UserResponse } from './../../../core/models/response';

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
    );
  }

  public signup(request: Request.Auth.Signup): Observable<Response<UserResponse>> {
    return this.http.post<Response<UserResponse>>(
      `${this.baseURL}auth/signup`,
      request,
      { headers: this.baseHeaders },
    );
  }

  public checkAuth(): Observable<Response<UserResponse>> {
    return this.http.get<Response<UserResponse>>(
      `${this.baseURL}auth/check_auth`,
      { headers: this.baseHeaders },
    );
  }

  public logout(): Observable<Response<UserResponse>> {
    return this.http.post<Response<UserResponse>>(
      `${this.baseURL}auth/logout`,
      null,
      { headers: this.baseHeaders },
    );
  }
}
