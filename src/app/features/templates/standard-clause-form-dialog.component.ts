import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardClauseFormComponent } from '../standard-clauses/standard-clause-form/standard-clause-form.component';
import { CreateStandardClauseDto } from '../../services/standard-clause.service';

@Component({
  selector: 'app-standard-clause-form-dialog',
  standalone: true,
  imports: [CommonModule, StandardClauseFormComponent],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh] relative">
        <app-standard-clause-form
          [isDialog]="true"
          (save)="onSave($event)"
          (cancel)="onCancel()"
        ></app-standard-clause-form>
      </div>
    </div>
  `
})
export class StandardClauseFormDialogComponent {
  @Output() save = new EventEmitter<CreateStandardClauseDto>();
  @Output() cancel = new EventEmitter<void>();

  onSave(clause: CreateStandardClauseDto): void {
    this.save.emit(clause);
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 