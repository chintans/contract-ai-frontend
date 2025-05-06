import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TemplateWizardComponent } from './template-wizard.component';
import { MockStandardClauseService } from '../../services/mock-standard-clause.service';
import { of, throwError } from 'rxjs';

const mockClauses = [
  { id: 1, name: 'Clause 1', type: 'TypeA', text: 'Text 1', jurisdiction: 'IN', allowedDeviations: 0, version: '1.0', contractType: 'NDA', createdAt: new Date(), updatedAt: new Date(), severity: 'MEDIUM' },
  { id: 2, name: 'Clause 2', type: 'TypeB', text: 'Text 2', jurisdiction: 'US', allowedDeviations: 1, version: '1.0', contractType: 'NDA', createdAt: new Date(), updatedAt: new Date(), severity: 'LOW' }
];

describe('TemplateWizardComponent', () => {
  let component: TemplateWizardComponent;
  let fixture: ComponentFixture<TemplateWizardComponent>;
  let mockService: jasmine.SpyObj<MockStandardClauseService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MockStandardClauseService', ['getByContractType', 'create']);
    await TestBed.configureTestingModule({
      imports: [TemplateWizardComponent],
      providers: [
        { provide: MockStandardClauseService, useValue: spy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TemplateWizardComponent);
    component = fixture.componentInstance;
    mockService = TestBed.inject(MockStandardClauseService) as jasmine.SpyObj<MockStandardClauseService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial step as 0', () => {
    expect(component.step()).toBe(0);
  });

  it('should go to next and previous steps', () => {
    component.nextStep();
    expect(component.step()).toBe(1);
    component.prevStep();
    expect(component.step()).toBe(0);
  });

  it('should update meta state', () => {
    component.meta.update(m => ({ ...m, name: 'Test Template' }));
    expect(component.meta().name).toBe('Test Template');
  });

  it('should load standard clauses on loadStandardClauses', fakeAsync(() => {
    component.meta.update(m => ({ ...m, contractType: 'NDA' }));
    mockService.getByContractType.and.returnValue(of(mockClauses));
    component.loadStandardClauses();
    tick();
    expect(component.standardClauses().length).toBe(2);
    expect(component.isLoadingClauses()).toBe(false);
  }));

  it('should handle error when loading clauses fails', fakeAsync(() => {
    component.meta.update(m => ({ ...m, contractType: 'NDA' }));
    mockService.getByContractType.and.returnValue(throwError(() => new Error('fail')));
    component.loadStandardClauses();
    tick();
    expect(component.error()).toBe('Failed to load standard clauses. Please try again.');
    expect(component.isLoadingClauses()).toBe(false);
  }));
}); 