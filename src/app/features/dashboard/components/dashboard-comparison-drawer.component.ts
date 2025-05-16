import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-comparison-drawer',
  standalone: true,
  templateUrl: './dashboard-comparison-drawer.component.html',
  styleUrls: ['./dashboard-comparison-drawer.component.scss']
})
export class DashboardComparisonDrawerComponent {
  // Drawer open/close state
  isOpen = signal(false);
  // View mode: 'inline' or 'side-by-side'
  viewMode = signal<'inline' | 'side-by-side'>('inline');
} 