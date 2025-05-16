import { Component } from '@angular/core';
import { DashboardRiskCounterComponent } from './dashboard-risk-counter.component';
import { DashboardFilterBarComponent } from './dashboard-filter-bar.component';
import { DashboardBulkResolveToolbarComponent } from './dashboard-bulk-resolve-toolbar.component';
import { DashboardRiskListComponent } from './dashboard-risk-list.component';
import { DashboardEventTimelineComponent } from './dashboard-event-timeline.component';

@Component({
  selector: 'app-dashboard-left-rail',
  standalone: true,
  imports: [DashboardRiskCounterComponent, DashboardFilterBarComponent, DashboardBulkResolveToolbarComponent, DashboardRiskListComponent, DashboardEventTimelineComponent],
  templateUrl: './dashboard-left-rail.component.html',
  styleUrls: ['./dashboard-left-rail.component.scss']
})
export class DashboardLeftRailComponent {} 