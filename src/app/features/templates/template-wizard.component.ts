import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VersionedClause, ClauseRule } from './template-version.model';
import { ClauseCardEditorComponent } from './clause-card-editor.component';
import { StandardClauseSelectorComponent } from './standard-clause-selector.component';
import { StandardClause } from '../../services/standard-clause.service';
import { StandardClauseFormDialogComponent } from './standard-clause-form-dialog.component';
import { CreateStandardClauseDto } from '../../services/standard-clause.service';
import { MockStandardClauseService } from '../../services/mock-standard-clause.service';

type StateCities = { [state: string]: string[] };
type CountryStates = { [country: string]: StateCities };

@Component({
  selector: 'app-template-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule, ClauseCardEditorComponent, StandardClauseSelectorComponent, StandardClauseFormDialogComponent],
  templateUrl: './template-wizard.component.html',
  styleUrls: ['./template-wizard.component.scss']
})
export class TemplateWizardComponent {
  step = signal(0);

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

  // Step 3: Rules (handled per clause)

  // Step 4: Review & Activate

  nextStep() {
    this.step.update(s => s + 1);
  }

  prevStep() {
    this.step.update(s => s - 1);
  }
} 