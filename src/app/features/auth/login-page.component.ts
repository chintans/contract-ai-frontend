import { Component, OnInit, inject, signal } from '@angular/core';

import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../core/auth.service';
import { environment } from '../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    MatButtonModule
],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  error = signal<string | null>(null);

  ngOnInit() {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: (res: any) => this.handleGoogle(res.credential)
      });
      google.accounts.id.renderButton(
        document.getElementById('googleBtn'),
        { theme: 'outline', size: 'large', text: 'signin_with', shape: 'rectangular' }
      );
    }
  }

  private handleGoogle(token: string) {
    this.auth.loginWithGoogle(token).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: () => this.error.set('Google login failed')
    });
  }
}
