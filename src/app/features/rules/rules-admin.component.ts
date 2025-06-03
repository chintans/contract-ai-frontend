import { Component, inject } from '@angular/core';

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
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    RulePreviewComponent
],
  templateUrl: './rules-admin.component.html',
  styleUrls: ['./rules-admin.component.scss']
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