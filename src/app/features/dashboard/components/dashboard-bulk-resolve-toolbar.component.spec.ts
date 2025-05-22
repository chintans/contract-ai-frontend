import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DashboardBulkResolveToolbarComponent } from './dashboard-bulk-resolve-toolbar.component';
import { bulkResolveRisks, bulkChangeSeverity, bulkDeleteRisks } from '../store/dashboard.actions';
import { initialState } from '../store/dashboard.reducer';
import { of } from 'rxjs';

describe('DashboardBulkResolveToolbarComponent', () => {
  let fixture: ComponentFixture<DashboardBulkResolveToolbarComponent>;
  let component: DashboardBulkResolveToolbarComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardBulkResolveToolbarComponent],
      providers: [provideMockStore({ initialState: { dashboard: { ...initialState, selectedRiskIds: ['1'] } } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardBulkResolveToolbarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('resolveSelected dispatches bulkResolveRisks', () => {
    component.selectedRiskIds$ = of(['1']);
    component.resolveSelected();
    expect(store.dispatch).toHaveBeenCalledWith(bulkResolveRisks({ riskIds: ['1'] }));
  });

  it('deleteSelected dispatches bulkDeleteRisks', () => {
    component.selectedRiskIds$ = of(['1']);
    component.deleteSelected();
    expect(store.dispatch).toHaveBeenCalledWith(bulkDeleteRisks({ riskIds: ['1'] }));
  });

  it('onSeverityChange dispatches bulkChangeSeverity', () => {
    component.selectedRiskIds$ = of(['1']);
    const event = { target: { value: 'high' } } as unknown as Event;
    component.onSeverityChange(event);
    expect(store.dispatch).toHaveBeenCalledWith(bulkChangeSeverity({ riskIds: ['1'], severity: 'high' }));
  });
});
