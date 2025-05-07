import { Component, OnInit, Output, EventEmitter, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateStandardClauseDto, IStandardClauseService, StandardClause } from '../models/standard-clause.model';
import { STANDARD_CLAUSE_SERVICE_TOKEN } from '../standard-clauses.module';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-standard-clause-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './standard-clause-form.component.html'
})
export class StandardClauseFormComponent implements OnInit {
  @Input() isDialog = false;
  clauseForm: FormGroup;
  isEditMode = false;
  clauseId?: number;
  isLoading = false;
  isSubmitting = false;
  error: string | null = null;

  @Output() save = new EventEmitter<CreateStandardClauseDto>();
  @Output() cancel = new EventEmitter<void>();

  private standardClauseService = inject<IStandardClauseService>(STANDARD_CLAUSE_SERVICE_TOKEN);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.clauseForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      text: ['', Validators.required],
      jurisdiction: [''],
      version: [''],
      allowedDeviations: [''],
      contractType: ['']
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
        next: (clause: StandardClause) => {
          this.clauseForm.patchValue({
            name: clause.name,
            type: clause.type,
            text: clause.text,
            jurisdiction: clause.jurisdiction,
            version: clause.version,
            allowedDeviations: clause.allowedDeviations,
            contractType: clause.contractType
          });
        },
        error: (error: unknown) => {
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
      this.save.emit(formValue);
      const request = this.isEditMode && this.clauseId
        ? this.standardClauseService.update(this.clauseId, formValue)
        : this.standardClauseService.create(formValue);

      request.pipe(
        finalize(() => this.isSubmitting = false)
      ).subscribe({
        next: () => {
          this.router.navigate(['/standard-clauses']);
        },
        error: (error: unknown) => {
          console.error('Error saving clause:', error);
          this.error = `Failed to ${this.isEditMode ? 'update' : 'create'} the clause. Please try again later.`;
        }
      });
    }
  }

  onCancel(): void {
    if (this.isDialog) {
      this.cancel.emit();
    } else {
      this.router.navigate(['/standard-clauses']);
    }
  }
} 