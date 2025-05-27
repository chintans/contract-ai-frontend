import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BranchSelectorComponent } from '../version-control/branch-selector.component';
import { CommitDialogComponent } from '../version-control/commit-dialog.component';

@Component({
  selector: 'app-contract-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    BranchSelectorComponent,
    CommitDialogComponent
  ],
  templateUrl: './contract-editor.component.html',
  styleUrls: ['./contract-editor.component.scss']
})
export class ContractEditorComponent {
  body = '';
  branches = ['main'];
  currentBranch = 'main';

  constructor(private dialog: MatDialog) {}

  onBranchChange(branch: string) {
    this.currentBranch = branch;
  }

  openCommitDialog() {
    const ref = this.dialog.open(CommitDialogComponent);
    ref.componentInstance.commit.subscribe(message => {
      ref.close();
      console.log('commit', message); // placeholder for service call
    });
  }
}
