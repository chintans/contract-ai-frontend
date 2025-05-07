import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClauseRule, Enforcement, Severity } from '../../models/rule.model';
import { RuleValidationService } from '../../services/rule-validation.service';

@Component({
  selector: 'app-rule-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  template: `
    <form [formGroup]="ruleForm" class="rule-editor" role="form" aria-label="Rule Editor">
      <!-- Enforcement -->
      <div class="enforcement-section">
        <label class="section-label" id="enforcement-label">Enforcement Level</label>
        <mat-radio-group formControlName="enforcement" aria-labelledby="enforcement-label">
          <mat-radio-button *ngFor="let type of enforcements" [value]="type" [attr.aria-label]="type">
            {{type}}
          </mat-radio-button>
        </mat-radio-group>
      </div>

      <!-- Severity -->
      <div class="severity-section">
        <mat-form-field>
          <mat-label id="severity-label">Severity</mat-label>
          <mat-select formControlName="severity" aria-labelledby="severity-label">
            <mat-option *ngFor="let level of severityLevels" [value]="level" [attr.aria-label]="level">
              {{level}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Similarity Settings -->
      <div class="similarity-section" *ngIf="showSimilarityControls()">
        <mat-form-field>
          <mat-label id="similarity-threshold-label">Similarity Threshold (%)</mat-label>
          <input matInput type="number" formControlName="similarityThreshold"
                 min="0" max="100"
                 matTooltip="Exact text match = 100%. Lower this if you permit paraphrasing."
                 aria-labelledby="similarity-threshold-label">
        </mat-form-field>

        <mat-form-field>
          <mat-label id="allowed-deviation-label">Allowed Deviation (%)</mat-label>
          <input matInput type="number" formControlName="deviationAllowedPct"
                 min="0" max="100"
                 aria-labelledby="allowed-deviation-label">
        </mat-form-field>
      </div>

      <!-- Patterns -->
      <div class="patterns-section" *ngIf="showPatternControls()">
        <!-- Forbidden Patterns -->
        <mat-form-field class="full-width">
          <mat-label id="forbidden-patterns-label">Forbidden Patterns</mat-label>
          <mat-chip-grid #forbiddenChipGrid aria-labelledby="forbidden-patterns-label">
            <mat-chip-row *ngFor="let pattern of forbiddenPatterns()"
                         (removed)="removePattern('forbidden', pattern)">
              {{pattern}}
              <button matChipRemove aria-label="Remove pattern">
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-row>
          </mat-chip-grid>
          <input placeholder="Add pattern..."
                 [matChipInputFor]="forbiddenChipGrid"
                 (matChipInputTokenEnd)="addPattern('forbidden', $event)"
                 aria-label="Add forbidden pattern">
        </mat-form-field>

        <!-- Required Patterns -->
        <mat-form-field class="full-width">
          <mat-label id="required-patterns-label">Required Patterns</mat-label>
          <mat-chip-grid #requiredChipGrid aria-labelledby="required-patterns-label">
            <mat-chip-row *ngFor="let pattern of requiredPatterns()"
                         (removed)="removePattern('required', pattern)">
              {{pattern}}
              <button matChipRemove aria-label="Remove pattern">
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip-row>
          </mat-chip-grid>
          <input placeholder="Add pattern..."
                 [matChipInputFor]="requiredChipGrid"
                 (matChipInputTokenEnd)="addPattern('required', $event)"
                 aria-label="Add required pattern">
        </mat-form-field>
      </div>

      <!-- Additional Settings -->
      <div class="additional-settings">
        <mat-form-field>
          <mat-label id="statutory-reference-label">Statutory Reference</mat-label>
          <input matInput formControlName="statutoryReference" aria-labelledby="statutory-reference-label">
        </mat-form-field>

        <mat-form-field>
          <mat-label id="score-weight-label">Score Weight</mat-label>
          <input matInput type="number" formControlName="scoreWeight" min="0" aria-labelledby="score-weight-label">
        </mat-form-field>

        <mat-checkbox formControlName="autoSuggest" aria-label="Enable Auto-Suggest">
          Enable Auto-Suggest
        </mat-checkbox>
      </div>

      <!-- Validation Errors -->
      <div class="validation-errors" *ngIf="validationErrors().length">
        <p *ngFor="let error of validationErrors()" class="error-message" role="alert">
          {{error}}
        </p>
      </div>
    </form>
  `,
  styles: [`
    .rule-editor {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1rem;
    }

    .section-label {
      font-weight: 500;
      margin-bottom: 0.5rem;
      display: block;
    }

    .enforcement-section mat-radio-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .similarity-section,
    .additional-settings {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .patterns-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .full-width {
      width: 100%;
    }

    .validation-errors {
      background-color: #fef2f2;
      border-radius: 4px;
      padding: 1rem;
      margin-top: 1rem;
    }

    .error-message {
      color: #dc2626;
      margin: 0;
      font-size: 0.875rem;
    }
  `]
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
  severityLevels = Object.values(Severity);

  ruleForm: FormGroup = this.fb.group({
    enforcement: ['', Validators.required],
    severity: ['', Validators.required],
    similarityThreshold: [null],
    deviationAllowedPct: [null],
    statutoryReference: [''],
    autoSuggest: [false],
    scoreWeight: [1, [Validators.required, Validators.min(0)]]
  });

  private _forbiddenPatterns = signal<string[]>([]);
  private _requiredPatterns = signal<string[]>([]);
  validationErrors = signal<string[]>([]);

  forbiddenPatterns = this._forbiddenPatterns.asReadonly();
  requiredPatterns = this._requiredPatterns.asReadonly();

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

  private validateAndEmit() {
    const ruleValue: ClauseRule = {
      ...this.ruleForm.value,
      forbiddenPatterns: this._forbiddenPatterns(),
      requiredPatterns: this._requiredPatterns()
    };

    const validation = this.ruleValidationService.validateRule(ruleValue);
    this.validationErrors.set(validation.errors);

    if (validation.isValid) {
      this.ruleChange.emit(ruleValue);
    }
  }
} 