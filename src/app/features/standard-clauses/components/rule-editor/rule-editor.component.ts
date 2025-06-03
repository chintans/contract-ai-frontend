import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';

import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ClauseRule, Enforcement, Severity } from '../../models/rule.model';
import { RuleValidationService } from '../../services/rule-validation.service';

@Component({
  selector: 'app-rule-editor',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule
],
  templateUrl: './rule-editor.component.html',
  styleUrls: ['./rule-editor.component.scss']
})
export class RuleEditorComponent {
  private fb = inject(FormBuilder);
  private ruleValidationService = inject(RuleValidationService);

  @Input() set rule(value: ClauseRule | null) {
    if (value) {
      this.ruleForm.patchValue(value);
      this._forbiddenPatterns.set(value.forbiddenPatterns || []);
      this._requiredPatterns.set(value.requiredPatterns || []);
    }
  }
  @Output() ruleChange = new EventEmitter<ClauseRule>();

  enforcements = Object.values(Enforcement);
  severityLevels = Object.keys(Severity).filter(key => isNaN(Number(key)));

  ruleForm: FormGroup = this.fb.group({
    enforcement: ['', Validators.required],
    severity: ['', Validators.required],
    similarityThreshold: [null],
    deviationAllowedPct: [null],
    statutoryReference: [''],
    autoSuggest: [false],
    scoreWeight: [1, [Validators.required, Validators.min(0)]],
    conditionIf: this.fb.array([]),
    conditionUnless: this.fb.array([])
  });

  private _forbiddenPatterns = signal<string[]>([]);
  private _requiredPatterns = signal<string[]>([]);
  validationErrors = signal<string[]>([]);

  forbiddenPatterns = this._forbiddenPatterns.asReadonly();
  requiredPatterns = this._requiredPatterns.asReadonly();

  // Helper getters
  get conditionIfArray() {
    return this.ruleForm.get('conditionIf') as FormArray;
  }
  get conditionUnlessArray() {
    return this.ruleForm.get('conditionUnless') as FormArray;
  }

  constructor() {
    this.ruleForm.valueChanges.subscribe(() => {
      this.validateAndEmit();
    });
  }

  showSimilarityControls(): boolean {
    const enforcement = this.ruleForm.get('enforcement')?.value;
    return enforcement === Enforcement.MUST_HAVE || enforcement === Enforcement.SHOULD_HAVE;
  }

  showPatternControls(): boolean {
    const enforcement = this.ruleForm.get('enforcement')?.value;
    return enforcement !== Enforcement.OPTIONAL;
  }

  addPattern(type: 'forbidden' | 'required', event: any) {
    const value = event.value.trim();
    if (!value) return;

    if (type === 'forbidden') {
      this._forbiddenPatterns.update(patterns => [...patterns, value]);
    } else {
      this._requiredPatterns.update(patterns => [...patterns, value]);
    }
    event.chipInput!.clear();
    this.validateAndEmit();
  }

  removePattern(type: 'forbidden' | 'required', pattern: string) {
    if (type === 'forbidden') {
      this._forbiddenPatterns.update(patterns => patterns.filter(p => p !== pattern));
    } else {
      this._requiredPatterns.update(patterns => patterns.filter(p => p !== pattern));
    }
    this.validateAndEmit();
  }

  addCondition(type: 'if' | 'unless') {
    const arr = type === 'if' ? this.conditionIfArray : this.conditionUnlessArray;
    arr.push(this.fb.group({ key: '', value: '' }));
    this.validateAndEmit();
  }
  removeCondition(type: 'if' | 'unless', idx: number) {
    const arr = type === 'if' ? this.conditionIfArray : this.conditionUnlessArray;
    arr.removeAt(idx);
    this.validateAndEmit();
  }

  private validateAndEmit() {
    const ifObj: Record<string, string> = {};
    this.conditionIfArray.controls.forEach(ctrl => {
      if (ctrl.value.key) ifObj[ctrl.value.key] = ctrl.value.value;
    });
    const unlessObj: Record<string, string | number> = {};
    this.conditionUnlessArray.controls.forEach(ctrl => {
      if (ctrl.value.key) unlessObj[ctrl.value.key] = ctrl.value.value;
    });
    // Basic validation for duplicate keys and empty fields
    const errors: string[] = [];
    const allKeys = [...Object.keys(ifObj), ...Object.keys(unlessObj)];
    const keySet = new Set();
    for (const key of allKeys) {
      if (keySet.has(key)) errors.push(`Duplicate condition key: ${key}`);
      keySet.add(key);
    }
    if (Object.values(ifObj).some(v => !v) || Object.values(unlessObj).some(v => !v)) {
      errors.push('All condition fields must have both key and value.');
    }
    this.validationErrors.set(errors);
    const ruleValue: ClauseRule = {
      ...this.ruleForm.value,
      forbiddenPatterns: this._forbiddenPatterns(),
      requiredPatterns: this._requiredPatterns(),
      condition: (Object.keys(ifObj).length || Object.keys(unlessObj).length)
        ? { if: Object.keys(ifObj).length ? ifObj : undefined, unless: Object.keys(unlessObj).length ? unlessObj : undefined }
        : undefined
    };
    const validation = this.ruleValidationService.validateRule(ruleValue);
    this.validationErrors.set([...errors, ...validation.errors]);
    if (validation.isValid && errors.length === 0) {
      this.ruleChange.emit(ruleValue);
    }
  }
} 