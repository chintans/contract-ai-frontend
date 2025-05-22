import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardComplianceHeatmapComponent } from './dashboard-compliance-heatmap.component';
import { initialState } from '../store/dashboard.reducer';

describe('DashboardComplianceHeatmapComponent', () => {
  let fixture: ComponentFixture<DashboardComplianceHeatmapComponent>;
  let component: DashboardComplianceHeatmapComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComplianceHeatmapComponent],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardComplianceHeatmapComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
