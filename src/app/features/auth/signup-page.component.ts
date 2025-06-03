import { Component, OnInit, inject, signal } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';
import { environment } from '../../../environments/environment';
import type { AuthRegisterLoginDto } from '@models/models';

declare const google: any;

@Component({
  selector: 'app-signup-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  error = signal<string | null>(null);

  form = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
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
        document.getElementById('googleSignupBtn'),
        { theme: 'outline', size: 'large' }
      );
    }
  }

  signup() {
    if (this.form.invalid) {
      return;
    }
    this.auth.signUp(this.form.getRawValue() as unknown as AuthRegisterLoginDto).subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.error.set('Signup failed')
    });
  }

  private handleGoogle(token: string) {
    this.auth.loginWithGoogle(token).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error.set('Google login failed')
    });
  }
}
