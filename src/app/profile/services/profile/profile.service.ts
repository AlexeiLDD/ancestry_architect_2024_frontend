import { Injectable } from '@angular/core';
import { HttpBase } from '../../../core/models/http-base';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Response, ProfileResponse } from '../../../core/models/response';

@Injectable({
  providedIn: 'root'
})
export class ProfileService extends HttpBase {
  constructor(private http: HttpClient) { super(); }

  public getProfile(id: number): Observable<Response<ProfileResponse>> {
    return this.http.get<Response<ProfileResponse>>(
      `${this.baseURL}profile/${id}`,
      { headers: this.baseHeaders },
    );
  }

}
