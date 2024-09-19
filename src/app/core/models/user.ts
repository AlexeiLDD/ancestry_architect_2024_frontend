
export interface UserInterace {
    id: number,
    email: string,
    name?: string,
    surname?: string,
    dateOfBirth?: Date,
}

export class User implements UserInterace{
    id: number;
    email: string;
    name?: string;
    surname?: string;
    dateOfBirth?: Date;

    constructor({ id, email }: UserInterace ){
        this.id = id;
        this.email = email;
    }
}
