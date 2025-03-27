import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-risk-flag-notes-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Add Notes</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="w-full">
        <mat-label>Notes</mat-label>
        <textarea matInput
                  [(ngModel)]="notes"
                  rows="4"
                  placeholder="Enter your notes about this risk..."></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button
              color="primary"
              [mat-dialog-close]="notes">
        Save
      </button>
    </mat-dialog-actions>
  `
})
export class RiskFlagNotesDialogComponent {
  notes: string = '';

  constructor() {}
}

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
  template: `
    <div class="p-6">
      <div class="max-w-4xl mx-auto">
        <div *ngIf="analysis$ | async as analysis; else loading">
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">Risk Flags</h2>
              <div class="flex gap-4">
                <mat-form-field appearance="outline" class="w-48">
                  <mat-label>Filter by Severity</mat-label>
                  <mat-select [(ngModel)]="selectedSeverity">
                    <mat-option value="all">All</mat-option>
                    <mat-option value="high">High</mat-option>
                    <mat-option value="medium">Medium</mat-option>
                    <mat-option value="low">Low</mat-option>
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline" class="w-48">
                  <mat-label>Filter by Status</mat-label>
                  <mat-select [(ngModel)]="selectedStatus">
                    <mat-option value="all">All</mat-option>
                    <mat-option value="open">Open</mat-option>
                    <mat-option value="resolved">Resolved</mat-option>
                    <mat-option value="ignored">Ignored</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <mat-card *ngFor="let risk of filteredRisks$ | async">
              <mat-card-header>
                <div [ngClass]="getRiskTypeClass(risk.type)" class="w-2 h-2 rounded-full mt-2 mr-2"></div>
                <mat-card-title class="text-lg">{{ risk.category }}</mat-card-title>
                <mat-card-subtitle>{{ risk.clause }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content class="mt-4">
                <p class="text-gray-700">{{ risk.description }}</p>
                <p class="text-gray-600 mt-2">
                  <strong>Recommendation:</strong> {{ risk.recommendation }}
                </p>
                <p *ngIf="risk.notes" class="text-gray-600 mt-2">
                  <strong>Notes:</strong> {{ risk.notes }}
                </p>
              </mat-card-content>
              <mat-card-actions align="end">
                <button mat-button (click)="addNotes(risk)">
                  <mat-icon>note_add</mat-icon>
                  Add Notes
                </button>
                <button mat-button
                        [color]="risk.status === 'resolved' ? 'accent' : 'primary'"
                        (click)="updateRiskStatus(risk, risk.status === 'resolved' ? 'open' : 'resolved')">
                  <mat-icon>{{ risk.status === 'resolved' ? 'undo' : 'check' }}</mat-icon>
                  {{ risk.status === 'resolved' ? 'Reopen' : 'Mark Resolved' }}
                </button>
                <button mat-button
                        color="warn"
                        (click)="updateRiskStatus(risk, risk.status === 'ignored' ? 'open' : 'ignored')">
                  <mat-icon>{{ risk.status === 'ignored' ? 'visibility' : 'visibility_off' }}</mat-icon>
                  {{ risk.status === 'ignored' ? 'Unignore' : 'Ignore' }}
                </button>
              </mat-card-actions>
            </mat-card>
          </div>

          <div class="flex justify-end mt-6">
            <button mat-raised-button color="primary" (click)="goToSummary()">
              View Summary
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </div>

        <ng-template #loading>
          <div class="text-center py-12">
            <mat-spinner diameter="48" class="mx-auto mb-4"></mat-spinner>
            <p class="text-gray-600">Loading risk flags...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .risk-high {
      @apply bg-red-500;
    }
    .risk-medium {
      @apply bg-yellow-500;
    }
    .risk-low {
      @apply bg-green-500;
    }
  `]
})
export class RiskFlagsComponent implements OnInit {
  analysis$: Observable<ContractAnalysis | null>;
  filteredRisks$: Observable<ContractAnalysis['analysis']['riskFlags']>;
  selectedSeverity = 'all';
  selectedStatus = 'all';

  constructor(
    private contractAnalysisService: ContractAnalysisService,
    private dialog: MatDialog,
    private router: Router
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
        this.router.navigate(['contract-review', 'upload']);
      }
    });
  }

  private filterRisks(risks: ContractAnalysis['analysis']['riskFlags']): ContractAnalysis['analysis']['riskFlags'] {
    return risks.filter(risk => {
      const matchesSeverity = this.selectedSeverity === 'all' || risk.type === this.selectedSeverity;
      const matchesStatus = this.selectedStatus === 'all' || risk.status === this.selectedStatus;
      return matchesSeverity && matchesStatus;
    });
  }

  getRiskTypeClass(type: 'high' | 'medium' | 'low'): string {
    return `risk-${type}`;
  }

  async addNotes(risk: ContractAnalysis['analysis']['riskFlags'][0]): Promise<void> {
    const dialogRef = this.dialog.open(RiskFlagNotesDialogComponent, {
      width: '500px',
      data: { notes: risk.notes }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result !== undefined) {
      this.contractAnalysisService.updateRiskFlag(risk.id, { notes: result });
    }
  }

  updateRiskStatus(
    risk: ContractAnalysis['analysis']['riskFlags'][0],
    newStatus: 'open' | 'resolved' | 'ignored'
  ): void {
    this.contractAnalysisService.updateRiskFlag(risk.id, { status: newStatus });
  }

  goToSummary(): void {
    this.router.navigate(['contract-review', 'summary']);
  }
} 