import { Injectable, signal, inject } from '@angular/core';
import { ClauseRule } from '../standard-clauses/models/rule.model';
import { Enforcement, Severity } from '../standard-clauses/models/rule.model';
import { RulesService as ApiRulesService } from '@api/api';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs';

export interface RuleWithMetadata extends ClauseRule {
  id: string;
  name: string;
  description: string;
  sampleText: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class RulesService {
  private _rules = signal<RuleWithMetadata[]>([]);
  rules = this._rules.asReadonly();
  private api = inject(ApiRulesService);

  constructor() {
    this.loadRules();
  }

  private loadRules() {
    if (!environment.mockData) {
      this.api.rulesControllerFindAll().subscribe(rules => this._rules.set(rules as any));
      return;
    }

    const storedRules = localStorage.getItem('rules');
    if (storedRules) {
      this._rules.set(JSON.parse(storedRules));
      return;
    }

    const mockRules: RuleWithMetadata[] = [
      {
        id: '1',
        name: 'Confidentiality Clause',
        description: 'Standard confidentiality requirements for all contracts',
        sampleText: 'Each party agrees to maintain the confidentiality of any proprietary information received from the other party.',
        enforcement: Enforcement.MUST_HAVE,
        severity: Severity.HIGH,
        similarityThreshold: 0.8,
        patterns: [
          'confidential information',
          'proprietary information',
          'trade secrets'
        ],
        forbiddenPatterns: ['public domain'],
        requiredPatterns: ['confidentiality', 'non-disclosure'],
        statutoryReference: 'Indian Contract Act §27',
        autoSuggest: true,
        scoreWeight: 2.5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
      },
      {
        id: '2',
        name: 'Limitation of Liability',
        description: 'Defines liability caps and exclusions',
        sampleText: 'Neither party shall be liable for any indirect, special, or consequential damages arising out of this agreement.',
        enforcement: Enforcement.MUST_HAVE,
        severity: Severity.HIGH,
        similarityThreshold: 0.9,
        patterns: [
          'limitation of liability',
          'liability cap',
          'consequential damages'
        ],
        forbiddenPatterns: ['unlimited liability'],
        requiredPatterns: ['limitation of liability'],
        statutoryReference: 'Indian Contract Act §73',
        autoSuggest: true,
        scoreWeight: 3.0,
        createdAt: new Date('2024-01-02'),
        updatedAt: new Date('2024-01-02')
      },
      {
        id: '3',
        name: 'Governing Law',
        description: 'Specifies applicable law and jurisdiction',
        sampleText: 'This Agreement shall be governed by and construed in accordance with the laws of India.',
        enforcement: Enforcement.MUST_HAVE,
        severity: Severity.MEDIUM,
        similarityThreshold: 0.7,
        patterns: [
          'governing law',
          'jurisdiction',
          'applicable law'
        ],
        forbiddenPatterns: [],
        requiredPatterns: ['govern', 'law'],
        statutoryReference: 'Indian Contract Act §28',
        autoSuggest: true,
        scoreWeight: 2.0,
        createdAt: new Date('2024-01-03'),
        updatedAt: new Date('2024-01-03')
      },
      {
        id: '4',
        name: 'Force Majeure',
        description: 'Handles unforeseen circumstances and events',
        sampleText: 'Neither party shall be liable for any failure to perform due to causes beyond its reasonable control.',
        enforcement: Enforcement.SHOULD_HAVE,
        severity: Severity.MEDIUM,
        similarityThreshold: 0.6,
        patterns: [
          'force majeure',
          'act of god',
          'beyond reasonable control'
        ],
        forbiddenPatterns: [],
        requiredPatterns: ['force majeure'],
        statutoryReference: 'Indian Contract Act §56',
        autoSuggest: true,
        scoreWeight: 1.5,
        createdAt: new Date('2024-01-04'),
        updatedAt: new Date('2024-01-04')
      }
    ];

    this._rules.set(mockRules);
    this.saveRules(); // Save mock data to localStorage
  }

  private saveRules() {
    localStorage.setItem('rules', JSON.stringify(this._rules()));
  }

  createRule(rule: Omit<RuleWithMetadata, 'id' | 'createdAt' | 'updatedAt'>) {
    if (!environment.mockData) {
      return this.api.rulesControllerCreate(rule as any).pipe(map(res => res as any));
    }
    const newRule: RuleWithMetadata = {
      ...rule,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this._rules.update(rules => [...rules, newRule]);
    this.saveRules();
    return newRule;
  }

  updateRule(id: string, rule: Partial<Omit<RuleWithMetadata, 'id' | 'createdAt' | 'updatedAt'>>) {
    if (!environment.mockData) {
      this.api.rulesControllerUpdate(id, rule as any).subscribe();
      return;
    }
    this._rules.update(rules =>
      rules.map(r => r.id === id
        ? { ...r, ...rule, updatedAt: new Date() }
        : r
      )
    );
    this.saveRules();
  }

  deleteRule(id: string) {
    if (!environment.mockData) {
      this.api.rulesControllerRemove(id).subscribe();
      return;
    }
    this._rules.update(rules => rules.filter(r => r.id !== id));
    this.saveRules();
  }

  getRuleById(id: string): RuleWithMetadata | undefined {
    return this._rules().find(r => r.id === id);
  }
} 
