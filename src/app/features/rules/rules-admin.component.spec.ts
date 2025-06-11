import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RulesAdminComponent } from './rules-admin.component';
import { RulesService, RuleWithMetadata } from './rules.service';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { Enforcement, Severity } from '../standard-clauses/models/rule.model';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('RulesAdminComponent', () => {
  let fixture: ComponentFixture<RulesAdminComponent>;
  let component: RulesAdminComponent;
  let rulesServiceSpy: any;
  let dialogSpy: { open: ReturnType<typeof vi.fn> };

  const rule: RuleWithMetadata = {
    id: '1',
    name: 'Rule',
    description: 'Desc',
    sampleText: 'Sample',
    enforcement: Enforcement.MUST_HAVE,
    severity: Severity.HIGH,
    similarityThreshold: 0.8,
    patterns: [],
    forbiddenPatterns: [],
    requiredPatterns: [],
    statutoryReference: '',
    autoSuggest: true,
    scoreWeight: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    rulesServiceSpy = {
      createRule: vi.fn(),
      updateRule: vi.fn(),
      deleteRule: vi.fn(),
      rules: () => [rule]
    };
    dialogSpy = { open: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [RulesAdminComponent],
      providers: [
        { provide: RulesService, useValue: rulesServiceSpy },
        { provide: MatDialog, useValue: dialogSpy }
      ]
    })
      .overrideProvider(MatDialog, { useValue: dialogSpy })
      .compileComponents();

    fixture = TestBed.createComponent(RulesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('createRule opens dialog and creates rule on result', () => {
    dialogSpy.open.mockReturnValue({ afterClosed: () => of(rule) } as any);
    component.createRule();
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(rulesServiceSpy.createRule).toHaveBeenCalledWith(rule);
  });

  it('editRule opens dialog and updates rule on result', () => {
    dialogSpy.open.mockReturnValue({ afterClosed: () => of({ name: 'New' }) } as any);
    component.editRule(rule);
    expect(dialogSpy.open).toHaveBeenCalled();
    expect(rulesServiceSpy.updateRule).toHaveBeenCalledWith(rule.id, { name: 'New' });
  });

  it('deleteRule calls service when confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    component.deleteRule(rule);
    expect(rulesServiceSpy.deleteRule).toHaveBeenCalledWith(rule.id);
  });

  it('deleteRule does nothing when not confirmed', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    component.deleteRule(rule);
    expect(rulesServiceSpy.deleteRule).not.toHaveBeenCalled();
  });
});
