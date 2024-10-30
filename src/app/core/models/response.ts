import { HttpStatusCode } from "@angular/common/http"
import { UserInterface } from "./user"
import { TreeExcerpt } from "./tree"

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

export interface SuccessResponse {
    success: boolean,
}

export interface UserResponse {
    isAuth: boolean,
    user: UserInterface,
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
    user: UserInterface,
    profile: ProfileResponse
}

export type CreateTreeResponse = TreeExcerpt

export type TreeListResponse = Array<TreeExcerpt> | null
