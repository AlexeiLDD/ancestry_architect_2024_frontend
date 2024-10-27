import { Injectable } from '@angular/core';
import { HttpBase } from '../../../core/models/http-base';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response, SuccessResponse, TreeListResponse } from '../../../core/models/response';
import { Request } from '../../../core/models/request';

@Injectable({
  providedIn: 'root'
})
export class TreeService extends HttpBase{
  constructor(private http: HttpClient) { super(); }

  public getCreatedList(): Observable<Response<TreeListResponse>> {
    return this.http.get<Response<TreeListResponse>>(
      `${this.baseURL}tree/list/created`,
      { headers: this.baseHeaders },
    );
  }

  public getAvailableList(): Observable<Response<TreeListResponse>> {
    return this.http.get<Response<TreeListResponse>>(
      `${this.baseURL}tree/list/available`,
      { headers: this.baseHeaders },
    );
  }

  public grantPermission(request: Request.Tree.GrantPermission): Observable<Response<SuccessResponse>> {
    return this.http.post<Response<SuccessResponse>>(
      `${this.baseURL}tree/permission`,
      request,
      { headers: this.baseHeaders },
    );
  }
}
