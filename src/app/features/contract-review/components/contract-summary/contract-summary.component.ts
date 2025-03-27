import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
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
    MatExpansionModule
  ],
  template: `
    <div class="p-6">
      <div class="max-w-4xl mx-auto">
        <div *ngIf="analysis$ | async as analysis; else loading">
          <div class="mb-6">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-semibold">Contract Summary</h2>
              <button mat-raised-button color="primary" (click)="exportAnalysis()">
                <mat-icon>download</mat-icon>
                Export Summary
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
                  <mat-list>
                    <mat-list-item *ngFor="let obligation of party.obligations">
                      <mat-icon matListItemIcon>check_circle</mat-icon>
                      <span matListItemTitle>{{ obligation }}</span>
                    </mat-list-item>
                  </mat-list>
                </div>
              </div>
            </mat-expansion-panel>

            <mat-expansion-panel>
              <mat-expansion-panel-header>
                <mat-panel-title>Risk Summary</mat-panel-title>
              </mat-expansion-panel-header>
              <div class="space-y-4 mt-4">
                <div class="grid grid-cols-3 gap-4">
                  <div class="text-center p-4 bg-red-50 rounded-lg">
                    <p class="text-2xl font-bold text-red-600">
                      {{ getHighRiskCount(analysis) }}
                    </p>
                    <p class="text-sm text-gray-600">High Risk Items</p>
                  </div>
                  <div class="text-center p-4 bg-yellow-50 rounded-lg">
                    <p class="text-2xl font-bold text-yellow-600">
                      {{ getMediumRiskCount(analysis) }}
                    </p>
                    <p class="text-sm text-gray-600">Medium Risk Items</p>
                  </div>
                  <div class="text-center p-4 bg-green-50 rounded-lg">
                    <p class="text-2xl font-bold text-green-600">
                      {{ getLowRiskCount(analysis) }}
                    </p>
                    <p class="text-sm text-gray-600">Low Risk Items</p>
                  </div>
                </div>
                <mat-divider></mat-divider>
                <div>
                  <h4 class="font-medium mb-2">Recommendations</h4>
                  <mat-list>
                    <mat-list-item *ngFor="let recommendation of analysis.analysis.summary.recommendations">
                      <mat-icon matListItemIcon>lightbulb</mat-icon>
                      <span matListItemTitle>{{ recommendation }}</span>
                    </mat-list-item>
                  </mat-list>
                </div>
              </div>
            </mat-expansion-panel>
          </mat-accordion>

          <div class="flex justify-end mt-6">
            <button mat-raised-button color="primary" (click)="goToQA()">
              Ask Questions
              <mat-icon>arrow_forward</mat-icon>
            </button>
          </div>
        </div>

        <ng-template #loading>
          <div class="text-center py-12">
            <mat-spinner diameter="48" class="mx-auto mb-4"></mat-spinner>
            <p class="text-gray-600">Loading contract summary...</p>
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