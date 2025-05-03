export interface TemplateVersion {
  versionId: string;
  templateId: string;
  versionNo: string;
  notes?: string;
  createdAt: Date;
  createdBy: string;
  isActive: boolean;
  clauses: VersionedClause[];
}

export interface VersionedClause {
  clauseId: string;
  clauseType: string;
  title: string;
  body: string;
  ruleJson: ClauseRule;
  orderIdx: number;
}

export interface ClauseRule {
  enforcement: 'MUST_HAVE' | 'NICE_TO_HAVE' | 'FORBIDDEN';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  allowedDeviation: number;
  forbiddenPatterns: string[];
} 