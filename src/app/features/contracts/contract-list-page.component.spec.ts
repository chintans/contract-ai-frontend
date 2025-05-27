import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ContractListPageComponent } from './contract-list-page.component';
import { ContractDataService } from './contract-data.service';
import { of } from 'rxjs';

describe('ContractListPageComponent', () => {
  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [ContractListPageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ContractDataService,
          useValue: { listContracts: () => of([]) }
        }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContractListPageComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
