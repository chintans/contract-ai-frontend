import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateStandardClauseDto } from '../../../services/standard-clause.service';
import { MockStandardClauseService } from '../../../services/mock-standard-clause.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-standard-clause-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-3xl font-bold mb-6">{{ isEditMode ? 'Edit' : 'Create' }} Standard Clause</h1>

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
        
        <form *ngIf="!isLoading" [formGroup]="clauseForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              formControlName="name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              [ngClass]="{'border-red-500': clauseForm.get('name')?.invalid && clauseForm.get('name')?.touched}"
            >
            <div *ngIf="clauseForm.get('name')?.invalid && clauseForm.get('name')?.touched" class="text-red-500 text-sm mt-1">
              Name is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Type</label>
            <input
              type="text"
              formControlName="type"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              [ngClass]="{'border-red-500': clauseForm.get('type')?.invalid && clauseForm.get('type')?.touched}"
            >
            <div *ngIf="clauseForm.get('type')?.invalid && clauseForm.get('type')?.touched" class="text-red-500 text-sm mt-1">
              Type is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Text</label>
            <textarea
              formControlName="text"
              rows="6"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              [ngClass]="{'border-red-500': clauseForm.get('text')?.invalid && clauseForm.get('text')?.touched}"
            ></textarea>
            <div *ngIf="clauseForm.get('text')?.invalid && clauseForm.get('text')?.touched" class="text-red-500 text-sm mt-1">
              Text is required
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Jurisdiction</label>
            <input
              type="text"
              formControlName="jurisdiction"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Version</label>
            <input
              type="text"
              formControlName="version"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Allowed Deviations</label>
            <textarea
              formControlName="allowedDeviations"
              rows="3"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-between">
            <button
              type="button"
              routerLink="/standard-clauses"
              class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              [disabled]="isSubmitting"
            >
              Cancel
            </button>
            <button
              type="submit"
              [disabled]="clauseForm.invalid || isSubmitting"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            >
              {{ isSubmitting ? 'Saving...' : (isEditMode ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: []
})
export class StandardClauseFormComponent implements OnInit {
  clauseForm: FormGroup;
  isEditMode = false;
  clauseId?: number;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private standardClauseService: MockStandardClauseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clauseForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      text: ['', Validators.required],
      jurisdiction: [''],
      version: [''],
      allowedDeviations: ['']
    });
  }

  ngOnInit(): void {
    this.clauseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.clauseId) {
      this.isEditMode = true;
      this.loadClause();
    }
  }

  loadClause(): void {
    if (this.clauseId) {
      this.isLoading = true;
      this.error = null;

      this.standardClauseService.getOne(this.clauseId).pipe(
        finalize(() => this.isLoading = false)
      ).subscribe({
        next: (clause) => {
          this.clauseForm.patchValue({
            name: clause.name,
            type: clause.type,
            text: clause.text,
            jurisdiction: clause.jurisdiction,
            version: clause.version,
            allowedDeviations: clause.allowedDeviations
          });
        },
        error: (error) => {
          console.error('Error loading clause:', error);
          this.error = 'Failed to load the clause. Please try again later.';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.clauseForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.error = null;
      const formValue: CreateStandardClauseDto = this.clauseForm.value;
      
      const request = this.isEditMode && this.clauseId
        ? this.standardClauseService.update(this.clauseId, formValue)
        : this.standardClauseService.create(formValue);

      request.pipe(
        finalize(() => this.isSubmitting = false)
      ).subscribe({
        next: () => {
          this.router.navigate(['/standard-clauses']);
        },
        error: (error) => {
          console.error('Error saving clause:', error);
          this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} the clause. Please try again later.`;
        }
      });
    }
  }
} 