import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractAnalysisService, ContractAnalysis } from '../../services/contract-analysis.service';
import { firstValueFrom, Observable } from 'rxjs';
import { ContractSummaryDetailsComponent, ContractSummary } from './contract-summary-details/contract-summary-details.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

// Define interfaces for type safety
interface RiskFlag {
  type: string;
  severity: string;
  status: string;
  description: string;
  suggestedResolution?: string;
  reviewerComments?: string;
  isReviewed: boolean;
  isResolved: boolean;
}

interface Clause {
  number: number;
  type: string;
  riskLevel: string;
  title: string;
  text: string;
  suggestedText?: string;
  classification?: string;
  isReviewed: boolean;
  isApproved: boolean;
}

@Component({
  selector: 'app-contract-analysis',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    ContractSummaryDetailsComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './contract-analysis.component.html',
  styleUrls: ['./contract-analysis.component.scss']
})
export class ContractAnalysisComponent implements OnInit, OnChanges {
  @Input() contractId: string | null = null;
  analysis$: Observable<ContractAnalysis | null>;

  // Expose summaries, riskFlags, and clauses for the template
  summaries: any[] = [];
  riskFlags: RiskFlag[] = [];
  clauses: Clause[] = [];

  // Filtering and pagination state
  riskFlagFilter: string = '';
  riskFlagSeverity: string = '';
  riskFlagStatus: string = '';
  riskFlagPage: number = 1;
  riskFlagPageSize: number = 5;

  clauseFilter: string = '';
  clauseType: string = '';
  clauseRiskLevel: string = '';
  clausePage: number = 1;
  clausePageSize: number = 5;

  get filteredRiskFlags(): RiskFlag[] {
    let filtered = this.riskFlags;
    if (this.riskFlagFilter) {
      filtered = filtered.filter(rf =>
        rf.description?.toLowerCase().includes(this.riskFlagFilter.toLowerCase()) ||
        rf.type?.toLowerCase().includes(this.riskFlagFilter.toLowerCase())
      );
    }
    if (this.riskFlagSeverity) {
      filtered = filtered.filter(rf => rf.severity === this.riskFlagSeverity);
    }
    if (this.riskFlagStatus) {
      filtered = filtered.filter(rf => rf.status === this.riskFlagStatus);
    }
    return filtered;
  }

  get paginatedRiskFlags(): RiskFlag[] {
    const start = (this.riskFlagPage - 1) * this.riskFlagPageSize;
    return this.filteredRiskFlags.slice(start, start + this.riskFlagPageSize);
  }

  get riskFlagTotalPages(): number {
    return Math.ceil(this.filteredRiskFlags.length / this.riskFlagPageSize) || 1;
  }

  get filteredClauses(): Clause[] {
    let filtered = this.clauses;
    if (this.clauseFilter) {
      filtered = filtered.filter(clause =>
        clause.title?.toLowerCase().includes(this.clauseFilter.toLowerCase()) ||
        clause.text?.toLowerCase().includes(this.clauseFilter.toLowerCase())
      );
    }
    if (this.clauseType) {
      filtered = filtered.filter(clause => clause.type === this.clauseType);
    }
    if (this.clauseRiskLevel) {
      filtered = filtered.filter(clause => clause.riskLevel === this.clauseRiskLevel);
    }
    return filtered;
  }

  get paginatedClauses(): Clause[] {
    const start = (this.clausePage - 1) * this.clausePageSize;
    return this.filteredClauses.slice(start, start + this.clausePageSize);
  }

  get clauseTotalPages(): number {
    return Math.ceil(this.filteredClauses.length / this.clausePageSize) || 1;
  }

  // Pagination controls
  nextRiskFlagPage() {
    if (this.riskFlagPage < this.riskFlagTotalPages) this.riskFlagPage++;
  }
  prevRiskFlagPage() {
    if (this.riskFlagPage > 1) this.riskFlagPage--;
  }
  nextClausePage() {
    if (this.clausePage < this.clauseTotalPages) this.clausePage++;
  }
  prevClausePage() {
    if (this.clausePage > 1) this.clausePage--;
  }

  // Reset pagination on filter change
  onRiskFlagFilterChange() {
    this.riskFlagPage = 1;
  }
  onClauseFilterChange() {
    this.clausePage = 1;
  }

  constructor(
    private contractAnalysisService: ContractAnalysisService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.analysis$ = this.contractAnalysisService.getCurrentAnalysis();
  }

  ngOnInit(): void {
    this.analysis$.subscribe(analysis => {
      if (!analysis) {
        this.router.navigate(['../upload'], { relativeTo: this.route });
      } else {
        this.summaries = analysis.analysis.summaries;
        this.riskFlags = analysis.analysis.riskFlags as RiskFlag[];
        this.clauses = (analysis.analysis.clauses as any[]).map((clause: any) => this.mapClauseDtoToClause(clause));
      }
    });
  }

  private mapClauseDtoToClause(dto: any): Clause {
    return {
      number: Number(dto.number),
      type: dto.type ?? '',
      riskLevel: dto.riskLevel ?? '',
      title: dto.title ?? '',
      text: dto.text ?? '',
      suggestedText: dto.suggestedText,
      classification: dto.classification,
      isReviewed: dto.isReviewed,
      isApproved: dto.isApproved
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contractId'] && this.contractId) {
      this.fetchAnalysis(this.contractId);
    }
  }

  private async fetchAnalysis(contractId: string): Promise<void> {
    try {
      const analysisRes = await firstValueFrom(this.contractAnalysisService['contractsService'].contractControllerGetAnalysis(contractId));
      const mapped = (this.contractAnalysisService as any).mapBackendToContractAnalysis(analysisRes, '');
      (this.contractAnalysisService as any).currentAnalysis.next(mapped);
    } catch (error) {
      // Optionally handle error
    }
  }

  async exportAnalysis(): Promise<void> {
    try {
      const blob = await firstValueFrom(this.contractAnalysisService.exportAnalysis());
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contract-analysis.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting analysis:', error);
    }
  }

  parseSummaryText(text: string): ContractSummary | null {
    try {
      return JSON.parse(text);
    } catch {
      return null;
    }
  }
} 