import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
// Placeholder selector for audit events (to be implemented in selectors/reducer)
// import { selectAuditEvents } from '../store/dashboard.selectors';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard-event-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-event-timeline.component.html',
  styleUrls: ['./dashboard-event-timeline.component.scss']
})
export class DashboardEventTimelineComponent {
  private store = inject(Store);
  // Replace with real selector when available
  auditEvents$ = of([
    { timestamp: new Date().toISOString(), actor: 'Alice', action: 'Uploaded contract', detail: 'Contract NDA_v1.pdf uploaded.' },
    { timestamp: new Date().toISOString(), actor: 'Bob', action: 'Resolved risk', detail: 'IP clause risk resolved.' },
    { timestamp: new Date().toISOString(), actor: 'Carol', action: 'Approved contract', detail: 'Contract approved.' }
  ]);
} 