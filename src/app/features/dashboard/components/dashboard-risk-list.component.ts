import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { selectRiskFlags, selectSelectedRiskIds } from '../store/dashboard.selectors';
import { selectRisk, deselectRisk } from '../store/dashboard.actions';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard-risk-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-risk-list.component.html',
  styleUrls: ['./dashboard-risk-list.component.scss']
})
export class DashboardRiskListComponent {
  private store = inject(Store);
  riskFlags$ = this.store.select(selectRiskFlags);
  selectedRiskIds$ = this.store.select(selectSelectedRiskIds);

  isSelected(riskId: string, selectedIds: string[]): boolean {
    return selectedIds.includes(riskId);
  }

  toggleRisk(riskId: string, selectedIds: string[]): void {
    if (selectedIds.includes(riskId)) {
      this.store.dispatch(deselectRisk({ riskId }));
    } else {
      this.store.dispatch(selectRisk({ riskId }));
    }
  }
} 