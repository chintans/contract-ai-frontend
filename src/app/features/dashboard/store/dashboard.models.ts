export interface Contract {
  id: string;
  title: string;
  status: 'new' | 'ai-analysed' | 'in-review' | 'approved';
  parties: string[];
  meta: Record<string, any>;
}

export interface Clause {
  id: string;
  contractId: string;
  title: string;
  body: string;
  type: string;
  category: string;
  status: 'draft' | 'final';
}

export interface RiskFlag {
  id: string;
  contractId: string;
  clauseId: string;
  type: 'high' | 'medium' | 'low';
  category: string;
  description: string;
  recommendation: string;
  status: 'open' | 'resolved' | 'ignored';
  notes?: string;
}

export interface ComplianceStatus {
  id: string;
  contractId: string;
  category: string;
  rule: string;
  status: 'pass' | 'warn' | 'fail';
}

export interface ChatMessage {
  id: string;
  contractId: string;
  sender: string;
  message: string;
  timestamp: string;
}

export interface UploadQueueItem {
  id: string;
  fileName: string;
  status: 'pending' | 'uploading' | 'uploaded' | 'error';
  error?: string;
}

export interface DashboardFilters {
  severities: string[];
  clauseTypes: string[];
  ruleCategories: string[];
  reviewers: string[];
  resolvedStates: string[];
  search: string;
}

export type SelectedRiskIds = string[];

export type DashboardTab = 'clauses' | 'summaries' | 'compliance' | 'attachments';

export interface UnsavedEdit {
  clauseId: string;
  draft: string;
} 