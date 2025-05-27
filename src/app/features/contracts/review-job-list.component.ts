import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface ReviewJob {
  id: string;
  fileName: string;
  createdAt: string;
}

@Component({
  selector: 'app-review-job-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './review-job-list.component.html',
  styleUrls: ['./review-job-list.component.scss']
})
export class ReviewJobListComponent {
  jobs: ReviewJob[] = [
    { id: 'r1', fileName: 'contract.pdf', createdAt: '2024-06-10' }
  ];

  constructor(private router: Router) {}

  open(job: ReviewJob): void {
    this.router.navigate(['../reviews', job.id]);
  }
}
