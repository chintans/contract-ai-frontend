import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';
import { ContractAnalysisService } from './contract-analysis.service';
import { ContractsService } from '../../../services/api/services/ContractsService';
import { HybridReviewService } from '../../../services/api/services/HybridReviewService';

describe('ContractAnalysisService', () => {
  let service: ContractAnalysisService;
  let contractsSpy: jasmine.SpyObj<ContractsService>;
  let hybridSpy: jasmine.SpyObj<HybridReviewService>;

  beforeEach(() => {
    contractsSpy = jasmine.createSpyObj('ContractsService', ['contractControllerExportAnalysis']);
    hybridSpy = jasmine.createSpyObj('HybridReviewService', []);
    TestBed.configureTestingModule({
      providers: [
        ContractAnalysisService,
        { provide: ContractsService, useValue: contractsSpy },
        { provide: HybridReviewService, useValue: hybridSpy }
      ]
    });
    service = TestBed.inject(ContractAnalysisService);
  });

  it('should map backend data', async () => {
    const data = {
      id: '1',
      uploadDate: '2024-01-01T00:00:00Z',
      status: 'completed',
      summary: { title: 't', parties: ['p'] },
      riskFlags: []
    } as any;
    const mapped = (service as any).mapBackendToContractAnalysis(data, 'f.doc');
    expect(mapped.contractId).toBe('1');
    expect(mapped.fileName).toBe('f.doc');
    expect(mapped.analysis.summary.title).toBe('t');
  });

  it('exportAnalysis should return blob when no contract id', async () => {
    (service as any).currentAnalysis.next({
      contractId: '',
      fileName: 'f',
      uploadDate: new Date(),
      status: 'completed',
      analysis: { summary: { title: '', parties: [], effectiveDate: new Date(), expirationDate: new Date(), value: 0, keyTerms: [], obligations: [], recommendations: [] }, riskFlags: [] }
    });
    const blob = await firstValueFrom(service.exportAnalysis());
    expect(blob instanceof Blob).toBeTrue();
    expect(contractsSpy.contractControllerExportAnalysis).not.toHaveBeenCalled();
  });

  it('exportAnalysis should delegate when contract id present', async () => {
    const expectedBlob = new Blob();
    contractsSpy.contractControllerExportAnalysis.and.returnValue(of(expectedBlob));
    (service as any).currentAnalysis.next({
      contractId: '123',
      fileName: 'f',
      uploadDate: new Date(),
      status: 'completed',
      analysis: { summary: { title: '', parties: [], effectiveDate: new Date(), expirationDate: new Date(), value: 0, keyTerms: [], obligations: [], recommendations: [] }, riskFlags: [] }
    });
    const blob = await firstValueFrom(service.exportAnalysis());
    expect(blob).toBe(expectedBlob);
    expect(contractsSpy.contractControllerExportAnalysis).toHaveBeenCalledWith('123');
  });
});
