import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StandardClause, CreateStandardClauseDto, IStandardClauseService } from '../models/standard-clause.model';

@Injectable({
  providedIn: 'root'
})
export class StandardClauseService implements IStandardClauseService {
  private apiUrl = `${environment.apiUrl}/standard-clauses`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<StandardClause[]> {
    return this.http.get<StandardClause[]>(this.apiUrl);
  }

  getOne(id: number): Observable<StandardClause> {
    return this.http.get<StandardClause>(`${this.apiUrl}/${id}`);
  }

  getByType(type: string): Observable<StandardClause[]> {
    return this.http.get<StandardClause[]>(`${this.apiUrl}/type/${type}`);
  }

  getByContractType(contractType: string): Observable<StandardClause[]> {
    return this.http.get<StandardClause[]>(`${this.apiUrl}/contract-type/${contractType}`);
  }

  create(clause: CreateStandardClauseDto): Observable<StandardClause> {
    return this.http.post<StandardClause>(this.apiUrl, clause);
  }

  update(id: number, clause: Partial<CreateStandardClauseDto>): Observable<StandardClause> {
    return this.http.patch<StandardClause>(`${this.apiUrl}/${id}`, clause);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 