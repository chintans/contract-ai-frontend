import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DashboardRiskListComponent } from './dashboard-risk-list.component';
import { selectRisk, deselectRisk } from '../store/dashboard.actions';
import { initialState } from '../store/dashboard.reducer';

describe('DashboardRiskListComponent', () => {
  let fixture: ComponentFixture<DashboardRiskListComponent>;
  let component: DashboardRiskListComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardRiskListComponent],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardRiskListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggleRisk selects risk when not selected', () => {
    component.toggleRisk('1', []);
    expect(store.dispatch).toHaveBeenCalledWith(selectRisk({ riskId: '1' }));
  });

  it('toggleRisk deselects risk when selected', () => {
    component.toggleRisk('1', ['1']);
    expect(store.dispatch).toHaveBeenCalledWith(deselectRisk({ riskId: '1' }));
  });
});
