import { HttpHeaders } from "@angular/common/http";

export class HttpBase {
  public baseURL: string = '/api/';
  public baseHeaders: HttpHeaders = new HttpHeaders({ 
    // 'Access-Control-Allow-Origin': '*',
    // 'Access-Control-Allow-Methods': 'GET, POST, DELETE, PUT, HEAD, OPTIONS',
    // 'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
  });
}
