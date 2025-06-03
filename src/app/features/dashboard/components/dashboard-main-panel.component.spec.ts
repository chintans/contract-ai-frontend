import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { describe, expect, it, vi } from 'vitest'
import { DashboardMainPanelComponent } from './dashboard-main-panel.component';
import { DashboardClausesListComponent } from './dashboard-clauses-list.component';
import { DashboardAutosaveToolbarComponent } from './dashboard-autosave-toolbar.component';
import { DashboardComplianceHeatmapComponent } from './dashboard-compliance-heatmap.component';
import { setActiveTab } from '../store/dashboard.actions';
import { initialState } from '../store/dashboard.reducer';


describe('DashboardMainPanelComponent', () => {
  let fixture: ComponentFixture<DashboardMainPanelComponent>;
  let component: DashboardMainPanelComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardMainPanelComponent,
        DashboardClausesListComponent,
        DashboardAutosaveToolbarComponent,
        DashboardComplianceHeatmapComponent
      ],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardMainPanelComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    vi.spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setTab dispatches setActiveTab', () => {
    component.setTab('summaries');
    expect(store.dispatch).toHaveBeenCalledWith(setActiveTab({ tab: 'summaries' } as any));
  });
});
