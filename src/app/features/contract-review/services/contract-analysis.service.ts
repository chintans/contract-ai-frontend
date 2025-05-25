import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, firstValueFrom } from 'rxjs';
import { ContractsService } from '../../../services/api/services/ContractsService';
import { HybridReviewService } from '../../../services/api/services/HybridReviewService';
import { UpdateRiskFlagDto } from '../../../services/api/models/UpdateRiskFlagDto';

export interface ContractAnalysis {
  contractId: string;
  fileName: string;
  uploadDate: Date;
  status: 'analyzing' | 'completed' | 'error';
  analysis: {
    summary: {
      title: string;
      parties: string[];
      effectiveDate: Date;
      expirationDate: Date;
      value: number;
      keyTerms: { term: string; description: string }[];
      obligations: { party: string; obligations: string[] }[];
      recommendations: string[];
    };
    riskFlags: {
      id: string;
      type: 'high' | 'medium' | 'low';
      category: string;
      description: string;
      clause: string;
      recommendation: string;
      status: 'open' | 'resolved' | 'ignored';
      notes?: string;
    }[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContractAnalysisService {
  private contractsService = inject(ContractsService);
  private hybridReviewService = inject(HybridReviewService);
  private currentAnalysis = new BehaviorSubject<ContractAnalysis | null>(null);

  getCurrentAnalysis(): Observable<ContractAnalysis | null> {
    return this.currentAnalysis.asObservable();
  }

  async uploadContract(file: File, contractType: string): Promise<void> {
    if (!file || !contractType) return;
    this.currentAnalysis.next({
      contractId: '',
      fileName: file.name,
      uploadDate: new Date(),
      status: 'analyzing',
      analysis: {
        summary: {
          title: '',
          parties: [],
          effectiveDate: new Date(),
          expirationDate: new Date(),
          value: 0,
          keyTerms: [],
          obligations: [],
          recommendations: []
        },
        riskFlags: []
      }
    });
    try {
      // Upload contract
      const uploadRes = await firstValueFrom(
        this.contractsService.contractControllerCreate({ file, contractType })
      ) as any;
      const contractId = uploadRes?.id || uploadRes?.contractId;
      if (!contractId) throw new Error('No contract ID returned from upload');
      // Trigger analysis
      await firstValueFrom(this.contractsService.contractControllerAnalyzeContract(contractId));
      // Fetch analysis result
      const analysisRes = await firstValueFrom(this.contractsService.contractControllerGetAnalysis(contractId)) as any;
      // Map backend data to ContractAnalysis
      const mapped = this.mapBackendToContractAnalysis(analysisRes, file.name);
      this.currentAnalysis.next(mapped);
    } catch (err) {
      this.currentAnalysis.next({
        contractId: '',
        fileName: file.name,
        uploadDate: new Date(),
        status: 'error',
        analysis: {
          summary: {
            title: '',
            parties: [],
            effectiveDate: new Date(),
            expirationDate: new Date(),
            value: 0,
            keyTerms: [],
            obligations: [],
            recommendations: []
          },
          riskFlags: []
        }
      });
      throw err;
    }
  }

  updateRiskFlag(riskId: string, updates: Partial<ContractAnalysis['analysis']['riskFlags'][0]>): void {
    const currentValue = this.currentAnalysis.value;
    if (!currentValue) return;
    const contractId = currentValue.contractId;
    if (!contractId) return;
    const dto: UpdateRiskFlagDto = {
      status: (updates.status as UpdateRiskFlagDto.status) ?? UpdateRiskFlagDto.status.OPEN,
      notes: updates.notes
    };
    this.contractsService.contractControllerUpdateRiskFlag(contractId, riskId, dto).subscribe({
      next: () => {
        // Optimistically update local state
        const updatedRiskFlags = currentValue.analysis.riskFlags.map(flag =>
          flag.id === riskId ? { ...flag, ...updates } : flag
        );
        this.currentAnalysis.next({
          ...currentValue,
          analysis: {
            ...currentValue.analysis,
            riskFlags: updatedRiskFlags
          }
        });
      }
    });
  }

  async getAIResponse(question: string): Promise<string> {
    // Use HybridReviewService for search, fallback to ContractsService QnA if needed
    try {
      const res = await firstValueFrom(this.hybridReviewService.hybridReviewControllerSearch(question)) as any;
      if (res?.answer) return res.answer;
      // fallback: try ContractsService QnA if contractId is available
      const contractId = this.currentAnalysis.value?.contractId;
      if (contractId) {
        const qnaRes = await firstValueFrom(this.contractsService.contractControllerAskQuestion(contractId)) as any;
        if (qnaRes?.answer) return qnaRes.answer;
      }
      return 'No answer available.';
    } catch (err) {
      return 'Error getting AI response.';
    }
  }

  exportAnalysis(): Observable<Blob> {
    const analysis = this.currentAnalysis.value;
    if (!analysis?.contractId) {
      return of(new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' }));
    }
    return this.contractsService.contractControllerExportAnalysis(analysis.contractId) as Observable<Blob>;
  }

  // Helper to map backend data to ContractAnalysis interface
  private mapBackendToContractAnalysis(data: any, fileName: string): ContractAnalysis {
    // This mapping should be updated to match backend response structure
    return {
      contractId: data.id || data.contractId || '',
      fileName: fileName,
      uploadDate: data.uploadDate ? new Date(data.uploadDate) : new Date(),
      status: data.status || 'completed',
      analysis: {
        summary: {
          title: data.summary?.title || '',
          parties: data.summary?.parties || [],
          effectiveDate: data.summary?.effectiveDate ? new Date(data.summary.effectiveDate) : new Date(),
          expirationDate: data.summary?.expirationDate ? new Date(data.summary.expirationDate) : new Date(),
          value: data.summary?.value || 0,
          keyTerms: data.summary?.keyTerms || [],
          obligations: data.summary?.obligations || [],
          recommendations: data.summary?.recommendations || []
        },
        riskFlags: data.riskFlags || []
      }
    };
  }
} 