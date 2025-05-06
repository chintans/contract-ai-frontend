import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TemplatesComponent } from './templates.component';
import { Template } from './template-table.component';
import { TemplateTableComponent } from './template-table.component';
import { TemplateDialogComponent } from './template-dialog.component';

describe('TemplatesComponent', () => {
  let component: TemplatesComponent;
  let fixture: ComponentFixture<TemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesComponent, TemplateTableComponent, TemplateDialogComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(TemplatesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open create template dialog', () => {
    component.openCreateTemplate();
    expect(component.showDialog).toBe(true);
    expect(component.editingTemplate).toBeUndefined();
  });

  it('should open edit template dialog', () => {
    const template: Template = { id: '1', name: 'Test', contractType: 'NDA', jurisdiction: 'Global', activeVersion: '1.0' };
    component.openEditTemplate(template);
    expect(component.showDialog).toBe(true);
    expect(component.editingTemplate).toEqual(template);
  });

  it('should save new template', () => {
    const newTemplate: Template = { id: '3', name: 'New', contractType: 'MSA', jurisdiction: 'India', activeVersion: '1.0' };
    component.onDialogSave(newTemplate);
    expect(component.templates.find(t => t.id === '3')).toEqual(newTemplate);
    expect(component.showDialog).toBe(false);
    expect(component.editingTemplate).toBeUndefined();
  });

  it('should update existing template', () => {
    const updatedTemplate: Template = { id: '1', name: 'Updated', contractType: 'NDA', jurisdiction: 'Global', activeVersion: '2.0' };
    component.onDialogSave(updatedTemplate);
    expect(component.templates.find(t => t.id === '1')).toEqual(updatedTemplate);
    expect(component.showDialog).toBe(false);
    expect(component.editingTemplate).toBeUndefined();
  });

  it('should cancel dialog', () => {
    component.showDialog = true;
    component.editingTemplate = { id: '1', name: 'Test', contractType: 'NDA', jurisdiction: 'Global', activeVersion: '1.0' };
    component.onDialogCancel();
    expect(component.showDialog).toBe(false);
    expect(component.editingTemplate).toBeUndefined();
  });
}); 