import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../standard-clause-service.token';
import { IStandardClauseService, StandardClause } from '../models/standard-clause.model';

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

  private standardClauseService = inject<IStandardClauseService>(STANDARD_CLAUSE_SERVICE_TOKEN);

  ngOnInit(): void {
    this.loadStandardClauses();
  }

  loadStandardClauses(): void {
    this.isLoading = true;
    this.error = null;
    console.log('loadStandardClauses');
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
        this.loadStandardClauses();
      },
      error: (error) => {
        console.error('Error deleting standard clause:', error);
        this.error = 'Failed to delete the clause. Please try again later.';
      }
    });
  }
} 