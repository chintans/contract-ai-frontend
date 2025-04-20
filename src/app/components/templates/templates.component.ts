import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TemplatesService, StandardClause, CreateStandardClauseDto } from '../../services/templates.service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ]
})
export class TemplatesComponent implements OnInit {
  templates: StandardClause[] = [];
  selectedTemplate: StandardClause | null = null;
  templateForm: FormGroup = this.initForm();
  isEditing = false;
  isLoading = true;

  constructor(
    private templatesService: TemplatesService,
    private fb: FormBuilder
  ) {
    console.log('TemplatesComponent constructed');
  }

  ngOnInit(): void {
    console.log('TemplatesComponent initialized');
    this.loadTemplates();
  }

  private initForm(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      content: ['', Validators.required],
      jurisdiction: [''],
      version: [''],
      description: [''],
      metadata: ['']
    });
  }

  loadTemplates(): void {
    console.log('Loading templates...');
    this.isLoading = true;
    this.templatesService.getAll().subscribe({
      next: (templates) => {
        console.log('Templates loaded:', templates);
        this.templates = templates;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading templates:', error);
        this.isLoading = false;
        // TODO: Add error handling UI
      }
    });
  }

  onSelect(template: StandardClause): void {
    this.selectedTemplate = template;
    this.isEditing = true;
    this.templateForm.patchValue({
      name: template.name,
      type: template.type,
      content: template.content,
      jurisdiction: template.jurisdiction,
      version: template.version,
      description: template.description,
      metadata: template.metadata ? JSON.stringify(template.metadata, null, 2) : ''
    });
  }

  onSubmit(): void {
    if (this.templateForm.invalid) return;

    const formValue = this.templateForm.value;
    const templateData: CreateStandardClauseDto = {
      ...formValue,
      metadata: formValue.metadata ? JSON.parse(formValue.metadata) : undefined
    };

    if (this.isEditing && this.selectedTemplate) {
      this.templatesService.update(this.selectedTemplate.id, templateData).subscribe({
        next: () => {
          this.loadTemplates();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error updating template:', error);
          // TODO: Add error handling UI
        }
      });
    } else {
      this.templatesService.create(templateData).subscribe({
        next: () => {
          this.loadTemplates();
          this.resetForm();
        },
        error: (error) => {
          console.error('Error creating template:', error);
          // TODO: Add error handling UI
        }
      });
    }
  }

  onDelete(id: string): void {
    if (confirm('Are you sure you want to delete this template?')) {
      this.templatesService.delete(id).subscribe({
        next: () => {
          this.loadTemplates();
          if (this.selectedTemplate?.id === id) {
            this.resetForm();
          }
        },
        error: (error) => {
          console.error('Error deleting template:', error);
          // TODO: Add error handling UI
        }
      });
    }
  }

  resetForm(): void {
    this.templateForm.reset();
    this.selectedTemplate = null;
    this.isEditing = false;
  }
} 