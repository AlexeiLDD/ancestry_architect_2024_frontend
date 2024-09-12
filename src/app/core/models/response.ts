import { HttpStatusCode } from "@angular/common/http"
import { UserInterace } from "./auth"

export interface Response<T> {
    code: HttpStatusCode,
    body: T,
}

export interface UserResponse {
    isAuth: boolean,
    user: UserInterace,
    name: string,
    surname: string,
}

export interface ProfileResponse {
    id: number,
    userID: number,
    name: string,
    surname: string,
    birthdate: string,
    gender: string,
    avatarPath: string,
}
