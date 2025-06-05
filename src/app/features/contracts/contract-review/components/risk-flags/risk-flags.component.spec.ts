import { TestBed } from '@angular/core/testing';
import { RiskFlagsComponent, RiskFlagNotesDialogComponent } from './risk-flags.component';
import { ContractAnalysisService } from '../../services/contract-analysis.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { vi } from 'vitest';

describe('RiskFlagsComponent', () => {
  let serviceSpy: { getCurrentAnalysis: ReturnType<typeof vi.fn>; updateRiskFlag: ReturnType<typeof vi.fn> };
  let dialog: MatDialog;

  beforeEach(async () => {
    serviceSpy = {
      getCurrentAnalysis: vi.fn().mockReturnValue(of({ analysis: { riskFlags: [] } } as any)),
      updateRiskFlag: vi.fn()
    };
    await TestBed.configureTestingModule({
      imports: [RiskFlagsComponent, RiskFlagNotesDialogComponent],
      providers: [
        { provide: ContractAnalysisService, useValue: serviceSpy },
        { provide: Router, useValue: { navigate: vi.fn() } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
    dialog = TestBed.inject(MatDialog);
    vi.spyOn(dialog, 'open').mockReturnValue({ afterClosed: () => of('note') } as any);
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RiskFlagsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should get risk type class', () => {
    const fixture = TestBed.createComponent(RiskFlagsComponent);
    const component = fixture.componentInstance;
    expect(component.getRiskTypeClass('high')).toBe('risk-high');
  });

  it('should add notes', async () => {
    const fixture = TestBed.createComponent(RiskFlagsComponent);
    const component = fixture.componentInstance;
    await component.addNotes({ id: '1', type: 'high', category: '', description: '', clause: '', recommendation: '', status: 'open' });
    expect(dialog.open).toHaveBeenCalled();
  });
});
