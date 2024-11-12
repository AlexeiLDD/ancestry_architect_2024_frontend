import { HttpStatusCode } from "@angular/common/http"
import { UserInterface } from "./user"
import { Tree, TreeExcerpt } from "./tree"
import { Node } from "./node";

export interface Response<T> {
    code: HttpStatusCode;
    body: T;
}

export interface ErrorResponse {
    code: HttpStatusCode;
    status: string;
}

export interface SeveralErrorsResponse {
    code: HttpStatusCode;
    errors: Array<string>;
}

export interface SuccessResponse {
    success: boolean;
}

export interface UserResponse {
    isAuth: boolean;
    user: UserInterface;
    name: string;
    surname: string;
    avatarPath: string;
}

export interface ProfileResponse {
    id: number;
    userID: number;
    name: string;
    surname: string;
    birthdate: string;
    gender: string;
    avatarPath: string;
}

export interface UpdateProfileResponse {
    user: UserInterface;
    profile: ProfileResponse;
}

export type CreateTreeResponse = TreeExcerpt;

export type TreeListResponse = Array<TreeExcerpt> | null;

export type GetTreeResponse = Tree;

export interface NodeDescriptionResponse {
    nodeID: number;
    description: string;
}

export type GetNodeResponse = Node;

export interface UpdatePreviewResponse {
    id: number;
    previewPath: string;
}
