import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StandardClauseSelectorComponent } from './standard-clause-selector.component';
import { StandardClause, IStandardClauseService } from '../standard-clauses/models/standard-clause.model';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../standard-clauses/standard-clause-service.token';

const clauses: StandardClause[] = [
  { id: 1, name: 'Clause', type: 'TYPE', text: 'Text', jurisdiction: 'US', allowedDeviations: 0, version: '1.0', contractType: 'NDA', createdAt: new Date(), updatedAt: new Date() }
];

class MockService implements IStandardClauseService {
  getAll() { return of(clauses); }
  getByContractType() { return of(clauses); }
  create() { return of(); }
  getOne() { return of(clauses[0]); }
  getByType() { return of(clauses); }
  update() { return of(clauses[0]); }
  delete() { return of(); }
}

describe('StandardClauseSelectorComponent', () => {
  let fixture: ComponentFixture<StandardClauseSelectorComponent>;
  let component: StandardClauseSelectorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardClauseSelectorComponent],
      providers: [
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useClass: MockService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(StandardClauseSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and load clauses', () => {
    expect(component.standardClauses.length).toBe(1);
  });

  it('should emit select on onSelect', () => {
    const spy = spyOn(component.select, 'emit');
    component.onSelect(clauses[0]);
    expect(spy).toHaveBeenCalledWith(clauses[0]);
  });

  it('should emit cancel on onCancel', () => {
    const spy = spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(spy).toHaveBeenCalled();
  });
});
