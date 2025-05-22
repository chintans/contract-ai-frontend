import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RuleDialogComponent } from './rule-dialog.component';
import { ClauseRule } from './template-version.model';

const rule: ClauseRule = {
  enforcement: 'MUST_HAVE',
  severity: 'LOW',
  allowedDeviation: 0,
  forbiddenPatterns: []
};

describe('RuleDialogComponent', () => {
  let fixture: ComponentFixture<RuleDialogComponent>;
  let component: RuleDialogComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleDialogComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(RuleDialogComponent);
    component = fixture.componentInstance;
    component.rule = { ...rule };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit save on form submit', () => {
    const saveSpy = spyOn(component.save, 'emit');
    fixture.nativeElement.querySelector('form').dispatchEvent(new Event('submit'));
    expect(saveSpy).toHaveBeenCalledWith(rule);
  });

  it('should emit cancel on cancel click', () => {
    const cancelSpy = spyOn(component.cancel, 'emit');
    fixture.nativeElement.querySelector('button').click();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
