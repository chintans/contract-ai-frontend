import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VersionedClause } from './template-version.model';

@Component({
  selector: 'app-clause-card-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clause-card-editor.component.html',
  styleUrls: ['./clause-card-editor.component.scss']
})
export class ClauseCardEditorComponent {
  @Input() clause?: VersionedClause;
  @Output() save = new EventEmitter<VersionedClause>();
  @Output() cancel = new EventEmitter<void>();

  public get clauseSafe(): VersionedClause {
    return this.clause ?? { clauseId: '', clauseType: '', title: '', body: '', ruleJson: { enforcement: 'MUST_HAVE', severity: 'MEDIUM', allowedDeviation: 0, forbiddenPatterns: [] }, orderIdx: 0 };
  }

  // Monaco integration and preview will be added later
} 