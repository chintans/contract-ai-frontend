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
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Standard Clauses</h1>
        <button 
          routerLink="/standard-clauses/new"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add New Clause
        </button>
      </div>

      <!-- Error Alert -->
      <div *ngIf="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
        <strong class="font-bold">Error!</strong>
        <span class="block sm:inline"> {{ error }}</span>
        <button 
          class="absolute top-0 bottom-0 right-0 px-4 py-3"
          (click)="error = null">
          <span class="sr-only">Dismiss</span>
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
          </svg>
        </button>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>

      <!-- Empty State -->
      <div *ngIf="!isLoading && standardClauses.length === 0" class="text-center py-8">
        <p class="text-gray-500 text-lg">No standard clauses found. Click "Add New Clause" to create one.</p>
      </div>

      <!-- Clauses Grid -->
      <div *ngIf="!isLoading && standardClauses.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div *ngFor="let clause of standardClauses" 
             class="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <h2 class="text-xl font-semibold mb-2">{{ clause.name }}</h2>
          <p class="text-gray-600 mb-2">Type: {{ clause.type }}</p>
          <p class="text-gray-600 mb-2" *ngIf="clause.jurisdiction">
            Jurisdiction: {{ clause.jurisdiction }}
          </p>
          <p class="text-gray-600 mb-4" *ngIf="clause.version">
            Version: {{ clause.version }}
          </p>
          <div class="flex justify-between items-center">
            <button 
              [routerLink]="['/standard-clauses', clause.id]"
              class="text-blue-500 hover:text-blue-700">
              View Details
            </button>
            <button 
              (click)="deleteClause(clause.id)"
              [disabled]="isDeletingId === clause.id"
              class="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isDeletingId === clause.id ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
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