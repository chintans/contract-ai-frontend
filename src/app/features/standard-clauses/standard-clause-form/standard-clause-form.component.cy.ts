// @ts-ignore
/// <reference types="cypress-real-events" />
import { mount } from 'cypress/angular';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StandardClauseFormComponent } from './standard-clause-form.component';
import { MockStandardClauseService } from '../services/mock-standard-clause.service';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../standard-clause-service.token';

describe('StandardClauseFormComponent', () => {
  it('renders the form in create mode and checks ARIA', () => {
    mount(StandardClauseFormComponent, {
      imports: [CommonModule, ReactiveFormsModule, RouterModule],
      providers: [
        FormBuilder, 
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useClass: MockStandardClauseService }
      ],        
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
          allowedDeviations: [''],
          contractType: ['']
        })
      }
    });
    cy.get('form[aria-describedby="form-description"]').should('exist');
    cy.get('button[aria-label="Submit form"]').should('exist');    
  });

  it('shows required field validation', () => {
    mount(StandardClauseFormComponent, {
      imports: [CommonModule, ReactiveFormsModule, RouterModule],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useClass: MockStandardClauseService },
        { provide: Router, useValue: { navigate: cy.stub() } }
      ],
      componentProperties: {
        isDialog: false,
        isEditMode: false,
        isLoading: false,
        isSubmitting: false,        
        clauseForm: new FormBuilder().group({
          name: [''],
          type: [''],
          text: [''],
          jurisdiction: [''],
          version: [''],
          allowedDeviations: [''],
          contractType: ['']
        })
      }
    });
    cy.get('input[id="clause-name"]').realClick();
    cy.realType('Test Clause');    
    cy.get('button[aria-label="Submit form"]').click();
    cy.contains('Name is required').should('exist');
    cy.contains('Type is required').should('exist');
    cy.contains('Text is required').should('exist');    
  });

  it('shows error state', () => {
    mount(StandardClauseFormComponent, {
      imports: [CommonModule, ReactiveFormsModule, RouterModule],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useClass: MockStandardClauseService }
      ],
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
          allowedDeviations: [''],
          contractType: ['']
        })
      }
    });
    cy.get('[role="alert"]').should('exist');
    cy.contains('Test error!').should('exist');
  });

  it('shows loading state', () => {
    mount(StandardClauseFormComponent, {
      imports: [CommonModule, ReactiveFormsModule, RouterModule],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: new Map() } } },
        { provide: STANDARD_CLAUSE_SERVICE_TOKEN, useClass: MockStandardClauseService }
      ],
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
          allowedDeviations: [''],
          contractType: ['']
        })
      }
    });
    cy.get('[role="status"][aria-live="polite"]').should('exist');
  });
}); 