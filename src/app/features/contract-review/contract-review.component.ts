import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../../shared/shared.module';
import { StepValidationService } from './services/step-validation.service';
import { inject, signal, computed } from '@angular/core';
import { ContractUploadComponent } from './components/contract-upload/contract-upload.component';
import { ContractAnalysisComponent } from './components/contract-analysis/contract-analysis.component';
import { RiskFlagsComponent } from './components/risk-flags/risk-flags.component';
import { ContractSummaryComponent } from './components/contract-summary/contract-summary.component';
import { LegalQAComponent } from './components/legal-qa/legal-qa.component';

@Component({
  selector: 'app-contract-review',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SharedModule,
    ContractUploadComponent,
    ContractAnalysisComponent,
    RiskFlagsComponent,
    ContractSummaryComponent,
    LegalQAComponent
  ],
  templateUrl: './contract-review.component.html',
  styleUrls: ['./contract-review.component.scss']
})
export class ContractReviewComponent implements AfterViewInit, OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  currentStepIndex = 0;
  totalSteps = 5; // Total number of steps in the stepper

  // Step data signals
  uploadData = signal<{ contractType: string; selectedFile: File | null }>({ contractType: '', selectedFile: null });
  analysisData = signal<{ analysis: any }>({ analysis: null });
  risksData = signal<{ risks: any[] }>({ risks: [] });
  summaryData = signal<{ summary: any }>({ summary: null });
  qaData = signal<{ questions: string[] }>({ questions: [] });

  // Error state
  stepError = signal<string | null>(null);

  private readonly stepValidation = inject(StepValidationService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Map of routes to step indices
  private readonly routeStepMap: Record<string, number> = {
    'upload': 0,
    'analysis': 1,
    'risk-flags': 2,
    'summary': 3,
    'qa': 4
  };

  // Map of step indices to routes
  private readonly stepRouteMap: Record<number, string> = {
    0: 'upload',
    1: 'analysis',
    2: 'risk-flags',
    3: 'summary',
    4: 'qa'
  };

  ngOnInit() {
    // Subscribe to route changes to update stepper
    this.route.url.subscribe(segments => {
      if (segments.length > 0) {
        const path = segments[segments.length - 1].path;
        if (this.routeStepMap.hasOwnProperty(path)) {
          this.currentStepIndex = this.routeStepMap[path];
          if (this.stepper) {
            this.stepper.selectedIndex = this.currentStepIndex;
          }
        }
      }
    });
  }

  ngAfterViewInit() {
    if (this.stepper) {
      this.stepper.selectionChange.subscribe(event => {
        this.currentStepIndex = event.selectedIndex;
        this.stepError.set(null);
        // Navigate to the corresponding route
        const route = this.stepRouteMap[this.currentStepIndex];
        if (route) {
          this.router.navigate([route], { relativeTo: this.route.parent });
        }
      });
    }
  }

  previous(): void {
    if (this.stepper) {
      this.stepper.previous();
      this.stepError.set(null);
    }
  }

  // Computed property to check if current step is valid
  isCurrentStepValid = computed(() => {
    switch (this.currentStepIndex) {
      case 0:
        return this.stepValidation.validateUpload(this.uploadData());
      case 1:
        return this.stepValidation.validateAnalysis(this.analysisData());
      case 2:
        return this.stepValidation.validateRiskFlags(this.risksData());
      case 3:
        return this.stepValidation.validateSummary(this.summaryData());
      case 4:
        return this.stepValidation.validateQA(this.qaData());
      default:
        return false;
    }
  });

  next(): void {
    // Only fire validation and show error if invalid and user clicks Next
    if (!this.isCurrentStepValid()) {
      switch (this.currentStepIndex) {
        case 0:
          this.stepError.set('Please complete the contract upload step.');
          break;
        case 1:
          this.stepError.set('Analysis step is not complete.');
          break;
        case 2:
          this.stepError.set('Please review all risk flags.');
          break;
        case 3:
          this.stepError.set('Summary step is not complete.');
          break;
        case 4:
          this.stepError.set('Please ask at least one question.');
          break;
      }
      return;
    }
    if (this.stepper) {
      this.stepper.next();
      this.stepError.set(null);
    }
  }

  hasPrevious(): boolean {
    return this.currentStepIndex > 0;
  }

  hasNext(): boolean {
    return this.currentStepIndex < this.totalSteps - 1;
  }

  onUploadDataChange(data: { contractType: string; selectedFile: File | null }): void {
    this.uploadData.set(data);
  }
} 