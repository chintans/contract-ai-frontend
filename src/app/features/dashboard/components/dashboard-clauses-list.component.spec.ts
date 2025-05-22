import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DashboardClausesListComponent } from './dashboard-clauses-list.component';
import { initialState } from '../store/dashboard.reducer';

describe('DashboardClausesListComponent', () => {
  let fixture: ComponentFixture<DashboardClausesListComponent>;
  let component: DashboardClausesListComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardClausesListComponent],
      providers: [provideMockStore({ initialState: { dashboard: initialState } })]
    }).compileComponents();
    fixture = TestBed.createComponent(DashboardClausesListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
