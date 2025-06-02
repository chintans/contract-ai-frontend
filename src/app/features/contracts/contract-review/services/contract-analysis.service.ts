import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, of, firstValueFrom, map } from 'rxjs';
import { ContractsService, FilesService } from '@api/api';
import { UpdateRiskFlagDto } from '@models/updateRiskFlagDto';
import { AnalysisResultDto } from '@models/analysisResultDto';
import { SummaryDto } from '@models/summaryDto';
import { RiskFlagDto } from '@models/riskFlagDto';
import { ClauseDto } from '@models/clauseDto';

export interface ContractAnalysis {
  contractId: string;
  fileName: string;
  uploadDate: Date;
  status: 'analyzing' | 'completed' | 'error';
  analysis: {
    summaries: SummaryDto[];
    riskFlags: RiskFlagDto[];
    clauses: ClauseDto[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class ContractAnalysisService {
  private contractsService = inject(ContractsService);
  private filesService = inject(FilesService);
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
        summaries: [],
        riskFlags: [],
        clauses: []
      }
    });
    try {
      const fileBlob = new Blob([file], { type: file.type });
      // Upload contract
      const uploadRes = await firstValueFrom(
        this.contractsService.contractControllerCreate(fileBlob, contractType)
      ) as any;
      const contractId = uploadRes?.id || uploadRes?.contractId;
      if (!contractId) throw new Error('No contract ID returned from upload');
      // Trigger analysis
      await firstValueFrom(this.contractsService.contractControllerAnalyzeContract(contractId));
      // Fetch analysis result
      const analysisRes = await firstValueFrom(this.contractsService.contractControllerGetAnalysis(contractId));
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
          summaries: [],
          riskFlags: [],
          clauses: []
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
      status: (updates.status) ?? 'OPEN',
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
      const contractId = this.currentAnalysis.value?.contractId;
      if (!contractId) return 'No contract ID available.';
      
      const res = await firstValueFrom(this.contractsService.contractControllerAskQuestion(contractId)) as any;
      if (res?.answer) return res.answer;
      
      // fallback: try ContractsService QnA
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

  uploadAttachment(file: File): Observable<string> {
    return this.filesService.filesLocalControllerUploadFileV1(file).pipe(
      map(res => res.file.path)
    );
  }

  // Helper to map backend data to ContractAnalysis interface
  private mapBackendToContractAnalysis(data: AnalysisResultDto, fileName: string): ContractAnalysis {
    return {
      contractId: (data as any).id || (data as any).contractId || '',
      fileName: fileName,
      uploadDate: (data as any).uploadDate ? new Date((data as any).uploadDate) : new Date(),
      status: (data as any).status || 'completed',
      analysis: {
        summaries: data.summaries || [],
        riskFlags: data.riskFlags || [],
        clauses: data.clauses || []
      }
    };
  }
} 
