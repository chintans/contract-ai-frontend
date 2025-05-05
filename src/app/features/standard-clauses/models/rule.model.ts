export enum Enforcement {
  MUST_HAVE = 'MUST_HAVE',
  SHOULD_HAVE = 'SHOULD_HAVE',
  MUST_NOT_HAVE = 'MUST_NOT_HAVE',
  OPTIONAL = 'OPTIONAL'
}

export enum Severity {
  HIGH = 3,
  MEDIUM = 2,
  LOW = 1
}

export interface RuleCondition {
  field: string;
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'regex';
  value: string;
}

export interface ClauseRule {
  enforcement: Enforcement;
  severity: Severity;
  similarityThreshold?: number;      // 0-100
  deviationAllowedPct?: number;      // 0-100
  forbiddenPatterns?: string[];
  requiredPatterns?: string[];
  statutoryReference?: string;
  autoSuggest?: boolean;
  scoreWeight?: number;              // default 1
  condition?: RuleCondition;
  patterns: string[];
}

export interface RuleValidationResult {
  isValid: boolean;
  errors: string[];
} 