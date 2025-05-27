import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ContractDataService, ContractListItem } from './contract-data.service';

@Component({
  selector: 'app-contract-list-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contract-list-page.component.html',
  styleUrls: ['./contract-list-page.component.scss']
})
export class ContractListPageComponent implements OnInit {
  contracts: ContractListItem[] = [];
  private readonly data = inject(ContractDataService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.data.listContracts().subscribe(list => {
      this.contracts = list;
    });
  }

  newContract(): void {
    this.router.navigate(['/contracts/new']);
  }

  openContract(contract: ContractListItem): void {
    this.router.navigate(['/contracts', contract.id, 'edit']);
  }
}
