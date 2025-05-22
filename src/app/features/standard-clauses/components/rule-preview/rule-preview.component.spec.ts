import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RulePreviewComponent } from './rule-preview.component';
import { ClauseRule, Enforcement, Severity } from '../../models/rule.model';

describe('RulePreviewComponent', () => {
  let fixture: ComponentFixture<RulePreviewComponent>;
  let component: RulePreviewComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RulePreviewComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(RulePreviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should compute severity class', () => {
    const rule: ClauseRule = {
      enforcement: Enforcement.MUST_HAVE,
      severity: Severity.HIGH,
      similarityThreshold: 100,
      patterns: []
    } as ClauseRule;
    component.rule = rule;
    component.clauseText = 'text';
    fixture.detectChanges();
    expect(component.severityClass()).toBe('severity-high');
    expect(component.previewMessage()).toContain('severity');
  });
});
