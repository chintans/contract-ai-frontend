import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VersionedClause } from './template-version.model';
import { StandardClause, CreateStandardClauseDto } from '../../services/standard-clause.service';
import { StandardClauseCardComponent, StandardClauseCardData } from './standard-clause-card.component';
import { AddStandardClauseComponent, NewStandardClause } from './add-standard-clause.component';
import { MockStandardClauseService } from '../../services/mock-standard-clause.service';
import { TemplateRulesStepComponent } from '../standard-clauses/components/template-wizard/template-rules-step.component';
import { ClauseRule } from '../standard-clauses/models/rule.model';

type StateCities = { [state: string]: string[] };
type CountryStates = { [country: string]: StateCities };

@Component({
  selector: 'app-template-wizard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    StandardClauseCardComponent,
    AddStandardClauseComponent,
    TemplateRulesStepComponent
  ],
  templateUrl: './template-wizard.component.html',
  styleUrls: ['./template-wizard.component.scss']
})
export class TemplateWizardComponent {
  step = signal(0);
  showAddClauseDialog = signal(false);
  standardClauses = signal<StandardClauseCardData[]>([]);
  isLoadingClauses = signal(false);
  error = signal<string | null>(null);
  clauseRules = signal<Record<string, ClauseRule>>({});

  clausesForRules = computed(() => 
    this.standardClauses().map(clause => ({
      id: clause.id,
      title: clause.name,
      text: clause.text
    }))
  );

  indiaStates = [
    'Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'West Bengal', 'Gujarat', 'Uttar Pradesh', 'Rajasthan', 'Telangana', 'Kerala'
  ];
  usaStates = [
    'California', 'New York', 'Texas', 'Florida', 'Illinois', 'Pennsylvania', 'Ohio', 'Georgia', 'North Carolina', 'Michigan'
  ];
  citiesByState: CountryStates = {
    India: {
      Delhi: ['New Delhi'],
      Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
      Karnataka: ['Bengaluru', 'Mysuru'],
      'Tamil Nadu': ['Chennai', 'Coimbatore'],
      'West Bengal': ['Kolkata'],
      Gujarat: ['Ahmedabad', 'Surat'],
      'Uttar Pradesh': ['Lucknow', 'Noida'],
      Rajasthan: ['Jaipur', 'Udaipur'],
      Telangana: ['Hyderabad'],
      Kerala: ['Kochi', 'Thiruvananthapuram']
    },
    USA: {
      California: ['Los Angeles', 'San Francisco', 'San Diego'],
      'New York': ['New York City', 'Buffalo'],
      Texas: ['Houston', 'Dallas', 'Austin'],
      Florida: ['Miami', 'Orlando'],
      Illinois: ['Chicago'],
      Pennsylvania: ['Philadelphia', 'Pittsburgh'],
      Ohio: ['Columbus', 'Cleveland'],
      Georgia: ['Atlanta'],
      'North Carolina': ['Charlotte', 'Raleigh'],
      Michigan: ['Detroit', 'Ann Arbor']
    }
  };

  // Step 1: Meta
  meta = signal({
    name: '',
    contractType: '',
    country: '',
    state: '',
    city: '',
    isGlobal: false
  });

  // Step 2: Clause Library
  clauses = signal<VersionedClause[]>([]);
  editingClause: VersionedClause | null = null;
  editingIndex: number | null = null;
  showStandardClauseSelector = false;
  showStandardClauseFormDialog = false;

  constructor(private standardClauseService: MockStandardClauseService) {}

  ngOnInit() {
    this.loadStandardClauses();
  }

  loadStandardClauses() {
    if (!this.meta().contractType) return;
    
    this.isLoadingClauses.set(true);
    this.error.set(null);
    
    this.standardClauseService.getByContractType(this.meta().contractType).subscribe({
      next: (clauses: StandardClause[]) => {
        this.standardClauses.set(clauses.map(clause => ({
          id: clause.id.toString(),
          name: clause.name,
          type: clause.type,
          text: clause.text,
          jurisdiction: clause.jurisdiction,
          allowedDeviations: clause.allowedDeviations,
          version: clause.version
        })));
        this.isLoadingClauses.set(false);
      },
      error: (err: Error) => {
        console.error('Error loading clauses:', err);
        this.error.set('Failed to load standard clauses. Please try again.');
        this.isLoadingClauses.set(false);
      }
    });
  }

  onAddNewClause() {
    this.showAddClauseDialog.set(true);
  }

  onClauseSaved(newClause: NewStandardClause) {
    const createDto = {
      ...newClause,
      contractType: this.meta().contractType,
      version: '1.0'
    };

    this.standardClauseService.create(createDto).subscribe({
      next: (createdClause) => {
        this.standardClauses.update(clauses => [
          ...clauses,
          {
            id: createdClause.id.toString(),
            name: createdClause.name,
            type: createdClause.type,
            text: createdClause.text,
            jurisdiction: createdClause.jurisdiction,
            allowedDeviations: createdClause.allowedDeviations,
            version: createdClause.version
          }
        ]);
        this.showAddClauseDialog.set(false);
      },
      error: (err: Error) => {
        console.error('Error creating clause:', err);
        this.error.set('Failed to create standard clause. Please try again.');
      }
    });
  }

  onClauseCancel() {
    this.showAddClauseDialog.set(false);
  }

  onAddClause() {
    this.editingClause = {
      clauseId: Math.random().toString(36).substring(2, 10),
      clauseType: '',
      title: '',
      body: '',
      ruleJson: {
        enforcement: 'MUST_HAVE',
        severity: 'MEDIUM',
        allowedDeviation: 0,
        forbiddenPatterns: []
      },
      orderIdx: this.clauses().length
    };
    this.editingIndex = null;
  }

  onCreateStandardClause() {
    this.showStandardClauseFormDialog = true;
  }

  onStandardClauseFormSave(clause: CreateStandardClauseDto) {
    this.standardClauseService.create(clause).subscribe({
      next: (createdClause) => {
        // Map the created standard clause to a versioned clause
        const versionedClause: VersionedClause = {
          clauseId: createdClause.id.toString(),
          clauseType: createdClause.type,
          title: createdClause.name,
          body: createdClause.text,
          ruleJson: {
            enforcement: 'MUST_HAVE',
            severity: 'MEDIUM',
            allowedDeviation: 0,
            forbiddenPatterns: []
          },
          orderIdx: this.clauses().length
        };
        this.clauses.update(clauses => [...clauses, versionedClause]);
        this.showStandardClauseFormDialog = false;
      },
      error: (error) => {
        console.error('Error creating standard clause:', error);
        // You might want to show an error message to the user here
      }
    });
  }

  onStandardClauseFormCancel() {
    this.showStandardClauseFormDialog = false;
  }

  onImportStandardClause() {
    this.showStandardClauseSelector = true;
  }

  onStandardClauseSelected(clause: StandardClause) {
    // Map StandardClause to VersionedClause
    const mapped: VersionedClause = {
      clauseId: Math.random().toString(36).substring(2, 10),
      clauseType: clause.type,
      title: clause.name,
      body: clause.text,
      ruleJson: {
        enforcement: 'MUST_HAVE',
        severity: 'MEDIUM',
        allowedDeviation: 0,
        forbiddenPatterns: []
      },
      orderIdx: this.clauses().length
    };
    this.clauses.set([...this.clauses(), mapped]);
    this.showStandardClauseSelector = false;
  }

  onStandardClauseCancel() {
    this.showStandardClauseSelector = false;
  }

  onEditClause(clause: VersionedClause, idx: number) {
    this.editingClause = { ...clause };
    this.editingIndex = idx;
  }

  onDeleteClause(idx: number) {
    const updated = [...this.clauses()];
    updated.splice(idx, 1);
    this.clauses.set(updated);
  }

  onSaveClause(clause: VersionedClause) {
    const updated = [...this.clauses()];
    if (this.editingIndex !== null) {
      updated[this.editingIndex] = clause;
    } else {
      updated.push(clause);
    }
    this.clauses.set(updated);
    this.editingClause = null;
    this.editingIndex = null;
  }

  onCancelClause() {
    this.editingClause = null;
    this.editingIndex = null;
  }

  onCountryChange() {
    this.meta.update(m => ({ ...m, state: '', city: '' }));
  }

  getCities(country: string, state: string): string[] {
    if (!country || !state) return [];
    return (this.citiesByState[country as keyof CountryStates] as StateCities)?.[state] || [];
  }

  // Step 3: Rules
  onRulesChange(rules: Record<string, ClauseRule>) {
    this.clauseRules.set(rules);
  }

  // Step 4: Review & Activate

  nextStep() {
    if (this.step() === 0) {
      // When moving from step 1 to step 2, load the clauses
      this.loadStandardClauses();
    }
    this.step.update(s => s + 1);
  }

  prevStep() {
    this.step.update(s => s - 1);
  }

  handleClauseCreated(createdClause: StandardClause): void {
    // ... existing code ...
  }

  createStandardClause(newClause: NewStandardClause): void {
    const createDto: CreateStandardClauseDto & { contractType: string } = {
      ...newClause,
      version: '1.0',
      contractType: this.meta().contractType
    };
    // ... existing code ...
  }

  handleError(error: Error): void {
    console.error('Error:', error);
    // ... existing error handling code ...
  }
} 