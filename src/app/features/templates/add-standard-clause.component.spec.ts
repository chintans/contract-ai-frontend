import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest'
import { AddStandardClauseComponent } from './add-standard-clause.component';

describe('AddStandardClauseComponent', () => {
  let fixture: ComponentFixture<AddStandardClauseComponent>;
  let component: AddStandardClauseComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStandardClauseComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(AddStandardClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit save when form is valid and submitted', () => {
    const saveSpy = vi.spyOn(component.save, 'emit');
    component.form.setValue({
      name: 'Clause',
      type: 'TYPE',
      text: 'Body',
      jurisdiction: 'US',
      allowedDeviations: 1
    });
    component.onSubmit();
    expect(saveSpy).toHaveBeenCalledWith({
      name: 'Clause',
      type: 'TYPE',
      text: 'Body',
      jurisdiction: 'US',
      allowedDeviations: 1
    });
  });

  it('should emit cancel on onCancel', () => {
    const cancelSpy = vi.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
