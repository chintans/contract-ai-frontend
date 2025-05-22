import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StandardClauseCardComponent, StandardClauseCardData } from './standard-clause-card.component';

describe('StandardClauseCardComponent', () => {
  let fixture: ComponentFixture<StandardClauseCardComponent>;
  let component: StandardClauseCardComponent;

  const clause: StandardClauseCardData = {
    id: '1',
    name: 'Test',
    type: 'TYPE',
    text: 'Body',
    jurisdiction: 'US',
    allowedDeviations: 0,
    version: '1.0'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardClauseCardComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(StandardClauseCardComponent);
    component = fixture.componentInstance;
    component.clause = clause;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle expand state', () => {
    expect(component.isExpanded).toBe(false);
    component.toggleExpand();
    expect(component.isExpanded).toBe(true);
  });
});
