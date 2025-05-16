import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectRiskCounts } from '../store/dashboard.selectors';

@Component({
  selector: 'app-dashboard-risk-counter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-risk-counter.component.html',
  styleUrls: ['./dashboard-risk-counter.component.scss']
})
export class DashboardRiskCounterComponent {
  private store = inject(Store);
  readonly riskCounts$ = this.store.select(selectRiskCounts);
} 