import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-diff-viewer',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './diff-viewer.component.html',
  styleUrls: ['./diff-viewer.component.scss']
})
export class DiffViewerComponent {
  @Input() baseText = '';
  @Input() compareText = '';
}
