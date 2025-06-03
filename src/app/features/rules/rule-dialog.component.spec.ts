import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest'
import { RuleDialogComponent } from './rule-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Enforcement, Severity } from '../standard-clauses/models/rule.model';

describe('RuleDialogComponent', () => {
  let fixture: ComponentFixture<RuleDialogComponent>;
  let component: RuleDialogComponent;
  let dialogRefSpy: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialogRefSpy = { close: vi.fn() };
    await TestBed.configureTestingModule({
      imports: [RuleDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(RuleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with defaults when no rule provided', () => {
    expect(component.rule.enforcement).toBe(Enforcement.MUST_HAVE);
    expect(component.rule.severity).toBe(Severity.MEDIUM);
  });

  it('isValid returns false when required fields missing', () => {
    component.rule = {} as any;
    expect(component.isValid()).toBeFalsy();
  });

  it('isValid returns true when required fields present', () => {
    component.rule = {
      name: 'name',
      description: 'desc',
      enforcement: Enforcement.MUST_HAVE,
      severity: Severity.HIGH
    };
    expect(component.isValid()).toBeTruthy();
  });

  it('save closes dialog with rule when valid', () => {
    component.rule = {
      name: 'n',
      description: 'd',
      enforcement: Enforcement.MUST_HAVE,
      severity: Severity.HIGH
    };
    component.save();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.rule);
  });

  it('save does nothing when invalid', () => {
    component.rule = {} as any;
    component.save();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });
});
