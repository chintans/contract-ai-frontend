import { TestBed } from '@angular/core/testing';
import { ClauseSummaryComponent } from './clause-summary.component';

describe('ClauseSummaryComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClauseSummaryComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ClauseSummaryComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
