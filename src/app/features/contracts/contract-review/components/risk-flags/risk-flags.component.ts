import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ContractAnalysisService, ContractAnalysis } from '../../services/contract-analysis.service';
import { firstValueFrom, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskFlagNotesDialogComponent } from './risk-flag-notes-dialog.component';

@Component({
  selector: 'app-risk-flags',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule
],
  templateUrl: './risk-flags.component.html',
  styleUrls: ['./risk-flags.component.scss']
})
export class RiskFlagsComponent implements OnInit, OnChanges {
  @Input() contractId: string | null = null;
  analysis$: Observable<ContractAnalysis | null>;
  filteredRisks$: Observable<ContractAnalysis['analysis']['riskFlags']>;
  selectedSeverity: 'all' | 'HIGH' | 'MEDIUM' | 'LOW' = 'all';
  selectedStatus: 'all' | 'OPEN' | 'RESOLVED' | 'IGNORED' = 'all';

  constructor(
    private contractAnalysisService: ContractAnalysisService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.analysis$ = this.contractAnalysisService.getCurrentAnalysis();
    this.filteredRisks$ = this.analysis$.pipe(
      map(analysis => {
        if (!analysis) return [];
        return this.filterRisks(analysis.analysis.riskFlags);
      })
    );
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
      this.fetchRiskFlags(this.contractId);
    }
  }

  private async fetchRiskFlags(contractId: string): Promise<void> {
    try {
      const risksRes = await this.contractAnalysisService['contractsService'].contractControllerGetContractRisks(contractId).toPromise();
      const current = await this.contractAnalysisService.getCurrentAnalysis().toPromise();
      if (current) {
        const updated = { ...current, analysis: { ...current.analysis, riskFlags: risksRes || [] } };
        (this.contractAnalysisService as any).currentAnalysis.next(updated);
      }
    } catch (error) {
      // Optionally handle error
    }
  }

  private filterRisks(risks: ContractAnalysis['analysis']['riskFlags']): ContractAnalysis['analysis']['riskFlags'] {
    return risks.filter(risk => {
      const matchesSeverity = this.selectedSeverity === 'all' || risk.severity === this.selectedSeverity;
      const matchesStatus = this.selectedStatus === 'all' || risk.status === this.selectedStatus;
      return matchesSeverity && matchesStatus;
    });
  }

  getRiskTypeClass(severity: 'HIGH' | 'MEDIUM' | 'LOW'): string {
    return `risk-${severity.toLowerCase()}`;
  }

  async addNotes(risk: ContractAnalysis['analysis']['riskFlags'][0]): Promise<void> {
    const dialogRef = this.dialog.open(RiskFlagNotesDialogComponent, {
      width: '500px',
      data: { notes: risk.notes }
    });

    const result = await firstValueFrom(dialogRef.afterClosed());
    if (result !== undefined) {
      this.contractAnalysisService.updateRiskFlag(risk.id, { notes: result });
    }
  }

  updateRiskStatus(
    risk: ContractAnalysis['analysis']['riskFlags'][0],
    newStatus: 'OPEN' | 'RESOLVED' | 'IGNORED'
  ): void {
    this.contractAnalysisService.updateRiskFlag(risk.id, { status: newStatus });
  }
} 