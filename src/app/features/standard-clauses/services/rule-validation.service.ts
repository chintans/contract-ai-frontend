import { Injectable } from '@angular/core';
import { ClauseRule, Enforcement, RuleValidationResult } from '../models/rule.model';

@Injectable({
  providedIn: 'root'
})
export class RuleValidationService {
  
  validateRule(rule: ClauseRule): RuleValidationResult {
    const errors: string[] = [];

    // Check for required fields
    if (!rule.enforcement) {
      errors.push('Enforcement level is required');
    }
    if (!rule.severity) {
      errors.push('Severity level is required');
    }

    // Validate similarity threshold and deviation percentage
    if (rule.similarityThreshold !== undefined && rule.deviationAllowedPct !== undefined) {
      errors.push('Cannot specify both similarityThreshold and deviationAllowedPct');
    }

    if (rule.similarityThreshold !== undefined) {
      if (rule.similarityThreshold < 0 || rule.similarityThreshold > 100) {
        errors.push('Similarity threshold must be between 0 and 100');
      }
    }

    if (rule.deviationAllowedPct !== undefined) {
      if (rule.deviationAllowedPct < 0 || rule.deviationAllowedPct > 100) {
        errors.push('Deviation percentage must be between 0 and 100');
      }
    }

    // Validate patterns
    if (rule.forbiddenPatterns?.length) {
      for (const pattern of rule.forbiddenPatterns) {
        try {
          new RegExp(pattern);
        } catch (e) {
          errors.push(`Invalid regex pattern: ${pattern}`);
        }
      }

      // Forbidden patterns only make sense for MUST_NOT_HAVE or SHOULD_HAVE
      if (rule.enforcement === Enforcement.MUST_HAVE || rule.enforcement === Enforcement.OPTIONAL) {
        errors.push('Forbidden patterns can only be used with MUST_NOT_HAVE or SHOULD_HAVE enforcement');
      }
    }

    if (rule.requiredPatterns?.length) {
      for (const pattern of rule.requiredPatterns) {
        try {
          new RegExp(pattern);
        } catch (e) {
          errors.push(`Invalid regex pattern: ${pattern}`);
        }
      }
    }

    // Validate score weight
    if (rule.scoreWeight !== undefined && rule.scoreWeight <= 0) {
      errors.push('Score weight must be greater than 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
} 