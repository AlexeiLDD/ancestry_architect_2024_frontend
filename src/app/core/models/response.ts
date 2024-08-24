import { HttpStatusCode } from "@angular/common/http"

export interface Response<T>{
    code: HttpStatusCode,
    payload: T
}
