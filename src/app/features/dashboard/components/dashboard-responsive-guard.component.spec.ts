import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardResponsiveGuardComponent } from './dashboard-responsive-guard.component';

describe('DashboardResponsiveGuardComponent', () => {
  let fixture: ComponentFixture<DashboardResponsiveGuardComponent>;
  let component: DashboardResponsiveGuardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardResponsiveGuardComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardResponsiveGuardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
