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
    MatProgressSpinnerModule
  ],
  templateUrl: './contract-analysis.component.html',
  styleUrls: ['./contract-analysis.component.scss']
})
export class ContractAnalysisComponent implements OnInit, OnChanges {
  @Input() contractId: string | null = null;
  analysis$: Observable<ContractAnalysis | null>;

  constructor(
    private contractAnalysisService: ContractAnalysisService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.analysis$ = this.contractAnalysisService.getCurrentAnalysis();
  }

  ngOnInit(): void {
    // Subscribe to check if analysis exists
    this.analysis$.subscribe(analysis => {
      if (!analysis) {
        // If no analysis is available, redirect to upload
        this.router.navigate(['../upload'], { relativeTo: this.route });
      }
    });
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
      // Handle error (show error message to user)
    }
  }
} 