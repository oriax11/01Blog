import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../src/environments/environment';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  ErrorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.http.post(`${environment.apiUrl}/api/auth/login`, this.loginForm.value).subscribe(
        (response: any) => {
          const token = response.accessToken;

          const decoded: any = jwtDecode(token);
          if (decoded.role === 'BANNED') {
            this.ErrorMessage = 'Your account has been banned.';
            return;
          }

          this.authService.setToken(response.accessToken);
          this.router.navigate(['/home']);
        },
        (error) => {
          if (error.status === 401) {
            this.ErrorMessage = 'Wrong username or password.';
          } else if (error.status === 403) {
            this.ErrorMessage = 'You do not have permission to access this resource.';
          } else {
            this.ErrorMessage = 'An unexpected error occurred. Please try again.';
          }
        }
      );
    }
  }
}
