import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractAnalysisService, ContractAnalysis } from '../../services/contract-analysis.service';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contract-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './contract-summary.component.html',
  styleUrls: ['./contract-summary.component.scss']
})
export class ContractSummaryComponent implements OnInit, OnChanges {
  @Input() contractId: string | null = null;
  analysis$: Observable<ContractAnalysis | null>;

  summary: any = null;

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
        // Pick the first summary of type 'FULL' or just the first summary
        this.summary = analysis.analysis.summaries.find(s => s.type === 'FULL') || analysis.analysis.summaries[0] || null;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contractId'] && this.contractId) {
      // No need to fetch summary separately, handled by service
    }
  }

  getHighRiskCount(analysis: ContractAnalysis): number {
    return analysis.analysis.riskFlags.filter(risk => risk.severity === 'HIGH').length;
  }

  getMediumRiskCount(analysis: ContractAnalysis): number {
    return analysis.analysis.riskFlags.filter(risk => risk.severity === 'MEDIUM').length;
  }

  getLowRiskCount(analysis: ContractAnalysis): number {
    return analysis.analysis.riskFlags.filter(risk => risk.severity === 'LOW').length;
  }

  async exportAnalysis(): Promise<void> {
    try {
      const blob = await firstValueFrom(this.contractAnalysisService.exportAnalysis());
      if (blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contract-summary.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error exporting summary:', error);
    }
  }
} 