import { authGuard } from './auth.guard';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { vi, describe, it, expect } from 'vitest';

describe('authGuard', () => {
  it('allows navigation when authenticated', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: AuthService, useValue: { isAuthenticated: () => true } }
      ]
    });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(true);
  });

  it('redirects to login when not authenticated', () => {
    const navigate = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: { navigate } },
        { provide: AuthService, useValue: { isAuthenticated: () => false } }
      ]
    });
    const result = TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));
    expect(result).toBe(false);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
