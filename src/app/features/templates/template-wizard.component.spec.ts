import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { vi, expect } from 'vitest'
import { TemplateWizardComponent } from './template-wizard.component';
import { defer, of, throwError } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { TemplatesService } from '../../services/templates.service';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from './template-wizard.component';
import { IStandardClauseService } from '../standard-clauses/models/standard-clause.model';

const mockClauses = [
  { id: 1, name: 'Clause 1', type: 'TypeA', text: 'Text 1', jurisdiction: 'IN', allowedDeviations: 0, version: '1.0', contractType: 'NDA', createdAt: new Date(), updatedAt: new Date(), severity: 'MEDIUM' },
  { id: 2, name: 'Clause 2', type: 'TypeB', text: 'Text 2', jurisdiction: 'US', allowedDeviations: 1, version: '1.0', contractType: 'NDA', createdAt: new Date(), updatedAt: new Date(), severity: 'LOW' }
];

describe('TemplateWizardComponent', () => {
  let component: TemplateWizardComponent;
  let fixture: ComponentFixture<TemplateWizardComponent>;  
  let mockService: IStandardClauseService;

  beforeEach(waitForAsync(async () => {
    const activatedRouteStub = { snapshot: { paramMap: { get: () => null } } };
    const templatesServiceStub = { getOne: () => ({ subscribe: (cb: any) => cb({}) }) };    
    mockService = {
      getByContractType: vi.fn().mockReturnValue(of(mockClauses)),
      create: vi.fn().mockReturnValue(of(mockClauses[0])),
      getAll: vi.fn().mockReturnValue(of(mockClauses)),
      getOne: vi.fn().mockReturnValue(of(mockClauses[0])),
      getByType: vi.fn().mockReturnValue(of(mockClauses)),
      update: vi.fn().mockReturnValue(of(mockClauses[0])),
      delete: vi.fn().mockReturnValue(of(mockClauses[0]))
    };
    await TestBed.configureTestingModule({
      imports: [TemplateWizardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TemplatesService, useValue: templatesServiceStub },
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useValue: mockService }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TemplateWizardComponent);
    component = fixture.componentInstance;             
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have initial step as 0', () => {
    expect(component.step()).toBe(0);
  });

  it('should go to next and previous steps', () => {
    component.meta.set({
      name: 'name',
      contractType: 'NDA',
      country: '',
      state: '',
      city: '',
      isGlobal: true
    });
    component.nextStep();
    expect(component.step()).toBe(1);
    component.prevStep();
    expect(component.step()).toBe(0);
  });

  it('should update meta state', () => {
    component.meta.update(m => ({ ...m, name: 'Test Template' }));
    expect(component.meta().name).toBe('Test Template');
  });

  it('should load standard clauses on loadStandardClauses', fakeAsync(async () => {
    component.meta.update(m => ({ ...m, contractType: 'NDA' }));
    component.loadStandardClauses();
    tick();
    expect(component.standardClauses().length).toBe(2);
    expect(component.isLoadingClauses()).toBe(false);
    }));

  it('should handle error when loading clauses fails', fakeAsync(async () => {
    const activatedRouteStub = { snapshot: { paramMap: { get: () => null } } };
    const templatesServiceStub = { getOne: () => ({ subscribe: (cb: any) => cb({}) }) };
    const errorMockService = {
      getByContractType: vi.fn().mockReturnValue(
        defer(() => Promise.reject(new Error('fail')))
      ),
      create: vi.fn(),
      getAll: vi.fn(),
      getOne: vi.fn(),
      getByType: vi.fn(),
      update: vi.fn(),
      delete: vi.fn()
    };
    await TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [TemplateWizardComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TemplatesService, useValue: templatesServiceStub },
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useValue: errorMockService }
      ]
    }).compileComponents();
    const fixture = TestBed.createComponent(TemplateWizardComponent);
    const component = fixture.componentInstance;
    component.meta.update(m => ({ ...m, contractType: 'NDA' }));
    component.loadStandardClauses();    
    tick();
    fixture.detectChanges();
    expect(component.isLoadingClauses()).toBe(false);
    expect(component.error()).toBe('Failed to load standard clauses. Please try again.');    
  }));
}); 