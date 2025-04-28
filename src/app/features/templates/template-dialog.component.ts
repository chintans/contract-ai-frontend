import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Template } from './template-table.component';

@Component({
  selector: 'app-template-dialog',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white rounded shadow-lg w-full max-w-md p-6 relative">
        <h2 class="text-xl font-bold mb-4">{{ template ? 'Edit' : 'New' }} Template</h2>
        <form (ngSubmit)="onSave()" #form="ngForm">
          <div class="mb-4">
            <label class="block mb-1">Name</label>
            <input class="w-full border px-2 py-1 rounded" [(ngModel)]="formData.name" name="name" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Contract Type</label>
            <input class="w-full border px-2 py-1 rounded" [(ngModel)]="formData.contractType" name="contractType" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Jurisdiction</label>
            <input class="w-full border px-2 py-1 rounded" [(ngModel)]="formData.jurisdiction" name="jurisdiction" required />
          </div>
          <div class="mb-4">
            <label class="block mb-1">Active Version</label>
            <input class="w-full border px-2 py-1 rounded" [(ngModel)]="formData.activeVersion" name="activeVersion" required />
          </div>
          <div class="flex justify-end gap-2">
            <button type="button" class="px-4 py-2 rounded bg-gray-200" (click)="cancel.emit()">Cancel</button>
            <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white" [disabled]="form.invalid">Save</button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class TemplateDialogComponent {
  @Input() template?: Template;
  @Output() save = new EventEmitter<Template>();
  @Output() cancel = new EventEmitter<void>();

  formData: Template = {
    id: '',
    name: '',
    contractType: '',
    jurisdiction: '',
    activeVersion: ''
  };

  ngOnInit() {
    if (this.template) {
      this.formData = { ...this.template };
    }
  }

  onSave() {
    // For new templates, generate a random id
    if (!this.formData.id) {
      this.formData.id = Math.random().toString(36).substring(2, 9);
    }
    this.save.emit({ ...this.formData });
  }
} 