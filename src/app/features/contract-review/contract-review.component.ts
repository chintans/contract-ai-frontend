import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-contract-review',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatStepperModule,
    MatButtonModule,
    MatIconModule,
    SharedModule
  ],
  templateUrl: './contract-review.component.html',
  styleUrls: ['./contract-review.component.scss']
})
export class ContractReviewComponent implements AfterViewInit {
  @ViewChild('stepper') stepper!: MatStepper;
  currentStepIndex = 0;
  totalSteps = 5; // Total number of steps in the stepper

  // Form controls will be added here
  uploadForm: any;
  analysisForm: any;
  risksForm: any;
  summaryForm: any;
  qaForm: any;

  ngAfterViewInit() {
    if (this.stepper) {
      this.stepper.selectionChange.subscribe(event => {
        this.currentStepIndex = event.selectedIndex;
      });
    }
  }

  previous(): void {
    if (this.stepper) {
      this.stepper.previous();
    }
  }

  next(): void {
    if (this.stepper) {
      this.stepper.next();
    }
  }

  hasPrevious(): boolean {
    return this.currentStepIndex > 0;
  }

  hasNext(): boolean {
    return this.currentStepIndex < this.totalSteps - 1;
  }
} 