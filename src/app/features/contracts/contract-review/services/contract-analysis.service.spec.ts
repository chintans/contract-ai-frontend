import { TestBed } from '@angular/core/testing';
import { of, firstValueFrom } from 'rxjs';
import { describe, expect, it, vi } from 'vitest'
import { ContractAnalysisService } from './contract-analysis.service';
import { ContractsService, FilesService } from '@api/api';

describe('ContractAnalysisService', () => {
  let service: ContractAnalysisService;
  let contractsSpy: { contractControllerExportAnalysis: ReturnType<typeof vi.fn> };
  let filesSpy: { filesLocalControllerUploadFileV1: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    contractsSpy = { contractControllerExportAnalysis: vi.fn() };
    filesSpy = { filesLocalControllerUploadFileV1: vi.fn() };
    TestBed.configureTestingModule({
      providers: [
        ContractAnalysisService,
        { provide: ContractsService, useValue: contractsSpy },
        { provide: FilesService, useValue: filesSpy },
      ]
    });
    service = TestBed.inject(ContractAnalysisService);
  });

  it('should map backend data', async () => {
    const data = {
      id: '1',
      uploadDate: '2024-01-01T00:00:00Z',
      status: 'completed',
      summaries: [{ title: 't', parties: ['p'] }],
      riskFlags: []
    } as any;
    const mapped = (service as any).mapBackendToContractAnalysis(data, 'f.doc');
    expect(mapped.contractId).toBe('1');
    expect(mapped.fileName).toBe('f.doc');
    expect(mapped.analysis.summaries[0].title).toBe('t');
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
    expect(blob instanceof Blob).toBeTruthy();
    expect(contractsSpy.contractControllerExportAnalysis).not.toHaveBeenCalled();
  });

  it('exportAnalysis should delegate when contract id present', async () => {
    const expectedBlob = new Blob();
    contractsSpy.contractControllerExportAnalysis.mockReturnValue(of(expectedBlob as any));
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
