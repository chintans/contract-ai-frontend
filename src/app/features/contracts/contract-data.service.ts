import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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
