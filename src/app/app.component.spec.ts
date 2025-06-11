import { TestBed, waitForAsync } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideRouter } from '@angular/router';
import { AuthService } from './core/auth.service';

describe('AppComponent', () => {
  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        provideRouter([{ path: '', component: AppComponent }]),
        { provide: AuthService, useValue: { isAuthenticated: () => true, logout: () => {} } },
        provideRouter([])
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeDefined();
  });
}); 