import { createAction, props } from '@ngrx/store';
import { Contract, Clause, RiskFlag, ComplianceStatus, ChatMessage, UploadQueueItem, DashboardFilters, DashboardTab, UnsavedEdit } from './dashboard.models';

// Contracts
export const loadContracts = createAction('[Dashboard] Load Contracts');
export const loadContractsSuccess = createAction('[Dashboard] Load Contracts Success', props<{ contracts: Contract[] }>());
export const loadContractsFailure = createAction('[Dashboard] Load Contracts Failure', props<{ error: string }>());

// Clauses
export const loadClauses = createAction('[Dashboard] Load Clauses', props<{ contractId: string }>());
export const loadClausesSuccess = createAction('[Dashboard] Load Clauses Success', props<{ clauses: Clause[] }>());
export const loadClausesFailure = createAction('[Dashboard] Load Clauses Failure', props<{ error: string }>());

// Risk Flags
export const loadRiskFlags = createAction('[Dashboard] Load Risk Flags', props<{ contractId: string }>());
export const loadRiskFlagsSuccess = createAction('[Dashboard] Load Risk Flags Success', props<{ riskFlags: RiskFlag[] }>());
export const loadRiskFlagsFailure = createAction('[Dashboard] Load Risk Flags Failure', props<{ error: string }>());

// Compliance
export const loadCompliance = createAction('[Dashboard] Load Compliance', props<{ contractId: string }>());
export const loadComplianceSuccess = createAction('[Dashboard] Load Compliance Success', props<{ compliance: ComplianceStatus[] }>());
export const loadComplianceFailure = createAction('[Dashboard] Load Compliance Failure', props<{ error: string }>());

// Chat
export const loadChat = createAction('[Dashboard] Load Chat', props<{ contractId: string }>());
export const loadChatSuccess = createAction('[Dashboard] Load Chat Success', props<{ messages: ChatMessage[] }>());
export const loadChatFailure = createAction('[Dashboard] Load Chat Failure', props<{ error: string }>());

// Upload Queue
export const loadUploadQueue = createAction('[Dashboard] Load Upload Queue');
export const loadUploadQueueSuccess = createAction('[Dashboard] Load Upload Queue Success', props<{ queue: UploadQueueItem[] }>());
export const loadUploadQueueFailure = createAction('[Dashboard] Load Upload Queue Failure', props<{ error: string }>());

export const setFilters = createAction(
  '[Dashboard] Set Filters',
  props<{ filters: Partial<DashboardFilters> }>()
);

export const selectRisk = createAction('[Dashboard] Select Risk', props<{ riskId: string }>());
export const deselectRisk = createAction('[Dashboard] Deselect Risk', props<{ riskId: string }>());
export const clearSelectedRisks = createAction('[Dashboard] Clear Selected Risks');

export const bulkResolveRisks = createAction('[Dashboard] Bulk Resolve Risks', props<{ riskIds: string[] }>());
export const bulkChangeSeverity = createAction('[Dashboard] Bulk Change Severity', props<{ riskIds: string[], severity: 'high' | 'medium' | 'low' }>());
export const bulkDeleteRisks = createAction('[Dashboard] Bulk Delete Risks', props<{ riskIds: string[] }>());

export const selectAllVisibleRisks = createAction('[Dashboard] Select All Visible Risks', props<{ riskIds: string[] }>());
export const deselectAllRisks = createAction('[Dashboard] Deselect All Risks');

export const setActiveTab = createAction('[Dashboard] Set Active Tab', props<{ tab: DashboardTab }>());

export const updateUnsavedEdit = createAction('[Dashboard] Update Unsaved Edit', props<{ edit: UnsavedEdit }>());
export const saveAllEdits = createAction('[Dashboard] Save All Edits');
export const discardAllEdits = createAction('[Dashboard] Discard All Edits'); 