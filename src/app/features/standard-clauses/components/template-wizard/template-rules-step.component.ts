import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { RuleEditorComponent } from '../rule-editor/rule-editor.component';
import { RulePreviewComponent } from '../rule-preview/rule-preview.component';
import { ClauseRule, Enforcement } from '../../models/rule.model';
import { MatIconModule } from '@angular/material/icon';

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
    FormsModule,
    MatDividerModule,
    RuleEditorComponent,
    RulePreviewComponent,
    MatIconModule
  ],
  templateUrl: './template-rules-step.component.html',
  styleUrls: ['./template-rules-step.component.scss']
})
export class TemplateRulesStepComponent implements OnInit {
  @Input() set clausesData(value: { id: string, title: string, text: string }[]) {
    if (value) {
      this._clauses.set(value.map(clause => ({
        ...clause,
        rule: null // or provide a default rule if needed
      })));
    }
  }

  @Output() onBack = new EventEmitter<void>();
  @Output() onNext = new EventEmitter<void>();
  @Output() rulesChange = new EventEmitter<Record<string, ClauseRule>>();

  private _clauses = signal<ClauseWithRule[]>([]);
  clauses = this._clauses.asReadonly();

  ruleTemplates = [
    { name: 'Strict', rule: { enforcement: Enforcement.MUST_HAVE, severity: 3, similarityThreshold: 98, deviationAllowedPct: undefined, forbiddenPatterns: [], requiredPatterns: [], statutoryReference: '', autoSuggest: false, scoreWeight: 2, patterns: [] } },
    { name: 'Lenient', rule: { enforcement: Enforcement.SHOULD_HAVE, severity: 1, similarityThreshold: 80, deviationAllowedPct: 10, forbiddenPatterns: [], requiredPatterns: [], statutoryReference: '', autoSuggest: true, scoreWeight: 1, patterns: [] } }
  ];
  clauseValidationErrors = signal<Record<string, string[]>>({});
  clauseSimResults = signal<Record<string, { result: string, message: string }>>({});
  selectedClauseIndexes = signal<Set<number>>(new Set());

  ngOnInit() {
    // Load autosaved rules if present
    const saved = localStorage.getItem('wizard-rules');
    if (saved) {
      const parsed = JSON.parse(saved);
      this._clauses.set(parsed);
    }
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
    this.saveToLocalStorage();
    this.simulateClause(clauseId);
  }

  simulateClause(clauseId: string) {
    const clause = this._clauses().find(c => c.id === clauseId);
    if (!clause || !clause.rule) return;
    // Simulate rule effect (simple logic, replace with real backend logic as needed)
    let result = 'PASS';
    let message = 'Clause passes all checks.';
    if (clause.rule.similarityThreshold && clause.rule.similarityThreshold < 90) {
      result = 'FLAGGED';
      message = 'Similarity threshold is low; clause may allow paraphrasing.';
    }
    if (clause.rule.forbiddenPatterns?.length) {
      result = 'FLAGGED';
      message = 'Forbidden patterns present.';
    }
    this.clauseSimResults.update(sim => ({ ...sim, [clauseId]: { result, message } }));
  }

  clauseHasErrors(clauseId: string): boolean {
    return (this.clauseValidationErrors()[clauseId]?.length ?? 0) > 0;
  }

  onBatchApplyRule(rule: ClauseRule) {
    const selected = Array.from(this.selectedClauseIndexes());
    this._clauses.update(clauses =>
      clauses.map((clause, idx) =>
        selected.includes(idx) ? { ...clause, rule: { ...rule, patterns: rule.patterns ?? [] } } : clause
      )
    );
    this.emitRulesChange();
    this.saveToLocalStorage();
    selected.forEach(idx => this.simulateClause(this._clauses()[idx].id));
  }

  onApplyTemplate(templateName: string) {
    const template = this.ruleTemplates.find(t => t.name === templateName);
    if (!template) return;
    this.onBatchApplyRule(template.rule);
  }

  onClauseSelect(idx: number, event: Event) {
    // Type-safe extraction of checked value
    const checked = (event.target as HTMLInputElement).checked;
    const set = new Set(this.selectedClauseIndexes());
    if (checked) set.add(idx); else set.delete(idx);
    this.selectedClauseIndexes.set(set);
  }

  saveToLocalStorage() {
    localStorage.setItem('wizard-rules', JSON.stringify(this._clauses()));
  }

  clearAutosave() {
    localStorage.removeItem('wizard-rules');
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
} 