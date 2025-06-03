import { authGuard } from './auth.guard';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

describe('authGuard', () => {
  it('allows navigation when authenticated', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } },
        { provide: AuthService, useValue: { isAuthenticated: () => true } }
      ]
    });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeTrue();
  });

  it('redirects to login when not authenticated', () => {
    const navigate = jasmine.createSpy('navigate');
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate } },
        { provide: AuthService, useValue: { isAuthenticated: () => false } }
      ]
    });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBeFalse();
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
