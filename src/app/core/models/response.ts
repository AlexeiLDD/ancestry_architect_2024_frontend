import { HttpStatusCode } from "@angular/common/http"
import { UserInterace } from "./user"

export interface Response<T> {
    code: HttpStatusCode,
    body: T,
}

export interface ErrorResponse {
    code: HttpStatusCode,
    status: string,
}

export interface SeveralErrorsResponse {
    code: HttpStatusCode,
    errors: Array<string>,
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

export interface UpdateProfileResponse {
    user: UserInterace,
    profile: ProfileResponse
}
