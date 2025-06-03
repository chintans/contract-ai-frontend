import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, vi } from 'vitest'
import { ContractListPageComponent } from './contract-list-page.component';
import { ContractDataService } from './contract-data.service';
import { of } from 'rxjs';

describe('ContractListPageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContractListPageComponent],
      providers: [
        provideRouter([]),
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
