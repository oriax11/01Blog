import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  public currentUser: BehaviorSubject<any | null>;

  constructor() {
    this.currentUser = new BehaviorSubject<any | null>(null);
    if (this.isLoggedIn()) {
      const userId = this.getUserId();
      this.currentUser.next({ username: userId });
    }
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    const userId = this.getUserId();
    this.currentUser.next({ username: userId });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      this.logout();
      return false;
    }

    try {
      const decodedToken: any = jwtDecode(token);
      if (this.isTokenExpired(token)) {
        this.logout();
        return false;
      }
    } catch (error) {
      // Invalid JWT: malformed or signature-tampered
      this.logout();
      return false;
    }
    return true;
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() >= expiry;
    } catch {
      return true;
    }
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub;
    } catch {
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUser.next(null);
  }

  getAuthHeaders(): { headers: HttpHeaders } {
    const token = localStorage.getItem(this.tokenKey);
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
    return { headers };
  }
}
