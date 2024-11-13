import { Injectable } from '@angular/core';
import { HttpBase } from '../../../core/models/http-base';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Response, NodeDescriptionResponse, GetNodeResponse, UpdatePreviewResponse, SuccessResponse } from '../../../core/models/response';
import { Request } from '../../../core/models/request';

@Injectable({
  providedIn: 'root'
})
export class NodeService extends HttpBase {
  constructor(private http: HttpClient) { super(); }

  public getDescription(id: number): Observable<Response<NodeDescriptionResponse>> {
    return this.http.get<Response<NodeDescriptionResponse>>(
      `${this.baseURL}node/${id}/description`,
      { headers: this.baseHeaders },
    );
  }

  public get(id: number): Observable<Response<GetNodeResponse>> {
    return this.http.get<Response<GetNodeResponse>>(
      `${this.baseURL}node/${id}`,
      { headers: this.baseHeaders },
    );
  }

  public edit(id: number, request: Request.Node.Edit): Observable<Response<UpdatePreviewResponse>> {
    return this.http.post<Response<UpdatePreviewResponse>>(
      `${this.baseURL}node/${id}`,
      request,
      { headers: this.baseHeaders },
    );
  }

  public delete(id: number): Observable<Response<SuccessResponse>> {
    return this.http.delete<Response<SuccessResponse>>(
      `${this.baseURL}node/${id}`,
      { headers: this.baseHeaders },
    );
  }

  public updatePreview(id: number, request: FormData): Observable<Response<UpdatePreviewResponse>> {
    return this.http.post<Response<UpdatePreviewResponse>>(
      `${this.baseURL}node/${id}/preview`,
      request,
      { headers: this.baseHeaders },
    );
  }

  public create(request: Request.Node.Create): Observable<Response<GetNodeResponse>> {
    return this.http.post<Response<GetNodeResponse>>(
      `${this.baseURL}node`,
      request,
      { headers: this.baseHeaders },
    );
  }
}
