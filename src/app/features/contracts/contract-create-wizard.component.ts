import { Component, inject, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MaterialModule } from '../../shared/material.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-contract-create-wizard',
  standalone: true,
  imports: [FormsModule, MaterialModule, MatStepperModule, MatInputModule, MatFormFieldModule, MatCardModule],
  templateUrl: './contract-create-wizard.component.html',
  styleUrls: ['./contract-create-wizard.component.scss']
})
export class ContractCreateWizardComponent {
  step = signal(0);

  title = '';
  type = '';
  partyA = '';
  partyB = '';

  private readonly router = inject(Router);

  next(): void {
    if (this.step() < 2) {
      this.step.set(this.step() + 1);
    } else {
      // finish
      this.router.navigate(['/contracts']);
    }
  }

  prev(): void {
    if (this.step() > 0) {
      this.step.set(this.step() - 1);
    }
  }
}
