import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RuleEditorComponent } from '../standard-clauses/components/rule-editor/rule-editor.component';
import { RulePreviewComponent } from '../standard-clauses/components/rule-preview/rule-preview.component';
import { ClauseRule, Enforcement, Severity } from '../standard-clauses/models/rule.model';
import { RuleWithMetadata } from './rules.service';

@Component({
  selector: 'app-rule-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RuleEditorComponent,
    RulePreviewComponent
  ],
  template: `
    <div class="p-6">
      <h2 mat-dialog-title>{{data.rule ? 'Edit' : 'Create'}} Rule</h2>
      
      <mat-dialog-content>
        <div class="grid gap-4">
          <mat-form-field class="w-full">
            <mat-label>Rule Name</mat-label>
            <input matInput [(ngModel)]="rule.name" required>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Description</mat-label>
            <textarea matInput [(ngModel)]="rule.description" rows="3"></textarea>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Sample Text</mat-label>
            <textarea matInput [(ngModel)]="rule.sampleText" rows="3"></textarea>
          </mat-form-field>

          <app-rule-editor 
            [rule]="getRuleForEditor()" 
            (ruleChange)="onRuleChange($event)">
          </app-rule-editor>

          <div class="mt-4">
            <h3 class="text-lg font-medium mb-2">Preview</h3>
            <app-rule-preview 
              [rule]="getRuleForEditor()" 
              [clauseText]="rule.sampleText || ''">
            </app-rule-preview>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" (click)="save()" [disabled]="!isValid()">
          {{data.rule ? 'Update' : 'Create'}}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    mat-dialog-content {
      min-width: 600px;
    }
  `]
})
export class RuleDialogComponent {
  rule: Partial<RuleWithMetadata>;

  constructor(
    public dialogRef: MatDialogRef<RuleDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { rule?: RuleWithMetadata }
  ) {
    this.rule = data.rule ? { ...data.rule } : {
      enforcement: Enforcement.MUST_HAVE,
      severity: Severity.MEDIUM,
      similarityThreshold: 0.8,
      patterns: []
    };
  }

  getRuleForEditor(): ClauseRule {
    return {
      enforcement: this.rule.enforcement || Enforcement.MUST_HAVE,
      severity: this.rule.severity || Severity.MEDIUM,
      similarityThreshold: this.rule.similarityThreshold || 0.8,
      patterns: this.rule.patterns || []
    };
  }

  onRuleChange(clauseRule: ClauseRule) {
    this.rule = { ...this.rule, ...clauseRule };
  }

  isValid(): boolean {
    return !!(
      this.rule.name &&
      this.rule.description &&
      this.rule.enforcement &&
      this.rule.severity
    );
  }

  save() {
    if (this.isValid()) {
      this.dialogRef.close(this.rule);
    }
  }
} 