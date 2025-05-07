import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface NewStandardClause {
  name: string;
  type: string;
  text: string;
  jurisdiction: string;
  allowedDeviations: number;
}

@Component({
  selector: 'app-add-standard-clause',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-standard-clause.component.html',
  styleUrls: ['./add-standard-clause.component.scss']
})
export class AddStandardClauseComponent {
  @Input() contractType = '';
  @Output() save = new EventEmitter<NewStandardClause>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      text: ['', Validators.required],
      jurisdiction: ['', Validators.required],
      allowedDeviations: [0, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isSubmitting = true;
      this.save.emit(this.form.value);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 