import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contract-create-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
