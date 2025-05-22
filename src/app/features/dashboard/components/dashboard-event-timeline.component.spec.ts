import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardEventTimelineComponent } from './dashboard-event-timeline.component';
import { initialState } from '../store/dashboard.reducer';

describe('DashboardEventTimelineComponent', () => {
  let fixture: ComponentFixture<DashboardEventTimelineComponent>;
  let component: DashboardEventTimelineComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardEventTimelineComponent],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardEventTimelineComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
