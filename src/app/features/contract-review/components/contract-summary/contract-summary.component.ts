import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
export class ContractSummaryComponent implements OnInit {
  analysis$: Observable<ContractAnalysis | null>;

  constructor(
    private contractAnalysisService: ContractAnalysisService,
    private router: Router
  ) {
    this.analysis$ = this.contractAnalysisService.getCurrentAnalysis();
  }

  ngOnInit(): void {
    // Subscribe to check if analysis exists
    this.analysis$.subscribe(analysis => {
      if (!analysis) {
        // If no analysis is available, redirect to upload
        this.router.navigate(['contract-review', 'upload']);
      }
    });
  }

  getHighRiskCount(analysis: ContractAnalysis): number {
    return analysis.analysis.riskFlags.filter(risk => risk.type === 'high').length;
  }

  getMediumRiskCount(analysis: ContractAnalysis): number {
    return analysis.analysis.riskFlags.filter(risk => risk.type === 'medium').length;
  }

  getLowRiskCount(analysis: ContractAnalysis): number {
    return analysis.analysis.riskFlags.filter(risk => risk.type === 'low').length;
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
      // Handle error (show error message to user)
    }
  }

  goToQA(): void {
    this.router.navigate(['contract-review', 'qa']);
  }
} 