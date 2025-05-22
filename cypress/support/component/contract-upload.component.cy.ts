import { mount } from 'cypress/angular';
import { ContractUploadComponent } from '../../../src/app/features/contract-review/components/contract-upload/contract-upload.component';

describe('ContractUploadComponent', () => {
  it('emits data on selection', () => {
    const emit = cy.stub().as('emit');
    mount(ContractUploadComponent, { componentProperties: { uploadDataChange: { emit } as any } });
    cy.get('mat-select[data-cy="contract-type-select"]').click();
    cy.get('mat-option').contains('Service Agreement').click();
    cy.get('@emit').should('have.been.called');
  });
});
