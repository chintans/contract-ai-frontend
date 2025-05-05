import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RuleEditorComponent } from '../rule-editor/rule-editor.component';
import { RulePreviewComponent } from '../rule-preview/rule-preview.component';
import { ClauseRule } from '../../models/rule.model';

interface ClauseWithRule {
  id: string;
  title: string;
  text: string;
  rule: ClauseRule | null;
}

@Component({
  selector: 'app-template-rules-step',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    RuleEditorComponent,
    RulePreviewComponent
  ],
  template: `
    <div class="rules-step">
      <div class="step-header">
        <h2>Configure Rules</h2>
        <p class="step-description">
          Set enforcement rules and validation criteria for each clause in your template.
        </p>
      </div>

      <div class="clauses-list">
        <div *ngFor="let clause of clauses(); let i = index" class="clause-item">
          <div class="clause-header">
            <h3>{{clause.title}}</h3>
            <span class="clause-number">#{{i + 1}}</span>
          </div>

          <div class="rule-configuration">
            <div class="editor-section">
              <app-rule-editor
                [rule]="clause.rule"
                (ruleChange)="onRuleChange(clause.id, $event)">
              </app-rule-editor>
            </div>

            <mat-divider vertical></mat-divider>

            <div class="preview-section">
              <app-rule-preview
                [rule]="clause.rule"
                [clauseText]="clause.text">
              </app-rule-preview>
            </div>
          </div>

          <mat-divider *ngIf="i < clauses().length - 1"></mat-divider>
        </div>
      </div>

      <div class="step-actions">
        <button mat-button (click)="onBack.emit()">Back</button>
        <button mat-raised-button color="primary" 
                [disabled]="!allRulesValid()"
                (click)="onNext.emit()">
          Next
        </button>
      </div>
    </div>
  `,
  styles: [`
    .rules-step {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .step-header {
      margin-bottom: 2rem;
      text-align: center;
    }

    .step-description {
      color: #666;
      max-width: 600px;
      margin: 1rem auto;
    }

    .clauses-list {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .clause-item {
      background: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .clause-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .clause-number {
      background: #f3f4f6;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      color: #4b5563;
    }

    .rule-configuration {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 2rem;
      align-items: start;
    }

    .editor-section,
    .preview-section {
      min-width: 0;
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 1rem;
      border-top: 1px solid #e5e7eb;
    }
  `]
})
export class TemplateRulesStepComponent {
  @Input() set clausesData(value: { id: string, title: string, text: string }[]) {
    if (value) {
      this._clauses.set(value.map(clause => ({
        ...clause,
        rule: null
      })));
    }
  }

  @Output() onBack = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();
  @Output() rulesChange = new EventEmitter<Record<string, ClauseRule>>();

  private _clauses = signal<ClauseWithRule[]>([]);
  clauses = this._clauses.asReadonly();

  onRuleChange(clauseId: string, rule: ClauseRule) {
    this._clauses.update(clauses => 
      clauses.map(clause => 
        clause.id === clauseId 
          ? { ...clause, rule } 
          : clause
      )
    );

    // Emit updated rules map
    const rulesMap = this._clauses().reduce((acc, clause) => {
      if (clause.rule) {
        acc[clause.id] = clause.rule;
      }
      return acc;
    }, {} as Record<string, ClauseRule>);

    this.rulesChange.emit(rulesMap);
  }

  allRulesValid(): boolean {
    return this._clauses().every(clause => clause.rule !== null);
  }
} 