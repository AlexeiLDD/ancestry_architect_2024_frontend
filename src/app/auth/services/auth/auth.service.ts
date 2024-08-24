import { Injectable } from '@angular/core';
import { HttpClient, HttpStatusCode, HttpHeaders} from '@angular/common/http';
import { HttpBase } from './../../../core/models/http-base';
import { Response } from './../../../core/models/response';
import { User } from './../../../core/models/auth';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService extends HttpBase{
  constructor(private http: HttpClient) { super(); }

  public login(email: string, password: string): Observable<Response<User>> {
    return this.http.post<Response<User>>(
      `${this.baseURL}login`,
      { email, password },
      { headers: this.baseHeaders },
    )
  }

  public signup(email: string, password: string): Observable<Response<User>> {
    return this.http.post<Response<User>>(
      `${this.baseURL}signup`,
      { email, password },
      { headers: this.baseHeaders },
    )
  }
}
