import { Component, Input } from '@angular/core';

import { MatCardModule } from '@angular/material/card';

interface PullRequest {
  id: string;
  sourceBranch: string;
  targetBranch: string;
  status: 'open' | 'in-review' | 'merged' | 'abandoned';
  commits: number;
  lastActivity: string;
}

@Component({
  selector: 'app-pr-dashboard',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './pr-dashboard.component.html',
  styleUrls: ['./pr-dashboard.component.scss']
})
export class PrDashboardComponent {
  @Input() pullRequests: PullRequest[] = [];

  get open() {
    return this.pullRequests.filter(pr => pr.status === 'open');
  }

  get inReview() {
    return this.pullRequests.filter(pr => pr.status === 'in-review');
  }

  get merged() {
    return this.pullRequests.filter(pr => pr.status === 'merged');
  }

  get abandoned() {
    return this.pullRequests.filter(pr => pr.status === 'abandoned');
  }
}
