import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  template: `
    <div class="p-6">
      <div class="max-w-4xl mx-auto">
        <div *ngIf="analysis$ | async as analysis; else loading">
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">Contract Analysis</h2>
              <button mat-raised-button color="primary" (click)="exportAnalysis()">
                <mat-icon>download</mat-icon>
                Export Analysis
              </button>
            </div>
            <p class="text-gray-600 mt-2">{{ analysis.fileName }}</p>
          </div>

          <mat-card class="mb-6">
            <mat-card-header>
              <mat-card-title>Overview</mat-card-title>
            </mat-card-header>
            <mat-card-content class="mt-4">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <h3 class="text-lg font-medium mb-2">Contract Details</h3>
                  <div class="space-y-2">
                    <p><span class="font-medium">Title:</span> {{ analysis.analysis.summary.title }}</p>
                    <p><span class="font-medium">Value:</span> {{ analysis.analysis.summary.value | currency }}</p>
                    <p><span class="font-medium">Effective Date:</span> {{ analysis.analysis.summary.effectiveDate | date }}</p>
                    <p><span class="font-medium">Expiration Date:</span> {{ analysis.analysis.summary.expirationDate | date }}</p>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-medium mb-2">Parties</h3>
                  <ul class="list-disc list-inside space-y-1">
                    <li *ngFor="let party of analysis.analysis.summary.parties">{{ party }}</li>
                  </ul>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-accordion>
            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>Key Terms</mat-panel-title>
              </mat-expansion-panel-header>
              <div class="grid grid-cols-1 gap-4 mt-4">
                <div *ngFor="let term of analysis.analysis.summary.keyTerms" class="border-b pb-4">
                  <h4 class="font-medium">{{ term.term }}</h4>
                  <p class="text-gray-600 mt-1">{{ term.description }}</p>
                </div>
              </div>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>Party Obligations</mat-panel-title>
              </mat-expansion-panel-header>
              <div class="space-y-6 mt-4">
                <div *ngFor="let party of analysis.analysis.summary.obligations">
                  <h4 class="font-medium mb-2">{{ party.party }}</h4>
                  <ul class="list-disc list-inside space-y-1">
                    <li *ngFor="let obligation of party.obligations" class="text-gray-600">
                      {{ obligation }}
                    </li>
                  </ul>
                </div>
              </div>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>Recommendations</mat-panel-title>
              </mat-expansion-panel-header>
              <ul class="list-disc list-inside space-y-2 mt-4">
                <li *ngFor="let recommendation of analysis.analysis.summary.recommendations" class="text-gray-600">
                  {{ recommendation }}
                </li>
              </ul>
            </mat-expansion-panel>
          </mat-accordion>

          <div class="flex justify-end mt-6">
            <button mat-raised-button color="primary" (click)="goToRiskFlags()">
              View Risk Flags
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </div>

        <ng-template #loading>
          <div class="text-center py-12">
            <mat-spinner diameter="48" class="mx-auto mb-4"></mat-spinner>
            <p class="text-gray-600">Analyzing contract...</p>
          </div>
        </ng-template>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    mat-expansion-panel {
      margin-bottom: 1rem;
    }
  `]
})
export class ContractAnalysisComponent implements OnInit {
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

  goToRiskFlags(): void {
    this.router.navigate(['contract-review', 'risk-flags']);
  }
} 