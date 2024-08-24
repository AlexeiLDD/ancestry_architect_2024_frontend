import { HttpHeaders } from "@angular/common/http";

export class HttpBase {
  public baseURL: string = 'http://localhost:8080/api/';
  public baseHeaders: HttpHeaders = new HttpHeaders({ 
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
  });
}
