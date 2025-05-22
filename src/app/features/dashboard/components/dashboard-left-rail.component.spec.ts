import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardLeftRailComponent } from './dashboard-left-rail.component';
import { DashboardRiskCounterComponent } from './dashboard-risk-counter.component';
import { DashboardFilterBarComponent } from './dashboard-filter-bar.component';
import { DashboardBulkResolveToolbarComponent } from './dashboard-bulk-resolve-toolbar.component';
import { DashboardRiskListComponent } from './dashboard-risk-list.component';
import { DashboardEventTimelineComponent } from './dashboard-event-timeline.component';
import { provideMockStore } from '@ngrx/store/testing';
import { initialState } from '../store/dashboard.reducer';

describe('DashboardLeftRailComponent', () => {
  let fixture: ComponentFixture<DashboardLeftRailComponent>;
  let component: DashboardLeftRailComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardLeftRailComponent,
        DashboardRiskCounterComponent,
        DashboardFilterBarComponent,
        DashboardBulkResolveToolbarComponent,
        DashboardRiskListComponent,
        DashboardEventTimelineComponent
      ],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardLeftRailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
