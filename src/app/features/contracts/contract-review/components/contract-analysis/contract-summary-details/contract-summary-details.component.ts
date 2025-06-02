import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Party {
  name: string;
  alias: string;
  role: string;
}

export interface Snapshot {
  contractType: string;
  parties: Party[];
  effectiveDate: string;
  initialTerm: { value: number; unit: string };
  renewal: { type: string };
  governingLaw: string;
}

export interface Payment {
  currency: string;
  amount: number;
  schedule: string;
}

export interface KeyTerms {
  deliverables: string;
  payment: Payment;
  milestones: string;
  terminationTriggers: string;
  liabilityCaps: string;
}

export interface Obligation {
  party: string;
  text: string;
}

export interface CriticalDate {
  date: string;
  description: string;
  clauseRef: string;
}

export interface NoteworthyClause {
  clauseRef: string;
  summary: string;
}

export interface Risk {
  description: string;
  severity: string;
  clauseRef: string;
}

export interface ContractSummary {
  snapshot: Snapshot;
  keyTerms: KeyTerms;
  obligationsByParty: Obligation[];
  criticalDates: CriticalDate[];
  noteworthyClauses: NoteworthyClause[];
  risks: Risk[];
  abstract: string;
  generatedAt: string;
}

@Component({
  selector: 'app-contract-summary-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contract-summary-details.component.html',
  styleUrls: ['./contract-summary-details.component.scss']
})
export class ContractSummaryDetailsComponent {
  @Input() summary!: ContractSummary;

  get formattedAmount(): string {
    if (!this.summary?.keyTerms?.payment) return '';
    const { currency, amount } = this.summary.keyTerms.payment;
    return `${currency === 'INR' ? '₹' : currency} ${amount}`;
  }

  get formattedDate(): string {
    if (!this.summary?.generatedAt) return '';
    return new Date(this.summary.generatedAt).toLocaleString();
  }
} 