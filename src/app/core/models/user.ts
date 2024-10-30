
export interface UserInterface {
    id: number,
    email: string,
    name?: string,
    surname?: string,
    dateOfBirth?: Date,
}

export class User implements UserInterface{
    id: number;
    email: string;
    name?: string;
    surname?: string;
    dateOfBirth?: Date;

    constructor({ id, email }: UserInterface ){
        this.id = id;
        this.email = email;
    }
}
