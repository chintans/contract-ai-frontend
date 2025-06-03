import { Component, OnInit, inject, ViewChild, AfterViewInit, signal } from '@angular/core';

import { Router } from '@angular/router';
import { ContractDataService, ContractListItem } from './contract-data.service';
import { MaterialModule } from '../../shared/material.module';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-contract-list-page',
  standalone: true,
  imports: [MaterialModule],
  templateUrl: './contract-list-page.component.html',
  styleUrls: ['./contract-list-page.component.scss']
})
export class ContractListPageComponent implements OnInit, AfterViewInit {
  contracts = signal<ContractListItem[]>([]);
  dataSource = new MatTableDataSource<ContractListItem>([]);
  displayedColumns = ['title', 'status', 'lastEdited'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private readonly data = inject(ContractDataService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.data.listContracts().subscribe(list => {
      this.contracts.set(list);
      this.dataSource.data = list;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  newContract(): void {
    this.router.navigate(['/contracts/new']);
  }

  openContract(contract: ContractListItem): void {
    this.router.navigate(['/contracts', contract.id, 'edit']);
  }
}
