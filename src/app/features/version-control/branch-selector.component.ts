import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-branch-selector',
  standalone: true,
  imports: [CommonModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './branch-selector.component.html',
  styleUrls: ['./branch-selector.component.scss']
})
export class BranchSelectorComponent {
  @Input() branches: string[] = [];
  @Input() currentBranch = '';
  @Input() canCreate = false;
  @Output() branchChange = new EventEmitter<string>();
  @Output() createBranch = new EventEmitter<void>();

  onBranchSelect(branch: string) {
    this.branchChange.emit(branch);
  }

  onCreateBranch() {
    this.createBranch.emit();
  }
}
