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
  templateUrl: './rule-dialog.component.html',
  styleUrls: ['./rule-dialog.component.scss']
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
      similarityThreshold: undefined,
      patterns: []
    };
  }

  getRuleForEditor(): ClauseRule {
    return {
      enforcement: this.rule.enforcement || Enforcement.MUST_HAVE,
      severity: this.rule.severity || Severity.MEDIUM,
      similarityThreshold: this.rule.similarityThreshold || undefined,
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