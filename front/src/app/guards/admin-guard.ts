import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    if (!token) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded.role || decoded.roles || decoded.authorities; // depends on backend payload

      if (role && (role === 'ADMIN' || role.includes('ADMIN'))) {
        return true;
      }

      this.router.navigate(['/forbidden']);
      return false;
    } catch (error) {
      this.authService.logout();
      this.router.navigate(['/login']);
      return false;
    }
  }
}
