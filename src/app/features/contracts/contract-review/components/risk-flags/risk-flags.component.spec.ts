import { TestBed } from '@angular/core/testing';
import { RiskFlagsComponent, RiskFlagNotesDialogComponent } from './risk-flags.component';
import { ContractAnalysisService } from '../../services/contract-analysis.service';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';

describe('RiskFlagsComponent', () => {
  let serviceSpy: jasmine.SpyObj<ContractAnalysisService>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('ContractAnalysisService', ['getCurrentAnalysis', 'updateRiskFlag']);
    serviceSpy.getCurrentAnalysis.and.returnValue(of({ analysis: { riskFlags: [] } } as any));
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({ afterClosed: () => of('note') } as any);

    await TestBed.configureTestingModule({
      imports: [RiskFlagsComponent, RiskFlagNotesDialogComponent],
      providers: [
        { provide: ContractAnalysisService, useValue: serviceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    })
      .overrideProvider(MatDialog, { useValue: dialogSpy })
      .compileComponents();
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
    expect(dialogSpy.open).toHaveBeenCalled();
  });
});
