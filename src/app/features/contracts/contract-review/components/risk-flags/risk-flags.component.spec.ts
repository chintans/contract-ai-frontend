import { TestBed, waitForAsync } from '@angular/core/testing';
import { RiskFlagsComponent } from './risk-flags.component';
import { ContractAnalysisService } from '../../services/contract-analysis.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { vi } from 'vitest';

describe('RiskFlagsComponent', () => {
  let serviceSpy: { getCurrentAnalysis: ReturnType<typeof vi.fn>; updateRiskFlag: ReturnType<typeof vi.fn> };
  let dialog: MatDialog;

  beforeEach(waitForAsync(async () => {
    serviceSpy = {
      getCurrentAnalysis: vi.fn().mockReturnValue(of({ analysis: { riskFlags: [] } } as any)),
      updateRiskFlag: vi.fn()
    };
    await TestBed.configureTestingModule({
      imports: [RiskFlagsComponent],
      providers: [
        { provide: ContractAnalysisService, useValue: serviceSpy },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
    dialog = TestBed.inject(MatDialog);
    vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of('note') } as any);
  }));

  it('should create', () => {
    const fixture = TestBed.createComponent(RiskFlagsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should get risk type class', () => {
    const fixture = TestBed.createComponent(RiskFlagsComponent);
    const component = fixture.componentInstance;
    expect(component.getRiskTypeClass('HIGH')).toBe('risk-high');
  });

  it('should add notes', waitForAsync(async () => {
    const fixture = TestBed.createComponent(RiskFlagsComponent);
    const component = fixture.componentInstance;
    await component.addNotes({ id: '1', type: 'LEGAL', description: '', clauseId: '', status: 'OPEN', contractId: '1', createdAt: '', updatedAt: '', severity: 'HIGH', isReviewed: false, isResolved: false, notes: '' });
    expect(dialog.open).toHaveBeenCalled();
  }));
});
