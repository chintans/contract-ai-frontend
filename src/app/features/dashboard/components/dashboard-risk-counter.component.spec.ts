import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardRiskCounterComponent } from './dashboard-risk-counter.component';
import { initialState } from '../store/dashboard.reducer';

describe('DashboardRiskCounterComponent', () => {
  let fixture: ComponentFixture<DashboardRiskCounterComponent>;
  let component: DashboardRiskCounterComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRiskCounterComponent],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardRiskCounterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
