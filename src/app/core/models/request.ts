
export namespace Request {
    export namespace Auth {
        export interface Login {
            email: string;
            password: string;
        }

        export interface Signup extends Login {
            passwordRepeat: string;
        }
    }
}
