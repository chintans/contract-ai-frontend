import { Component, OnInit } from '@angular/core';
import { StandardClause } from '../../../services/standard-clause.service';
import { MockStandardClauseService } from '../../../services/mock-standard-clause.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-standard-clause-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './standard-clause-list.component.html'
})
export class StandardClauseListComponent implements OnInit {
  standardClauses: StandardClause[] = [];
  isLoading = false;
  error: string | null = null;
  isDeletingId: number | null = null;

  constructor(private standardClauseService: MockStandardClauseService) {}

  ngOnInit(): void {
    this.loadStandardClauses();
  }

  loadStandardClauses(): void {
    this.isLoading = true;
    this.error = null;
    
    this.standardClauseService.getAll().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (clauses) => {
        this.standardClauses = clauses;
      },
      error: (error) => {
        console.error('Error loading standard clauses:', error);
        this.error = 'Failed to load standard clauses. Please try again later.';
      }
    });
  }

  deleteClause(id: number): void {
    if (!confirm('Are you sure you want to delete this clause?')) {
      return;
    }

    this.isDeletingId = id;
    this.error = null;

    this.standardClauseService.delete(id).pipe(
      finalize(() => this.isDeletingId = null)
    ).subscribe({
      next: () => {
        this.standardClauses = this.standardClauses.filter(clause => clause.id !== id);
      },
      error: (error) => {
        console.error('Error deleting standard clause:', error);
        this.error = 'Failed to delete the clause. Please try again later.';
      }
    });
  }
} 