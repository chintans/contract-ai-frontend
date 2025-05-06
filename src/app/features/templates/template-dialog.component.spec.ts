import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplateDialogComponent } from './template-dialog.component';
import { FormsModule } from '@angular/forms';
import { Template } from './template-table.component';
import { By } from '@angular/platform-browser';

describe('TemplateDialogComponent', () => {
  let component: TemplateDialogComponent;
  let fixture: ComponentFixture<TemplateDialogComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateDialogComponent, FormsModule],
    }).compileComponents();
    fixture = TestBed.createComponent(TemplateDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(!!component).toEqual(true);
  });

  it('should initialize formData from input template', () => {
    const template: Template = {
      id: '1',
      name: 'Test',
      contractType: 'NDA',
      jurisdiction: 'Global',
      activeVersion: '1.0',
    };
    component.template = template;
    component.ngOnInit();
    expect(JSON.stringify(component.formData)).toEqual(JSON.stringify(template));
  });

  it('should emit save event with formData on save', () => {
    const saveSpy = spyOn(component.save, 'emit');
    component.formData = {
      id: '',
      name: 'Test',
      contractType: 'NDA',
      jurisdiction: 'Global',
      activeVersion: '1.0',
    };
    component.onSave();
    expect(saveSpy.calls.any()).toEqual(true);
    const callArg = saveSpy.calls.mostRecent().args[0];
    expect(callArg !== undefined).toEqual(true);
    expect(callArg && callArg.name).toEqual('Test');
    expect(callArg && callArg.contractType).toEqual('NDA');
    expect(callArg && callArg.jurisdiction).toEqual('Global');
    expect(callArg && callArg.activeVersion).toEqual('1.0');
  });

  it('should emit cancel event on cancel button click', () => {
    const cancelSpy = spyOn(component.cancel, 'emit');
    fixture.detectChanges();
    const cancelBtn = fixture.debugElement.query(By.css('button[type="button"]'));
    cancelBtn.nativeElement.click();
    expect(cancelSpy.calls.any()).toEqual(true);
  });

  it('should disable save button if form is invalid', () => {
    fixture.detectChanges();
    const saveBtn = fixture.debugElement.query(By.css('button[type="submit"]'));
    expect(saveBtn.nativeElement.disabled).toEqual(true);
  });
}); 