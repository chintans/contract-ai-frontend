import { TestBed } from '@angular/core/testing';
import { ContractReviewComponent } from './contract-review.component';
import { StepValidationService } from './services/step-validation.service';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from "rxjs";
describe('ContractReviewComponent', () => {
  let stepSpy: jasmine.SpyObj<StepValidationService>;

  beforeEach(async () => {
    stepSpy = jasmine.createSpyObj('StepValidationService', ['validateUpload', 'validateAnalysis', 'validateRiskFlags', 'validateSummary', 'validateQA']);
    stepSpy.validateUpload.and.returnValue(true);
    await TestBed.configureTestingModule({
      imports: [ContractReviewComponent],
      providers: [
        { provide: StepValidationService, useValue: stepSpy },
        { provide: Router, useValue: { navigate: () => {} } },
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
