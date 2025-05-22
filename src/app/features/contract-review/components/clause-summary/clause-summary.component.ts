import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-clause-summary',
  templateUrl: './clause-summary.component.html'
})
export class ClauseSummaryComponent implements OnInit {
  clauses: ClauseSummary[] = [
    {
      id: 1,
      title: 'Confidentiality',
      summary: 'This clause ensures that all parties keep information confidential.'
    },
    {
      id: 2,
      title: 'Termination',
      summary: 'This clause outlines the conditions under which the contract may be terminated.'
    },
    {
      id: 3,
      title: 'Governing Law',
      summary: 'This clause specifies the jurisdiction whose laws will govern the contract.'
    }
  ];

  trackByClauseId(index: number, clause: ClauseSummary): number {
    return clause.id;
  }

  constructor() {}

  ngOnInit(): void {}
}

interface ClauseSummary {
  id: number;
  title: string;
  summary: string;
} 