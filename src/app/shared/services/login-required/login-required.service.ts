import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginRequiredService implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.userService.observableUser$.pipe(
      map((resp): boolean | UrlTree  => {
        if (!resp.body.isAuth) {
          return this.router.createUrlTree(['/auth/login']);
        }

        return true;
      }),
      catchError(() => {
        return of(this.router.createUrlTree(['/auth/login']));
      }),
    );
  }
}
