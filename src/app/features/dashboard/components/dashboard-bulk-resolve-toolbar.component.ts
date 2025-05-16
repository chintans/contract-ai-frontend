import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectSelectedRiskIds } from '../store/dashboard.selectors';
import { bulkResolveRisks, bulkChangeSeverity, bulkDeleteRisks } from '../store/dashboard.actions';
import { CommonModule } from '@angular/common';
import { map, take } from 'rxjs';

@Component({
  selector: 'app-dashboard-bulk-resolve-toolbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-bulk-resolve-toolbar.component.html',
  styleUrls: ['./dashboard-bulk-resolve-toolbar.component.scss']
})
export class DashboardBulkResolveToolbarComponent {
  private store = inject(Store);
  selectedRiskIds$ = this.store.select(selectSelectedRiskIds);
  selectedCount$ = this.selectedRiskIds$.pipe(map(ids => ids.length));

  resolveSelected() {
    this.selectedRiskIds$.pipe(take(1)).subscribe(ids => {
      if (ids.length) this.store.dispatch(bulkResolveRisks({ riskIds: ids }));
    });
  }

  changeSeveritySelected(severity: 'high' | 'medium' | 'low') {
    this.selectedRiskIds$.pipe(take(1)).subscribe(ids => {
      if (ids.length) this.store.dispatch(bulkChangeSeverity({ riskIds: ids, severity }));
    });
  }

  deleteSelected() {
    this.selectedRiskIds$.pipe(take(1)).subscribe(ids => {
      if (ids.length) this.store.dispatch(bulkDeleteRisks({ riskIds: ids }));
    });
  }

  onSeverityChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'high' || value === 'medium' || value === 'low') {
      this.changeSeveritySelected(value);
    }
  }
} 