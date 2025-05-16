import { Component, signal, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-dashboard-offline-guard',
  standalone: true,
  templateUrl: './dashboard-offline-guard.component.html',
  styleUrls: ['./dashboard-offline-guard.component.scss']
})
export class DashboardOfflineGuardComponent implements OnInit, OnDestroy {
  isOffline = signal(false);

  private onlineListener = () => this.isOffline.set(false);
  private offlineListener = () => this.isOffline.set(true);

  ngOnInit() {
    window.addEventListener('online', this.onlineListener);
    window.addEventListener('offline', this.offlineListener);
    this.isOffline.set(!navigator.onLine);
  }

  ngOnDestroy() {
    window.removeEventListener('online', this.onlineListener);
    window.removeEventListener('offline', this.offlineListener);
  }
} 