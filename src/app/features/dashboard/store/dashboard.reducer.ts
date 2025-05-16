import { createReducer, on } from '@ngrx/store';
import * as DashboardActions from './dashboard.actions';
import { Contract, Clause, RiskFlag, ComplianceStatus, ChatMessage, UploadQueueItem, DashboardFilters, SelectedRiskIds, DashboardTab, UnsavedEdit } from './dashboard.models';

export interface DashboardState {
  contracts: Contract[];
  contractsLoading: boolean;
  contractsError: string | null;

  clauses: Clause[];
  clausesLoading: boolean;
  clausesError: string | null;

  riskFlags: RiskFlag[];
  riskFlagsLoading: boolean;
  riskFlagsError: string | null;

  compliance: ComplianceStatus[];
  complianceLoading: boolean;
  complianceError: string | null;

  chat: ChatMessage[];
  chatLoading: boolean;
  chatError: string | null;

  uploadQueue: UploadQueueItem[];
  uploadQueueLoading: boolean;
  uploadQueueError: string | null;

  filters: DashboardFilters;
  selectedRiskIds: SelectedRiskIds;

  activeTab: DashboardTab;

  unsavedEdits: UnsavedEdit[];
}

export const initialState: DashboardState = {
  contracts: [],
  contractsLoading: false,
  contractsError: null,

  clauses: [],
  clausesLoading: false,
  clausesError: null,

  riskFlags: [],
  riskFlagsLoading: false,
  riskFlagsError: null,

  compliance: [],
  complianceLoading: false,
  complianceError: null,

  chat: [],
  chatLoading: false,
  chatError: null,

  uploadQueue: [],
  uploadQueueLoading: false,
  uploadQueueError: null,

  filters: {
    severities: [],
    clauseTypes: [],
    ruleCategories: [],
    reviewers: [],
    resolvedStates: [],
    search: ''
  },
  selectedRiskIds: [],

  activeTab: 'clauses',

  unsavedEdits: [],
};

export const dashboardReducer = createReducer(
  initialState,
  // Contracts
  on(DashboardActions.loadContracts, (state: DashboardState) => ({ ...state, contractsLoading: true, contractsError: null })),
  on(DashboardActions.loadContractsSuccess, (state: DashboardState, { contracts }: { contracts: Contract[] }) => ({ ...state, contracts, contractsLoading: false })),
  on(DashboardActions.loadContractsFailure, (state: DashboardState, { error }: { error: string }) => ({ ...state, contractsLoading: false, contractsError: error })),

  // Clauses
  on(DashboardActions.loadClauses, (state: DashboardState) => ({ ...state, clausesLoading: true, clausesError: null })),
  on(DashboardActions.loadClausesSuccess, (state: DashboardState, { clauses }: { clauses: Clause[] }) => ({ ...state, clauses, clausesLoading: false })),
  on(DashboardActions.loadClausesFailure, (state: DashboardState, { error }: { error: string }) => ({ ...state, clausesLoading: false, clausesError: error })),

  // Risk Flags
  on(DashboardActions.loadRiskFlags, (state: DashboardState) => ({ ...state, riskFlagsLoading: true, riskFlagsError: null })),
  on(DashboardActions.loadRiskFlagsSuccess, (state: DashboardState, { riskFlags }: { riskFlags: RiskFlag[] }) => ({ ...state, riskFlags, riskFlagsLoading: false })),
  on(DashboardActions.loadRiskFlagsFailure, (state: DashboardState, { error }: { error: string }) => ({ ...state, riskFlagsLoading: false, riskFlagsError: error })),

  // Compliance
  on(DashboardActions.loadCompliance, (state: DashboardState) => ({ ...state, complianceLoading: true, complianceError: null })),
  on(DashboardActions.loadComplianceSuccess, (state: DashboardState, { compliance }: { compliance: ComplianceStatus[] }) => ({ ...state, compliance, complianceLoading: false })),
  on(DashboardActions.loadComplianceFailure, (state: DashboardState, { error }: { error: string }) => ({ ...state, complianceLoading: false, complianceError: error })),

  // Chat
  on(DashboardActions.loadChat, (state: DashboardState) => ({ ...state, chatLoading: true, chatError: null })),
  on(DashboardActions.loadChatSuccess, (state: DashboardState, { messages }: { messages: ChatMessage[] }) => ({ ...state, chat: messages, chatLoading: false })),
  on(DashboardActions.loadChatFailure, (state: DashboardState, { error }: { error: string }) => ({ ...state, chatLoading: false, chatError: error })),

  // Upload Queue
  on(DashboardActions.loadUploadQueue, (state: DashboardState) => ({ ...state, uploadQueueLoading: true, uploadQueueError: null })),
  on(DashboardActions.loadUploadQueueSuccess, (state: DashboardState, { queue }: { queue: UploadQueueItem[] }) => ({ ...state, uploadQueue: queue, uploadQueueLoading: false })),
  on(DashboardActions.loadUploadQueueFailure, (state: DashboardState, { error }: { error: string }) => ({ ...state, uploadQueueLoading: false, uploadQueueError: error })),

  on(DashboardActions.setFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters }
  })),
  on(DashboardActions.selectRisk, (state, { riskId }) => ({
    ...state,
    selectedRiskIds: state.selectedRiskIds.includes(riskId)
      ? state.selectedRiskIds
      : [...state.selectedRiskIds, riskId]
  })),
  on(DashboardActions.deselectRisk, (state, { riskId }) => ({
    ...state,
    selectedRiskIds: state.selectedRiskIds.filter(id => id !== riskId)
  })),
  on(DashboardActions.clearSelectedRisks, (state) => ({
    ...state,
    selectedRiskIds: []
  })),
  on(DashboardActions.bulkResolveRisks, (state, { riskIds }) => ({
    ...state,
    riskFlags: state.riskFlags.map(risk =>
      riskIds.includes(risk.id) ? { ...risk, status: 'resolved' as const } : risk
    )
  })),
  on(DashboardActions.bulkChangeSeverity, (state, { riskIds, severity }) => ({
    ...state,
    riskFlags: state.riskFlags.map(risk =>
      riskIds.includes(risk.id) ? { ...risk, type: severity } : risk
    )
  })),
  on(DashboardActions.bulkDeleteRisks, (state, { riskIds }) => ({
    ...state,
    riskFlags: state.riskFlags.filter(risk => !riskIds.includes(risk.id)),
    selectedRiskIds: state.selectedRiskIds.filter(id => !riskIds.includes(id))
  })),
  on(DashboardActions.selectAllVisibleRisks, (state, { riskIds }) => ({
    ...state,
    selectedRiskIds: Array.from(new Set([...state.selectedRiskIds, ...riskIds]))
  })),
  on(DashboardActions.deselectAllRisks, (state) => ({
    ...state,
    selectedRiskIds: []
  })),
  on(DashboardActions.setActiveTab, (state, { tab }) => ({
    ...state,
    activeTab: tab
  })),
  on(DashboardActions.updateUnsavedEdit, (state, { edit }) => ({
    ...state,
    unsavedEdits: [
      ...state.unsavedEdits.filter(e => e.clauseId !== edit.clauseId),
      edit
    ]
  })),
  on(DashboardActions.saveAllEdits, (state) => ({
    ...state,
    // In a real app, would also update clauses with drafts
    unsavedEdits: []
  })),
  on(DashboardActions.discardAllEdits, (state) => ({
    ...state,
    unsavedEdits: []
  })),
); 