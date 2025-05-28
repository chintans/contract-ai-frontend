import { TestBed } from '@angular/core/testing';
import { ContractSummaryComponent } from './contract-summary.component';
import { ContractAnalysisService } from '../../services/contract-analysis.service';
import { of } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

describe('ContractSummaryComponent', () => {
  let serviceSpy: jasmine.SpyObj<ContractAnalysisService>;

  beforeEach(async () => {
    serviceSpy = jasmine.createSpyObj('ContractAnalysisService', ['getCurrentAnalysis', 'exportAnalysis']);
    serviceSpy.getCurrentAnalysis.and.returnValue(of(null));
    await TestBed.configureTestingModule({
      imports: [ContractSummaryComponent],
      providers: [
        { provide: ContractAnalysisService, useValue: serviceSpy },
        { provide: Router, useValue: { navigate: () => {} } },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ContractSummaryComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should call exportAnalysis', async () => {
    const fixture = TestBed.createComponent(ContractSummaryComponent);
    const component = fixture.componentInstance;
    serviceSpy.exportAnalysis.and.returnValue(of(new Blob()));
    await component.exportAnalysis();
    expect(serviceSpy.exportAnalysis).toHaveBeenCalled();
  });
});
