import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { MatStepper } from '@angular/material/stepper';

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
export class ContractReviewComponent {
  // Form controls will be added here
  uploadForm: any;
  analysisForm: any;
  risksForm: any;
  summaryForm: any;
  qaForm: any;

  constructor(private stepper: MatStepper) {}

  previous(): void {
    this.stepper.previous();
  }

  next(): void {
    this.stepper.next();
  }

  hasPrevious(): boolean {
    return this.stepper.selectedIndex > 0;
  }

  hasNext(): boolean {
    return this.stepper.selectedIndex < this.stepper._steps.length - 1;
  }
} 