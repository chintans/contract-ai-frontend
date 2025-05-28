import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateVersion } from './template-version.model';
import { DiffViewerComponent } from '../version-control/diff-viewer.component';

@Component({
  selector: 'app-diff-version-dialog',
  standalone: true,
  imports: [CommonModule, DiffViewerComponent],
  templateUrl: './diff-version-dialog.component.html',
  styleUrls: ['./diff-version-dialog.component.scss']
})
export class DiffVersionDialogComponent {
  @Input() baseVersion?: TemplateVersion;
  @Input() compareVersion?: TemplateVersion;
  @Output() close = new EventEmitter<void>();

  get baseBodyText(): string {
    return this.baseVersion?.clauses.map(c => c.body).join('\n\n') || '';
  }

  get compareBodyText(): string {
    return this.compareVersion?.clauses.map(c => c.body).join('\n\n') || '';
  }

  // Monaco diff integration will be added later
} 