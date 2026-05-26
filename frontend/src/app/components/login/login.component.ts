import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';
  showPassword = false;
  features = [
    'JWT-based authentication',
    'Role-based access control (RBAC)',
    'Admin panel for user management',
    'Real-time data with loading states',
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  fillDemo(type: 'admin' | 'user'): void {
    const creds = type === 'admin'
      ? { email: 'admin@example.com', password: 'password123' }
      : { email: 'alice@example.com', password: 'password123' };
    this.loginForm.patchValue(creds);
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loading) return;

    this.loading = true;
    this.errorMessage = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/dashboard']);
        } else {
          this.errorMessage = res.error || 'Login failed';
          this.loading = false;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Invalid credentials. Please try again.';
        this.loading = false;
      }
    });
  }

  get emailCtrl() { return this.loginForm.get('email'); }
  get passwordCtrl() { return this.loginForm.get('password'); }
}
