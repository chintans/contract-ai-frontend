import { TestBed } from '@angular/core/testing';
import { ContractReviewComponent } from './contract-review.component';
import { StepValidationService } from './services/step-validation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { vi } from 'vitest';

import { of } from "rxjs";
describe('ContractReviewComponent', () => {
  let stepSpy: { validateUpload: ReturnType<typeof vi.fn>; validateAnalysis: ReturnType<typeof vi.fn>; validateRiskFlags: ReturnType<typeof vi.fn>; validateSummary: ReturnType<typeof vi.fn>; validateQA: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    stepSpy = {
      validateUpload: vi.fn().mockReturnValue(true),
      validateAnalysis: vi.fn(),
      validateRiskFlags: vi.fn(),
      validateSummary: vi.fn(),
      validateQA: vi.fn()
    };
    await TestBed.configureTestingModule({
      imports: [ContractReviewComponent],
      providers: [
        { provide: StepValidationService, useValue: stepSpy },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: { url: of([]), parent: {} } }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContractReviewComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should validate current step', () => {
    const fixture = TestBed.createComponent(ContractReviewComponent);
    const component = fixture.componentInstance;
    component.currentStepIndex = 0;
    expect(component.isCurrentStepValid()).toBe(true);
    expect(stepSpy.validateUpload).toHaveBeenCalled();
  });
});
