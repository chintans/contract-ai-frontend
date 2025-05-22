import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { StandardClauseFormComponent } from './standard-clause-form.component';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../standard-clause-service.token';
import { IStandardClauseService, StandardClause } from '../models/standard-clause.model';

class MockService implements IStandardClauseService {
  create = jasmine.createSpy().and.returnValue(of({} as StandardClause));
  update = jasmine.createSpy().and.returnValue(of({} as StandardClause));
  getAll() { return of([]); }
  getOne() { return of({} as StandardClause); }
  getByType() { return of([]); }
  getByContractType() { return of([]); }
  delete() { return of(); }
}

describe('StandardClauseFormComponent', () => {
  let fixture: ComponentFixture<StandardClauseFormComponent>;
  let component: StandardClauseFormComponent;
  let router: jasmine.SpyObj<Router>;
  let service: MockService;

  beforeEach(async () => {
    router = jasmine.createSpyObj('Router', ['navigate']);
    service = new MockService();
    await TestBed.configureTestingModule({
      imports: [StandardClauseFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useValue: service }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(StandardClauseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.clauseForm.setValue({
      name: 'n',
      type: 't',
      text: 'body',
      jurisdiction: '',
      version: '',
      allowedDeviations: '',
      contractType: ''
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call create on submit', () => {
    component.onSubmit();
    expect(service.create).toHaveBeenCalled();
  });

  it('should navigate on cancel', () => {
    component.onCancel();
    expect(router.navigate).toHaveBeenCalledWith(['/standard-clauses']);
  });
});
