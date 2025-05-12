import { Component, Input, Output, EventEmitter, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { RuleEditorComponent } from '../rule-editor/rule-editor.component';
import { RulePreviewComponent } from '../rule-preview/rule-preview.component';
import { ClauseRule } from '../../models/rule.model';
import { RulesService, RuleWithMetadata } from '../../../rules/rules.service';
import { RuleDialogComponent } from '../../../rules/rule-dialog.component';

interface ClauseWithRule {
  id: string;
  title: string;
  text: string;
  rule: ClauseRule | null;
  ruleId?: string;
}

@Component({
  selector: 'app-template-rules-step',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatStepperModule,
    MatButtonModule,
    MatDividerModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    RuleEditorComponent,
    RulePreviewComponent
  ],
  templateUrl: './template-rules-step.component.html',
  styleUrls: ['./template-rules-step.component.scss']
})
export class TemplateRulesStepComponent {
  private rulesService = inject(RulesService);
  private dialog = inject(MatDialog);

  // Track selected rules locally (by id)
  selectedRuleIds = signal<Set<string>>(new Set());

  rules = this.rulesService.rules;

  @Input() set clausesData(value: { id: string, title: string, text: string }[]) {
    if (value) {
      this._clauses.set(value.map(clause => ({
        ...clause,
        rule: null,
        ruleId: undefined
      })));
    }
  }

  @Output() onBack = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();
  @Output() rulesChange = new EventEmitter<Record<string, ClauseRule>>();

  private _clauses = signal<ClauseWithRule[]>([]);
  clauses = this._clauses.asReadonly();

  addRule() {
    const dialogRef = this.dialog.open(RuleDialogComponent, {
      width: '800px',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rulesService.createRule(result);
      }
    });
  }

  onRuleSelect(clauseId: string, ruleId: string) {
    const rule = this.rules().find(r => r.id === ruleId) || null;
    this._clauses.update(clauses =>
      clauses.map(clause =>
        clause.id === clauseId
          ? { ...clause, rule: rule } // assign the selected rule object
          : clause
      )
    );
    this.emitRulesChange();
  }

  onRuleChange(clauseId: string, rule: ClauseRule) {
    this._clauses.update(clauses =>
      clauses.map(clause =>
        clause.id === clauseId
          ? { ...clause, rule }
          : clause
      )
    );
    this.emitRulesChange();
  }

  emitRulesChange() {
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

  // Checkbox handler
  onRuleChecked(rule: RuleWithMetadata, checked: boolean) {
    const current = new Set(this.selectedRuleIds());
    if (checked) {
      current.add(rule.id);
    } else {
      current.delete(rule.id);
    }
    this.selectedRuleIds.set(current);
  }

  // Used in template for [(ngModel)]
  isRuleSelected(rule: RuleWithMetadata): boolean {
    return this.selectedRuleIds().has(rule.id);
  }

  // View rule details in dialog (read-only)
  viewRuleDetails(rule: RuleWithMetadata) {
    this.dialog.open(RuleDialogComponent, {
      width: '800px',
      data: { rule },
      disableClose: false
    });
  }
} 