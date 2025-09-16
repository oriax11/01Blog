import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isLoggedIn(): boolean {
    // For now, we will return false. In a real application, you would have logic to check if the user is logged in.
    return false;
  }
}
