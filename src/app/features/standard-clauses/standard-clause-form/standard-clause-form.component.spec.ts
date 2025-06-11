import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, expect, it, vi } from 'vitest'
import { StandardClauseFormComponent } from './standard-clause-form.component';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../standard-clause-service.token';
import { IStandardClauseService, StandardClause } from '../models/standard-clause.model';
import { provideRouter } from '@angular/router';
class MockService implements IStandardClauseService {
  create = vi.fn().mockReturnValue(of({} as StandardClause));
  update = vi.fn().mockReturnValue(of({} as StandardClause));
  getAll = vi.fn().mockReturnValue(of([]));
  getOne = vi.fn().mockReturnValue(of({} as StandardClause));
  getByType = vi.fn().mockReturnValue(of([]));
  getByContractType = vi.fn().mockReturnValue(of([]));
  delete = vi.fn().mockReturnValue(of());
}

describe('StandardClauseFormComponent', () => {
  let fixture: ComponentFixture<StandardClauseFormComponent>;
  let component: StandardClauseFormComponent;
  let service: MockService;
  let router: Router;

  beforeEach(async () => {
    service = new MockService();
    await TestBed.configureTestingModule({
      imports: [StandardClauseFormComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useValue: service }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(StandardClauseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
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
    vi.spyOn(router, 'navigate').mockResolvedValue(true as any);
    component.onSubmit();
    expect(service.create).toHaveBeenCalled();
  });

  it('should navigate on cancel', () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true as any);
    component.onCancel();
    expect(navigateSpy).toHaveBeenCalledWith(['/standard-clauses']);
  });
});
