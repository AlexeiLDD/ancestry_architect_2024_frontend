import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgClass } from '@angular/common';
import { UserService } from '../../../core/services/user/user.service';
import { ClickOutsideDirective } from '../../directives/click-outside/click-outside.directive';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgClass, ClickOutsideDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isActiveMenu = false;

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  get username(): string {
    return this.userService.username;
  }

  get avatarPath(): string {
    return this.userService.avatarPath as string;
  }

  isAuth(): boolean {
    return this.userService.isAuth();
  }

  activateDropdownMenu() {
    this.isActiveMenu = true;
  }

  disabledDropdownMenu(event?: MouseEvent) {
    if (event !== undefined) {
      event.stopImmediatePropagation();
    }
    
    this.isActiveMenu = false;
  }

  currentUrl():string {
    return this.router.url.slice(1);
  }

  logout() {
    this.userService.logout();
  }
}
