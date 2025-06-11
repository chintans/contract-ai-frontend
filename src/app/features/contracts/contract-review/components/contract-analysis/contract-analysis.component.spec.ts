import { TestBed } from '@angular/core/testing';
import { ContractAnalysisComponent } from './contract-analysis.component';
import { ContractAnalysisService } from '../../services/contract-analysis.service';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { vi } from 'vitest';

describe('ContractAnalysisComponent', () => {
  let serviceSpy: { getCurrentAnalysis: ReturnType<typeof vi.fn>; exportAnalysis: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    serviceSpy = {
      getCurrentAnalysis: vi.fn().mockReturnValue(of(null)),
      exportAnalysis: vi.fn()
    };
    await TestBed.configureTestingModule({
      imports: [ContractAnalysisComponent],
      providers: [
        { provide: ContractAnalysisService, useValue: serviceSpy },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContractAnalysisComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call exportAnalysis', async () => {
    const fixture = TestBed.createComponent(ContractAnalysisComponent);
    const component = fixture.componentInstance;
    serviceSpy.exportAnalysis.mockReturnValue(of(new Blob()));
    await component.exportAnalysis();
    expect(serviceSpy.exportAnalysis).toHaveBeenCalled();
  });
});
