import { Component } from '@angular/core';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
       formData = {
    email: '',
    password: '',
  };
  loginError = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  handleLogin() {
    if (!this.formData.email || !this.formData.password) return;

    this.loading = true;
    this.loginError = '';

    this.auth.login(this.formData.email, this.formData.password).subscribe({
      next: (res: any) => {
        this.loading = false;
        console.log('User authenticated:', res);

        this.auth.saveToken(res.token);
        localStorage.setItem('userProfile', JSON.stringify(res));
        localStorage.setItem('userId', res.id);

        if (res.isAdmin) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/user-dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.loginError =
          err.error?.message || 'Something went wrong. Please try again.';
      },
    });
  }
}
