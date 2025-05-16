import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectActiveTab } from '../store/dashboard.selectors';
import { setActiveTab } from '../store/dashboard.actions';
import { DashboardClausesListComponent } from './dashboard-clauses-list.component';
import { DashboardAutosaveToolbarComponent } from './dashboard-autosave-toolbar.component';
import { DashboardComplianceHeatmapComponent } from './dashboard-compliance-heatmap.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-main-panel',
  standalone: true,
  imports: [CommonModule, DashboardClausesListComponent, DashboardAutosaveToolbarComponent, DashboardComplianceHeatmapComponent],
  templateUrl: './dashboard-main-panel.component.html',
  styleUrls: ['./dashboard-main-panel.component.scss']
})
export class DashboardMainPanelComponent {
  private store = inject(Store);
  activeTab$ = this.store.select(selectActiveTab);

  setTab(tab: string) {
    this.store.dispatch(setActiveTab({ tab } as any));
  }
} 