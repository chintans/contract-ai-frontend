import { Component, Input, computed } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ClauseRule, Severity } from '../../models/rule.model';

@Component({
  selector: 'app-rule-preview',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './rule-preview.component.html',
  styleUrls: ['./rule-preview.component.scss']
})
export class RulePreviewComponent {
  @Input() rule: ClauseRule | null = null;
  @Input() clauseText: string | null = null;

  private _severityClass = computed(() => {
    if (!this.rule) return 'severity-low';
    switch (this.rule.severity) {
      case Severity.HIGH:
        return 'severity-high';
      case Severity.MEDIUM:
        return 'severity-medium';
      default:
        return 'severity-low';
    }
  });

  private _severityIcon = computed(() => {
    if (!this.rule) return 'info';
    switch (this.rule.severity) {
      case Severity.HIGH:
        return 'error';
      case Severity.MEDIUM:
        return 'warning';
      default:
        return 'check_circle';
    }
  });

  private _analysisResult = computed(() => {
    if (!this.rule || !this.clauseText) return '';

    const results: string[] = [];

    // Check patterns
    if (this.rule.forbiddenPatterns?.length) {
      for (const pattern of this.rule.forbiddenPatterns) {
        if (new RegExp(pattern, 'i').test(this.clauseText)) {
          results.push(`Contains forbidden pattern: "${pattern}"`);
        }
      }
    }

    if (this.rule.requiredPatterns?.length) {
      for (const pattern of this.rule.requiredPatterns) {
        if (!new RegExp(pattern, 'i').test(this.clauseText)) {
          results.push(`Missing required pattern: "${pattern}"`);
        }
      }
    }

    // Add enforcement context
    if (results.length) {
      return `This clause would be flagged: ${results.join(', ')}`;
    }

    return 'This clause would pass the current rule settings';
  });

  private _previewMessage = computed(() => {
    if (!this.rule) return 'Configure a rule to see preview';
    
    const messages: string[] = [];
    messages.push(`Rule will be enforced at ${this.rule.severity} severity`);

    if (this.rule.similarityThreshold) {
      messages.push(`requiring ${this.rule.similarityThreshold}% similarity`);
    }

    if (this.rule.deviationAllowedPct) {
      messages.push(`allowing ${this.rule.deviationAllowedPct}% deviation`);
    }

    if (this.rule.forbiddenPatterns?.length) {
      messages.push(`checking for ${this.rule.forbiddenPatterns.length} forbidden patterns`);
    }

    if (this.rule.requiredPatterns?.length) {
      messages.push(`ensuring ${this.rule.requiredPatterns.length} required patterns`);
    }

    return messages.join(', ');
  });

  severityClass = this._severityClass;
  severityIcon = this._severityIcon;
  analysisResult = this._analysisResult;
  previewMessage = this._previewMessage;
} 