import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { UserService } from './core/services/user/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'ancestry-architect';

  constructor(private usersService: UserService) {}

  isGotUser(): boolean {
    return this.usersService.userIsFetched;
  }
}
