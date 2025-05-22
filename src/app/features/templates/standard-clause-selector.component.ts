import { Component, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IStandardClauseService, StandardClause } from '../standard-clauses/models/standard-clause.model';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../standard-clauses/standard-clause-service.token';

@Component({
  selector: 'app-standard-clause-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './standard-clause-selector.component.html',
  styleUrls: ['./standard-clause-selector.component.scss']
})
export class StandardClauseSelectorComponent {
  standardClauses: StandardClause[] = [];
  isLoading = false;
  error: string | null = null;

  @Output() select = new EventEmitter<StandardClause>();
  @Output() cancel = new EventEmitter<void>();

  private standardClauseService = inject<IStandardClauseService>(STANDARD_CLAUSE_SERVICE_TOKEN);

  constructor() {
    this.loadStandardClauses();
  }

  loadStandardClauses() {
    this.isLoading = true;
    this.error = null;
    this.standardClauseService.getAll().subscribe({
      next: (clauses) => {
        this.standardClauses = clauses;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load standard clauses.';
        this.isLoading = false;
      }
    });
  }

  onSelect(clause: StandardClause) {
    this.select.emit(clause);
  }

  onCancel() {
    this.cancel.emit();
  }
} 