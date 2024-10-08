import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, mapToCanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { UserService } from '../../../core/services/user/user.service';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LogoutRequiredService implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    console.log('ssss')
    return this.userService.observableUser$.pipe(
      map((resp): boolean | UrlTree  => {
        if (resp.body.isAuth) {
          return this.router.createUrlTree(['/']);
        }

        return true;
      }),
      catchError(() => {
        return of(true);
      }),
    );
  }
}
