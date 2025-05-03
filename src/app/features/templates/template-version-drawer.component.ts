import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateVersion } from './template-version.model';

@Component({
  selector: 'app-template-version-drawer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-version-drawer.component.html',
  styleUrls: ['./template-version-drawer.component.scss']
})
export class TemplateVersionDrawerComponent {
  @Input() versions: TemplateVersion[] = [];
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
  @Output() activateVersion = new EventEmitter<string>();
  @Output() compareVersion = new EventEmitter<string>();

  selectedVersionId = signal<string | null>(null);

  onActivate(versionId: string) {
    this.activateVersion.emit(versionId);
  }

  onCompare(versionId: string) {
    this.compareVersion.emit(versionId);
  }

  onClose() {
    this.close.emit();
  }
} 