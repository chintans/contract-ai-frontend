import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { describe, expect, it, vi } from 'vitest'
import { RuleEditorComponent } from '../rule-editor/rule-editor.component';
import { RulePreviewComponent } from '../rule-preview/rule-preview.component';
import { TemplateRulesStepComponent } from './template-rules-step.component';
import { ClauseRule, Enforcement, Severity } from '../../models/rule.model';

describe('TemplateRulesStepComponent', () => {
  let fixture: ComponentFixture<TemplateRulesStepComponent>;
  let component: TemplateRulesStepComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TemplateRulesStepComponent,
        RuleEditorComponent,
        RulePreviewComponent,
        FormsModule,
        MatDividerModule,
        MatIconModule
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(TemplateRulesStepComponent);
    component = fixture.componentInstance;
    component.clausesData = [
      { id: '1', title: 'c1', text: 't1' },
      { id: '2', title: 'c2', text: 't2' }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load clauses from input', () => {
    expect(component.clauses().length).toBe(2);
  });

  it('should emit rulesChange on rule change', () => {
    const spy = vi.spyOn(component.rulesChange, 'emit');
    const rule: ClauseRule = { enforcement: Enforcement.MUST_HAVE, severity: Severity.LOW, patterns: [] } as ClauseRule;
    component.onRuleChange('1', rule);
    expect(spy).toHaveBeenCalled();
  });
});
