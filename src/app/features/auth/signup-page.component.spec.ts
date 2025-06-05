import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SignupPageComponent } from './signup-page.component';
import { AuthService } from '../../core/auth.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { vi } from 'vitest';

class MockAuthService {
  signUp = vi.fn().mockReturnValue(of({}));
}

describe('SignupPageComponent', () => {
  let fixture: ComponentFixture<SignupPageComponent>;
  let component: SignupPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupPageComponent],
      providers: [
        provideMockStore({}),
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(SignupPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
