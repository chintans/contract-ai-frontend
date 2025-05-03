import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateTableComponent, Template } from './template-table.component';

@Component({
  selector: 'app-template-admin-page',
  standalone: true,
  imports: [CommonModule, TemplateTableComponent],
  templateUrl: './template-admin-page.component.html',
  styleUrls: ['./template-admin-page.component.scss']
})
export class TemplateAdminPageComponent {
  templates = signal<Template[]>([]);

  constructor(private router: Router) {}

  onNewTemplate() {
    this.router.navigate(['/templates/new']);
  }

  onEditTemplate(template: Template) {
    this.router.navigate(['/templates', template.id]);
  }

  // For version drawer, will be handled in child component
} 