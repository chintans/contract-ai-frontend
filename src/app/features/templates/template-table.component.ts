import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Jurisdiction {
  country?: string;
  state?: string;
  city?: string;
  isGlobal?: boolean;
}

export interface Template {
  id: string;
  name: string;
  contractType: string;
  jurisdiction: Jurisdiction;
  activeVersion: string;
}

@Component({
  selector: 'app-template-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-table.component.html',
  styleUrls: ['./template-table.component.scss']
})
export class TemplateTableComponent implements OnInit {
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
        { id: '1', name: 'MSA v1', contractType: 'MSA', jurisdiction: { country: 'India', state: 'Gujarat', city: 'Ahmedabad', isGlobal: false }, activeVersion: '1.0' },
        { id: '2', name: 'NDA v2', contractType: 'NDA', jurisdiction: { isGlobal: true }, activeVersion: '2.0' },
      ];
      this.loading = false;
    }, 500);
  }

  formatJurisdiction(jurisdiction: Jurisdiction): string {
    if (jurisdiction.isGlobal) {
      return 'Global';
    }
    return [jurisdiction.country, jurisdiction.state, jurisdiction.city].filter(x => !!x).join('/');
  }
} 