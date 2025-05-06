import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClauseRule } from './template-version.model';

@Component({
  selector: 'app-rule-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rule-dialog.component.html',
  styleUrls: ['./rule-dialog.component.scss']
})
export class RuleDialogComponent {
  @Input() rule!: ClauseRule;
  @Output() save = new EventEmitter<ClauseRule>();
  @Output() cancel = new EventEmitter<void>();
} 