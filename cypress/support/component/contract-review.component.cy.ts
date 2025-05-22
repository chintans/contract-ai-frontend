import { mount } from 'cypress/angular';
import { ContractReviewComponent } from '../../../src/app/features/contract-review/contract-review.component';
import { StepValidationService } from '../../../src/app/features/contract-review/services/step-validation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ContractReviewComponent', () => {
  it('renders first step', () => {
    const step = { validateUpload: () => true } as Partial<StepValidationService>;
    mount(ContractReviewComponent, {
      providers: [
        { provide: StepValidationService, useValue: step },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: { url: of([]), parent: {} } }
      ]
    });
    cy.contains('Upload Contract').should('exist');
  });
});
