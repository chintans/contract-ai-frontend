import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClauseCardEditorComponent } from './clause-card-editor.component';
import { VersionedClause } from './template-version.model';

describe('ClauseCardEditorComponent', () => {
  let fixture: ComponentFixture<ClauseCardEditorComponent>;
  let component: ClauseCardEditorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClauseCardEditorComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(ClauseCardEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide default clause when none is set', () => {
    expect(component.clauseSafe.clauseId).toBe('');
  });

  it('should emit save with clause data', () => {
    const saveSpy = spyOn(component.save, 'emit');
    const clause: VersionedClause = {
      clauseId: '1',
      clauseType: 'type',
      title: 'Title',
      body: 'Body',
      ruleJson: { enforcement: 'MUST_HAVE', severity: 'MEDIUM', allowedDeviation: 0, forbiddenPatterns: [] },
      orderIdx: 0
    };
    component.clause = clause;
    fixture.nativeElement.querySelector('button:last-child').click();
    expect(saveSpy).toHaveBeenCalledWith(clause);
  });
});
