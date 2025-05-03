import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateVersion } from './template-version.model';

@Component({
  selector: 'app-diff-version-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './diff-version-dialog.component.html',
  styleUrls: ['./diff-version-dialog.component.scss']
})
export class DiffVersionDialogComponent {
  @Input() baseVersion?: TemplateVersion;
  @Input() compareVersion?: TemplateVersion;
  @Output() close = new EventEmitter<void>();

  // Monaco diff integration will be added later
} 