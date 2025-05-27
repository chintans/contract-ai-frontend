import { TestBed } from '@angular/core/testing';
import { PrDashboardComponent } from './pr-dashboard.component';

describe('PrDashboardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrDashboardComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PrDashboardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
