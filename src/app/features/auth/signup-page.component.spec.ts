import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { SignupPageComponent } from './signup-page.component';

describe('SignupPageComponent', () => {
  let fixture: ComponentFixture<SignupPageComponent>;
  let component: SignupPageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupPageComponent],
      providers: [provideMockStore({})]
    }).compileComponents();
    fixture = TestBed.createComponent(SignupPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
