import { Observable } from 'rxjs';

export interface StandardClause {
  id: number;
  name: string;
  type: string;
  text: string;
  jurisdiction: string;
  allowedDeviations: number;
  contractType: string;
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStandardClauseDto {
  name: string;
  type: string;
  text: string;
  jurisdiction: string;
  allowedDeviations: number;
  contractType: string;
  version: string;
}

export interface IStandardClauseService {
  getAll(): Observable<StandardClause[]>;
  getOne(id: number): Observable<StandardClause>;
  getByType(type: string): Observable<StandardClause[]>;
  getByContractType(contractType: string): Observable<StandardClause[]>;
  create(clause: CreateStandardClauseDto): Observable<StandardClause>;
  update(id: number, clause: Partial<CreateStandardClauseDto>): Observable<StandardClause>;
  delete(id: number): Observable<void>;
} 