import { Component } from '@angular/core';

import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { MatTableDataSource } from '@angular/material/table';

interface ReviewJob {
  id: string;
  fileName: string;
  createdAt: string;
  status: string;
}

@Component({
  selector: 'app-review-job-list',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './review-job-list.component.html',
  styleUrls: ['./review-job-list.component.scss']
})
export class ReviewJobListComponent {
  jobs: ReviewJob[] = [
    { id: 'r1', fileName: 'contract.pdf', createdAt: '2024-06-10', status: 'Pending' }
  ];
  dataSource = new MatTableDataSource<ReviewJob>(this.jobs);
  displayedColumns = ['fileName', 'createdAt', 'status'];

  constructor(private router: Router) {}

  open(job: ReviewJob): void {
    this.router.navigate(['../reviews', job.id]);
  }

  addForReview(): void {
    // Navigate to the contract review wizard (upload step)
    this.router.navigate(['/contracts/review/upload']);
  }
}
