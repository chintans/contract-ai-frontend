import { Component, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard-responsive-guard',
  standalone: true,
  templateUrl: './dashboard-responsive-guard.component.html',
  styleUrls: ['./dashboard-responsive-guard.component.scss']
})
export class DashboardResponsiveGuardComponent implements OnInit, OnDestroy {
  isDesktop = signal(false);
  isTablet = signal(false);
  isMobile = signal(false);

  private updateBreakpoint = () => {
    const width = window.innerWidth;
    this.isDesktop.set(width >= 1280);
    this.isTablet.set(width >= 768 && width < 1280);
    this.isMobile.set(width < 768);
  };

  ngOnInit() {
    window.addEventListener('resize', this.updateBreakpoint);
    this.updateBreakpoint();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateBreakpoint);
  }
} 