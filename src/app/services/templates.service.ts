import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StandardClause {
  id: string;
  name: string;
  type: string;
  content: string;
  jurisdiction?: string;
  version?: string;
  description?: string;
  metadata?: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStandardClauseDto {
  name: string;
  type: string;
  content: string;
  jurisdiction?: string;
  version?: string;
  description?: string;
  metadata?: Record<string, any>;
  isActive?: boolean;
}

export type UpdateStandardClauseDto = Partial<CreateStandardClauseDto>;

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
  private apiUrl = `${environment.apiUrl}/templates`;
  private mockTemplates: StandardClause[] = [
    {
      id: '1',
      name: 'Sample NDA Template',
      type: 'NDA',
      content: 'This Non-Disclosure Agreement ("Agreement") is made between...',
      jurisdiction: 'India',
      version: '1.0',
      description: 'Standard NDA template for general use',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Employment Agreement',
      type: 'Employment',
      content: 'This Employment Agreement is made and entered into...',
      jurisdiction: 'India',
      version: '1.0',
      description: 'Standard employment agreement template',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  constructor(private http: HttpClient) {}

  getAll(): Observable<StandardClause[]> {
    if (environment.mockData) {
      console.log('Using mock data for templates');
      return of(this.mockTemplates);
    }
    return this.http.get<StandardClause[]>(this.apiUrl);
  }

  getOne(id: string): Observable<StandardClause> {
    if (environment.mockData) {
      const template = this.mockTemplates.find(t => t.id === id);
      if (!template) {
        throw new Error(`Template with ID ${id} not found`);
      }
      return of(template);
    }
    return this.http.get<StandardClause>(`${this.apiUrl}/${id}`);
  }

  getByType(type: string): Observable<StandardClause[]> {
    if (environment.mockData) {
      return of(this.mockTemplates.filter(t => t.type === type));
    }
    return this.http.get<StandardClause[]>(`${this.apiUrl}/type/${type}`);
  }

  getByJurisdiction(jurisdiction: string): Observable<StandardClause[]> {
    if (environment.mockData) {
      return of(this.mockTemplates.filter(t => t.jurisdiction === jurisdiction));
    }
    return this.http.get<StandardClause[]>(`${this.apiUrl}/jurisdiction/${jurisdiction}`);
  }

  create(clause: CreateStandardClauseDto): Observable<StandardClause> {
    if (environment.mockData) {
      const newTemplate: StandardClause = {
        id: (this.mockTemplates.length + 1).toString(),
        ...clause,
        isActive: clause.isActive ?? true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.mockTemplates.push(newTemplate);
      return of(newTemplate);
    }
    return this.http.post<StandardClause>(this.apiUrl, clause);
  }

  update(id: string, clause: UpdateStandardClauseDto): Observable<StandardClause> {
    if (environment.mockData) {
      const index = this.mockTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error(`Template with ID ${id} not found`);
      }
      this.mockTemplates[index] = {
        ...this.mockTemplates[index],
        ...clause,
        updatedAt: new Date()
      };
      return of(this.mockTemplates[index]);
    }
    return this.http.patch<StandardClause>(`${this.apiUrl}/${id}`, clause);
  }

  delete(id: string): Observable<void> {
    if (environment.mockData) {
      const index = this.mockTemplates.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error(`Template with ID ${id} not found`);
      }
      this.mockTemplates.splice(index, 1);
      return of(void 0);
    }
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
} 