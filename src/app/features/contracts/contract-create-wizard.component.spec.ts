import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest'
import { ContractCreateWizardComponent } from './contract-create-wizard.component';

describe('ContractCreateWizardComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractCreateWizardComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContractCreateWizardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
