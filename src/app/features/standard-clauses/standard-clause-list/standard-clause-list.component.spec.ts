import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StandardClauseListComponent } from './standard-clause-list.component';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../standard-clause-service.token';
import { IStandardClauseService, StandardClause } from '../models/standard-clause.model';

const clauses: StandardClause[] = [
  { id: 1, name: 'Clause 1', type: 'A', text: 't1', jurisdiction: 'IN', allowedDeviations: 0, contractType: 'NDA', version: '1.0', createdAt: new Date(), updatedAt: new Date() },
  { id: 2, name: 'Clause 2', type: 'B', text: 't2', jurisdiction: 'US', allowedDeviations: 1, contractType: 'MSA', version: '1.0', createdAt: new Date(), updatedAt: new Date() }
];

class MockService implements IStandardClauseService {
  getAll = jasmine.createSpy().and.returnValue(of(clauses));
  getOne() { return of(clauses[0]); }
  getByType() { return of(clauses); }
  getByContractType() { return of(clauses); }
  create() { return of(clauses[0]); }
  update() { return of(clauses[0]); }
  delete = jasmine.createSpy().and.returnValue(of(void 0));
}

describe('StandardClauseListComponent', () => {
  let fixture: ComponentFixture<StandardClauseListComponent>;
  let component: StandardClauseListComponent;
  let service: MockService;

  beforeEach(async () => {
    service = new MockService();
    await TestBed.configureTestingModule({
      imports: [StandardClauseListComponent],
      providers: [
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useValue: service }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(StandardClauseListComponent);
    component = fixture.componentInstance;
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();
  });

  it('should create and load clauses', () => {
    expect(component.standardClauses.length).toBe(2);
    expect(service.getAll).toHaveBeenCalled();
  });

  it('should call delete on service', () => {
    component.deleteClause(1);
    expect(service.delete).toHaveBeenCalledWith(1);
  });
});
