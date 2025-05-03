import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardClauseFormComponent } from '../../features/standard-clauses/standard-clause-form/standard-clause-form.component';
import { CreateStandardClauseDto } from '../../services/standard-clause.service';
import { MockStandardClauseService } from '../../services/mock-standard-clause.service';

@Component({
  selector: 'app-standard-clause-form-dialog',
  standalone: true,
  imports: [CommonModule, StandardClauseFormComponent],
  templateUrl: './standard-clause-form-dialog.component.html',
  styleUrls: ['./standard-clause-form-dialog.component.scss']
})
export class StandardClauseFormDialogComponent {
  @Output() save = new EventEmitter<CreateStandardClauseDto>();
  @Output() cancel = new EventEmitter<void>();

  isSubmitting = false;
  error: string | null = null;

  constructor(private mockService: MockStandardClauseService) {}

  onSave(clause: CreateStandardClauseDto) {
    this.isSubmitting = true;
    this.mockService.create(clause).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.save.emit(created);
      },
      error: (err) => {
        this.error = 'Failed to create clause.';
        this.isSubmitting = false;
      }
    });
  }

  onCancel() {
    this.cancel.emit();
  }
} 