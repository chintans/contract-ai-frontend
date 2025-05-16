import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Contract, Clause, RiskFlag, ComplianceStatus, ChatMessage, UploadQueueItem } from './dashboard.models';

export abstract class DashboardDataService {
  abstract loadContracts(): Observable<Contract[]>;
  abstract loadClauses(contractId: string): Observable<Clause[]>;
  abstract loadRiskFlags(contractId: string): Observable<RiskFlag[]>;
  abstract loadCompliance(contractId: string): Observable<ComplianceStatus[]>;
  abstract loadChat(contractId: string): Observable<ChatMessage[]>;
  abstract loadUploadQueue(): Observable<UploadQueueItem[]>;
}

@Injectable()
export class DashboardMockDataService implements DashboardDataService {
  loadContracts() {
    return of([
      { id: '1', title: 'Mock Contract', status: 'new' as const, parties: ['Alice', 'Bob'], meta: {} }
    ]);
  }
  loadClauses(contractId: string) {
    return of([
      { id: '1', contractId, title: 'Clause 1', body: 'Mock clause body', type: 'NDA', category: 'Compliance', status: 'draft' as const }
    ]);
  }
  loadRiskFlags(contractId: string) {
    return of([
      { id: '1', contractId, clauseId: '1', type: 'high' as const, category: 'Risk', description: 'Mock risk', recommendation: 'Mock recommendation', status: 'open' as const }
    ]);
  }
  loadCompliance(contractId: string) {
    return of([
      { id: '1', contractId, category: 'Compliance', rule: 'Rule 1', status: 'pass' as const }
    ]);
  }
  loadChat(contractId: string) {
    return of([
      { id: '1', contractId, sender: 'Alice', message: 'Hello', timestamp: new Date().toISOString() }
    ]);
  }
  loadUploadQueue() {
    return of([
      { id: '1', fileName: 'contract.pdf', status: 'uploaded' as const }
    ]);
  }
} 