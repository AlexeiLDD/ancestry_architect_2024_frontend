import { Injectable } from '@angular/core';
import { User, UserInterace } from '../../models/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: UserInterace | undefined; 

  constructor() { }

  isAuth(): boolean {
    return this.user !== undefined
  }

  set User(user: UserInterace) {
    this.user = user;
  }

  get User(): UserInterace | undefined {
    return this.user
  }
}
