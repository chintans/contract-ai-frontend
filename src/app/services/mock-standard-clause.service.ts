import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { StandardClause, CreateStandardClauseDto } from './standard-clause.service';

@Injectable({
  providedIn: 'root'
})
export class MockStandardClauseService {
  private clauses: StandardClause[] = [];
  private nextId = 1;

  constructor() {
    // Add some initial mock data
    this.create({
      name: 'Sample Confidentiality Clause',
      type: 'NDA',
      text: 'Each party agrees to maintain the confidentiality of all information.',
      jurisdiction: 'India',
      version: '1.0',
      allowedDeviations: 'Minor modifications allowed'
    }).subscribe();
  }

  getAll(): Observable<StandardClause[]> {
    return of(this.clauses).pipe(delay(500)); // Simulate network delay
  }

  getOne(id: number): Observable<StandardClause> {
    const clause = this.clauses.find(c => c.id === id);
    if (!clause) {
      throw new Error(`Clause with ID ${id} not found`);
    }
    return of(clause).pipe(delay(500));
  }

  getByType(type: string): Observable<StandardClause[]> {
    const filtered = this.clauses.filter(c => c.type === type);
    return of(filtered).pipe(delay(500));
  }

  create(clause: CreateStandardClauseDto): Observable<StandardClause> {
    const newClause: StandardClause = {
      id: this.nextId++,
      ...clause,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.clauses.push(newClause);
    return of(newClause).pipe(delay(500));
  }

  update(id: number, clause: Partial<CreateStandardClauseDto>): Observable<StandardClause> {
    const index = this.clauses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Clause with ID ${id} not found`);
    }
    this.clauses[index] = {
      ...this.clauses[index],
      ...clause,
      updatedAt: new Date()
    };
    return of(this.clauses[index]).pipe(delay(500));
  }

  delete(id: number): Observable<void> {
    const index = this.clauses.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error(`Clause with ID ${id} not found`);
    }
    this.clauses.splice(index, 1);
    return of(void 0).pipe(delay(500));
  }
} 