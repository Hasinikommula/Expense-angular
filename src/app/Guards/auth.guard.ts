import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../Services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
    //  Checks if the user is logged in using service
    if (this.authService.isLoggedIn()) {
      return true; // If User is logged in,then allow access to the route
    } else {
      // If User is not logged in,then redirect them to the login page
      console.warn('Access denied: User not logged in. Redirecting to /login.');
      this.router.navigate(['/login']);
      return false; // Block access to the route
    }
  }
}