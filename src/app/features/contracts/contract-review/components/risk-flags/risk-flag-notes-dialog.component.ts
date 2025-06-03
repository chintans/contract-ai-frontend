import { Component } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-risk-flag-notes-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
],
  templateUrl: './risk-flag-notes-dialog.component.html',
  styleUrls: ['./risk-flag-notes-dialog.component.scss']
})
export class RiskFlagNotesDialogComponent {
  notes = '';

  constructor() {}
} 