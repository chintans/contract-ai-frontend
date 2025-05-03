import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Template {
  id: string;
  name: string;
  contractType: string;
  jurisdiction: string;
  activeVersion: string;
}

@Component({
  selector: 'app-template-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="loading" class="text-center py-8">Loading...</div>
    <table *ngIf="!loading" class="min-w-full bg-white border border-gray-200 rounded">
      <thead>
        <tr>
          <th class="px-4 py-2">Name</th>
          <th class="px-4 py-2">Contract Type</th>
          <th class="px-4 py-2">Jurisdiction</th>
          <th class="px-4 py-2">Active Version</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let t of templates">
          <td class="px-4 py-2">{{ t.name }}</td>
          <td class="px-4 py-2">{{ t.contractType }}</td>
          <td class="px-4 py-2">{{ t.jurisdiction }}</td>
          <td class="px-4 py-2">{{ t.activeVersion }}</td>
          <td class="px-4 py-2">
            <button class="bg-gray-200 px-2 py-1 rounded" (click)="editTemplate.emit(t)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
  `,
  styles: [`
    table { width: 100%; border-collapse: collapse; }
    th, td { border-bottom: 1px solid #e5e7eb; }
    th { background: #f3f4f6; text-align: left; }
  `]
})
export class TemplateTableComponent {
  @Input() templates: Template[] = [];
  @Output() editTemplate = new EventEmitter<Template>();

  loading = true;

  ngOnInit() {
    this.fetchTemplates();
  }

  fetchTemplates() {
    // TODO: Replace with real API call
    this.loading = true;
    setTimeout(() => {
      this.templates = [
        { id: '1', name: 'MSA v1', contractType: 'MSA', jurisdiction: 'India', activeVersion: '1.0' },
        { id: '2', name: 'NDA v2', contractType: 'NDA', jurisdiction: 'Global', activeVersion: '2.0' },
      ];
      this.loading = false;
    }, 500);
  }
} 