import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { RulePreviewComponent } from '../standard-clauses/components/rule-preview/rule-preview.component';
import { RulesService, RuleWithMetadata } from './rules.service';
import { RuleDialogComponent } from './rule-dialog.component';

@Component({
  selector: 'app-rules-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    RulePreviewComponent
  ],
  template: `
    <div class="p-6">
      <div class="max-w-7xl mx-auto">
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-bold">Rules Management</h1>
          <button mat-raised-button color="primary" (click)="createRule()">
            <mat-icon>add</mat-icon>
            Create Rule
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <mat-card *ngFor="let rule of rulesService.rules()">
            <mat-card-header>
              <mat-card-title>{{rule.name}}</mat-card-title>
              <mat-card-subtitle>{{rule.description}}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <app-rule-preview [rule]="rule" [clauseText]="rule.sampleText"></app-rule-preview>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" (click)="editRule(rule)">
                <mat-icon>edit</mat-icon>
                Edit
              </button>
              <button mat-button color="warn" (click)="deleteRule(rule)">
                <mat-icon>delete</mat-icon>
                Delete
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    mat-card {
      margin-bottom: 1rem;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 1rem;
    }
  `]
})
export class RulesAdminComponent {
  rulesService = inject(RulesService);
  dialog = inject(MatDialog);

  createRule() {
    const dialogRef = this.dialog.open(RuleDialogComponent, {
      width: '800px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rulesService.createRule(result);
      }
    });
  }

  editRule(rule: RuleWithMetadata) {
    const dialogRef = this.dialog.open(RuleDialogComponent, {
      width: '800px',
      data: { rule }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.rulesService.updateRule(rule.id, result);
      }
    });
  }

  deleteRule(rule: RuleWithMetadata) {
    if (confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) {
      this.rulesService.deleteRule(rule.id);
    }
  }
} 