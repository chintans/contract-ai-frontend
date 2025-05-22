import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DashboardFilterBarComponent } from './dashboard-filter-bar.component';
import { setFilters } from '../store/dashboard.actions';
import { initialState } from '../store/dashboard.reducer';

describe('DashboardFilterBarComponent', () => {
  let fixture: ComponentFixture<DashboardFilterBarComponent>;
  let component: DashboardFilterBarComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFilterBarComponent],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardFilterBarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggle adds value when not present', () => {
    expect(component.toggle(['a'], 'b')).toEqual(['a', 'b']);
  });

  it('onSearchInput dispatches setFilters', () => {
    const input = { target: { value: 'test' } } as unknown as Event;
    component.onSearchInput(input);
    expect(store.dispatch).toHaveBeenCalledWith(setFilters({ filters: { search: 'test' } }));
  });
});
