import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../../shared/shared.module';
import { filter } from 'rxjs/operators';

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

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    if (this.stepper) {
      this.stepper.selectionChange.subscribe(event => {
        this.currentStepIndex = event.selectedIndex;
      });

      // Listen to route changes
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        const childRoute = this.route.firstChild?.snapshot.url[0]?.path;
        switch (childRoute) {
          case 'upload':
            this.stepper.selectedIndex = 0;
            break;
          case 'analysis':
            this.stepper.selectedIndex = 1;
            break;
          case 'risk-flags':
            this.stepper.selectedIndex = 2;
            break;
          case 'summary':
            this.stepper.selectedIndex = 3;
            break;
          case 'qa':
            this.stepper.selectedIndex = 4;
            break;
        }
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