import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { ContractsService } from '../../services/api/contracts.service';

export interface ContractListItem {
  id: string;
  title: string;
  status: string;
  lastEdited: string;
}

@Injectable()
export abstract class ContractDataService {
  abstract listContracts(): Observable<ContractListItem[]>;
}

@Injectable()
export class MockContractDataService implements ContractDataService {
  listContracts(): Observable<ContractListItem[]> {
    return of([
      { id: '1', title: 'Service Agreement', status: 'Active', lastEdited: '2024-06-01' },
      { id: '2', title: 'NDA', status: 'Draft', lastEdited: '2024-06-02' }
    ]);
  }
}

@Injectable()
export class ApiContractDataService implements ContractDataService {
  constructor(private contracts: ContractsService) {}

  listContracts(): Observable<ContractListItem[]> {
    return this.contracts.contractControllerFindAll().pipe(
      map((res: any[]) =>
        res.map(c => ({
          id: c.id?.toString() ?? '',
          title: c.title ?? c.name ?? '',
          status: c.status ?? '',
          lastEdited: c.updatedAt ?? ''
        }))
      )
    );
  }
}
