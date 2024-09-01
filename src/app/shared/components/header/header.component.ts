import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { HttpStatusCode } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';
import { Response, UserResponse } from '../../../core/models/response';
import { AuthService } from '../../../auth/services/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isActiveMenu = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  get observableUser$(): Observable<Response<UserResponse>> {
    return this.userService.observableUser$;
  }

  get username(): string {
    return this.userService.username;
  }

  isAuth(): boolean {
    return this.userService.isAuth();
  }

  activateDropdownMenu() {
    this.isActiveMenu = true;
  }

  disabledDropdownMenu() {
    this.isActiveMenu = false;
  }

  logout(event: Event) {
    event.preventDefault();

    this.disabledDropdownMenu();

    this.userService.logout();
  }
}
