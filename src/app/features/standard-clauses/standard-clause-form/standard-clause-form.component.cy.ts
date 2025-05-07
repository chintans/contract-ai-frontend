// @ts-ignore
import { injectAxe, checkA11y } from 'cypress-axe';
import { mount } from 'cypress/angular';
import { StandardClauseFormComponent } from './standard-clause-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

describe('StandardClauseFormComponent', () => {
  it('renders the form in create mode and checks ARIA', () => {
    mount(StandardClauseFormComponent, {
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
      componentProperties: {
        isDialog: false,
        isEditMode: false,
        isLoading: false,
        isSubmitting: false,
        error: null,
        clauseForm: new FormBuilder().group({
          name: [''],
          type: [''],
          text: [''],
          jurisdiction: [''],
          version: [''],
          allowedDeviations: ['']
        })
      }
    });
    cy.get('form[aria-describedby="form-description"]').should('exist');
    cy.get('button[aria-label="Submit form"]').should('exist');
    injectAxe();
    checkA11y();
  });

  it('shows required field validation', () => {
    mount(StandardClauseFormComponent, {
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
      componentProperties: {
        isDialog: false,
        isEditMode: false,
        isLoading: false,
        isSubmitting: false,
        error: null,
        clauseForm: new FormBuilder().group({
          name: [''],
          type: [''],
          text: [''],
          jurisdiction: [''],
          version: [''],
          allowedDeviations: ['']
        })
      }
    });
    cy.get('button[aria-label="Submit form"]').click();
    cy.contains('Name is required').should('exist');
    cy.contains('Type is required').should('exist');
    cy.contains('Text is required').should('exist');
    checkA11y();
  });

  it('shows error state', () => {
    mount(StandardClauseFormComponent, {
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
      componentProperties: {
        isDialog: false,
        isEditMode: false,
        isLoading: false,
        isSubmitting: false,
        error: 'Test error!',
        clauseForm: new FormBuilder().group({
          name: [''],
          type: [''],
          text: [''],
          jurisdiction: [''],
          version: [''],
          allowedDeviations: ['']
        })
      }
    });
    cy.get('[role="alert"]').should('exist');
    cy.contains('Test error!').should('exist');
    checkA11y();
  });

  it('shows loading state', () => {
    mount(StandardClauseFormComponent, {
      imports: [ReactiveFormsModule],
      providers: [FormBuilder],
      componentProperties: {
        isDialog: false,
        isEditMode: false,
        isLoading: true,
        isSubmitting: false,
        error: null,
        clauseForm: new FormBuilder().group({
          name: [''],
          type: [''],
          text: [''],
          jurisdiction: [''],
          version: [''],
          allowedDeviations: ['']
        })
      }
    });
    cy.get('[role="status"][aria-live="polite"]').should('exist');
  });
}); 