import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  constructor(private userService: UserService) {}

  isAuth(): boolean{
    return this.userService.isAuth();
  }

  username(): string {
    if (this.userService.isAuth()) {
      if (this.userService.User?.name){
        return this.userService.User?.name
      }
    }

    return this.userService.User?.email as string
  }
}
