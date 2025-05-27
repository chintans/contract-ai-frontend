import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ContractCreateWizardComponent } from './contract-create-wizard.component';

describe('ContractCreateWizardComponent', () => {
  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [ContractCreateWizardComponent],
      providers: [{ provide: Router, useValue: routerSpy }]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContractCreateWizardComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
