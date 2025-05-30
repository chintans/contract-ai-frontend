import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService as ApiAuthService } from '@api/api';
import { User, AuthEmailLoginDto, AuthGoogleLoginDto, AuthRegisterLoginDto, LoginResponseDto } from '@models/models';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private token = signal<string | null>(localStorage.getItem('token'));
  user = signal<User | null>(null);
  private readonly api: ApiAuthService = inject(ApiAuthService);

  constructor(private router: Router) {    
  }

  isAuthenticated(): boolean {
    return !!this.token();
  }

  login(dto: AuthEmailLoginDto) {
    return this.api.authControllerLoginV1(dto).pipe(tap(res => this.setSession(res)));
  }

  loginWithGoogle(idToken: string) {
    const dto: AuthGoogleLoginDto = { idToken };
    console.log('loginWithGoogle', dto.idToken);
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
