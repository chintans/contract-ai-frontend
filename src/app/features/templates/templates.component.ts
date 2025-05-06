import { Component } from '@angular/core';
import { TemplateTableComponent, Template } from './template-table.component';
// import { TemplateDialogComponent } from './template-dialog.component';

@Component({
  selector: 'app-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
  standalone: true,
  imports: [TemplateTableComponent]
})
export class TemplatesComponent {
  templates: Template[] = [
    { id: '1', name: 'MSA v1', contractType: 'MSA', jurisdiction: { country: 'India', state: '', city: '', isGlobal: false }, activeVersion: '1.0' },
    { id: '2', name: 'NDA v2', contractType: 'NDA', jurisdiction: { isGlobal: true }, activeVersion: '2.0' },
  ];
  // showDialog = false;
  // editingTemplate: Template | undefined = undefined;

  openCreateTemplate() {
    // this.editingTemplate = undefined;
    // this.showDialog = true;
    // Instead, navigate to the wizard for new template
    // (navigation logic can be added here if needed)
  }

  openEditTemplate(template: Template) {
    // this.editingTemplate = template;
    // this.showDialog = true;
    // Instead, navigate to the wizard for editing
    // (navigation logic can be added here if needed)
  }

  onDialogSave(template: Template) {
    const idx = this.templates.findIndex(t => t.id === template.id);
    if (idx > -1) {
      this.templates[idx] = template;
    } else {
      this.templates.push(template);
    }
    // this.showDialog = false;
    // this.editingTemplate = undefined;
  }

  onDialogCancel() {
    // this.showDialog = false;
    // this.editingTemplate = undefined;
  }
} 