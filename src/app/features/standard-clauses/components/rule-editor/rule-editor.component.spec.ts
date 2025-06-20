import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RuleEditorComponent } from './rule-editor.component';
import { Enforcement, Severity } from '../../models/rule.model';
import { describe, expect, it, vi } from 'vitest'

describe('RuleEditorComponent', () => {
  let fixture: ComponentFixture<RuleEditorComponent>;
  let component: RuleEditorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleEditorComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(RuleEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit ruleChange when form valid', fakeAsync(() => {
    const spy = vi.spyOn(component.ruleChange, 'emit');
    component.ruleForm.patchValue({
      enforcement: Enforcement.MUST_HAVE,
      severity: Severity.HIGH,
      similarityThreshold: 90,
      scoreWeight: 1
    });
    tick();
    expect(spy).toHaveBeenCalled();
  }));
});
