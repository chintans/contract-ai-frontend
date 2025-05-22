import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { DashboardAutosaveToolbarComponent } from './dashboard-autosave-toolbar.component';
import { saveAllEdits, discardAllEdits } from '../store/dashboard.actions';
import { initialState } from '../store/dashboard.reducer';

describe('DashboardAutosaveToolbarComponent', () => {
  let fixture: ComponentFixture<DashboardAutosaveToolbarComponent>;
  let component: DashboardAutosaveToolbarComponent;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardAutosaveToolbarComponent],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardAutosaveToolbarComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    spyOn(store, 'dispatch');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saveAll dispatches action', () => {
    component.saveAll();
    expect(store.dispatch).toHaveBeenCalledWith(saveAllEdits());
  });

  it('discardAll dispatches action', () => {
    component.discardAll();
    expect(store.dispatch).toHaveBeenCalledWith(discardAllEdits());
  });
});
