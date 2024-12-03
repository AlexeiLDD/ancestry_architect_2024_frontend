import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterOutlet, UrlSegment } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { UserService } from './core/services/user/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Ancestry Architect';
  isMain = true;

  @ViewChild('elem') elem?: ElementRef;

  constructor(
    private usersService: UserService, 
    private route: ActivatedRoute,
  ) {}

  isGotUser(): boolean {
    return this.usersService.userIsFetched;
  }

  activateRouter() { this.isMain = false; }
  deactivateRouter() { this.isMain = true; }
}
