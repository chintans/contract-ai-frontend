import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';
import { environment } from '../../../environments/environment';
import type { AuthEmailLoginDto } from '../../services/api/models/AuthEmailLoginDto';

declare const google: any;

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  error = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  ngOnInit() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (res: any) => this.handleGoogle(res.credential)
      });
      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'outline', size: 'large' }
      );
    }
  }

  login() {
    if (this.form.invalid) {
      return;
    }
    this.auth.login(this.form.getRawValue() as unknown as AuthEmailLoginDto).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error.set('Login failed')
    });
  }

  private handleGoogle(token: string) {
    this.auth.loginWithGoogle(token).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error.set('Google login failed')
    });
  }
}
