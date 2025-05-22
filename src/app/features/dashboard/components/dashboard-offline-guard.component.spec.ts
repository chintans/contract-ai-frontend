import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardOfflineGuardComponent } from './dashboard-offline-guard.component';

describe('DashboardOfflineGuardComponent', () => {
  let fixture: ComponentFixture<DashboardOfflineGuardComponent>;
  let component: DashboardOfflineGuardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardOfflineGuardComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardOfflineGuardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
