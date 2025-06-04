import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { LoginPageComponent } from './login-page.component';
import { AuthService } from '../../core/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { vi } from 'vitest';

class MockAuthService {
  loginWithGoogle = vi.fn().mockReturnValue(of({}));
}

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let component: LoginPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideMockStore({}),
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
