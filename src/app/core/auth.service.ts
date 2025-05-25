import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { OpenAPI } from '../services/api/core/OpenAPI';
import { AuthService as ApiAuthService } from '../services/api/services/AuthService';
import type { AuthEmailLoginDto } from '../services/api/models/AuthEmailLoginDto';
import type { AuthRegisterLoginDto } from '../services/api/models/AuthRegisterLoginDto';
import type { AuthGoogleLoginDto } from '../services/api/models/AuthGoogleLoginDto';
import type { LoginResponseDto } from '../services/api/models/LoginResponseDto';
import type { User } from '../services/api/models/User';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('token'));
  user = signal<User | null>(null);

  constructor(private api: ApiAuthService, private router: Router) {
    OpenAPI.TOKEN = () => Promise.resolve(this.token() ?? '');
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  login(dto: AuthEmailLoginDto) {
    return this.api.authControllerLoginV1(dto).pipe(tap(res => this.setSession(res)));
  }

  loginWithGoogle(idToken: string) {
    const dto: AuthGoogleLoginDto = { idToken };
    return this.api.authGoogleControllerLoginV1(dto).pipe(tap(res => this.setSession(res)));
  }

  signUp(dto: AuthRegisterLoginDto) {
    return this.api.authControllerRegisterV1(dto);
  }

  logout() {
    this.token.set(null);
    this.user.set(null);
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  private setSession(res: LoginResponseDto) {
    this.token.set(res.token);
    this.user.set(res.user);
    localStorage.setItem('token', res.token);
  }
}
